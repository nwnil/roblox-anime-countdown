// Timezone utility functions for consistent handling across the app

/**
 * Get the user's current timezone
 */
export function getUserTimezone(): string {
  if (typeof window === 'undefined') {
    return 'UTC' // Default for server-side rendering
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format a date in the user's local timezone
 */
export function formatDateInUserTimezone(
  date: string | Date, 
  options?: Intl.DateTimeFormatOptions
): string {
  let dateObj: Date
  
  if (typeof date === 'string') {
    // For our new format, the ISO string represents the intended local time stored as UTC
    const utcDate = new Date(date)
    
    // Get the UTC components (which represent the original intended local time)
    const year = utcDate.getUTCFullYear()
    const month = utcDate.getUTCMonth()
    const day = utcDate.getUTCDate()
    const hours = utcDate.getUTCHours()
    const minutes = utcDate.getUTCMinutes()
    const seconds = utcDate.getUTCSeconds()
    
    // Create a new Date using these components as local time
    dateObj = new Date(year, month, day, hours, minutes, seconds)
  } else {
    dateObj = date
  }
  
  if (typeof window === 'undefined') {
    // Server-side: use basic formatting
    return dateObj.toLocaleDateString('en-US', options)
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format a date and time in the user's local timezone
 */
export function formatDateTimeInUserTimezone(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  let dateObj: Date
  
  if (typeof date === 'string') {
    // For our new format, the ISO string represents the intended local time stored as UTC
    const utcDate = new Date(date)
    
    // Get the UTC components (which represent the original intended local time)
    const year = utcDate.getUTCFullYear()
    const month = utcDate.getUTCMonth()
    const day = utcDate.getUTCDate()
    const hours = utcDate.getUTCHours()
    const minutes = utcDate.getUTCMinutes()
    const seconds = utcDate.getUTCSeconds()
    
    // Create a new Date using these components as local time
    dateObj = new Date(year, month, day, hours, minutes, seconds)
  } else {
    dateObj = date
  }
  
  if (typeof window === 'undefined') {
    // Server-side: use basic formatting
    return dateObj.toLocaleString('en-US', options)
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options
  }
  
  return dateObj.toLocaleString('en-US', defaultOptions)
}

/**
 * Calculate time remaining until a target date in the user's timezone
 */
export function calculateTimeRemaining(targetDate: string | Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  let target: Date
  
  if (typeof targetDate === 'string') {
    // For our new format, the ISO string represents the intended local time stored as UTC
    // We need to create a local Date that represents this same time in the user's timezone
    const utcDate = new Date(targetDate)
    
    // Get the UTC components (which represent the original intended local time)
    const year = utcDate.getUTCFullYear()
    const month = utcDate.getUTCMonth()
    const day = utcDate.getUTCDate()
    const hours = utcDate.getUTCHours()
    const minutes = utcDate.getUTCMinutes()
    const seconds = utcDate.getUTCSeconds()
    
    // Create a new Date using these components as local time
    target = new Date(year, month, day, hours, minutes, seconds)
  } else {
    target = targetDate
  }
  
  const now = new Date()
  const difference = target.getTime() - now.getTime()
  
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    }
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false
  }
}

/**
 * Get timezone abbreviation (e.g., PST, EST, etc.)
 */
export function getTimezoneAbbreviation(): string {
  if (typeof window === 'undefined') {
    return 'UTC' // Default for server-side rendering
  }
  
  const timezone = getUserTimezone()
  const date = new Date()
  
  // Get the timezone abbreviation
  const timezoneName = date.toLocaleString('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  }).split(' ').pop() || timezone
  
  return timezoneName
}

/**
 * Convert local time input to UTC for database storage
 */
export function convertLocalTimeToUTC(dateString: string, timeString: string): string {
  const localDateTime = new Date(`${dateString}T${timeString}:00`)
  return localDateTime.toISOString()
}

/**
 * Get the user's timezone offset in hours
 */
export function getTimezoneOffset(): number {
  return -(new Date().getTimezoneOffset() / 60)
}

/**
 * Convert datetime-local input to ISO string without timezone conversion
 * This preserves the exact date/time the user intended, regardless of their timezone
 */
export function datetimeLocalToISO(datetimeLocalValue: string): string {
  if (!datetimeLocalValue) return ''
  
  // datetime-local gives us "YYYY-MM-DDTHH:MM" format
  // We want to store this exact time as if it were UTC
  // so that when it's displayed anywhere, it shows the exact time the user intended
  
  // Parse the datetime-local value manually
  const [datePart, timePart] = datetimeLocalValue.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  
  // Create a Date object in UTC that represents this exact local time
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0))
  
  return utcDate.toISOString()
}

/**
 * Convert ISO string back to datetime-local format without timezone conversion
 * This shows the exact date/time that was originally intended
 */
export function isoToDatetimeLocal(isoString: string): string {
  if (!isoString) return ''
  
  try {
    // Parse the ISO string and extract the UTC components
    // which represent the original intended local time
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    
    // Get UTC components (which represent the original local time)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
} 