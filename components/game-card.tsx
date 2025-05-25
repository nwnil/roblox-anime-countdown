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
        className="group relative bg-gradient-to-b from-[#1a1d29] to-[#1a1d29]/90 rounded-xl overflow-hidden border border-gray-800/50"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -5,
          borderColor: "rgba(147, 51, 234, 0.5)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 1
        }}
        layout
      >
        <div className="relative h-48 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="w-full h-full"
          >
            <Image
              src={game.thumbnail || "/placeholder.svg"}
              alt={game.title}
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] to-transparent"></div>

          <div className="absolute top-2 right-2 z-20">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors ${
                        isNotificationEnabled ? "text-yellow-400" : "text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationClick()
                      }}
                    >
                      {isNotificationEnabled ? (
                        <BellRing className="h-4 w-4 fill-yellow-400" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    {isNotificationEnabled ? (
                      <div>
                        <p>Notifications enabled! 🔔</p>
                        <p className="text-xs opacity-80">Click to disable or configure</p>
                      </div>
                    ) : copied ? (
                      <p>Setting up notifications... 🎉</p>
                    ) : (
                      <div>
                        <p>Set up email or Discord notifications</p>
                        <p className="text-xs opacity-80">Never miss a release!</p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="absolute bottom-2 left-3 flex flex-wrap gap-1">
            <Badge className={`bg-gradient-to-r ${getGenreColor(game.genre)} border-none`}>{game.genre}</Badge>
            <Badge className={`bg-gradient-to-r ${getAnimeStyleColor(game.animeStyle)} border-none`}>
              {game.animeStyle}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <motion.h3 
            className="font-bold text-lg mb-1 line-clamp-1"
            whileHover={{
              background: "linear-gradient(to right, #c084fc, #60a5fa)",
              backgroundClip: "text",
              color: "transparent"
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
          >
            {game.title}
          </motion.h3>
          <p className="text-gray-400 text-sm mb-3">by {game.developer}</p>

          <div className="grid grid-cols-4 gap-2 mb-4 relative">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg -m-1"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
            />

            <div className="flex flex-col items-center relative z-10">
              <span className="text-xl font-bold text-white">{timeLeft.days}</span>
              <span className="text-xs text-gray-400">DAYS</span>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xl font-bold text-white">{timeLeft.hours}</span>
              <span className="text-xs text-gray-400">HOURS</span>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xl font-bold text-white">{timeLeft.minutes}</span>
              <span className="text-xs text-gray-400">MINS</span>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xl font-bold text-white">{timeLeft.seconds}</span>
              <span className="text-xs text-gray-400">SECS</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">Release: {new Date(game.releaseDate).toLocaleDateString()}</div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getAnticipationColor(game.anticipationLevel)}`}></div>
              <span className="text-xs text-gray-400">{game.anticipationLevel}% Hype</span>
            </div>
          </div>
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        />

        {/* Notification indicator */}
        {isNotificationEnabled && (
          <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-yellow-500 border-l-transparent border-r-transparent rotate-180 z-20">
            <BellRing className="absolute -top-[30px] -right-[15px] h-3 w-3 fill-white text-white rotate-[135deg]" />
          </div>
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
