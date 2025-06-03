"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Bell, BellRing, Mail, X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import { NotificationScheduler } from "@/lib/notification-scheduler"
import type { Game } from "@/lib/types"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  game: Game
  isNotificationEnabled: boolean
  onNotificationToggle: () => void
}

interface EmailNotificationPreferences {
  email: {
    enabled: boolean
    address: string
    verified: boolean
  }
  timing: {
    oneDayBefore: boolean
    oneHourBefore: boolean
    fifteenMinutesBefore: boolean
    onRelease: boolean
  }
}

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  game, 
  isNotificationEnabled, 
  onNotificationToggle 
}: NotificationModalProps) {
  const [mounted, setMounted] = useState(false)
  const [preferences, setPreferences] = useState<EmailNotificationPreferences>({
    email: {
      enabled: false,
      address: "",
      verified: false
    },
    timing: {
      oneDayBefore: true,
      oneHourBefore: true,
      fifteenMinutesBefore: true,
      onRelease: true
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Load existing preferences
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(`notifications-${game.id}`)
      if (stored) {
        try {
        setPreferences(JSON.parse(stored))
        } catch (e) {
          console.error('Error parsing stored preferences:', e)
        }
      }
    }
  }, [isOpen, game.id])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const sendVerificationEmail = async () => {
    if (!validateEmail(preferences.email.address)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Send verification email using the API
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: preferences.email.address,
          gameName: game.title,
          gameId: game.id,
          notificationType: 'verification'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationSent(true)
        setSuccessMessage("Verification email sent! Check your inbox and click the link to verify.")
        
        // For demo purposes, auto-verify after 5 seconds
        setTimeout(() => {
          setPreferences(prev => ({
            ...prev,
            email: { ...prev.email, verified: true }
          }))
          setSuccessMessage("Email verified successfully! ✅")
          setVerificationSent(false)
        }, 5000)
      } else {
        throw new Error(data.error || 'Failed to send verification email')
      }
      
    } catch (error) {
      setErrorMessage("Failed to send verification email. Please try again.")
      console.error('Verification email error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = () => {
    if (preferences.email.enabled && !preferences.email.verified) {
      setErrorMessage("Please verify your email address first")
      return
    }
    
    if (preferences.email.enabled && !validateEmail(preferences.email.address)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Save to localStorage
    localStorage.setItem(`notifications-${game.id}`, JSON.stringify(preferences))
    
    // Save timestamp for tracking new notifications
    localStorage.setItem(`notifications-${game.id}-last-modified`, Date.now().toString())
    
    // Schedule notifications using the scheduler
    const scheduler = NotificationScheduler.getInstance()
    if (preferences.email.enabled && preferences.email.verified) {
      scheduler.scheduleGameNotifications(game, preferences)
    } else {
      // Clear any existing notifications if disabled
      scheduler.clearGameNotifications(game.id)
    }
    
    // Update the parent component
    onNotificationToggle()
    
    // Dispatch custom event to update notification bell
    window.dispatchEvent(new CustomEvent('notificationUpdated'))
    
    setSuccessMessage("Notification preferences saved! 🎉")
    
    // Close modal after success
    setTimeout(() => {
      onClose()
      setSuccessMessage("")
      setErrorMessage("")
    }, 1500)
  }

  const clearMessages = () => {
    setSuccessMessage("")
    setErrorMessage("")
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#1a1d29] to-[#151823] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                    <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
                <p className="text-sm text-gray-400">{game.title}</p>
              </div>
            </div>
              <Button 
                variant="ghost" 
                  size="icon"
                onClick={onClose}
                  className="text-gray-400 hover:text-white"
              >
                  <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
              >
                    <Check className="h-4 w-4" />
                    <span className="text-sm">{successMessage}</span>
              </motion.div>
            )}
            {errorMessage && (
              <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
              >
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

              {/* Email Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Enable Email Notifications</Label>
                    <p className="text-xs text-gray-400 mt-1">Get notified when this game releases</p>
              </div>
                <Switch
                  checked={preferences.email.enabled}
                    onCheckedChange={(checked) => {
                    setPreferences(prev => ({
                      ...prev,
                      email: { ...prev.email, enabled: checked }
                    }))
                      clearMessages()
                    }}
                />
            </div>

              {preferences.email.enabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                >
                  <div>
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <div className="flex gap-2 mt-2">
                      <Input
                        id="email"
                        type="email"
                          placeholder="your.email@example.com"
                        value={preferences.email.address}
                          onChange={(e) => {
                          setPreferences(prev => ({
                            ...prev,
                            email: { ...prev.email, address: e.target.value, verified: false }
                          }))
                            clearMessages()
                          }}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          disabled={preferences.email.verified}
                        />
                        {!preferences.email.verified && preferences.email.address && (
                        <Button
                          onClick={sendVerificationEmail}
                            disabled={isLoading || !validateEmail(preferences.email.address)}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Verify"
                            )}
                        </Button>
                        )}
                        {preferences.email.verified && (
                          <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-md">
                            <Check className="h-4 w-4 text-green-400" />
                          </div>
                        )}
                      </div>
                      {verificationSent && (
                        <p className="text-xs text-blue-400 mt-2">
                          ⏱️ Demo: Auto-verifying in 5 seconds...
                        </p>
                    )}
                  </div>
                </motion.div>
              )}
          </div>

          {/* Notification Timing */}
              {preferences.email.enabled && (
                <div className="space-y-3">
                  <Label className="text-white font-medium">When to Notify</Label>
            
            <div className="space-y-3">
              {[
                      { key: 'oneDayBefore', label: '1 Day Before Release', desc: 'Get ready!' },
                      { key: 'oneHourBefore', label: '1 Hour Before Release', desc: 'Almost time!' },
                      { key: 'fifteenMinutesBefore', label: '15 Minutes Before Release', desc: 'Final countdown!' },
                      { key: 'onRelease', label: 'When Game Releases', desc: 'It\'s live!' }
                    ].map(({ key, label, desc }) => (
                <div 
                  key={key} 
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                        <div>
                          <div className="text-sm text-white">{label}</div>
                          <div className="text-xs text-gray-400">{desc}</div>
                        </div>
                    <Switch
                      checked={preferences.timing[key as keyof typeof preferences.timing]}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({
                          ...prev,
                          timing: { ...prev.timing, [key]: checked }
                        }))
                      }
                    />
                </div>
              ))}
            </div>
          </div>
              )}

          {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
              <Button 
                  onClick={savePreferences}
                  disabled={preferences.email.enabled && !preferences.email.verified}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Save Notifications
              </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
} 