"use client"

import { useState, useEffect } from "react"
import { Bell, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import DiscordModal from "@/components/discord-modal"

export default function NotificationBell() {
  const [showModal, setShowModal] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  // Count enabled notifications from localStorage
  useEffect(() => {
    const countNotifications = () => {
      let count = 0
      let hasNew = false
      
      // Check localStorage for notification preferences
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('notifications-')) {
          try {
            const preferences = JSON.parse(localStorage.getItem(key) || '{}')
            if (preferences.email?.enabled && preferences.email?.verified) {
              count++
              
              // Check if notification was recently added (within last 5 minutes)
              const lastModified = localStorage.getItem(`${key}-last-modified`)
              if (lastModified) {
                const timeDiff = Date.now() - parseInt(lastModified)
                if (timeDiff < 5 * 60 * 1000) { // 5 minutes
                  hasNew = true
                }
              }
            }
          } catch (e) {
            console.error('Error parsing notification preferences:', e)
          }
        }
      }
      
      setNotificationCount(count)
      setHasNewNotifications(hasNew)
    }

    // Initial count
    countNotifications()

    // Listen for localStorage changes
    const handleStorageChange = () => {
      countNotifications()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events when notifications are modified
    const handleNotificationUpdate = () => {
      countNotifications()
    }
    
    window.addEventListener('notificationUpdated', handleNotificationUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('notificationUpdated', handleNotificationUpdate)
    }
  }, [])

  // Clear "new" status after 5 minutes
  useEffect(() => {
    if (hasNewNotifications) {
      const timer = setTimeout(() => {
        setHasNewNotifications(false)
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearTimeout(timer)
    }
  }, [hasNewNotifications])

  const handleClick = () => {
    setShowModal(true)
    setHasNewNotifications(false) // Clear new notification indicator when opened
  }

  // Create a dummy game object for the Discord modal
  const dummyGame = {
    id: "discord-invitation",
    title: "Join Our Discord Community",
    developer: "AniBlox Team",
    animeStyle: "Community",
    genre: "Social",
    status: "Upcoming" as const,
    releaseDate: new Date().toISOString(),
    description: "Connect with fellow anime game enthusiasts",
    thumbnail: ""
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className="relative overflow-hidden group p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
          title="Join our Discord server for updates and community"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <AnimatePresence mode="wait">
            {hasNewNotifications ? (
              <motion.div
                key="bell-ring"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 15, -10, 10, -5, 5, 0] }}
                exit={{ rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <BellRing className="h-5 w-5 text-yellow-400" />
              </motion.div>
            ) : (
              <motion.div
                key="bell"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <Bell className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification count badge */}
          <AnimatePresence>
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulsing ring for new notifications */}
          <AnimatePresence>
            {hasNewNotifications && (
              <motion.div
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
              />
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <DiscordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        game={dummyGame}
      />
    </>
  )
} 