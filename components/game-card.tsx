"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Bell, BellRing, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import GameDetails from "@/components/game-details"
import NotificationModal from "@/components/notification-modal"
import type { Game } from "@/lib/types"
import { motion } from "framer-motion"

interface GameCardProps {
  game: Game
  isNotificationEnabled: boolean
  onNotificationToggle: () => void
}

export default function GameCard({ game, isNotificationEnabled, onNotificationToggle }: GameCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [showDetails, setShowDetails] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(game.releaseDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [game.releaseDate])

  // Get color based on anticipation level
  const getAnticipationColor = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 80) return "bg-green-400"
    if (level >= 70) return "bg-yellow-500"
    if (level >= 60) return "bg-yellow-400"
    return "bg-gray-500"
  }

  // Get genre badge color
  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "Adventure":
        return "from-blue-600 to-blue-400"
      case "Action":
        return "from-red-600 to-red-400"
      case "RPG":
        return "from-purple-600 to-purple-400"
      case "Fighting":
        return "from-orange-600 to-orange-400"
      case "Simulator":
        return "from-green-600 to-green-400"
      default:
        return "from-gray-600 to-gray-400"
    }
  }

  // Get anime style badge color
  const getAnimeStyleColor = (style: string) => {
    switch (style) {
      case "One Piece":
        return "from-blue-600 to-cyan-400"
      case "Naruto":
        return "from-orange-600 to-yellow-400"
      case "Dragon Ball":
        return "from-yellow-600 to-orange-400"
      case "My Hero Academia":
        return "from-green-600 to-blue-400"
      case "Demon Slayer":
        return "from-red-600 to-pink-400"
      case "Bleach":
        return "from-purple-600 to-indigo-400"
      case "Attack on Titan":
        return "from-red-700 to-red-500"
      default:
        return "from-gray-600 to-gray-400"
    }
  }

  // Handle notification setup
  const handleNotificationClick = () => {
    if (isNotificationEnabled) {
      // If already enabled, show quick toggle feedback
      onNotificationToggle()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      // If not enabled, open setup modal
      setShowNotificationModal(true)
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

  return (
    <>
      <motion.div
        ref={cardRef}
        className="group relative bg-gradient-to-br from-[#0f1117] via-[#1a1d29] to-[#151823] rounded-2xl overflow-hidden border border-gray-800/30 shadow-2xl"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -8,
          scale: 1.02,
          filter: "brightness(1.05) saturate(1.15) contrast(1.02)"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8
        }}
        layout
      >


        {/* Main content layout */}
        <div className="flex h-full">
          {/* Left side - Image and extras */}
          <div className="relative w-32 flex-shrink-0 flex flex-col">
            {/* Image container */}
            <div className="relative h-32 w-32 rounded-xl overflow-hidden mb-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="relative h-full w-full"
              >
                <div className="relative h-full w-full bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={game.thumbnail || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Floating badges on image */}
                  <div className="absolute top-1 left-1 right-1 flex flex-wrap gap-1">
                    <Badge className={`bg-gradient-to-r ${getGenreColor(game.genre)} border-none text-[10px] px-1 py-0`}>
                      {game.genre}
                    </Badge>
                  </div>
                  
                  {/* Hype indicator */}
                  <div className="absolute bottom-1 right-1">
                    <div className={`w-3 h-3 rounded-full ${getAnticipationColor(game.anticipationLevel)} shadow-lg`} />
                  </div>
                </div>
              </motion.div>
            </div>


          </div>

          {/* Right side - Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="font-bold text-lg leading-tight line-clamp-2 text-white"
                    whileHover={{
                      background: "linear-gradient(45deg, #c084fc, #60a5fa, #34d399)",
                      backgroundClip: "text",
                      color: "transparent",
                      backgroundSize: "200% 200%"
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    {game.title}
                  </motion.h3>
                  <p className="text-gray-400 text-xs mt-1">by {game.developer}</p>
                </div>
                
                {/* Notification button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20
                        }}
                        className="relative z-20"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all ${
                            isNotificationEnabled ? "text-yellow-400 bg-yellow-400/20" : "text-gray-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNotificationClick()
                          }}
                        >
                          {isNotificationEnabled ? (
                            <BellRing className="h-3 w-3 fill-current" />
                          ) : (
                            <Bell className="h-3 w-3" />
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        {isNotificationEnabled ? (
                          <div>
                            <p>Notifications enabled! 🔔</p>
                            <p className="text-xs opacity-80">Click to configure</p>
                          </div>
                        ) : copied ? (
                          <p>Setting up... 🎉</p>
                        ) : (
                          <div>
                            <p>Get notified on release!</p>
                            <p className="text-xs opacity-80">Never miss a launch</p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Anime style badge */}
              <Badge className={`bg-gradient-to-r ${getAnimeStyleColor(game.animeStyle)} border-none text-xs mb-3`}>
                {game.animeStyle} Style
              </Badge>
            </div>

            {/* Countdown */}
            <div className="relative">
              <div className="grid grid-cols-4 gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hrs</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Min</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sec</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800/50">
              <div className="text-[10px] text-gray-500">
                {new Date(game.releaseDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400">{game.anticipationLevel}%</span>
                <div className="text-[10px] text-gray-500">hype</div>
              </div>
            </div>
          </div>
        </div>





        {/* Notification indicator - subtle corner glow */}
        {isNotificationEnabled && (
          <motion.div 
            className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg z-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
          </motion.div>
        )}

        {/* Clickable overlay for opening details */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handleOpenDetails}
          aria-label={`View details for ${game.title}`}
        ></div>
      </motion.div>

      {showDetails && (
        <GameDetails
          game={game}
          isNotificationEnabled={isNotificationEnabled}
          onNotificationToggle={onNotificationToggle}
          onClose={handleCloseDetails}
          cardPosition={cardPosition}
          timeLeft={timeLeft}
        />
      )}

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        game={game}
        isNotificationEnabled={isNotificationEnabled}
        onNotificationToggle={onNotificationToggle}
      />
    </>
  )
}
