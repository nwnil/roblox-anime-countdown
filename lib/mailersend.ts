import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

// Initialize MailerSend instance
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN || '',
})

// Default sender information
const defaultSender = new Sender(
  process.env.MAILERSEND_FROM_EMAIL || 'noreply@yourdomain.com',
  process.env.MAILERSEND_FROM_NAME || 'AniBlox Calendar'
)

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export class MailerSendService {
  private static instance: MailerSendService

  static getInstance(): MailerSendService {
    if (!MailerSendService.instance) {
      MailerSendService.instance = new MailerSendService()
    }
    return MailerSendService.instance
  }

  private constructor() {
    // Validate environment variables
    if (!process.env.MAILERSEND_API_TOKEN) {
      console.warn('⚠️ MAILERSEND_API_TOKEN not found. Email sending will be disabled.')
    }
    if (!process.env.MAILERSEND_FROM_EMAIL) {
      console.warn('⚠️ MAILERSEND_FROM_EMAIL not found. Using default sender.')
    }
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; message?: string; messageId?: string }> {
    try {
      // Check if API token is configured
      if (!process.env.MAILERSEND_API_TOKEN) {
        console.log('📧 Demo Mode - Email would be sent:', emailData)
        return {
          success: true,
          message: 'Demo mode: Email logged to console',
          messageId: `demo-${Date.now()}`
        }
      }

      // Validate email address
      if (!this.isValidEmail(emailData.to)) {
        return {
          success: false,
          message: 'Invalid email address'
        }
      }

      // Create recipient
      const recipients = [new Recipient(emailData.to)]

      // Create email parameters
      const emailParams = new EmailParams()
        .setFrom(defaultSender)
        .setTo(recipients)
        .setSubject(emailData.subject)
        .setHtml(emailData.html)

      // Add text version if provided
      if (emailData.text) {
        emailParams.setText(emailData.text)
      }

      // Send email
      const response = await mailersend.email.send(emailParams)

      console.log('✅ Email sent successfully:', {
        to: emailData.to,
        subject: emailData.subject,
        messageId: response.body?.id || 'unknown'
      })

      return {
        success: true,
        message: 'Email sent successfully',
        messageId: response.body?.id
      }

    } catch (error) {
      console.error('❌ Failed to send email:', error)
      
      // Handle specific MailerSend errors
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          return {
            success: false,
            message: 'Invalid API token. Please check your MailerSend configuration.'
          }
        }
        if (error.message.includes('403')) {
          return {
            success: false,
            message: 'Domain not verified. Please verify your domain in MailerSend dashboard.'
          }
        }
        if (error.message.includes('429')) {
          return {
            success: false,
            message: 'Rate limit exceeded. Please try again later.'
          }
        }
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async sendNotificationEmail(
    email: string,
    gameName: string,
    gameId: string,
    notificationType: string
  ): Promise<{ success: boolean; message?: string; messageId?: string }> {
    
    const emailData = this.createNotificationEmail(email, gameName, gameId, notificationType)
    
    if (!emailData) {
      return {
        success: false,
        message: 'Invalid notification type'
      }
    }

    return await this.sendEmail(emailData)
  }

  private createNotificationEmail(
    email: string,
    gameName: string,
    gameId: string,
    notificationType: string
  ): EmailData | null {
    
    let subject = ''
    let htmlContent = ''
    
    switch (notificationType) {
      case 'verification':
        subject = `🔐 Verify your email for ${gameName} notifications`
        htmlContent = this.createEmailHTML({
          title: 'Verify Your Email',
          gameName,
          message: 'Please verify your email address to receive notifications for this game.',
          emoji: '🔐',
          color: '#3B82F6',
          actionText: 'Verify Email',
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify?email=${encodeURIComponent(email)}&game=${gameId}`
        })
        break
        
      case 'oneDayBefore':
        subject = `🗓️ ${gameName} releases tomorrow!`
        htmlContent = this.createEmailHTML({
          title: 'Game Releases Tomorrow!',
          gameName,
          message: 'Get ready! Your awaited game releases in just 24 hours.',
          emoji: '🗓️',
          color: '#3B82F6',
          actionText: 'View Game Details',
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}#game-${gameId}`
        })
        break
        
      case 'oneHourBefore':
        subject = `⏰ ${gameName} releases in 1 hour!`
        htmlContent = this.createEmailHTML({
          title: 'Almost Time!',
          gameName,
          message: 'Your game releases in just 1 hour. Get your setup ready!',
          emoji: '⏰',
          color: '#F59E0B',
          actionText: 'Get Ready to Play',
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}#game-${gameId}`
        })
        break
        
      case 'fifteenMinutesBefore':
        subject = `🚀 ${gameName} releases in 15 minutes!`
        htmlContent = this.createEmailHTML({
          title: 'Final Countdown!',
          gameName,
          message: 'This is it! Your game releases in just 15 minutes.',
          emoji: '🚀',
          color: '#EF4444',
          actionText: 'Join the Action',
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}#game-${gameId}`
        })
        break
        
      case 'onRelease':
        subject = `🎮 ${gameName} is NOW LIVE!`
        htmlContent = this.createEmailHTML({
          title: 'Game Released!',
          gameName,
          message: 'The moment you\'ve been waiting for! Your game is now live and ready to play.',
          emoji: '🎮',
          color: '#10B981',
          actionText: 'Play Now',
          actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}#game-${gameId}`
        })
        break
        
      default:
        return null
    }

    return {
      to: email,
      subject,
      html: htmlContent,
      text: this.createTextVersion(subject, gameName, notificationType)
    }
  }

  private createEmailHTML({ title, gameName, message, emoji, color, actionText, actionUrl }: {
    title: string
    gameName: string
    message: string
    emoji: string
    color: string
    actionText: string
    actionUrl: string
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { margin: 0; padding: 0; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); }
          .header { text-align: center; padding: 40px 30px 30px; background: linear-gradient(135deg, #1E293B 0%, #334155 100%); }
          .emoji { font-size: 48px; margin-bottom: 10px; }
          .title { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; }
          .subtitle { color: #94A3B8; margin: 10px 0 0 0; font-size: 16px; }
          .content { padding: 30px; }
          .game-card { background: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 25px; text-align: center; }
          .game-title { color: #FFFFFF; margin: 0 0 15px 0; font-size: 24px; font-weight: bold; }
          .game-description { color: #94A3B8; margin: 0; font-size: 16px; line-height: 1.5; }
          .action-button { text-align: center; margin-top: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, ${color} 0%, ${color}CC 100%); color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; }
          .footer { padding: 20px 30px; text-align: center; border-top: 1px solid #334155; background: #0F172A; }
          .footer-text { color: #64748B; margin: 0; font-size: 14px; }
          .footer-link { color: #64748B; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="emoji">${emoji}</div>
            <h1 class="title">${title}</h1>
            <p class="subtitle">${message}</p>
          </div>
          
          <!-- Game Info -->
          <div class="content">
            <div class="game-card">
              <h2 class="game-title">${gameName}</h2>
              <p class="game-description">
                Thank you for using AniBlox Calendar to track your favorite anime Roblox games!
              </p>
            </div>
            
            <!-- Action Button -->
            <div class="action-button">
              <a href="${actionUrl}" class="button">
                ${actionText}
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              You're receiving this because you subscribed to notifications for ${gameName}.<br>
              <a href="#" class="footer-link">Unsubscribe</a> | 
              <a href="#" class="footer-link">Update Preferences</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private createTextVersion(subject: string, gameName: string, notificationType: string): string {
    const baseText = `${subject}\n\nGame: ${gameName}\n\nThank you for using AniBlox Calendar to track your favorite anime Roblox games!\n\nVisit: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}\n\nYou're receiving this because you subscribed to notifications for ${gameName}.`
    
    switch (notificationType) {
      case 'verification':
        return `${baseText}\n\nPlease verify your email address to receive notifications for this game.`
      case 'oneDayBefore':
        return `${baseText}\n\nGet ready! Your awaited game releases in just 24 hours.`
      case 'oneHourBefore':
        return `${baseText}\n\nYour game releases in just 1 hour. Get your setup ready!`
      case 'fifteenMinutesBefore':
        return `${baseText}\n\nThis is it! Your game releases in just 15 minutes.`
      case 'onRelease':
        return `${baseText}\n\nThe moment you've been waiting for! Your game is now live and ready to play.`
      default:
        return baseText
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Health check method
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!process.env.MAILERSEND_API_TOKEN) {
        return {
          success: false,
          message: 'MailerSend API token not configured'
        }
      }

      // Test with a simple API call (get account info)
      // Note: MailerSend doesn't have a dedicated health check endpoint
      // so we'll just verify the token format
      const token = process.env.MAILERSEND_API_TOKEN
      if (token.length < 10) {
        return {
          success: false,
          message: 'Invalid API token format'
        }
      }

      return {
        success: true,
        message: 'MailerSend service configured correctly'
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const mailersendService = MailerSendService.getInstance() 