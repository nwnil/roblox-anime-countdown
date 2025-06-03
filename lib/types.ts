export interface Game {
  id: string
  title: string
  developer: string
  genre: string
  thumbnail: string
  icon?: string
  releaseDate: string
  hasExactDate?: boolean
  approximateReleaseText?: string
  description: string
  animeStyle: string
  tags?: string[]
  videoUrl?: string
  images?: string[]
  status?: "Alpha Testing" | "Beta Testing" | "Upcoming" | "TBA" | "Delayed"
  robloxGameId?: string
  links?: {
    discord?: string
    twitter?: string
    roblox?: string
    youtube?: string
    website?: string
    instagram?: string
    tiktok?: string
  }
  features?: string[]
  platforms?: string[]
  earlyAccessDate?: string
  notifications?: {
    enabled: boolean
    discord: boolean
    email: boolean
  }
  youtube_videos?: string[]
}
