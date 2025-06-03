"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Bell, Mail, X, Settings, Trash2, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { gameService, dbGameToAppGame } from "@/lib/supabase-service"
import type { Game } from "@/lib/types"

interface GlobalNotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NotificationItem {
  gameId: string
  game: Game | null
  preferences: {
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
}

export default function GlobalNotificationModal({ isOpen, onClose }: GlobalNotificationModalProps) {
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Load all notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    setIsLoading(true)
    const notificationItems: NotificationItem[] = []

    try {
      // Get all games from database
      const dbGames = await gameService.getAllGames()
      const games = dbGames.map(dbGameToAppGame)

      // Check localStorage for notification preferences
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('notifications-')) {
          try {
            const gameId = key.replace('notifications-', '')
            const preferences = JSON.parse(localStorage.getItem(key) || '{}')
            
            if (preferences.email?.enabled) {
              const game = games.find(g => g.id === gameId) || null
              notificationItems.push({
                gameId,
                game,
                preferences
              })
            }
          } catch (e) {
            console.error('Error parsing notification preferences:', e)
          }
        }
      }

      setNotifications(notificationItems)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeNotification = (gameId: string) => {
    localStorage.removeItem(`notifications-${gameId}`)
    localStorage.removeItem(`notifications-${gameId}-last-modified`)
    
    setNotifications(prev => prev.filter(n => n.gameId !== gameId))
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('notificationUpdated'))
  }

  const clearAllNotifications = () => {
    notifications.forEach(notification => {
      localStorage.removeItem(`notifications-${notification.gameId}`)
      localStorage.removeItem(`notifications-${notification.gameId}-last-modified`)
    })
    
    setNotifications([])
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('notificationUpdated'))
  }

  const getTimingText = (timing: NotificationItem['preferences']['timing']) => {
    const enabled = []
    if (timing.oneDayBefore) enabled.push('1 day')
    if (timing.oneHourBefore) enabled.push('1 hour')
    if (timing.fifteenMinutesBefore) enabled.push('15 min')
    if (timing.onRelease) enabled.push('release')
    
    return enabled.length > 0 ? enabled.join(', ') + ' before' : 'Custom timing'
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
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1d29] to-[#151823] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Notification Center</h3>
                    <p className="text-sm text-gray-400">
                      {notifications.length} active notification{notifications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
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
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <Bell className="h-8 w-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No Active Notifications</h4>
                  <p className="text-gray-400 mb-4">
                    You haven't set up any game notifications yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    Click the bell icon on any game card to set up notifications for release dates and updates.
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.gameId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Game thumbnail */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
                            {notification.game?.thumbnail ? (
                              <img
                                src={notification.game.thumbnail}
                                alt={notification.game.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs">?</span>
                              </div>
                            )}
                          </div>

                          {/* Game details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">
                              {notification.game?.title || 'Unknown Game'}
                            </h4>
                            <p className="text-sm text-gray-400 mb-2">
                              {notification.game?.developer || 'Unknown Developer'}
                            </p>
                            
                            {/* Email and timing info */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <Mail className="h-3 w-3 text-blue-400" />
                                <span className="text-gray-300">{notification.preferences.email.address}</span>
                                {notification.preferences.email.verified ? (
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Clock className="h-3 w-3 text-purple-400" />
                                <span className="text-gray-400">
                                  {getTimingText(notification.preferences.timing)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNotification(notification.gameId)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                            title="Remove notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
                <p className="text-xs text-gray-400 text-center">
                  Notifications are stored locally in your browser. 
                  Clear your browser data will remove all notification preferences.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
} 