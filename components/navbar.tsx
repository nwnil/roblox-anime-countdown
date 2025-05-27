"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface NavbarProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  activeCategory: string
}

export default function Navbar({ onSearch, onCategoryChange, activeCategory }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Categories for the filter buttons
  const categories = ["All Games", "One Piece", "Naruto", "Dragon Ball", "My Hero Academia", "Demon Slayer"]

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

  // Handle category button click
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category)
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

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-gray-800/50 bg-[#0f1117]/90 backdrop-blur-md shadow-lg shadow-purple-900/5"
          : "border-transparent bg-[#0f1117]/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-500">
              <div className="absolute inset-[2px] rounded-full bg-[#0f1117] flex items-center justify-center">
                <span className="text-white font-bold text-xs">AR</span>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:inline-block font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400"
            >
              AnimeRoblox
            </motion.span>
          </Link>
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

          <Link href="/admin" className="hidden md:block">
            <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              Admin
            </Button>
          </Link>

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
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-gray-300">Categories</h3>
                  <div className="flex flex-col gap-1">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`justify-start ${
                          activeCategory === category
                            ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-l-2 border-purple-500"
                            : "text-gray-400"
                        }`}
                        onClick={() => {
                          handleCategoryClick(category)
                          setIsOpen(false)
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 py-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className={`whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}
