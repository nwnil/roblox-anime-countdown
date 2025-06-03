// This would typically run as a background job/cron job on your server
// For demo purposes, this shows how the notification system would work

import type { Game } from '@/lib/types'

interface NotificationPreferences {
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

export class NotificationScheduler {
  private static instance: NotificationScheduler
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler()
    }
    return NotificationScheduler.instance
  }

  // Schedule notifications for a game
  scheduleGameNotifications(game: Game, preferences: NotificationPreferences) {
    if (!preferences.email.enabled || !preferences.email.verified) {
      return
    }

    const releaseDate = new Date(game.releaseDate)
    const now = new Date()
    
    // Clear existing notifications for this game
    this.clearGameNotifications(game.id)

    // Schedule 1 day before
    if (preferences.timing.oneDayBefore) {
      const oneDayBefore = new Date(releaseDate.getTime() - 24 * 60 * 60 * 1000)
      if (oneDayBefore > now) {
        const timeout = setTimeout(() => {
          this.sendNotification(game, preferences.email.address, 'oneDayBefore')
        }, oneDayBefore.getTime() - now.getTime())
        
        this.intervals.set(`${game.id}-oneDayBefore`, timeout)
      }
    }

    // Schedule 1 hour before
    if (preferences.timing.oneHourBefore) {
      const oneHourBefore = new Date(releaseDate.getTime() - 60 * 60 * 1000)
      if (oneHourBefore > now) {
        const timeout = setTimeout(() => {
          this.sendNotification(game, preferences.email.address, 'oneHourBefore')
        }, oneHourBefore.getTime() - now.getTime())
        
        this.intervals.set(`${game.id}-oneHourBefore`, timeout)
      }
    }

    // Schedule 15 minutes before
    if (preferences.timing.fifteenMinutesBefore) {
      const fifteenMinutesBefore = new Date(releaseDate.getTime() - 15 * 60 * 1000)
      if (fifteenMinutesBefore > now) {
        const timeout = setTimeout(() => {
          this.sendNotification(game, preferences.email.address, 'fifteenMinutesBefore')
        }, fifteenMinutesBefore.getTime() - now.getTime())
        
        this.intervals.set(`${game.id}-fifteenMinutesBefore`, timeout)
      }
    }

    // Schedule on release
    if (preferences.timing.onRelease) {
      if (releaseDate > now) {
        const timeout = setTimeout(() => {
          this.sendNotification(game, preferences.email.address, 'onRelease')
          this.triggerReleasePopup(game)
        }, releaseDate.getTime() - now.getTime())
        
        this.intervals.set(`${game.id}-onRelease`, timeout)
      }
    }
  }

  // Clear notifications for a specific game
  clearGameNotifications(gameId: string) {
    const keysToRemove: string[] = []
    
    this.intervals.forEach((timeout, key) => {
      if (key.startsWith(gameId)) {
        clearTimeout(timeout)
        keysToRemove.push(key)
      }
    })
    
    keysToRemove.forEach(key => this.intervals.delete(key))
  }

  // Send notification email
  private async sendNotification(game: Game, email: string, type: string) {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          gameName: game.title,
          gameId: game.id,
          notificationType: type
        })
      })

      if (response.ok) {
        console.log(`📧 Notification sent: ${type} for ${game.title} to ${email}`)
      } else {
        console.error(`Failed to send ${type} notification for ${game.title}`)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  // Trigger release popup (this would need to be connected to the UI state)
  private triggerReleasePopup(game: Game) {
    // In a real app, you'd emit an event or use a state management solution
    // For now, we'll dispatch a custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gameReleased', { detail: game }))
    }
  }

  // Get all scheduled notifications (for debugging)
  getScheduledNotifications(): string[] {
    return Array.from(this.intervals.keys())
  }

  // Clear all notifications
  clearAllNotifications() {
    this.intervals.forEach((timeout) => clearTimeout(timeout))
    this.intervals.clear()
  }
}

// Helper function to load preferences from localStorage
export function getNotificationPreferences(gameId: string): NotificationPreferences | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(`notifications-${gameId}`)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error loading notification preferences:', error)
    return null
  }
}

// Helper function to schedule notifications for all games with saved preferences
export function scheduleAllNotifications(games: Game[]) {
  const scheduler = NotificationScheduler.getInstance()
  
  games.forEach(game => {
    const preferences = getNotificationPreferences(game.id)
    if (preferences?.email.enabled && preferences?.email.verified) {
      scheduler.scheduleGameNotifications(game, preferences)
    }
  })
}

// Initialize the scheduler (in a real app, this would be in your server startup)
if (typeof window !== 'undefined') {
  NotificationScheduler.getInstance()
} 