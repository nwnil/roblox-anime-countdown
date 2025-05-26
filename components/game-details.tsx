"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Bell, BellRing, Share2, ChevronLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NotificationModal from "@/components/notification-modal"
import type { Game } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface GameDetailsProps {
  game: Game
  isNotificationEnabled: boolean
  onNotificationToggle: () => void
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

export default function GameDetails({
  game,
  isNotificationEnabled,
  onNotificationToggle,
  onClose,
  cardPosition,
  timeLeft,
}: GameDetailsProps) {
  const [copied, setCopied] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  // Calculate initial position based on card position
  const initialX = window.innerWidth
  const initialY = cardPosition.top
  const initialScale = cardPosition.width / (window.innerWidth * 0.75) // Target width is 75% of screen

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="game-details-overlay"
        className="fixed inset-0 z-[9999] flex items-start justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Details panel */}
        <motion.div
          id="details-container"
          className="relative h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-gradient-to-b from-[#1a1d29] to-[#151823] shadow-2xl overflow-y-auto overflow-x-hidden z-[9999]"
          initial={{
            x: initialX,
            y: initialY - window.scrollY, // Adjust for page scroll
            opacity: 0,
            scale: initialScale,
            height: cardPosition.height,
            borderRadius: 12,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            height: "100%",
            borderRadius: 0,
          }}
          exit={{
            x: initialX,
            y: initialY - window.scrollY, // Adjust for page scroll
            opacity: 0,
            scale: initialScale,
            height: cardPosition.height,
            borderRadius: 12,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            duration: 0.5,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image with parallax effect */}
          <div className="relative h-[40vh] overflow-hidden">
            <motion.div style={{ y: scrollY * 0.5 }} className="absolute inset-0 z-0">
              <Image
                src={game.thumbnail || "/placeholder.svg"}
                alt={game.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] via-[#1a1d29]/80 to-transparent"></div>
            </motion.div>

            {/* Close button */}
            <motion.button
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
              onClick={onClose}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            {/* Game title and badges */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`bg-gradient-to-r ${getGenreColor(game.genre)} border-none`}>{game.genre}</Badge>
                <Badge className={`bg-gradient-to-r ${getAnimeStyleColor(game.animeStyle)} border-none`}>
                  {game.animeStyle}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
                {game.title}
              </h1>
              <p className="text-gray-400 mt-1">by {game.developer}</p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Countdown section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Releasing in
              </h2>
              <div className="grid grid-cols-4 gap-4 p-4 bg-[#0f1117] rounded-lg border border-gray-800/30">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {timeLeft.days}
                  </span>
                  <span className="text-xs text-gray-400">DAYS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {timeLeft.hours}
                  </span>
                  <span className="text-xs text-gray-400">HOURS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-xs text-gray-400">MINS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-xs text-gray-400">SECS</span>
                </div>
              </div>
            </motion.div>

            {/* Game info */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-[#0f1117] p-3 rounded-lg text-center border border-gray-800/30 hover:border-purple-500/30 transition-colors">
                <div className="text-lg font-bold">{new Date(game.releaseDate).toLocaleDateString()}</div>
                <div className="text-xs text-gray-400">Release Date</div>
              </div>
              <div className="bg-[#0f1117] p-3 rounded-lg text-center border border-gray-800/30 hover:border-purple-500/30 transition-colors">
                <div className="text-lg font-bold">{game.anticipationLevel}%</div>
                <div className="text-xs text-gray-400">Hype Level</div>
              </div>
              <div className="bg-[#0f1117] p-3 rounded-lg text-center border border-gray-800/30 hover:border-purple-500/30 transition-colors">
                <div className="text-lg font-bold">{game.animeStyle}</div>
                <div className="text-xs text-gray-400">Anime Style</div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">{game.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Features
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Immersive {game.animeStyle}-inspired world and characters</li>
                <li>Unique gameplay mechanics based on the anime</li>
                <li>Customizable character progression system</li>
                <li>Multiplayer battles and cooperative missions</li>
                <li>Regular content updates and events</li>
              </ul>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className={`flex-1 transition-all ${
                  isNotificationEnabled
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
                onClick={() => {
                  if (isNotificationEnabled) {
                    setShowNotificationModal(true)
                  } else {
                    setShowNotificationModal(true)
                  }
                }}
                size="lg"
              >
                {isNotificationEnabled ? (
                  <>
                    <BellRing className="h-5 w-5 mr-2 fill-white" />
                    Configure Notifications
                  </>
                ) : (
                  <>
                    <Bell className="h-5 w-5 mr-2" />
                    Set Up Notifications
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={shareGame}
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                {copied ? "Copied!" : "Share Game"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showNotificationModal && (
        <NotificationModal
          key="notification-modal"
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          game={game}
          isNotificationEnabled={isNotificationEnabled}
          onNotificationToggle={onNotificationToggle}
        />
      )}
    </AnimatePresence>,
    document.body
  )
}
