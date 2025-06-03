"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ExternalLink, X, Clock, Calendar, Tag, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Game } from "@/lib/types"

interface GameReleasePopupProps {
  isOpen: boolean
  onClose: () => void
  game: Game
}

const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
    initial={{ 
      opacity: 0,
      scale: 0,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2
    }}
  />
)

const StarBurst = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {Array.from({ length: 20 }).map((_, i) => (
      <FloatingParticle key={i} delay={i * 0.1} />
    ))}
  </motion.div>
)

export default function GameReleasePopup({ isOpen, onClose, game }: GameReleasePopupProps) {
  const [mounted, setMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      setShowConfetti(true)
      // Auto close after 8 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 8000)
      return () => clearTimeout(timer)
    }
    return () => setMounted(false)
  }, [isOpen, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2), rgba(34, 211, 238, 0.2))",
                  "linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))",
                  "linear-gradient(45deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2), rgba(34, 211, 238, 0.2))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {showConfetti && <StarBurst />}
          </div>

          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.175, 0.885, 0.32, 1.275],
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#1a1d29] to-[#151823] rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Header with animated sparkles */}
            <div className="relative p-6 text-center border-b border-white/10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
                  GAME RELEASED!
                </span>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300"
              >
                The game you've been waiting for is now live!
              </motion.p>
            </div>

            {/* Game Info */}
            <div className="p-6 space-y-6">
              {/* Game Image and Title */}
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                    <img
                      src={game.icon || game.thumbnail || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-blue-500/50 blur-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl font-bold text-white mb-1"
                  >
                    {game.title}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <Tag className="h-4 w-4" />
                    {game.genre}
                  </motion.div>
                </div>
              </div>

              {/* Game Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Release Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <div className="text-white font-medium">
                        {new Date(game.releaseDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <div className="text-green-400 font-medium flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Live Now!
                      </div>
                    </div>
                  </div>
                </div>

                {game.description && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                {/* Social Links */}
                {game.links && Object.entries(game.links).some(([key, value]) => value && key !== 'roblox') && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                      Follow & Connect
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {game.links?.discord && (
                        <Button
                          onClick={() => window.open(game.links?.discord || '', '_blank')}
                          variant="outline"
                          className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                          Discord
                        </Button>
                      )}
                      {game.links?.twitter && (
                        <Button
                          onClick={() => window.open(game.links?.twitter || '', '_blank')}
                          variant="outline"
                          className="border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Twitter
                        </Button>
                      )}
                      {game.links?.youtube && (
                        <Button
                          onClick={() => window.open(game.links?.youtube || '', '_blank')}
                          variant="outline"
                          className="border-red-500/30 text-red-300 hover:bg-red-500/20 text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </Button>
                      )}
                      {game.links?.instagram && (
                        <Button
                          onClick={() => window.open(game.links?.instagram || '', '_blank')}
                          variant="outline"
                          className="border-pink-500/30 text-pink-300 hover:bg-pink-500/20 text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Instagram
                        </Button>
                      )}
                      {game.links?.tiktok && (
                        <Button
                          onClick={() => window.open(game.links?.tiktok || '', '_blank')}
                          variant="outline"
                          className="border-gray-500/30 text-gray-300 hover:bg-gray-500/20 text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          TikTok
                        </Button>
                      )}
                      {game.links?.website && (
                        <Button
                          onClick={() => window.open(game.links?.website || '', '_blank')}
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Roblox Game Link (if available) */}
                {game.links?.roblox && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => window.open(game.links?.roblox || '', '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Play on Roblox!
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Later
                    </Button>
                  </div>
                )}

                {/* If no Roblox link, just show close button */}
                {!game.links?.roblox && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Auto-close timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <div className="text-xs text-gray-500">
                  This popup will close automatically in a few seconds
                </div>
                <motion.div
                  className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 8, ease: "linear" }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
} 