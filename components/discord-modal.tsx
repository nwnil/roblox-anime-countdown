"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Users, MessageCircle, Crown, Star, ExternalLink, Copy, Check, Gamepad2, Zap, MessageSquare, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Game } from "@/lib/types"

interface DiscordModalProps {
  isOpen: boolean
  onClose: () => void
  game: Game
}

export default function DiscordModal({ isOpen, onClose, game }: DiscordModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  const discordInvite = "https://discord.gg/TeGGEvGrfq"

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(discordInvite)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openDiscord = () => {
    window.open(discordInvite, '_blank')
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#1a1d29] to-[#151823] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Join Our Discord</h3>
                    <p className="text-sm text-gray-400">Get updates for {game.title}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Discord Server Preview */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border border-white/20">
                    <Crown className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">AniBlox Community</h4>
                    <p className="text-sm text-gray-400">Official Discord Server</p>
                  </div>
                </div>

                {/* Server Status */}
                <div className="flex justify-center">
                  <motion.div 
                    className="bg-white/5 rounded-lg p-3 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Star className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="text-sm font-medium text-white">Active 24/7</p>
                    </div>
                  </motion.div>
                </div>

                {/* What you'll get */}
                <div className="space-y-2">
                  <h5 className="text-white font-medium text-sm">What you'll get:</h5>
                  <div className="space-y-2">
                    {[
                      { icon: Gamepad2, text: "Game release announcements" },
                      { icon: Zap, text: "Real-time update notifications" },
                      { icon: Users, text: "Connect with other anime game fans" },
                      { icon: MessageSquare, text: "Discuss upcoming releases" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >
                        <feature.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {feature.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invite Link Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <input
                    type="text"
                    value={discordInvite}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none selection:bg-gray-600/30"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyInviteLink}
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={openDiscord}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 hover:border-white/30 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Discord
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={copyInviteLink}
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Join our community to never miss a game release! <Gamepad2 className="h-3 w-3" />
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
} 