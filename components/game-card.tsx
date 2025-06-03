"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Settings, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import GameDetails from "@/components/game-details"
import DiscordModal from "@/components/discord-modal"
import type { Game } from "@/lib/types"
import { motion } from "framer-motion"
import { calculateTimeRemaining, formatDateInUserTimezone } from "@/lib/timezone-utils"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClient, setIsClient] = useState(false)
  const [isGameReleased, setIsGameReleased] = useState(false)

  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  // Set client flag after mount to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
    
    // Check if notifications are enabled for this game
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`notifications-${game.id}`)
      if (stored) {
        try {
          const preferences = JSON.parse(stored)
          setIsNotificationEnabled(preferences.email?.enabled && preferences.email?.verified)
        } catch (e) {
          console.error('Error parsing notification preferences:', e)
        }
      }
    }
  }, [game.id])

  useEffect(() => {
    if (!isClient) return // Don't run countdown on server

    const updateCountdown = () => {
      const timeRemaining = calculateTimeRemaining(game.releaseDate)
      const newTimeLeft = {
        days: timeRemaining.days,
        hours: timeRemaining.hours,
        minutes: timeRemaining.minutes,
        seconds: timeRemaining.seconds,
      }
      
      // Check if the countdown has reached zero (game is released)
      const hasReachedZero = timeRemaining.isExpired
      
      // Check if this is the moment when the countdown just reached zero
      const wasStillCountingDown = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0
      
      // If countdown just reached zero and we were still counting down before
      if (hasReachedZero && wasStillCountingDown) {
        // Dispatch game released event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gameReleased', { detail: game }))
        }
        setIsGameReleased(true)
      }
      
      // Only update timeLeft if game hasn't been released yet
      if (!hasReachedZero) {
        setTimeLeft(newTimeLeft)
      } else {
        // Game is released, mark it as such
        setIsGameReleased(true)
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [game.releaseDate, isClient, timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds, game])

  // Get color based on anticipation level
  const getAnticipationColor = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 80) return "bg-green-400"
    if (level >= 70) return "bg-yellow-500"
    if (level >= 60) return "bg-yellow-400"
    return "bg-gray-500"
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

  // Get anime style color
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

  // Handle opening details
  const handleOpenDetails = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
      // Lock scroll when details are open
      document.body.style.overflow = "hidden"
      setShowDetails(true)
    }
  }

  // Handle closing details
  const handleCloseDetails = () => {
    document.body.style.overflow = ""
    setShowDetails(false)
  }

  // Handle notification toggle
  const handleNotificationToggle = () => {
    // Check updated status from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`notifications-${game.id}`)
      if (stored) {
        try {
          const preferences = JSON.parse(stored)
          setIsNotificationEnabled(preferences.email?.enabled && preferences.email?.verified)
        } catch (e) {
          console.error('Error parsing notification preferences:', e)
        }
      }
    }
  }

  // Handle notification button click
  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening game details
    setShowDiscordModal(true)
  }

  // Don't render the card if the game has been released (for exact dates only)
  if (game.hasExactDate !== false && isGameReleased) {
    return null
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -2,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut"
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Subtle top accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-500 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Notification Bell - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNotificationClick}
            className="h-8 w-8 p-0 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 border bg-blue-500/20 border-blue-400/30 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
            title="Join our Discord for updates"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Main content layout */}
        <div className="flex h-full p-6">
          {/* Left side - Image */}
          <div className="relative w-20 h-20 flex-shrink-0 mr-5">
            <div 
              className="relative h-full w-full rounded-xl overflow-hidden bg-gray-800/50 transition-transform duration-200 ease-out hover:scale-[1.02]"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <Image
                src={game.icon || game.thumbnail || "/placeholder.svg"}
                alt={game.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-8">
                  <div className="mb-1">
                    <h3 className="font-semibold text-lg text-white leading-tight transition-transform duration-150 ease-out hover:translate-x-0.5">
                      {game.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">by {game.developer}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ease-out hover:scale-[1.02] ${getCategoryColor(getGameCategory(game))}`}>
                  {getGameCategory(game)}
                </span>
                <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ease-out hover:scale-[1.02] ${getAnimeStyleColor(game.animeStyle)}`}>
                  {game.animeStyle}
                </span>
              </div>
            </div>

            {/* Countdown / Release Info */}
            {game.hasExactDate !== false ? (
              // Show countdown for exact dates
              <div className="bg-gray-900/30 rounded-xl p-4 mb-4 transition-colors duration-200 ease-out hover:bg-gray-900/40">
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { value: timeLeft.days, label: "Days" },
                    { value: timeLeft.hours, label: "Hours" },
                    { value: timeLeft.minutes, label: "Min" },
                    { value: timeLeft.seconds, label: "Sec" }
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <span 
                        className="text-xl font-bold text-white font-mono transition-all duration-150 ease-out"
                        key={item.value}
                      >
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Show approximate release text
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 mb-4 transition-colors duration-200 ease-out hover:from-purple-900/40 hover:to-blue-900/40 border border-purple-500/20">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Expected Release</div>
                  <div className="text-lg font-semibold text-white">
                    {game.approximateReleaseText || "TBA"}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-400">
                {game.hasExactDate !== false ? (
                  formatDateInUserTimezone(game.releaseDate, { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                ) : (
                  game.approximateReleaseText || "TBA"
                )}
              </div>
              <div className="text-gray-400">
                {game.status}
              </div>
            </div>
          </div>
        </div>

        {/* Clickable overlay */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handleOpenDetails}
          aria-label={`View details for ${game.title}`}
        />
      </motion.div>

      {showDetails && (
        <GameDetails
          game={game}
          onClose={handleCloseDetails}
          cardPosition={cardPosition}
          timeLeft={timeLeft}
        />
      )}

      {showDiscordModal && (
        <DiscordModal
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
          game={game}
        />
      )}
    </>
  )
}
