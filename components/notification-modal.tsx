"use client"

import { useState, useEffect } from "react"
import { Bell, BellRing, Mail, MessageSquare, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import type { Game } from "@/lib/types"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  game: Game
  isNotificationEnabled: boolean
  onNotificationToggle: () => void
}

interface NotificationPreferences {
  email: {
    enabled: boolean
    address: string
    verified: boolean
  }
  discord: {
    enabled: boolean
    webhookUrl: string
    username: string
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
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: false,
      address: "",
      verified: false
    },
    discord: {
      enabled: false,
      webhookUrl: "",
      username: ""
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

  // Load existing preferences
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(`notifications-${game.id}`)
      if (stored) {
        setPreferences(JSON.parse(stored))
      }
    }
  }, [isOpen, game.id])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateDiscordWebhook = (url: string) => {
    return url.includes('discord.com/api/webhooks/') || url.includes('discordapp.com/api/webhooks/')
  }

  const sendVerificationEmail = async () => {
    if (!validateEmail(preferences.email.address)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      // Simulate API call to send verification email
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: preferences.email.address,
          gameId: game.id,
          gameName: game.title
        })
      })

      if (response.ok) {
        setSuccessMessage("Verification email sent! Check your inbox.")
        // In a real app, you'd wait for email verification
        // For demo purposes, we'll auto-verify after 3 seconds
        setTimeout(() => {
          setPreferences(prev => ({
            ...prev,
            email: { ...prev.email, verified: true }
          }))
          setSuccessMessage("Email verified! ✅")
        }, 3000)
      } else {
        throw new Error('Failed to send verification email')
      }
    } catch (error) {
      setErrorMessage("Failed to send verification email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const testDiscordWebhook = async () => {
    if (!validateDiscordWebhook(preferences.discord.webhookUrl)) {
      setErrorMessage("Please enter a valid Discord webhook URL")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch(preferences.discord.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: preferences.discord.username || "Game Release Bot",
          embeds: [{
            title: "🎮 Notification Test",
            description: `Testing notifications for **${game.title}**`,
            color: 0x7C3AED,
            thumbnail: {
              url: game.thumbnail
            },
            fields: [
              {
                name: "Release Date",
                value: new Date(game.releaseDate).toLocaleDateString(),
                inline: true
              },
              {
                name: "Genre",
                value: game.genre,
                inline: true
              }
            ],
            footer: {
              text: "Anime Roblox Games Countdown"
            }
          }]
        })
      })

      if (response.ok) {
        setSuccessMessage("Discord test message sent! ✅")
      } else {
        throw new Error('Discord webhook test failed')
      }
    } catch (error) {
      setErrorMessage("Failed to send Discord test. Check your webhook URL.")
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = () => {
    const hasValidEmail = preferences.email.enabled && preferences.email.verified
    const hasValidDiscord = preferences.discord.enabled && validateDiscordWebhook(preferences.discord.webhookUrl)
    
    if (!hasValidEmail && !hasValidDiscord) {
      setErrorMessage("Please set up at least one notification method")
      return
    }

    // Save to localStorage (in a real app, this would be saved to your backend)
    localStorage.setItem(`notifications-${game.id}`, JSON.stringify(preferences))
    
    // Toggle notification state if needed
    if (!isNotificationEnabled) {
      onNotificationToggle()
    }

    setSuccessMessage("Notification preferences saved! 🎉")
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#1a1d29] border border-gray-800/50 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">Notification Setup</h3>
                <p className="text-sm text-gray-400">{game.title}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Email Notifications */}
          <div className="mb-6 p-4 bg-[#0f1117] rounded-lg border border-gray-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Email Notifications</span>
              </div>
              <Switch
                checked={preferences.email.enabled}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({
                    ...prev,
                    email: { ...prev.email, enabled: checked }
                  }))
                }
              />
            </div>

            {preferences.email.enabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={preferences.email.address}
                      onChange={(e) => 
                        setPreferences(prev => ({
                          ...prev,
                          email: { ...prev.email, address: e.target.value, verified: false }
                        }))
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={sendVerificationEmail}
                      disabled={isLoading || !preferences.email.address}
                    >
                      {preferences.email.verified ? "✅" : "Verify"}
                    </Button>
                  </div>
                  {preferences.email.verified && (
                    <p className="text-xs text-green-400 mt-1">Email verified ✅</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Discord Notifications */}
          <div className="mb-6 p-4 bg-[#0f1117] rounded-lg border border-gray-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <span className="font-semibold">Discord Notifications</span>
              </div>
              <Switch
                checked={preferences.discord.enabled}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({
                    ...prev,
                    discord: { ...prev.discord, enabled: checked }
                  }))
                }
              />
            </div>

            {preferences.discord.enabled && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="webhook" className="text-sm">Webhook URL</Label>
                  <Input
                    id="webhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={preferences.discord.webhookUrl}
                    onChange={(e) => 
                      setPreferences(prev => ({
                        ...prev,
                        discord: { ...prev.discord, webhookUrl: e.target.value }
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="username" className="text-sm">Bot Username (Optional)</Label>
                  <Input
                    id="username"
                    placeholder="Game Release Bot"
                    value={preferences.discord.username}
                    onChange={(e) => 
                      setPreferences(prev => ({
                        ...prev,
                        discord: { ...prev.discord, username: e.target.value }
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={testDiscordWebhook}
                  disabled={isLoading || !preferences.discord.webhookUrl}
                  className="w-full"
                >
                  Test Discord Webhook
                </Button>

                <div className="text-xs text-gray-400 p-2 bg-gray-800/50 rounded">
                  <p className="font-semibold mb-1">How to get Discord Webhook:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your Discord server</li>
                    <li>Right-click on a channel → Edit Channel</li>
                    <li>Go to Integrations → Webhooks</li>
                    <li>Click "New Webhook" and copy the URL</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Notification Timing */}
          <div className="mb-6 p-4 bg-[#0f1117] rounded-lg border border-gray-800/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BellRing className="h-4 w-4 text-yellow-400" />
              When to Notify
            </h4>
            
            <div className="space-y-2">
              {[
                { key: 'oneDayBefore', label: '1 Day Before Release' },
                { key: 'oneHourBefore', label: '1 Hour Before Release' },
                { key: 'fifteenMinutesBefore', label: '15 Minutes Before Release' },
                { key: 'onRelease', label: 'When Game Releases' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={savePreferences}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Save Notifications
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 