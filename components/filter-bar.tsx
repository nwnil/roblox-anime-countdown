"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { motion, AnimatePresence } from "framer-motion"

interface FilterBarProps {
  filters: {
    status: string[]
    genre: string[]
    animeStyle: string[]
  }
  onFilterChange: (filterType: "status" | "genre" | "animeStyle", value: string) => void
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [openSections, setOpenSections] = useState({
    status: true,
    genre: true,
    animeStyle: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Filter options
  const filterOptions = {
    status: ["Alpha Testing", "Beta Testing", "Upcoming", "TBA", "Delayed"],
    genre: ["Fighting / PvP", "RPG / Open World", "Tower Defense", "Simulator / Idle", "Sports / Racing", "Arena Battler", "Story Mode", "Adventure / Quest-Based"],
    animeStyle: ["One Piece", "Naruto", "Dragon Ball", "My Hero Academia", "Demon Slayer", "Bleach", "Attack on Titan", "Jujutsu Kaisen", "Chainsaw Man", "Solo Leveling", "Sword Art Online", "Tokyo Ghoul", "JoJo's Bizarre Adventure", "One Punch Man", "Blue Lock", "Black Clover", "Fire Force", "Other"],
  }

  // Check if a filter is active
  const isFilterActive = (filterType: keyof typeof filters, value: string) => {
    return filters[filterType].includes(value)
  }

  // Handle filter click
  const handleFilterClick = (filterType: keyof typeof filters, value: string) => {
    onFilterChange(filterType, value)
  }

  // Reset all filters
  const resetFilters = () => {
    // Clear all active filters by toggling them off
    filters.status.forEach((status) => {
      onFilterChange("status", status)
    })
    filters.genre.forEach((genre) => {
      onFilterChange("genre", genre)
    })
    filters.animeStyle.forEach((style) => {
      onFilterChange("animeStyle", style)
    })
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).flat().length

  return (
    <div className="bg-gradient-to-b from-[#1a1d29] to-[#1a1d29]/90 rounded-xl border border-gray-800/50 p-4 shadow-xl shadow-purple-900/5 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-white">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white" onClick={resetFilters}>
            Reset
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <>
          <div className="text-xs text-gray-500 mb-4">Active filters:</div>

          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {filters.status.map((status) => (
                <motion.div
                  key={status}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Badge 
                    variant="modern" 
                    size="sm"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 flex items-center gap-1"
                  >
                    {status}
                    <button
                      className="hover:text-purple-900 dark:hover:text-white transition-colors"
                      onClick={() => handleFilterClick("status", status)}
                      aria-label={`Remove ${status} filter`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                </motion.div>
              ))}
              {filters.genre.map((genre) => (
                <motion.div
                  key={genre}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Badge 
                    variant="modern" 
                    size="sm"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                  >
                    {genre}
                    <button
                      className="hover:text-blue-900 dark:hover:text-white transition-colors"
                      onClick={() => handleFilterClick("genre", genre)}
                      aria-label={`Remove ${genre} filter`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                </motion.div>
              ))}
              {filters.animeStyle.map((style) => (
                <motion.div
                  key={style}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Badge 
                    variant="modern" 
                    size="sm"
                    className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 flex items-center gap-1"
                  >
                    {style}
                    <button
                      className="hover:text-green-900 dark:hover:text-white transition-colors"
                      onClick={() => handleFilterClick("animeStyle", style)}
                      aria-label={`Remove ${style} filter`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <Collapsible open={openSections.status} className="mb-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between p-0 h-auto font-medium group"
            onClick={() => toggleSection("status")}
          >
            <span className="text-white group-hover:text-purple-400 transition-all">
              Status
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          {filterOptions.status.map((status) => (
            <div
              key={status}
              className="flex items-center gap-2 px-1 py-1.5 hover:bg-gray-800/30 rounded-md cursor-pointer transition-colors"
              onClick={() => handleFilterClick("status", status)}
            >
              <div
                className={`w-4 h-4 rounded border ${
                  isFilterActive("status", status) ? "border-purple-500 bg-purple-500/10" : "border-gray-600"
                } flex items-center justify-center transition-colors`}
              >
                {isFilterActive("status", status) && <Check className="h-3 w-3 text-purple-500" />}
              </div>
              <span className={`text-sm ${isFilterActive("status", status) ? "text-white" : "text-gray-400"}`}>
                {status}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.genre} className="mb-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between p-0 h-auto font-medium group"
            onClick={() => toggleSection("genre")}
          >
            <span className="text-white group-hover:text-blue-400 transition-all">
              Genre
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.genre ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          {filterOptions.genre.map((genre) => (
            <div
              key={genre}
              className="flex items-center gap-2 px-1 py-1.5 hover:bg-gray-800/30 rounded-md cursor-pointer transition-colors"
              onClick={() => handleFilterClick("genre", genre)}
            >
              <div
                className={`w-4 h-4 rounded border ${
                  isFilterActive("genre", genre) ? "border-blue-500 bg-blue-500/10" : "border-gray-600"
                } flex items-center justify-center transition-colors`}
              >
                {isFilterActive("genre", genre) && <Check className="h-3 w-3 text-blue-500" />}
              </div>
              <span className={`text-sm ${isFilterActive("genre", genre) ? "text-white" : "text-gray-400"}`}>
                {genre}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.animeStyle} className="mb-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between p-0 h-auto font-medium group"
            onClick={() => toggleSection("animeStyle")}
          >
            <span className="text-white group-hover:text-green-400 transition-all">
              Anime Style
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.animeStyle ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          {filterOptions.animeStyle.map((style) => (
            <div
              key={style}
              className="flex items-center gap-2 px-1 py-1.5 hover:bg-gray-800/30 rounded-md cursor-pointer transition-colors"
              onClick={() => handleFilterClick("animeStyle", style)}
            >
              <div
                className={`w-4 h-4 rounded border ${
                  isFilterActive("animeStyle", style) ? "border-green-500 bg-green-500/10" : "border-gray-600"
                } flex items-center justify-center transition-colors`}
              >
                {isFilterActive("animeStyle", style) && <Check className="h-3 w-3 text-green-500" />}
              </div>
              <span className={`text-sm ${isFilterActive("animeStyle", style) ? "text-white" : "text-gray-400"}`}>
                {style}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
