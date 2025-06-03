"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Share2, ChevronLeft, Settings, Play, Clock, Calendar, ExternalLink, Star, Film, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { calculateTimeRemaining } from "@/lib/timezone-utils"

interface GameDetailsProps {
  game: Game
  onClose: () => void
  cardPosition: {
    top: number
    left: number
    width: number
    height: number
  }
  timeLeft: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

// Sneak Peeks Component - REWRITTEN FROM SCRATCH
function SneakPeeksContent({ game }: { game: Game }) {
  const [activeTab, setActiveTab] = useState<'video' | 'images'>('video')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get all valid YouTube video IDs from youtube_videos
  const youtubeVideos = (game.youtube_videos || [])
    .map(url => {
      const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/)
      return match ? match[1] : null
    })
    .filter(Boolean) as string[]

  // Get all uploaded videos and images
  const allVideos = game.images?.filter(url => 
    url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
  ) || []
  const actualImages = game.images?.filter(url => 
    !url.includes('video') && !url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
  ) || []

  // Prefer YouTube videos if present
  const hasYouTubeVideos = youtubeVideos.length > 0
  const hasUploadedVideos = allVideos.length > 0
  const hasImages = actualImages.length > 0

  // For switching between YouTube videos
  const [currentYouTubeIndex, setCurrentYouTubeIndex] = useState(0)

  // Set initial video to first YouTube or uploaded video
  useEffect(() => {
    if (hasYouTubeVideos && !hasInitialized) {
      setCurrentYouTubeIndex(0)
      setHasInitialized(true)
    } else if (hasUploadedVideos && !hasYouTubeVideos && !hasInitialized) {
      setCurrentVideoIndex(0)
      setHasInitialized(true)
    }
  }, [hasYouTubeVideos, hasUploadedVideos, hasInitialized])

  // Auto-set active tab based on available content
  useEffect(() => {
    if ((hasYouTubeVideos || hasUploadedVideos) && !hasImages) {
      setActiveTab('video')
    } else if (!hasYouTubeVideos && !hasUploadedVideos && hasImages) {
      setActiveTab('images')
    } else if (hasYouTubeVideos || hasUploadedVideos) {
      setActiveTab('video')
    }
  }, [hasYouTubeVideos, hasUploadedVideos, hasImages])

  // Main video player logic
  const mainYouTubeId = youtubeVideos[currentYouTubeIndex] || youtubeVideos[0] || null
  const mainUploadedVideo = allVideos[currentVideoIndex] || ''

  return (
    <div className="space-y-4">
      {/* Tabs */}
      {(hasYouTubeVideos || hasUploadedVideos) && hasImages && (
        <div className="flex justify-center">
          <div className="flex bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'video' 
                  ? 'bg-[#00d1ff]/20 text-[#00d1ff] border border-[#00d1ff]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="h-4 w-4" />
              Videos ({hasYouTubeVideos ? youtubeVideos.length : allVideos.length})
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'images' 
                  ? 'bg-[#00d1ff]/20 text-[#00d1ff] border border-[#00d1ff]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Screenshots ({actualImages.length})
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'video' && (hasYouTubeVideos || hasUploadedVideos) && (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Main Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {/* YouTube Main Video */}
              {hasYouTubeVideos && mainYouTubeId && (
                <iframe
                  key={`youtube-player-${currentYouTubeIndex}`}
                  src={`https://www.youtube-nocookie.com/embed/${mainYouTubeId}?controls=1&modestbranding=1&showinfo=0&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video Player"
                  frameBorder="0"
                ></iframe>
              )}
              {/* Uploaded Main Video */}
              {!hasYouTubeVideos && mainUploadedVideo && (
                <video
                  key={`video-player-${currentVideoIndex}`}
                  src={mainUploadedVideo}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  onLoadStart={() => setIsVideoLoading(true)}
                  onCanPlay={() => setIsVideoLoading(false)}
                  onError={() => setIsVideoLoading(false)}
                />
              )}
              {/* Video Info */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {hasYouTubeVideos
                  ? `${currentYouTubeIndex + 1} / ${youtubeVideos.length}`
                  : `${currentVideoIndex + 1} / ${allVideos.length}`}
              </div>
              {/* Fallback if no videos found */}
              {!hasYouTubeVideos && !hasUploadedVideos && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No videos found for this game.</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {(hasYouTubeVideos && youtubeVideos.length > 1) && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Click videos below to switch</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {youtubeVideos.map((id, idx) => (
                    <button
                      key={id}
                      onClick={() => setCurrentYouTubeIndex(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 group ${
                        currentYouTubeIndex === idx 
                          ? 'border-[#00d1ff] scale-105 shadow-lg shadow-[#00d1ff]/25' 
                          : 'border-white/20 hover:border-[#00d1ff]/60 hover:scale-102'
                      }`}
                    >
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${id}?controls=0&modestbranding=1&showinfo=0&rel=0`}
                        className="w-full h-full pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`YouTube Video ${idx + 1}`}
                        frameBorder="0"
                      ></iframe>
                      {/* Overlay */}
                      <div className={`absolute inset-0 transition-all duration-200 ${
                        currentYouTubeIndex === idx 
                          ? 'bg-[#00d1ff]/20' 
                          : 'bg-black/20 group-hover:bg-[#00d1ff]/10'
                      }`} />
                      {/* Video Number */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {idx + 1}
                      </div>
                      {/* Playing Indicator */}
                      {currentYouTubeIndex === idx && (
                        <div className="absolute top-2 right-2 bg-[#00d1ff] text-white px-2 py-1 rounded text-xs font-medium">
                          PLAYING
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Video Thumbnails */}
            {(!hasYouTubeVideos && allVideos.length > 1) && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Click videos below to switch</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allVideos.map((videoUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 group ${
                        currentVideoIndex === index 
                          ? 'border-[#00d1ff] scale-105 shadow-lg shadow-[#00d1ff]/25' 
                          : 'border-white/20 hover:border-[#00d1ff]/60 hover:scale-102'
                      }`}
                    >
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover pointer-events-none"
                        preload="metadata"
                        muted
                      />
                      {/* Overlay */}
                      <div className={`absolute inset-0 transition-all duration-200 ${
                        currentVideoIndex === index 
                          ? 'bg-[#00d1ff]/20' 
                          : 'bg-black/20 group-hover:bg-[#00d1ff]/10'
                      }`} />
                      {/* Video Number */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                      {/* Playing Indicator */}
                      {currentVideoIndex === index && (
                        <div className="absolute top-2 right-2 bg-[#00d1ff] text-white px-2 py-1 rounded text-xs font-medium">
                          PLAYING
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'images' && hasImages && (
          <motion.div
            key="images"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Main selected image */}
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <Image
                src={actualImages[selectedImageIndex]}
                alt={`${game.title} Screenshot ${selectedImageIndex + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedImageIndex + 1} / {actualImages.length}
              </div>
            </div>

            {/* Thumbnail grid */}
            {actualImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {actualImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-[#00d1ff] scale-105' 
                        : 'border-white/20 hover:border-white/40 hover:scale-102'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`${game.title} Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-[#00d1ff]/20" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function GameDetails({
  game,
  onClose,
  cardPosition,
  timeLeft,
}: GameDetailsProps) {
  const [copied, setCopied] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("details-container")
      if (container) {
        setScrollY(container.scrollTop)
      }
    }

    const container = document.getElementById("details-container")
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Share game
  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: `Check out ${game.title} - an upcoming ${game.animeStyle}-inspired Roblox game!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      const shareText = `Check out ${game.title} - an upcoming ${game.animeStyle}-inspired Roblox game!`
      navigator.clipboard.writeText(shareText + " " + window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Get new category based on game content
  const getGameCategory = (game: Game) => {
    // Map based on genre and game content - handle full genre names from admin panel
    if (game.genre === "Fighting / PvP" || game.genre === "Fighting" || game.title.toLowerCase().includes("demon hunter") || game.title.toLowerCase().includes("dragon warrior")) {
      return "Fighting & PvP"
    }
    if (game.genre === "RPG / Open World" || game.genre === "RPG" || game.genre === "Open World" || game.title.toLowerCase().includes("soul society") || game.title.toLowerCase().includes("alchemist")) {
      return "RPG & Open World"
    }
    if (game.genre === "Adventure / Quest-Based" || game.genre === "Adventure" || game.title.toLowerCase().includes("pirate legacy") || game.title.toLowerCase().includes("hero academia") || game.title.toLowerCase().includes("shinobi")) {
      return "RPG & Open World"
    }
    if (game.genre === "Simulator / Idle" || game.genre === "Simulator" || game.title.toLowerCase().includes("mecha pilot")) {
      return "Simulator & Idle"
    }
    if (game.genre === "Tower Defense" || game.title.toLowerCase().includes("titan defense")) {
      return "Tower Defense"
    }
    if (game.genre === "Sports / Racing" || game.genre === "Racing" || game.genre === "Sports" || game.title.toLowerCase().includes("racing") || game.title.toLowerCase().includes("sports")) {
      return "Sports & Racing"
    }
    if (game.genre === "Arena Battler") {
      return "Arena Battler"
    }
    if (game.genre === "Story Mode") {
      return "Story Mode"
    }
    // Default fallback
    return "RPG & Open World"
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tower Defense":
        return "bg-blue-900/30 text-blue-300 border-blue-700/50"
      case "Fighting & PvP":
        return "bg-red-900/30 text-red-300 border-red-700/50"
      case "RPG & Open World":
        return "bg-purple-900/30 text-purple-300 border-purple-700/50"
      case "Simulator & Idle":
        return "bg-green-900/30 text-green-300 border-green-700/50"
      case "Sports & Racing":
        return "bg-orange-900/30 text-orange-300 border-orange-700/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/50"
    }
  }

  // Get anime style badge color
  const getAnimeStyleColor = (style: string) => {
    switch (style) {
      case "One Piece":
        return "bg-cyan-900/30 text-cyan-300 border-cyan-700/50"
      case "Naruto":
        return "bg-orange-900/30 text-orange-300 border-orange-700/50"
      case "Dragon Ball":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700/50"
      case "My Hero Academia":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-700/50"
      case "Demon Slayer":
        return "bg-pink-900/30 text-pink-300 border-pink-700/50"
      case "Bleach":
        return "bg-indigo-900/30 text-indigo-300 border-indigo-700/50"
      case "Attack on Titan":
        return "bg-rose-900/30 text-rose-300 border-rose-700/50"
      case "Fullmetal Alchemist":
        return "bg-amber-900/30 text-amber-300 border-amber-700/50"
      case "Evangelion":
        return "bg-violet-900/30 text-violet-300 border-violet-700/50"
      case "JoJo's Bizarre Adventure":
        return "bg-purple-900/30 text-purple-300 border-purple-700/50"
      case "One Punch Man":
        return "bg-red-900/30 text-red-300 border-red-700/50"
      case "Blue Lock":
        return "bg-blue-900/30 text-blue-300 border-blue-700/50"
      case "Black Clover":
        return "bg-green-900/30 text-green-300 border-green-700/50"
      case "Fire Force":
        return "bg-orange-900/30 text-orange-300 border-orange-700/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/50"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alpha Testing":
        return "bg-purple-900/30 text-purple-300 border-purple-700/50"
      case "Beta Testing":
        return "bg-blue-900/30 text-blue-300 border-blue-700/50"
      case "Upcoming":
        return "bg-green-900/30 text-green-300 border-green-700/50"
      case "TBA":
        return "bg-gray-900/30 text-gray-300 border-gray-700/50"
      case "Delayed":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/50"
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="game-details-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Background - matching homepage gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, #0e0e10, #1a1a1d)"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        </div>

        {/* Main container - centered card layout */}
        <motion.div
          id="details-container"
          className="relative w-full max-w-4xl h-[90vh] overflow-y-auto overflow-x-hidden z-[9999]"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px"
          }}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 280, 
            duration: 0.8,
            ease: [0.25, 0.25, 0.25, 1]
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 flex items-center justify-center"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut"
            }}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Main Content */}
          <div className="p-8 space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="text-center space-y-6"
            >
              {/* Game Icon */}
              <motion.div
                className="relative w-24 h-24 mx-auto"
                whileHover={{ scale: 1.1 }}
                transition={{ 
                  type: "spring", 
                  damping: 12, 
                  stiffness: 300,
                  duration: 0.4
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 transition-all duration-500"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)"
                  }}
                >
                  <Image
                    src={game.icon || game.thumbnail || "/placeholder.svg"}
                    alt={game.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-[#00d1ff]/50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1]
                  }}
                />
              </motion.div>

              {/* Title & Developer */}
              <div className="space-y-2">
                <motion.h1
                  className="text-4xl font-bold text-white font-display"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {game.title}
                </motion.h1>
                <motion.p
                  className="text-gray-400 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  by {game.developer}
                </motion.p>
              </div>

              {/* Badges */}
              <motion.div
                className="flex justify-center gap-3 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ease-out ${getCategoryColor(getGameCategory(game))}`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -1
                  }}
                  transition={{ 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {getGameCategory(game)}
                </motion.div>
                <motion.div
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ease-out ${getAnimeStyleColor(game.animeStyle)}`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -1
                  }}
                  transition={{ 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {game.animeStyle}
                </motion.div>
                <motion.div
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ease-out ${getStatusColor(game.status || "TBA")}`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -1
                  }}
                  transition={{ 
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {game.status || "TBA"}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Circular Countdown Timer */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                damping: 18,
                stiffness: 200,
                duration: 1,
                delay: 0.4
              }}
            >
              <div className="relative">
                {/* Center content */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    className="text-center w-full max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {game.hasExactDate !== false ? (
                      // Show countdown for exact dates
                      <>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Clock className="h-6 w-6 text-[#00d1ff]" />
                          <span className="text-white/80 text-lg font-medium">RELEASES IN</span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 mb-4 px-2">
                          {[
                            { value: timeLeft.days, label: "DAYS" },
                            { value: timeLeft.hours, label: "HRS" },
                            { value: timeLeft.minutes, label: "MIN" },
                            { value: timeLeft.seconds, label: "SEC" }
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              className="text-center"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.6, 
                                delay: 1.1 + index * 0.1,
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }}
                            >
                              <motion.div
                                className="text-3xl font-bold text-white font-mono-digits"
                                key={item.value}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  type: "spring",
                                  damping: 12,
                                  stiffness: 300,
                                  duration: 0.4
                                }}
                              >
                                {String(item.value).padStart(2, '0')}
                              </motion.div>
                              <div className="text-sm text-gray-400 font-medium tracking-wider">
                                {item.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          className="text-lg text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ 
                            duration: 0.7, 
                            delay: 1.5,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          {new Date(game.releaseDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </motion.div>
                      </>
                    ) : (
                      // Show approximate release text
                      <>
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <Calendar className="h-6 w-6 text-[#7c3aed]" />
                          <span className="text-white/80 text-lg font-medium">EXPECTED RELEASE</span>
                        </div>
                        
                        <motion.div
                          className="text-4xl font-bold text-white mb-4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 1.1,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          {game.approximateReleaseText || "TBA"}
                        </motion.div>
                        
                        <motion.div
                          className="text-sm text-gray-400 px-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ 
                            duration: 0.7, 
                            delay: 1.3,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          Exact date TBA
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Sneak Peeks Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.9, 
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h2 className="text-2xl font-bold text-white text-center">Sneak Peeks</h2>
              
              {(() => {
                // Filter out videos from images for display check
                const actualImages = game.images?.filter(url => 
                  !url.includes('video') && !url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
                ) || []
                
                // Check for YouTube videos as well
                const hasYoutubeVideos = game.youtube_videos && game.youtube_videos.length > 0
                
                return (game.videoUrl || actualImages.length || hasYoutubeVideos) ? (
                  <SneakPeeksContent game={game} />
                ) : (
                  <div 
                    className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    <Image
                      src={game.icon || game.thumbnail || "/placeholder.svg"}
                      alt={game.title}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
                    
                    {/* Loading animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative"
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                      >
                        {/* Glowing emblem placeholder */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00d1ff] to-[#7c3aed] opacity-50 blur-sm absolute inset-0" />
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00d1ff] to-[#7c3aed] flex items-center justify-center relative">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-center">
                      <motion.div
                        className="text-white font-semibold mb-2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.7, 
                          delay: 1.2,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        Preview Coming Soon
                      </motion.div>
                      <motion.div
                        className="text-gray-300 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 1.35,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        Gameplay preview will be available on launch
                      </motion.div>
                    </div>

                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                      Preview coming on launch
                    </motion.div>
                  </div>
                )
              })()}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Share Button */}
              <motion.button
                onClick={shareGame}
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-3 flex-1"
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeOut"
                }}
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Share2 className="h-5 w-5" />
                {copied ? "Copied!" : "Share"}
              </motion.button>
            </motion.div>

            {/* Game Description */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h3 className="text-xl font-semibold text-white">About This Game</h3>
              <div 
                className="p-6 rounded-2xl text-gray-300 leading-relaxed transition-all duration-500 break-words overflow-wrap-anywhere"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere"
                }}
              >
                {game.description}
              </div>
            </motion.div>

            {/* Release Info */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Release Date */}
              <div 
                className="p-6 rounded-2xl space-y-3 transition-all duration-500"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00d1ff]" />
                  <h4 className="text-white font-semibold">Release Date</h4>
                  <span className="ml-auto px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-500/30">
                    Global
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {game.hasExactDate !== false ? (
                      new Date(game.releaseDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    ) : (
                      game.approximateReleaseText || "TBA"
                    )}
                  </div>
                  <div className="text-gray-400">
                    {game.hasExactDate !== false ? "Roblox (Early Access)" : "Approximate Timing"}
                  </div>
                </div>
              </div>

              {/* Game Links */}
              <div 
                className="p-6 rounded-2xl space-y-4 transition-all duration-500"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-[#00d1ff]" />
                  <h4 className="text-white font-semibold">Game Links</h4>
                </div>
                
                {game.links && (
                  <div className="grid grid-cols-2 gap-3">
                    {game.links.discord && (
                      <motion.a
                        href={game.links.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium border border-indigo-500/30"
                        whileHover={{ 
                          scale: 1.02,
                          y: -1
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 0.15,
                          ease: "easeOut"
                        }}
                        style={{
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Discord
                      </motion.a>
                    )}
                    {game.links.twitter && (
                      <motion.a
                        href={game.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-sm font-medium border border-sky-500/30"
                        whileHover={{ 
                          scale: 1.02,
                          y: -1
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 0.15,
                          ease: "easeOut"
                        }}
                        style={{
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </motion.a>
                    )}
                    {game.links.roblox && (
                      <motion.a
                        href={game.links.roblox}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm font-medium border border-green-500/30"
                        whileHover={{ 
                          scale: 1.02,
                          y: -1
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 0.15,
                          ease: "easeOut"
                        }}
                        style={{
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Play Game
                      </motion.a>
                    )}
                    {game.links.youtube && (
                      <motion.a
                        href={game.links.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium border border-red-500/30"
                        whileHover={{ 
                          scale: 1.02,
                          y: -1
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                          duration: 0.15,
                          ease: "easeOut"
                        }}
                        style={{
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </motion.a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

