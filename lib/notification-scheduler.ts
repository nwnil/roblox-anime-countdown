// This would typically run as a background job/cron job on your server
// For demo purposes, this shows how the notification system would work

interface NotificationSettings {
  gameId: string
  gameName: string
  releaseDate: string
  email?: {
    address: string
    verified: boolean
  }
  discord?: {
    webhookUrl: string
    username?: string
  }
  timing: {
    oneDayBefore: boolean
    oneHourBefore: boolean
    fifteenMinutesBefore: boolean
    onRelease: boolean
  }
}

class NotificationScheduler {
  private static instance: NotificationScheduler
  private settings: NotificationSettings[] = []

  private constructor() {
    // In a real app, this would load from your database
    this.loadSettings()
    this.startScheduler()
  }

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler()
    }
    return NotificationScheduler.instance
  }

  private loadSettings() {
    // In a real app, this would query your database
    // For demo, we'll load from localStorage if available
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('notifications-'))
      keys.forEach(key => {
        try {
          const setting = JSON.parse(localStorage.getItem(key) || '{}')
          if (setting.email?.verified || setting.discord?.webhookUrl) {
            this.settings.push({
              gameId: key.replace('notifications-', ''),
              gameName: setting.gameName || 'Unknown Game',
              releaseDate: setting.releaseDate,
              email: setting.email,
              discord: setting.discord,
              timing: setting.timing
            })
          }
        } catch (error) {
          console.error('Error loading notification setting:', error)
        }
      })
    }
  }

  private startScheduler() {
    // Check every minute for notifications to send
    setInterval(() => {
      this.checkAndSendNotifications()
    }, 60000) // 1 minute
  }

  private checkAndSendNotifications() {
    const now = new Date()
    
    this.settings.forEach(setting => {
      const releaseDate = new Date(setting.releaseDate)
      const timeDiff = releaseDate.getTime() - now.getTime()
      const minutesUntilRelease = Math.floor(timeDiff / (1000 * 60))

      // Check each timing condition
      if (setting.timing.oneDayBefore && this.isTimeToNotify(minutesUntilRelease, 24 * 60)) {
        this.sendNotification(setting, '1 day', minutesUntilRelease)
      }
      
      if (setting.timing.oneHourBefore && this.isTimeToNotify(minutesUntilRelease, 60)) {
        this.sendNotification(setting, '1 hour', minutesUntilRelease)
      }
      
      if (setting.timing.fifteenMinutesBefore && this.isTimeToNotify(minutesUntilRelease, 15)) {
        this.sendNotification(setting, '15 minutes', minutesUntilRelease)
      }
      
      if (setting.timing.onRelease && minutesUntilRelease <= 0 && minutesUntilRelease >= -5) {
        this.sendReleaseNotification(setting)
      }
    })
  }

  private isTimeToNotify(minutesUntilRelease: number, targetMinutes: number): boolean {
    // Send notification if we're within 1 minute of the target time
    return Math.abs(minutesUntilRelease - targetMinutes) <= 1
  }

  private async sendNotification(setting: NotificationSettings, timeText: string, minutesLeft: number) {
    const message = {
      title: `🎮 ${setting.gameName} releases soon!`,
      body: `Your anticipated game releases in ${timeText}! Get ready to play!`,
      timeRemaining: this.formatTimeRemaining(minutesLeft)
    }

    // Send email if configured
    if (setting.email?.verified) {
      await this.sendEmailNotification(setting, message, timeText)
    }

    // Send Discord if configured
    if (setting.discord?.webhookUrl) {
      await this.sendDiscordNotification(setting, message, timeText)
    }
  }

  private async sendReleaseNotification(setting: NotificationSettings) {
    const message = {
      title: `🚀 ${setting.gameName} is NOW LIVE!`,
      body: `The game you've been waiting for is finally here! Start playing now!`,
      timeRemaining: 'RELEASED!'
    }

    // Send email if configured
    if (setting.email?.verified) {
      await this.sendEmailNotification(setting, message, 'release')
    }

    // Send Discord if configured
    if (setting.discord?.webhookUrl) {
      await this.sendDiscordNotification(setting, message, 'release')
    }
  }

  private async sendEmailNotification(setting: NotificationSettings, message: any, type: string) {
    try {
      const isRelease = type === 'release'
      
      const emailContent = {
        to: setting.email!.address,
        subject: message.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px;">
            <div style="background: white; padding: 30px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">${message.title}</h1>
                <p style="color: #666; font-size: 16px; margin: 10px 0;">${message.body}</p>
              </div>
              
              ${isRelease ? `
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; font-size: 18px; font-weight: bold;">
                    🎮 GAME IS LIVE! 🎮
                  </div>
                </div>
              ` : `
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 36px; font-weight: bold; color: #7c3aed; margin-bottom: 5px;">
                      ${message.timeRemaining}
                    </div>
                    <div style="color: #666; font-size: 14px;">until release</div>
                  </div>
                </div>
              `}
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #374151;">Game Details:</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${setting.gameName}</p>
                <p style="margin: 5px 0;"><strong>Release Date:</strong> ${new Date(setting.releaseDate).toLocaleDateString()}</p>
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              
              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p>You're receiving this because you enabled notifications for this game.</p>
                <p>Anime Roblox Games Countdown | Never miss a release!</p>
              </div>
            </div>
          </div>
        `
      }

      // In a real app, you'd call your email service here
      const response = await fetch('/api/send-notification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailContent)
      })

      if (response.ok) {
        console.log(`Email notification sent to ${setting.email!.address}`)
      }
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  private async sendDiscordNotification(setting: NotificationSettings, message: any, type: string) {
    try {
      const isRelease = type === 'release'
      
      const discordPayload = {
        username: setting.discord!.username || "Game Release Bot",
        embeds: [{
          title: message.title,
          description: message.body,
          color: isRelease ? 0x10b981 : 0x7C3AED,
          fields: [
            {
              name: "Game",
              value: setting.gameName,
              inline: true
            },
            {
              name: "Release Date",
              value: new Date(setting.releaseDate).toLocaleDateString(),
              inline: true
            },
            {
              name: isRelease ? "Status" : "Time Remaining",
              value: isRelease ? "🚀 **LIVE NOW!**" : `⏰ ${message.timeRemaining}`,
              inline: true
            }
          ],
          footer: {
            text: "Anime Roblox Games Countdown",
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
          },
          timestamp: new Date().toISOString()
        }]
      }

      const response = await fetch(setting.discord!.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      })

      if (response.ok) {
        console.log(`Discord notification sent for ${setting.gameName}`)
      }
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
    }
  }

  private formatTimeRemaining(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    } else if (minutes < 24 * 60) {
      const hours = Math.floor(minutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    } else {
      const days = Math.floor(minutes / (24 * 60))
      return `${days} day${days !== 1 ? 's' : ''}`
    }
  }

  // Method to add new notification settings
  public addNotificationSetting(setting: NotificationSettings) {
    const existingIndex = this.settings.findIndex(s => s.gameId === setting.gameId)
    if (existingIndex >= 0) {
      this.settings[existingIndex] = setting
    } else {
      this.settings.push(setting)
    }
  }

  // Method to remove notification settings
  public removeNotificationSetting(gameId: string) {
    this.settings = this.settings.filter(s => s.gameId !== gameId)
  }
}

export default NotificationScheduler

// Initialize the scheduler (in a real app, this would be in your server startup)
if (typeof window !== 'undefined') {
  NotificationScheduler.getInstance()
} 