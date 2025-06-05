"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { MediaUpload } from "@/components/ui/media-upload"
import { MultiMediaUpload } from "@/components/ui/multi-media-upload"
import { Trash2, Edit, Plus, Eye, EyeOff, Save, X, Image, Video, Link, Tags, Calendar, Settings, Globe, Check, Clock, Users, Tag, Star, Gamepad2, Zap, Shield, Crown, Sparkles, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { gameService, dbGameToAppGame, appGameToDbGame } from "@/lib/supabase-service"
import type { Game } from "@/lib/types"
import type { DbGame } from "@/lib/supabase-service"
import { motion, AnimatePresence } from "framer-motion"
import { FileUpload } from "@/components/ui/file-upload"
import { calculateTimeRemaining } from "@/lib/timezone-utils"
import { datetimeLocalToISO, isoToDatetimeLocal } from "@/lib/timezone-utils"

// GameListItem component for rendering individual games
interface GameListItemProps {
  game: Game
  onEdit: (game: Game) => void
  onDelete: (id: string) => void
}

const GameListItem: React.FC<GameListItemProps> = ({ game, onEdit, onDelete }) => {
  // Only show as released if we have an exact date and it's past the current time
  const isReleased = game.hasExactDate !== false && new Date(game.releaseDate) <= new Date()
  
  return (
    <Card className="bg-[#1a1d29] border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex gap-2">
            <img 
              src={game.thumbnail} 
              alt={game.title}
              className="w-16 h-16 rounded-lg object-cover bg-gray-800"
            />
            {game.icon && (
              <img 
                src={game.icon} 
                alt={`${game.title} icon`}
                className="w-12 h-12 rounded object-cover bg-gray-800"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{game.title}</h3>
                  {isReleased && (
                    <Badge className="bg-blue-600 text-white">Released</Badge>
                  )}
                </div>
                <p className="text-gray-400">by {game.developer}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" size="sm">{game.genre}</Badge>
                  <Badge variant="secondary" size="sm">{game.animeStyle}</Badge>
                  {game.status && <Badge variant="outline" size="sm">{game.status}</Badge>}
                </div>
                {game.tags && game.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {game.tags.length > 3 && (
                      <Badge variant="secondary" size="sm" className="text-xs">
                        +{game.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Release Date</p>
                <p className={`${isReleased ? 'text-blue-400' : 'text-white'}`}>
                  {game.hasExactDate !== false ? (
                    new Date(game.releaseDate).toLocaleDateString()
                  ) : (
                    game.approximateReleaseText || "TBA"
                  )}
                </p>
                {game.earlyAccessDate && game.hasExactDate !== false && (
                  <>
                    <p className="text-sm text-gray-400 mt-1">Early Access</p>
                    <p className="text-cyan-400 text-sm">{new Date(game.earlyAccessDate).toLocaleDateString()}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(game)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(game.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Additional details with modern icons */}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
              {game.videoUrl && (
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Video
                </div>
              )}
              {game.images && game.images.length > 0 && (
                <div className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  {game.images.length} Images
                </div>
              )}
              {game.platforms && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {game.platforms.join(", ")}
                </div>
              )}
              {game.notifications?.enabled && (
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [games, setGames] = useState<Game[]>([])
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authStep, setAuthStep] = useState<'password' | 'verification'>('password')
  const [codeSent, setCodeSent] = useState(false)

  // Step 1: Send verification code to email
  const handleSendCode = async () => {
    setIsLoading(true)
    setAuthError("")
    
    try {
      const response = await fetch('/api/admin/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuthStep('verification')
        setCodeSent(true)
        setAuthError("")
      } else {
        setAuthError(data.error || "Failed to send verification code")
      }
    } catch (error) {
      setAuthError("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify the email code
  const handleVerifyCode = async () => {
    setIsLoading(true)
    setAuthError("")
    
    try {
      const response = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("adminAuth", "true")
        loadGames()
      } else {
        setAuthError(data.error || "Verification failed")
      }
    } catch (error) {
      setAuthError("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset auth flow
  const resetAuth = () => {
    setAuthStep('password')
    setCodeSent(false)
    setPassword("")
    setVerificationCode("")
    setAuthError("")
  }

  // Load games from Supabase
  const loadGames = async () => {
    try {
      setIsLoadingGames(true)
      const dbGames = await gameService.getAllGames()
      const appGames = dbGames.map(dbGameToAppGame)
      setGames(appGames)
    } catch (error) {
      console.error('Error loading games:', error)
      alert('Failed to load games from database')
    } finally {
      setIsLoadingGames(false)
    }
  }

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
      loadGames()
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("adminAuth")
    setPassword("")
  }

  const genres = [
    "Fighting / PvP", 
    "RPG / Open World", 
    "Tower Defense", 
    "Simulator / Idle", 
    "Sports / Racing", 
    "Arena Battler", 
    "Story Mode", 
    "Adventure / Quest-Based"
  ]
  
  const animeStyles = [
    "One Piece", "Naruto", "Dragon Ball", "My Hero Academia", 
    "Demon Slayer", "Bleach", "Attack on Titan", "Jujutsu Kaisen",
    "Chainsaw Man", "Solo Leveling", "Sword Art Online", "Tokyo Ghoul", 
    "JoJo's Bizarre Adventure", "One Punch Man", "Blue Lock", "Black Clover", "Fire Force", "Other"
  ]
  
  const statusOptions = ["Alpha Testing", "Beta Testing", "Upcoming", "TBA", "Delayed"]
  const platformOptions = ["Roblox", "Roblox (Early Access)", "PC", "Mobile", "Console"]
  
  const commonTags = [
    "Upcoming", "Early Access", "Fighting & PVP", "RPG", "Adventure", "Anime", 
    "Multiplayer", "Single Player", "Free to Play", "Open World", "Story Mode",
    "Character Customization", "PvP", "PvE", "Competitive", "Casual"
  ]

  const createEmptyGame = (): Game => ({
    id: Date.now().toString(),
    title: "",
    developer: "",
    genre: "Fighting / PvP",
    thumbnail: "/placeholder.svg",
    icon: "/placeholder.svg",
    releaseDate: (() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(12, 0, 0, 0) // Set to noon tomorrow
      return tomorrow.toISOString()
    })(),
    hasExactDate: true, // Default to exact date
    approximateReleaseText: "", // Empty by default
    description: "",
    animeStyle: "One Piece",
    tags: [],
    status: "Upcoming",
    videoUrl: "",
    images: [],
    robloxGameId: "",
    earlyAccessDate: "",
    features: [],
    platforms: ["Roblox"],
    notifications: {
      enabled: true,
      discord: true,
      email: true
    },
    links: {
      discord: "",
      twitter: "",
      roblox: "",
      youtube: "",
      website: "",
      instagram: "",
      tiktok: ""
    }
  })

  const handleSaveGame = async (game: Game) => {
    setIsLoading(true)
    try {
      const dbGameData = appGameToDbGame(game)
      
    if (editingGame) {
      // Update existing game
        await gameService.updateGame(game.id, dbGameData)
      setGames(games.map(g => g.id === game.id ? game : g))
        alert("Game updated successfully!")
    } else {
        // Add new game - don't include ID, let Supabase generate it
        const { id, ...newGameData } = dbGameData
        console.log('Attempting to save game data:', newGameData)
        await gameService.addGame(newGameData)
        // Reload games to get the new game with proper ID
        await loadGames()
        alert("Game added successfully!")
    }
      
    setEditingGame(null)
    setShowAddForm(false)
    } catch (error) {
      console.error('Error saving game:', error)
      // Show more detailed error information
      let errorMessage = 'Failed to save game to database'
      if (error instanceof Error) {
        errorMessage += ': ' + error.message
      } else if (typeof error === 'object' && error !== null) {
        errorMessage += ': ' + JSON.stringify(error, null, 2)
      }
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      setIsLoading(true)
      try {
        await gameService.deleteGame(id)
      setGames(games.filter(g => g.id !== id))
        alert("Game deleted successfully!")
      } catch (error) {
        console.error('Error deleting game:', error)
        alert('Failed to delete game from database')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Simple Game Form Component
  const GameForm = ({ game, onSave, onCancel, isSubmitting }: { 
    game: Game, 
    onSave: (game: Game) => void, 
    onCancel: () => void,
    isSubmitting: boolean
  }) => {
    const [formData, setFormData] = useState(game)
    const [newTag, setNewTag] = useState("")
    const [newFeature, setNewFeature] = useState("")
    const [isFormClient, setIsFormClient] = useState(false)
    const [newYoutubeUrl, setNewYoutubeUrl] = useState('')
    const [localLoading, setLocalLoading] = useState(false)

    // Set client flag after mount to prevent hydration issues
    useEffect(() => {
      setIsFormClient(true)
    }, [])

    // Use memoized form data to prevent unnecessary rerenders
    const memoizedFormData = useMemo(() => formData, [formData]);

    // Define updateFormData function with proper batching to prevent refreshes
    const updateFormData = useCallback((updates: Partial<Game>) => {
      setFormData(prev => ({
        ...prev,
        ...updates
      }));
    }, []);

    // Use a memoized debounced function to batch multiple updates
    const debouncedUpdateFormData = useCallback(
      (() => {
        let timeoutId: NodeJS.Timeout | null = null;
        return (updates: Partial<Game>) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            updateFormData(updates);
            timeoutId = null;
          }, 50);
        };
      })(),
      [updateFormData]
    );

    // Replace all instances of updateFormDataDebounced with debouncedUpdateFormData
    const addTag = useCallback(() => {
      if (newTag && !formData.tags?.includes(newTag)) {
        debouncedUpdateFormData({
          tags: [...(formData.tags || []), newTag]
        });
        setNewTag("");
      }
    }, [newTag, formData.tags, debouncedUpdateFormData]);

    const removeTag = useCallback((tagToRemove: string) => {
      debouncedUpdateFormData({
        tags: formData.tags?.filter(tag => tag !== tagToRemove)
      });
    }, [formData.tags, debouncedUpdateFormData]);

    const addFeature = useCallback(() => {
      if (newFeature && !formData.features?.includes(newFeature)) {
        debouncedUpdateFormData({
          features: [...(formData.features || []), newFeature]
        });
        setNewFeature("");
      }
    }, [newFeature, formData.features, debouncedUpdateFormData]);

    const removeFeature = useCallback((featureToRemove: string) => {
      debouncedUpdateFormData({
        features: formData.features?.filter(feature => feature !== featureToRemove)
      });
    }, [formData.features, debouncedUpdateFormData]);

    // Use useCallback to prevent unnecessary re-renders
    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault()
      
      // Prevent double submissions
      if (isSubmitting || localLoading) {
        return
      }
      
      setLocalLoading(true)
      
      if (!formData.title || !formData.developer || !formData.description) {
        alert("Please fill in all required fields!")
        setLocalLoading(false)
        return
      }
      
      // Validate release date based on type
      if (formData.hasExactDate) {
        if (!formData.releaseDate) {
          alert("Please select a release date!")
          setLocalLoading(false)
          return
        }
      } else {
        if (!formData.approximateReleaseText?.trim()) {
          alert("Please enter an approximate release time!")
          setLocalLoading(false)
          return
        }
      }
      
      onSave(formData)
      // Don't reset localLoading here as the parent component will unmount this component
    }, [formData, onSave, isSubmitting, localLoading]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-[#1a1d29] border-gray-800 my-4">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {editingGame ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingGame ? "Edit Game" : "Add New Game"}
            </CardTitle>
            <CardDescription>
              Configure all game details, media, and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                  <TabsTrigger value="basic" className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="release" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Release
                  </TabsTrigger>
                  <TabsTrigger value="links" className="flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    Links
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Features
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Game Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => debouncedUpdateFormData({title: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter game title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="developer" className="text-white">Developer *</Label>
                      <Input
                        id="developer"
                        value={formData.developer}
                        onChange={(e) => debouncedUpdateFormData({developer: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter developer name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="genre" className="text-white">Genre</Label>
                      <Select value={formData.genre} onValueChange={(value) => debouncedUpdateFormData({genre: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map(genre => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="animeStyle" className="text-white">Anime Style</Label>
                      <Select value={formData.animeStyle} onValueChange={(value) => debouncedUpdateFormData({animeStyle: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {animeStyles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => debouncedUpdateFormData({status: value as any})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="robloxGameId" className="text-white">Roblox Game ID</Label>
                      <Input
                        id="robloxGameId"
                        value={formData.robloxGameId || ""}
                        onChange={(e) => debouncedUpdateFormData({robloxGameId: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter Roblox game ID"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => debouncedUpdateFormData({description: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      placeholder="Enter game description"
                    />
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6 mt-4">
                  <div className="space-y-8">
                    {/* Game Icon Section */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Image className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Game Icon</h3>
                          <p className="text-blue-200/80">Square logo displayed in game cards</p>
                        </div>
                      </div>
                      
                      <FileUpload
                        onFileUpload={async (file: File) => {
                          console.log('Uploading icon file:', file.name)
                          
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: uploadFormData,
                          })

                          if (!response.ok) {
                            const errorData = await response.text()
                            throw new Error(`Upload failed: ${response.status} ${errorData}`)
                          }

                          const data = await response.json()
                          
                          if (!data.success || !data.url) {
                            throw new Error(data.error || 'Upload failed - no URL returned')
                          }

                          debouncedUpdateFormData({icon: data.url})
                          return data.url
                        }}
                        acceptedTypes={['image/*']}
                        maxSize={20}
                        currentUrl={formData.icon}
                        placeholder="Drop your game icon here"
                        className="w-full"
                      />
                      
                      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <h4 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          Icon Guidelines
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200/80">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <span>Size: 512x512px (1:1)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <span>Format: PNG, JPG, WebP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <span>Max: 20MB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Media Gallery Section */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Video className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Media Gallery</h3>
                          <p className="text-purple-200/80">Screenshots, videos & preview content</p>
                        </div>
                      </div>

                      <MultiMediaUpload
                        mediaUrls={formData.images || []}
                        primaryVideoUrl={formData.videoUrl || ""}
                        onPrimaryVideoChange={(videoUrl) => {
                          debouncedUpdateFormData({videoUrl: videoUrl})
                        }}
                        onChange={(urls) => {
                          debouncedUpdateFormData({
                            images: urls,
                            videoUrl: (() => {
                              const videos = urls.filter(url => 
                                url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
                              )
                              
                              if (videos.length === 0) return ""
                              if (formData.videoUrl && videos.includes(formData.videoUrl)) {
                                return formData.videoUrl
                              }
                              return videos[0]
                            })()
                          })
                        }}
                        maxItems={50}
                        disabled={isLoading}
                      />
                    </div>

                    {/* YouTube Videos Section */}
                    <div className="mt-8">
                      <Label className="text-white text-lg mb-2 block">YouTube Videos</Label>
                      <p className="text-sm text-gray-400 mb-2">Paste a YouTube video URL and press Add. You can add multiple videos. Unlisted videos are supported.</p>
                      <div className="flex gap-2 mb-4">
                        <Input
                          type="url"
                          value={newYoutubeUrl}
                          onChange={e => setNewYoutubeUrl(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white flex-1"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => {
                            const url = newYoutubeUrl.trim()
                            if (!url) return
                            // Basic YouTube URL validation
                            const isValid = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\//)
                            if (!isValid) return alert('Please enter a valid YouTube URL.')
                            debouncedUpdateFormData({
                              youtube_videos: [...(formData.youtube_videos || []), url],
                            })
                            setNewYoutubeUrl('')
                          }}
                          disabled={!newYoutubeUrl.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      {/* List of added YouTube videos with preview */}
                      <div className="space-y-4">
                        {(formData.youtube_videos || []).map((url, idx) => {
                          // Extract YouTube video ID
                          let videoId = ''
                          const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/)
                          if (match) videoId = match[1]
                          return (
                            <div key={idx} className="flex items-center gap-4 mb-2">
                              <div className="w-48 aspect-video rounded overflow-hidden border border-gray-700 bg-black">
                                {videoId ? (
                                  <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${videoId}?controls=1&modestbranding=1&showinfo=0&rel=0`}
                                    title={`YouTube video ${idx + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  ></iframe>
                                ) : (
                                  <div className="text-xs text-gray-400 p-2">Invalid YouTube URL</div>
                                )}
                              </div>
                              <div className="flex-1 break-all text-gray-200 text-xs">{url}</div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  debouncedUpdateFormData({
                                    youtube_videos: (formData.youtube_videos || []).filter((_, i) => i !== idx)
                                  })
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Media Summary Dashboard */}
                    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Settings className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Media Overview</h3>
                          <p className="text-green-200/80">Summary of all uploaded content</p>
                        </div>
            git reset --hard 4d11999
          </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-green-400 mb-2">
                            {formData.icon ? '1' : '0'}
                          </div>
                          <div className="text-sm text-green-200/80">Game Icon</div>
                          <div className="text-xs text-green-300/60 mt-1">
                            {formData.icon ? 'Ready' : 'Missing'}
                          </div>
                        </div>
                        
                        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-blue-400 mb-2">
                            {formData.images?.filter(url => !url.includes('video') && !url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)).length || 0}
                          </div>
                          <div className="text-sm text-blue-200/80">Screenshots</div>
                          <div className="text-xs text-blue-300/60 mt-1">
                            Images
                          </div>
                        </div>
                        
                        <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-purple-400 mb-2">
                            {formData.images?.filter(url => url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)).length || 0}
                          </div>
                          <div className="text-sm text-purple-200/80">Videos</div>
                          <div className="text-xs text-purple-300/60 mt-1">
                            Preview clips
                          </div>
                        </div>
                        
                        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-yellow-400 mb-2">
                            {formData.videoUrl ? '⭐' : '—'}
                          </div>
                          <div className="text-sm text-yellow-200/80">Primary Video</div>
                          <div className="text-xs text-yellow-300/60 mt-1">
                            {formData.videoUrl ? 'Set' : 'None'}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          formData.icon 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          Icon: {formData.icon ? 'Ready' : 'Missing'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (formData.images?.length || 0) > 0
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          Media: {formData.images?.length || 0} files
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          formData.videoUrl
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          Primary: {formData.videoUrl ? 'Set' : 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Release Tab */}
                <TabsContent value="release" className="space-y-4 mt-4">
                  {/* Release Date Type Toggle */}
                  <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="hasExactDate" className="text-white font-medium">Release Date Type</Label>
                        <p className="text-sm text-gray-400">Choose whether you have an exact date or approximate timing</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.hasExactDate ? 'text-white font-medium' : 'text-gray-400'}`}>
                          Approximate
                        </span>
                        <Switch
                          id="hasExactDate"
                          checked={formData.hasExactDate ?? true}
                          onCheckedChange={(checked) => {
                            debouncedUpdateFormData({
                              hasExactDate: checked,
                              // Clear opposite field when switching
                              ...(checked ? { approximateReleaseText: "" } : {})
                            })
                          }}
                        />
                        <span className={`text-sm ${formData.hasExactDate ? 'text-white font-medium' : 'text-gray-400'}`}>
                          Exact Date
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Release Date Fields */}
                  {formData.hasExactDate ? (
                    // Exact Date Fields
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="releaseDate" className="text-white">Release Date *</Label>
                        <Input
                          id="releaseDate"
                          type="datetime-local"
                          value={isoToDatetimeLocal(formData.releaseDate || '')}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value) {
                              // Use the new timezone-safe conversion
                              const isoString = datetimeLocalToISO(value)
                              debouncedUpdateFormData({releaseDate: isoString})
                            } else {
                              const tomorrow = new Date()
                              tomorrow.setDate(tomorrow.getDate() + 1)
                              tomorrow.setHours(12, 0, 0, 0)
                              debouncedUpdateFormData({releaseDate: tomorrow.toISOString()})
                            }
                          }}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Required: When the game will be released</p>
                      </div>
                      <div>
                        <Label htmlFor="earlyAccessDate" className="text-white">Early Access Date (Optional)</Label>
                        <Input
                          id="earlyAccessDate"
                          type="datetime-local"
                          value={isoToDatetimeLocal(formData.earlyAccessDate || '')}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value) {
                              // Use the new timezone-safe conversion
                              const isoString = datetimeLocalToISO(value)
                              debouncedUpdateFormData({earlyAccessDate: isoString})
                            } else {
                              debouncedUpdateFormData({earlyAccessDate: ''})
                            }
                          }}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Early access before official release</p>
                      </div>
                    </div>
                  ) : (
                    // Approximate Date Field
                    <div>
                      <Label htmlFor="approximateReleaseText" className="text-white">Approximate Release Time *</Label>
                      <Input
                        id="approximateReleaseText"
                        type="text"
                        value={formData.approximateReleaseText || ""}
                        onChange={(e) => debouncedUpdateFormData({approximateReleaseText: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g., July 2025, Q2 2025, Summer 2025, Late 2024"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter approximate timing like "July 2025", "Q2 2025", "Summer 2025", etc.</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-md">
                    <h4 className="text-blue-400 font-medium mb-2">📅 Date & Time Guidelines:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {formData.hasExactDate ? (
                        <>
                          <li>• <strong>Release Date:</strong> The official launch date and time</li>
                          <li>• <strong>Early Access:</strong> Optional - for games with beta/early access</li>
                          <li>• <strong>Format:</strong> Browser will show date/time picker automatically</li>
                          <li>• <strong>Time Zone:</strong> Use your local time - system handles conversion</li>
                        </>
                      ) : (
                        <>
                          <li>• <strong>Approximate Release:</strong> Use when exact date is not available</li>
                          <li>• <strong>Examples:</strong> "July 2025", "Q2 2025", "Summer 2025", "Late 2024"</li>
                          <li>• <strong>Format:</strong> Keep it simple and user-friendly</li>
                          <li>• <strong>Note:</strong> Countdown timers won't show for approximate dates</li>
                        </>
                      )}
                    </ul>
                  </div>
                </TabsContent>

                {/* Links Tab */}
                <TabsContent value="links" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discord" className="text-white">Discord</Label>
                      <Input
                        id="discord"
                        value={formData.links?.discord || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), discord: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter Discord server URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter" className="text-white">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.links?.twitter || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), twitter: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter Twitter profile URL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roblox" className="text-white">Roblox</Label>
                      <Input
                        id="roblox"
                        value={formData.links?.roblox || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), roblox: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter Roblox game URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtube" className="text-white">YouTube</Label>
                      <Input
                        id="youtube"
                        value={formData.links?.youtube || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), youtube: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter YouTube video URL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website" className="text-white">Website</Label>
                      <Input
                        id="website"
                        value={formData.links?.website || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), website: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter game website URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram" className="text-white">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.links?.instagram || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), instagram: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter Instagram profile URL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tiktok" className="text-white">TikTok</Label>
                      <Input
                        id="tiktok"
                        value={formData.links?.tiktok || ""}
                        onChange={(e) => debouncedUpdateFormData({links: {...(formData.links || {}), tiktok: e.target.value}})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter TikTok profile URL"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="features" className="text-white">Features</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Enter new feature"
                        />
                        <Button type="button" onClick={addFeature} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.features?.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(feature)}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting || localLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {(isSubmitting || localLoading) ? "Saving..." : "Save Game"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || localLoading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#1a1d29] to-[#151823] flex items-center justify-center relative">
        {/* Background image */}
        <div className="fixed inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
            style={{
              backgroundImage: 'url(/background-image.png)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117]/90 via-[#1a1d29]/80 to-[#151823]/90"></div>
        </div>
        <Card className="w-full max-w-md bg-[#1a1d29] border-gray-800 relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter the admin password to manage games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {authError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md text-red-500 text-sm">
                  {authError}
                </div>
              )}
              
              {authStep === 'password' ? (
                <>
                  <div className="relative mb-4">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendCode()}
                      className="bg-gray-800 border-gray-700 text-white pr-10"
                      placeholder="Enter admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleSendCode} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-md text-green-400 text-sm">
                    ✅ Verification code sent to your email! Check your inbox.
                  </div>
                  
                  <div className="mb-4">
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
                      className="bg-gray-800 border-gray-700 text-white text-center text-2xl letter-spacing-wide"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerifyCode} 
                    className="w-full bg-green-600 hover:bg-green-700 mb-3"
                    disabled={isLoading || !verificationCode}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                  
                  <Button 
                    onClick={resetAuth} 
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    ← Back to Password
                  </Button>
                </>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure admin authentication with email verification
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#1a1d29] to-[#151823] p-6 relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url(/background-image.png)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117]/90 via-[#1a1d29]/80 to-[#151823]/90"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Game Admin Dashboard</h1>
            <p className="text-gray-400">Manage your Roblox anime countdown games</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">{games.length}</div>
              <p className="text-gray-400">Total Games</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-400">
                {games.filter(g => {
                  // Approximate dates are always considered upcoming
                  if (g.hasExactDate === false) return true
                  // Exact dates are upcoming if in the future
                  return new Date(g.releaseDate) > new Date()
                }).length}
              </div>
              <p className="text-gray-400">Upcoming Games</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-400">
                {games.filter(g => {
                  // Only exact dates can be considered released
                  return g.hasExactDate !== false && new Date(g.releaseDate) <= new Date()
                }).length}
              </div>
              <p className="text-gray-400">Released Games</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">
                {games.filter(g => g.notifications?.enabled).length}
              </div>
              <p className="text-gray-400">Notifications Enabled</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-[#1a1d29] border border-gray-800 mb-6">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Upcoming Games ({games.filter(g => {
                // Approximate dates are always considered upcoming
                if (g.hasExactDate === false) return true
                // Exact dates are upcoming if in the future
                return new Date(g.releaseDate) > new Date()
              }).length})
            </TabsTrigger>
            <TabsTrigger value="released" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Released Games ({games.filter(g => {
                // Only exact dates can be considered released
                return g.hasExactDate !== false && new Date(g.releaseDate) <= new Date()
              }).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {games.filter(g => {
                // Approximate dates are always considered upcoming
                if (g.hasExactDate === false) return true
                // Exact dates are upcoming if in the future
                return new Date(g.releaseDate) > new Date()
              }).length === 0 ? (
                <Card className="bg-[#1a1d29] border-gray-800">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-400 text-lg">No upcoming games found</p>
                    <p className="text-gray-500 mt-2">Add a new game to get started</p>
                  </CardContent>
                </Card>
              ) : (
                games.filter(g => {
                  // Approximate dates are always considered upcoming
                  if (g.hasExactDate === false) return true
                  // Exact dates are upcoming if in the future
                  return new Date(g.releaseDate) > new Date()
                }).map((game) => (
                  <GameListItem key={game.id} game={game} onEdit={setEditingGame} onDelete={handleDeleteGame} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="released">
            <div className="space-y-4">
              {games.filter(g => {
                // Only exact dates can be considered released
                return g.hasExactDate !== false && new Date(g.releaseDate) <= new Date()
              }).length === 0 ? (
                <Card className="bg-[#1a1d29] border-gray-800">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-400 text-lg">No released games found</p>
                    <p className="text-gray-500 mt-2">Games will appear here when their countdown reaches zero</p>
                  </CardContent>
                </Card>
              ) : (
                games.filter(g => {
                  // Only exact dates can be considered released
                  return g.hasExactDate !== false && new Date(g.releaseDate) <= new Date()
                }).map((game) => (
                  <GameListItem key={game.id} game={game} onEdit={setEditingGame} onDelete={handleDeleteGame} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showAddForm && (
          <GameForm
            key="add-form"
            game={createEmptyGame()}
            onSave={handleSaveGame}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isLoading}
          />
        )}
        {editingGame && (
          <GameForm
            key={`edit-form-${editingGame.id}`}
            game={editingGame}
            onSave={handleSaveGame}
            onCancel={() => setEditingGame(null)}
            isSubmitting={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 