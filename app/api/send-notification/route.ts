import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, gameName, gameId, notificationType } = await request.json()

    // Validate input
    if (!email || !gameName || !gameId || !notificationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create email content based on notification type
    let subject = ''
    let htmlContent = ''
    
    switch (notificationType) {
      case 'verification':
        subject = `🔐 Verify your email for ${gameName} notifications`
        htmlContent = createEmailHTML({
          title: 'Verify Your Email',
          gameName,
          message: 'Please verify your email address to receive notifications for this game.',
          emoji: '🔐',
          color: '#3B82F6'
        })
        break
        
      case 'oneDayBefore':
        subject = `🗓️ ${gameName} releases tomorrow!`
        htmlContent = createEmailHTML({
          title: 'Game Releases Tomorrow!',
          gameName,
          message: 'Get ready! Your awaited game releases in just 24 hours.',
          emoji: '🗓️',
          color: '#3B82F6'
        })
        break
        
      case 'oneHourBefore':
        subject = `⏰ ${gameName} releases in 1 hour!`
        htmlContent = createEmailHTML({
          title: 'Almost Time!',
          gameName,
          message: 'Your game releases in just 1 hour. Get your setup ready!',
          emoji: '⏰',
          color: '#F59E0B'
        })
        break
        
      case 'fifteenMinutesBefore':
        subject = `🚀 ${gameName} releases in 15 minutes!`
        htmlContent = createEmailHTML({
          title: 'Final Countdown!',
          gameName,
          message: 'This is it! Your game releases in just 15 minutes.',
          emoji: '🚀',
          color: '#EF4444'
        })
        break
        
      case 'onRelease':
        subject = `🎮 ${gameName} is NOW LIVE!`
        htmlContent = createEmailHTML({
          title: 'Game Released!',
          gameName,
          message: 'The moment you\'ve been waiting for! Your game is now live and ready to play.',
          emoji: '🎮',
          color: '#10B981'
        })
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    // For demo purposes, log the email instead of actually sending
    // In production, you would integrate with a service like SendGrid, Resend, or AWS SES
    console.log('📧 Email Notification:', {
      to: email,
      subject,
      type: notificationType,
      game: gameName,
      timestamp: new Date().toISOString()
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In production, you'd actually send the email here:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject
        }],
        from: { email: 'noreply@anibloxcalendar.com', name: 'AniBlox Calendar' },
        content: [{ type: 'text/html', value: htmlContent }]
      })
    })
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully',
      demo: true
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

function createEmailHTML({ title, gameName, message, emoji, color }: {
  title: string
  gameName: string
  message: string
  emoji: string
  color: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);">
        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, ${color}20 0%, ${color}10 100%); border-bottom: 1px solid #334155;">
          <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold;">${title}</h1>
          <p style="color: #94A3B8; margin: 10px 0 0 0; font-size: 16px;">${message}</p>
        </div>
        
        <!-- Game Info -->
        <div style="padding: 30px;">
          <div style="background: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 25px; text-align: center;">
            <h2 style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">${gameName}</h2>
            <p style="color: #94A3B8; margin: 0; font-size: 16px; line-height: 1.5;">
              Thank you for using AniBlox Calendar to track your favorite anime Roblox games!
            </p>
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://anibloxcalendar.com" style="display: inline-block; background: linear-gradient(135deg, ${color} 0%, ${color}CC 100%); color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View on AniBlox Calendar
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px 30px; text-align: center; border-top: 1px solid #334155; background: #0F172A;">
          <p style="color: #64748B; margin: 0; font-size: 14px;">
            You're receiving this because you subscribed to notifications for ${gameName}.<br>
            <a href="#" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> | 
            <a href="#" style="color: #64748B; text-decoration: underline;">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
} 