"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface NavbarProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  activeCategory: string
  onReset: () => void
}

export default function Navbar({ onSearch, onCategoryChange, activeCategory, onReset }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle mobile search input change
  const handleMobileSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileSearchQuery(e.target.value)
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  // Handle mobile search submission
  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(mobileSearchQuery)
    setIsOpen(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  // Clear mobile search
  const clearMobileSearch = () => {
    setMobileSearchQuery("")
    onSearch("")
  }

  // Update search when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  // Update mobile search when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        onSearch(mobileSearchQuery)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [mobileSearchQuery, isOpen, onSearch])

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle Discord link click
  const handleDiscordClick = () => {
    try {
      console.log('Discord button clicked!')
      const discordUrl = 'https://discord.gg/TeGGEvGrfq'
      console.log('Opening Discord URL:', discordUrl)
      
      // Try window.open first
      const newWindow = window.open(discordUrl, '_blank', 'noopener,noreferrer')
      
      // Fallback if popup is blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup blocked, trying direct navigation...')
        // Fallback to direct navigation
        window.location.href = discordUrl
      } else {
        console.log('Discord opened successfully in new tab')
      }
    } catch (error) {
      console.error('Error opening Discord:', error)
      // Final fallback
      window.location.href = 'https://discord.gg/TeGGEvGrfq'
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-gray-800/50 bg-[#0f1117]/90 backdrop-blur-md shadow-lg shadow-purple-900/5"
          : "border-transparent bg-[#0f1117]/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-0">
        <div className="flex items-center gap-2 md:gap-6 -ml-[100px]">
          <button onClick={onReset} className="flex items-center gap-2 group">
            <div className="relative h-28 w-96 overflow-hidden transition-all duration-300 group-hover:scale-105">
              <img 
                src="https://i.ibb.co/9HJWzphC/20250529-1928-Ani-Blox-Calendar-Design-simple-compose-01jwedxz07e6kagdq941c2md50-1-removebg.png"
                alt="AniBlox Calendar"
                className="h-full w-full object-contain"
              />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-64 bg-[#1a1d29]/80 backdrop-blur-sm border border-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300 focus:w-80"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              ) : null}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Discord Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDiscordClick}
            className="h-10 px-4 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 border bg-indigo-500/20 border-indigo-400/30 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 flex items-center gap-2"
            title="Join our Discord community"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="hidden md:inline">Discord</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0f1117] border-gray-800 text-white">
              <div className="flex flex-col gap-4 mt-8">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={mobileSearchQuery}
                    onChange={handleMobileSearchChange}
                    className="w-full bg-[#1a1d29]/80 backdrop-blur-sm border border-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  {mobileSearchQuery ? (
                    <button
                      type="button"
                      onClick={clearMobileSearch}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
