import { supabase } from './supabase'
import type { Game } from './types'

// Types for our database
export type DbGame = {
  id: string
  title: string
  developer: string
  description: string | null
  release_date: string | null
  has_exact_date: boolean | null
  approximate_release_text: string | null
  anime_style: string | null
  genre: string | null
  image_url: string | null
  icon_url: string | null
  trailer_url: string | null
  media_urls: string[] | null
  anticipation_level: number
  status: 'upcoming' | 'released' | 'delayed' | 'cancelled' | 'tba' | 'alpha_testing' | 'beta_testing'
  links: {
    discord?: string
    twitter?: string
    roblox?: string
    youtube?: string
    website?: string
    instagram?: string
    tiktok?: string
  } | null
  created_at: string
  updated_at: string
  youtube_videos: string[] | null
}

export type UserProfile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  timezone: string
  email_notifications: boolean
  push_notifications: boolean
  created_at: string
  updated_at: string
}

export type UserGameNotification = {
  id: string
  user_id: string
  game_id: string
  notification_type: 'release_date' | 'updates' | 'all'
  is_enabled: boolean
  created_at: string
}

export type UserPreferences = {
  id: string
  user_id: string
  preferred_genres: string[]
  preferred_anime_styles: string[]
  default_sort_option: string
  show_released_games: boolean
  created_at: string
  updated_at: string
}

// Game-related functions
export const gameService = {
  // Get all games
  async getAllGames(): Promise<DbGame[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('release_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get games by status
  async getGamesByStatus(status: string): Promise<DbGame[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', status)
      .order('release_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get games by anime style
  async getGamesByAnimeStyle(animeStyle: string): Promise<DbGame[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('anime_style', animeStyle)
      .order('release_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Add a new game (admin function)
  async addGame(game: Partial<DbGame>): Promise<DbGame> {
    console.log('Supabase addGame called with:', game)
    
    const { data, error } = await supabase
      .from('games')
      .insert([game])
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    
    console.log('Game successfully added:', data)
    return data
  },

  // Update game
  async updateGame(id: string, updates: Partial<DbGame>): Promise<DbGame> {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete game
  async deleteGame(id: string): Promise<void> {
    try {
      console.log('Starting deletion process for game:', id)
      
      // First, get the game data to access file URLs - select all columns we might need
      const { data: gameData, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching game data for deletion:', fetchError)
        // If we can't fetch the game, it might not exist, but continue with the deletion attempt
        if (fetchError.code === 'PGRST116') {
          console.log('Game not found, it may have already been deleted')
          return // Game doesn't exist, consider it already deleted
        }
      }

      console.log('Game data for deletion:', gameData)

      // Collect all file URLs to delete from storage
      const filesToDelete: string[] = []
      
      if (gameData) {
        // Add main files - check all possible column names that might exist
        const possibleFileColumns = [
          'icon_url', 'image_url', 'thumbnail_url', 'trailer_url', 'primary_video_url'
        ]
        
        for (const column of possibleFileColumns) {
          if (gameData[column] && typeof gameData[column] === 'string') {
            filesToDelete.push(gameData[column])
          }
        }
        
        // Add media files from media_urls array (if it exists)
        if (gameData.media_urls && Array.isArray(gameData.media_urls)) {
          filesToDelete.push(...gameData.media_urls.filter((url: string) => url && typeof url === 'string'))
        }
      }

      console.log('Files to delete from storage:', filesToDelete.length, filesToDelete)

      // Delete files from storage with improved error handling
      for (const fileUrl of filesToDelete) {
        if (fileUrl && typeof fileUrl === 'string' && fileUrl.trim()) {
          try {
            let bucket = '';
            let fileName = '';
            
            // Handle different URL formats
            if (fileUrl.includes('/storage/v1/object/public/')) {
              // Supabase public URL format
              const urlParts = fileUrl.split('/storage/v1/object/public/')
              if (urlParts.length > 1) {
                const pathParts = urlParts[1].split('/')
                bucket = pathParts[0]
                fileName = pathParts.slice(1).join('/')
              }
            } else if (fileUrl.includes('supabase')) {
              // Try to extract from other possible URL formats
              const matches = fileUrl.match(/\/([^\/]+)\/([^\/]+\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov|avi|mkv))$/i)
              if (matches) {
                bucket = matches[1]
                fileName = matches[2]
              }
            }
            
            if (bucket && fileName) {
              console.log(`Attempting to delete file: ${fileName} from bucket: ${bucket}`)
              
              const { error: deleteError } = await supabase.storage
                .from(bucket)
                .remove([fileName])

              if (deleteError) {
                console.error(`Error deleting file ${fileName} from bucket ${bucket}:`, deleteError)
                // Continue with other deletions even if one fails
              } else {
                console.log(`✅ Successfully deleted: ${fileName} from ${bucket}`)
              }
            } else {
              console.warn(`Could not parse file URL for deletion: ${fileUrl}`)
            }
          } catch (storageError) {
            console.error('Error processing file URL for deletion:', fileUrl, storageError)
            // Continue with other deletions
          }
        }
      }

      // Delete the game record from database
      console.log('Deleting game record from database...')
      const { error: dbError } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (dbError) {
        console.error('Error deleting game from database:', dbError)
        throw dbError
      }

      console.log('✅ Game deletion completed successfully')
    } catch (error) {
      console.error('❌ Error in deleteGame:', error)
      throw error
    }
  }
}

// User notification functions
export const notificationService = {
  // Get user's notification preferences for all games
  async getUserNotifications(userId: string): Promise<UserGameNotification[]> {
    const { data, error } = await supabase
      .from('user_game_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_enabled', true)

    if (error) throw error
    return data || []
  },

  // Toggle notification for a game
  async toggleGameNotification(userId: string, gameId: string): Promise<boolean> {
    // First check if notification exists
    const { data: existing } = await supabase
      .from('user_game_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single()

    if (existing) {
      // Update existing notification
      const { error } = await supabase
        .from('user_game_notifications')
        .update({ is_enabled: !existing.is_enabled })
        .eq('user_id', userId)
        .eq('game_id', gameId)

      if (error) throw error
      return !existing.is_enabled
    } else {
      // Create new notification
      const { error } = await supabase
        .from('user_game_notifications')
        .insert([{
          user_id: userId,
          game_id: gameId,
          notification_type: 'release_date',
          is_enabled: true
        }])

      if (error) throw error
      return true
    }
  },

  // Get notification status for a specific game
  async getGameNotificationStatus(userId: string, gameId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_game_notifications')
      .select('is_enabled')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single()

    if (error) return false
    return data?.is_enabled || false
  }
}

// User profile functions
export const userService = {
  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data
  },

  // Create or update user profile
  async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([profile])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user preferences
  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  },

  // Update user preferences
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([{ ...preferences, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Authentication functions
export const authService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Sign up with email
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Utility function to convert DB game to app Game type
export function dbGameToAppGame(dbGame: DbGame): Game {
  // Map database status to app status
  const statusMap: Record<string, Game['status']> = {
    'upcoming': 'Upcoming',
    'released': 'Upcoming', // Map released to upcoming since we don't have released status anymore
    'delayed': 'Delayed',
    'cancelled': 'TBA',
    'tba': 'TBA',
    'alpha_testing': 'Alpha Testing',
    'beta_testing': 'Beta Testing'
  }

  return {
    id: dbGame.id,
    title: dbGame.title,
    developer: dbGame.developer,
    description: dbGame.description || '',
    releaseDate: dbGame.release_date || '',
    hasExactDate: dbGame.has_exact_date ?? true, // Default to true if null
    approximateReleaseText: dbGame.approximate_release_text || '',
    animeStyle: dbGame.anime_style || '',
    genre: dbGame.genre || '',
    thumbnail: dbGame.image_url || '', // Map image_url to thumbnail
    icon: dbGame.icon_url || undefined, // Map icon_url to icon
    videoUrl: dbGame.trailer_url || '',
    status: statusMap[dbGame.status] || 'TBA', // Default to TBA instead of Upcoming
    links: dbGame.links || undefined,
    images: dbGame.media_urls || [],
    youtube_videos: dbGame.youtube_videos || [],
    tags: [],
    robloxGameId: '',
    earlyAccessDate: '',
    features: [],
    platforms: ['Roblox'],
    notifications: {
      enabled: true,
      discord: true,
      email: true
    }
  }
}

// Utility function to convert app Game to DB game format
export function appGameToDbGame(appGame: Game): Partial<DbGame> {
  // Map app status to database status
  const statusMap: Record<string, DbGame['status']> = {
    'Alpha Testing': 'alpha_testing',
    'Beta Testing': 'beta_testing',
    'Upcoming': 'upcoming',
    'TBA': 'tba',
    'Delayed': 'delayed'
  }

  return {
    title: appGame.title || '',
    developer: appGame.developer || '',
    description: appGame.description || null,
    release_date: appGame.releaseDate || null,
    has_exact_date: appGame.hasExactDate ?? true, // Default to true if undefined
    approximate_release_text: appGame.approximateReleaseText || null,
    anime_style: appGame.animeStyle || null,
    genre: appGame.genre || null,
    image_url: appGame.thumbnail || null,
    icon_url: appGame.icon || null,
    trailer_url: appGame.videoUrl || null,
    media_urls: appGame.images || null, // Store images array as media_urls
    youtube_videos: appGame.youtube_videos || null,
    anticipation_level: 5, // Default value for database
    status: statusMap[appGame.status || 'TBA'] || 'tba', // Default to tba instead of upcoming
    links: appGame.links || null
  }
} 