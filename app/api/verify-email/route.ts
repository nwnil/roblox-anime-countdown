import { NextRequest, NextResponse } from 'next/server'

// This would typically use a service like Resend, SendGrid, or Nodemailer
// For demo purposes, we'll simulate the process

export async function POST(request: NextRequest) {
  try {
    const { email, gameId, gameName } = await request.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Generate a verification token
    // 2. Store it in your database with expiration
    // 3. Send email with verification link
    // 4. Handle verification endpoint

    // Simulate email sending
    console.log(`Sending verification email to ${email} for game ${gameName}`)
    
    // Example email content:
    const emailContent = {
      to: email,
      subject: `🎮 Verify your email for ${gameName} notifications`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Verify Your Email</h2>
          <p>You've requested to receive notifications for <strong>${gameName}</strong>.</p>
          <p>Click the button below to verify your email address:</p>
          <a href="${process.env.NEXTAUTH_URL}/verify?token=DEMO_TOKEN&gameId=${gameId}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    display: inline-block; 
                    margin: 16px 0;">
            Verify Email Address
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            Anime Roblox Games Countdown | Never miss a release!
          </p>
        </div>
      `
    }

    // Here you would actually send the email using your preferred service:
    // await sendEmail(emailContent)

    // For demo purposes, we'll return success immediately
    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully' 
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' }, 
      { status: 500 }
    )
  }
}

// Example function for actual email sending (you'd implement this)
/*
async function sendEmail(emailContent: any) {
  // Using Resend (recommended)
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  return await resend.emails.send({
    from: 'notifications@yourdomain.com',
    to: emailContent.to,
    subject: emailContent.subject,
    html: emailContent.html,
  })

  // Or using SendGrid
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  return await sgMail.send({
    to: emailContent.to,
    from: 'notifications@yourdomain.com',
    subject: emailContent.subject,
    html: emailContent.html,
  })

  // Or using Nodemailer
  const nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emailContent.to,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}
*/ 