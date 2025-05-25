"use client"

import { useState, useEffect } from "react"
import GameCard from "@/components/game-card"
import Navbar from "@/components/navbar"
import FilterBar from "@/components/filter-bar"
import { games as allGames } from "@/lib/data"
import type { Game } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function Home() {
  const [games, setGames] = useState<Game[]>(allGames)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Games")
  const [sortOption, setSortOption] = useState("Release Date")
  const [filters, setFilters] = useState<{
    status: string[]
    genre: string[]
    animeStyle: string[]
  }>({
    status: [],
    genre: [],
    animeStyle: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notificationGames, setNotificationGames] = useLocalStorage<string[]>("notificationGames", [])

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true)

    // Simulate loading for better UX
    const timer = setTimeout(() => {
      let filteredGames = [...allGames]

      // Apply search filter
      if (searchQuery) {
        filteredGames = filteredGames.filter(
          (game) =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.developer.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply category filter
      if (activeCategory !== "All Games") {
        filteredGames = filteredGames.filter((game) => game.animeStyle === activeCategory)
      }

      // Apply sidebar filters
      if (filters.status.length > 0) {
        // For demo purposes, all games are "Upcoming"
        // In a real app, you'd filter by status
      }

      if (filters.genre.length > 0) {
        filteredGames = filteredGames.filter((game) => filters.genre.includes(game.genre))
      }

      if (filters.animeStyle.length > 0) {
        filteredGames = filteredGames.filter((game) => filters.animeStyle.includes(game.animeStyle))
      }

      // Apply sorting
      switch (sortOption) {
        case "Release Date":
          filteredGames.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
          break
        case "Most Anticipated":
          filteredGames.sort((a, b) => b.anticipationLevel - a.anticipationLevel)
          break
        case "Title (A-Z)":
          filteredGames.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "Notifications On":
          filteredGames.sort((a, b) => {
            const aNotification = notificationGames.includes(a.id) ? 1 : 0
            const bNotification = notificationGames.includes(b.id) ? 1 : 0
            return bNotification - aNotification
          })
          break
        default:
          break
      }

      setGames(filteredGames)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, activeCategory, sortOption, filters, notificationGames])

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

  // Handle notification toggle
  const toggleNotification = (gameId: string) => {
    setNotificationGames((prev) => {
      if (prev.includes(gameId)) {
        return prev.filter((id) => id !== gameId)
      } else {
        return [...prev, gameId]
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setActiveCategory("All Games")
    setSortOption("Release Date")
    setFilters({
      status: [],
      genre: [],
      animeStyle: [],
    })
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f1117] to-[#131620] text-white">
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent"></div>
        <div className="w-full h-full bg-[url('/grid-pattern.png')] bg-repeat opacity-10"></div>
      </div>

      <Navbar onSearch={handleSearch} onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[300px] w-full mb-12 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: 'url(https://i.ibb.co/gMgxN8D9/200-1.png)'
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
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
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

            {notificationGames.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 flex items-center gap-2"
              >
                <span className="text-sm text-gray-300">
                  You have notifications enabled for {notificationGames.length} game{notificationGames.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setSortOption("Notifications On")}
                  className="text-sm px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/30 transition-colors"
                >
                  View All
                </button>
              </motion.div>
            )}
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
                  {sortOption === "Notifications On" && " (Notifications First)"}
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
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  className="bg-[#1a1d29] border border-gray-700 rounded-lg py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option>Release Date</option>
                  <option>Most Anticipated</option>
                  <option>Title (A-Z)</option>
                  <option>Notifications On</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#1a1d29]/50 rounded-xl h-[350px] animate-pulse"></div>
                ))}
              </div>
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
                        isNotificationEnabled={notificationGames.includes(game.id)}
                        onNotificationToggle={() => toggleNotification(game.id)}
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
    </div>
  )
}
