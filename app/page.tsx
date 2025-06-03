"use client"

import { useState, useEffect, useRef } from "react"
import GameCard from "@/components/game-card"
import Navbar from "@/components/navbar"
import FilterBar from "@/components/filter-bar"
import GameReleasePopup from "@/components/game-release-popup"
import { gameService, dbGameToAppGame } from "@/lib/supabase-service"
import type { Game } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, RefreshCw, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { calculateTimeRemaining } from "@/lib/timezone-utils"

export default function Home() {
  const [allGames, setAllGames] = useState<Game[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Games")
  const [sortOption, setSortOption] = useState("release")
  const [filters, setFilters] = useState<{
    status: string[]
    genre: string[]
    animeStyle: string[]
  }>({
    status: [],
    genre: [],
    animeStyle: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Game release popup state
  const [showReleasePopup, setShowReleasePopup] = useState(false)
  const [releasedGame, setReleasedGame] = useState<Game | null>(null)

  // Load games from Supabase on component mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const dbGames = await gameService.getAllGames()
        const convertedGames = dbGames.map(dbGameToAppGame)
        
        // Filter out games that have already released (countdown ended)
        const upcomingGames = convertedGames.filter(game => {
          // For approximate dates, always consider them upcoming
          if (game.hasExactDate === false) {
            return true
          }
          
          // For exact dates, use timezone-safe calculation
          const timeRemaining = calculateTimeRemaining(game.releaseDate)
          return !timeRemaining.isExpired
        })
        
        setAllGames(upcomingGames)
        setGames(upcomingGames)
      } catch (err) {
        console.error('Error loading games:', err)
        setError('Failed to load games. Please try refreshing the page.')
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }

    loadGames()
  }, [])

  // Listen for game released events from individual game cards
  useEffect(() => {
    const handleGameReleased = (event: CustomEvent) => {
      const releasedGame = event.detail as Game
      
      // Show the release popup
      setReleasedGame(releasedGame)
      setShowReleasePopup(true)
      
      // Remove the released game from the lists
      setAllGames(prevGames => prevGames.filter(game => game.id !== releasedGame.id))
      setGames(prevGames => prevGames.filter(game => game.id !== releasedGame.id))
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('gameReleased', handleGameReleased as EventListener)
      return () => {
        window.removeEventListener('gameReleased', handleGameReleased as EventListener)
      }
    }
  }, [])

  // Check for newly released games every second
  useEffect(() => {
    const checkForReleasedGames = () => {
      // Find games that just reached their release time using timezone-safe calculation
      const justReleasedGames = allGames.filter(game => {
        // Only check exact dates for release notifications
        if (game.hasExactDate === false) {
          return false
        }
        
        // Use the same timezone-safe function as the countdown
        const timeRemaining = calculateTimeRemaining(game.releaseDate)
        return timeRemaining.isExpired
      })

      if (justReleasedGames.length > 0) {
        // Show popup for the first released game
        setReleasedGame(justReleasedGames[0])
        setShowReleasePopup(true)
        
        // Remove released games from display
        const stillUpcomingGames = allGames.filter(game => {
          // Keep approximate dates
          if (game.hasExactDate === false) {
            return true
          }
          
          // For exact dates, use timezone-safe calculation
          const timeRemaining = calculateTimeRemaining(game.releaseDate)
          return !timeRemaining.isExpired
        })
        
        setAllGames(stillUpcomingGames)
        setGames(stillUpcomingGames)
        
        // Dispatch custom event for any other components listening
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gameReleased', { detail: justReleasedGames[0] }))
        }
      }
    }

    const interval = setInterval(checkForReleasedGames, 1000) // Check every second
    return () => clearInterval(interval)
  }, [allGames])

  // Apply filters and sorting when games or filters change
  useEffect(() => {
    if (isInitialLoad) return // Don't filter during initial load

    setIsLoading(true)

    // Simulate loading for better UX (but shorter since we already have data)
    const timer = setTimeout(() => {
      let filteredGames = [...allGames]

      // Apply search filter
      if (searchQuery) {
        filteredGames = filteredGames.filter(
          (game) =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.animeStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply category filter
      if (activeCategory !== "All Games") {
        filteredGames = filteredGames.filter((game) => game.animeStyle === activeCategory)
      }

      // Apply sidebar filters
      if (filters.status.length > 0) {
        filteredGames = filteredGames.filter((game) => 
          game.status && filters.status.includes(game.status)
        )
      }

      if (filters.genre.length > 0) {
        filteredGames = filteredGames.filter((game) => {
          const gameCategory = getGameCategory(game)
          
          // Check if any selected filter matches this game
          return filters.genre.some(selectedGenre => {
            // Exact match with game category
            if (selectedGenre === gameCategory) {
              return true
            }
            
            // Specific matching for each filter type
            switch (selectedGenre) {
              case "RPG / Open World":
                return gameCategory === "RPG & Open World"
              
              case "Fighting / PvP":
                return gameCategory === "Fighting & PvP"
              
              case "Tower Defense":
                return gameCategory === "Tower Defense"
              
              case "Simulator / Idle":
                return gameCategory === "Simulator & Idle"
              
              case "Sports / Racing":
                return gameCategory === "Sports & Racing"
              
              case "Arena Battler":
                return gameCategory === "Arena Battler"
              
              case "Story Mode":
                return gameCategory === "Story Mode"
              
              case "Adventure / Quest-Based":
                return gameCategory === "RPG & Open World" && (game.genre === "Adventure / Quest-Based" || game.genre === "Adventure")
              
              default:
                // For other filters, only match if exact genre match
                return game.genre === selectedGenre
            }
          })
        })
      }

      if (filters.animeStyle.length > 0) {
        filteredGames = filteredGames.filter((game) => filters.animeStyle.includes(game.animeStyle))
      }

      // Apply sorting
      switch (sortOption) {
        case "release":
          filteredGames.sort((a, b) => {
            // Handle approximate dates - put them at the end
            if (a.hasExactDate === false && b.hasExactDate !== false) return 1
            if (b.hasExactDate === false && a.hasExactDate !== false) return -1
            if (a.hasExactDate === false && b.hasExactDate === false) {
              // Sort approximate dates alphabetically by their text
              return (a.approximateReleaseText || '').localeCompare(b.approximateReleaseText || '')
            }
            // Both have exact dates, sort by date
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          })
          break
        case "alphabetical":
          filteredGames.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "developer": 
          filteredGames.sort((a, b) => a.developer.localeCompare(b.developer))
          break
        default:
          filteredGames.sort((a, b) => {
            // Handle approximate dates - put them at the end
            if (a.hasExactDate === false && b.hasExactDate !== false) return 1
            if (b.hasExactDate === false && a.hasExactDate !== false) return -1
            if (a.hasExactDate === false && b.hasExactDate === false) {
              // Sort approximate dates alphabetically by their text
              return (a.approximateReleaseText || '').localeCompare(b.approximateReleaseText || '')
            }
            // Both have exact dates, sort by date
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          })
          break
      }

      setGames(filteredGames)
      setIsLoading(false)
    }, 150) // Shorter delay since we already have the data

    return () => clearTimeout(timer)
  }, [searchQuery, activeCategory, sortOption, filters, allGames, isInitialLoad])

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option)
  }

  // Get display text for sort option
  const getSortDisplayText = (option: string) => {
    switch (option) {
      case "release":
        return "Release Date"
      case "alphabetical":
        return "Title (A-Z)"
      case "developer":
        return "Developer"
      default:
        return "Release Date"
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[filterType]]
      const index = currentFilters.indexOf(value)

      if (index === -1) {
        // Add filter
        return {
          ...prev,
          [filterType]: [...currentFilters, value],
        }
      } else {
        // Remove filter
        currentFilters.splice(index, 1)
        return {
          ...prev,
          [filterType]: currentFilters,
        }
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setActiveCategory("All Games")
    setSortOption("release")
    setFilters({
      status: [],
      genre: [],
      animeStyle: [],
    })
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

  // Close release popup
  const closeReleasePopup = () => {
    setShowReleasePopup(false)
    setReleasedGame(null)
  }

  // Refresh games from database
  const refreshGames = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const dbGames = await gameService.getAllGames()
      const convertedGames = dbGames.map(dbGameToAppGame)
      
      // Filter out games that have already released (countdown ended)
      const now = new Date()
      const upcomingGames = convertedGames.filter(game => {
        // For approximate dates, always consider them upcoming
        if (game.hasExactDate === false) {
          return true
        }
        // For exact dates, check if they're in the future
        const releaseDate = new Date(game.releaseDate)
        return releaseDate > now
      })
      
      setAllGames(upcomingGames)
      setGames(upcomingGames)
    } catch (err) {
      console.error('Error refreshing games:', err)
      setError('Failed to refresh games. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1117] to-[#131620] text-white relative">
      {/* Main background image - far back */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url(/background-image.png)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117]/80 via-[#131620]/60 to-[#0f1117]/90"></div>
      </div>
      
      {/* Secondary background overlay */}
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent"></div>
      </div>

      <Navbar onSearch={handleSearch} onCategoryChange={handleCategoryChange} activeCategory={activeCategory} onReset={resetFilters} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[300px] w-full mb-12 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-slate-900/70 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-emerald-400/30 z-10"></div>
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: 'url(https://i.ibb.co/PzZCQs7z/200.png)'
            }}
          ></div>

          {/* Animated particles */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
          </div>

          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Anime Roblox Games
              <span className="block text-cyan-100">
                Countdown & Release Dates
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl"
            >
              Track the most anticipated anime-themed Roblox games and never miss a release
            </motion.p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-64 shrink-0"
          >
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {activeCategory === "All Games" ? "Upcoming Games" : activeCategory + " Games"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {searchQuery && (
                    <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full flex items-center">
                      Search: {searchQuery}
                      <button
                        onClick={() => handleSearch("")}
                        className="ml-1 hover:text-white"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    {games.length} game{games.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>
                              <div className="flex items-center gap-2">
                <button
                  onClick={refreshGames}
                  disabled={isLoading}
                  className="p-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-md hover:bg-gray-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh games from database"
                >
                  <RefreshCw className={`h-4 w-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between w-[200px] bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-md py-2 px-3 text-sm text-white font-medium shadow-sm hover:bg-gray-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer transition-all duration-200 group">
                    {getSortDisplayText(sortOption)}
                      <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[200px] bg-gray-800/95 backdrop-blur-sm border border-gray-700 data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out shadow-lg shadow-black/20"
                    >
                      <DropdownMenuItem 
                        className="py-2 px-3 text-sm cursor-pointer hover:bg-gray-700/60 focus:bg-gray-700/60 rounded-sm transition-colors duration-150 ease-in-out flex items-center gap-2"
                      onClick={() => handleSortChange("release")}
                      >
                      {sortOption === "release" && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>}
                        Release Date
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="py-2 px-3 text-sm cursor-pointer hover:bg-gray-700/60 focus:bg-gray-700/60 rounded-sm transition-colors duration-150 ease-in-out flex items-center gap-2"
                      onClick={() => handleSortChange("alphabetical")}
                      >
                      {sortOption === "alphabetical" && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>}
                        Title (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="py-2 px-3 text-sm cursor-pointer hover:bg-gray-700/60 focus:bg-gray-700/60 rounded-sm transition-colors duration-150 ease-in-out flex items-center gap-2"
                      onClick={() => handleSortChange("developer")}
                      >
                      {sortOption === "developer" && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>}
                      Developer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#1a1d29]/50 rounded-xl h-[350px] animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Error Loading Games
                </h3>
                <p className="text-gray-400 max-w-md mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Retry
                </button>
              </motion.div>
            ) : games.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  No games found
                </h3>
                <p className="text-gray-400 max-w-md">
                  We couldn't find any games matching your search criteria. Try adjusting your filters or search query.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${searchQuery}-${activeCategory}-${sortOption}-${JSON.stringify(filters)}`}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {games.map((game) => (
                    <motion.div key={game.id} variants={item} layout>
                      <GameCard
                        game={game}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-gray-800/50 py-8 mt-12 relative z-10 bg-[#0f1117]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Anime Roblox Countdown. All rights reserved.</p>
          <p className="mt-2">Not affiliated with Roblox Corporation or any anime license holders.</p>
        </div>
      </footer>

      {/* Game Release Popup */}
      {releasedGame && (
        <GameReleasePopup
          isOpen={showReleasePopup}
          onClose={closeReleasePopup}
          game={releasedGame}
        />
      )}
    </div>
  )
}
