import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { verificationCodes } from '@/lib/verification-storage'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Verify admin password first
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminEmail = process.env.ADMIN_EMAIL
    const gmailUser = process.env.GMAIL_USER
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
    
    if (!adminPassword || !adminEmail || !gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        { error: 'Server configuration incomplete' },
        { status: 500 }
      )
    }
    
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store code with 10-minute expiry
    verificationCodes.set(adminEmail, {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    })
    
    console.log(`Generated verification code ${verificationCode} for ${adminEmail}`) // Debug log
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    })
    
    // Send email
    await transporter.sendMail({
      from: `"AniBlox Admin" <${gmailUser}>`,
      to: adminEmail,
      subject: 'Admin Panel Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Admin Panel Access</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center;">
            <h3 style="color: #666;">Your verification code is:</h3>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; margin: 20px 0; letter-spacing: 5px;">
              ${verificationCode}
            </div>
            <p style="color: #666; margin-top: 20px;">
              This code will expire in 10 minutes.
            </p>
            <p style="color: #999; font-size: 14px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email' 
    })
    
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
} 