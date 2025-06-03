import { NextRequest, NextResponse } from 'next/server'
import { verificationCodes } from '@/lib/verification-storage'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    const adminEmail = process.env.ADMIN_EMAIL
    
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email not configured' },
        { status: 500 }
      )
    }
    
    console.log(`Checking verification code ${code} for ${adminEmail}`) // Debug log
    console.log(`Available codes:`, Array.from(verificationCodes.entries())) // Debug log
    
    const storedData = verificationCodes.get(adminEmail)
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new code.' },
        { status: 404 }
      )
    }
    
    // Check if code expired
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(adminEmail)
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 410 }
      )
    }
    
    // Verify code
    if (code !== storedData.code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      )
    }
    
    // Code is valid, remove it and grant access
    verificationCodes.delete(adminEmail)
    console.log(`Verification successful for ${adminEmail}`) // Debug log
    
    return NextResponse.json({ 
      success: true,
      message: 'Verification successful' 
    })
    
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

// Export the Map so send-code route can access it
export { verificationCodes } 