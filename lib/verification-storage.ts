// Use global variable to ensure sharing between API routes in Next.js
declare global {
  var verificationCodes: Map<string, { code: string, expires: number }> | undefined
}

// Initialize global verification codes storage
if (!global.verificationCodes) {
  global.verificationCodes = new Map<string, { code: string, expires: number }>()
}

export const verificationCodes = global.verificationCodes

// Clean up expired codes periodically (only run once)
if (!global.cleanupInterval) {
  global.cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [email, data] of verificationCodes.entries()) {
      if (now > data.expires) {
        verificationCodes.delete(email)
      }
    }
  }, 60000) // Clean up every minute
}

declare global {
  var cleanupInterval: NodeJS.Timeout | undefined
} 