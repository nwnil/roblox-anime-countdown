"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Eye, EyeOff, Save, X } from "lucide-react"
import { games as initialGames } from "@/lib/data"
import type { Game } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [games, setGames] = useState<Game[]>(initialGames)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Simple password authentication (in production, use proper auth)
  const ADMIN_PASSWORD = "roblox2025admin"

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
    } else {
      alert("Incorrect password!")
    }
  }

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
    setPassword("")
  }

  const genres = ["Adventure", "Action", "RPG", "Fighting", "Simulator"]
  const animeStyles = [
    "One Piece", "Naruto", "Dragon Ball", "My Hero Academia", 
    "Demon Slayer", "Bleach", "Attack on Titan", "Fullmetal Alchemist", "Evangelion"
  ]

  const createEmptyGame = (): Game => ({
    id: Date.now().toString(),
    title: "",
    developer: "",
    genre: "Adventure",
    thumbnail: "/placeholder.svg",
    releaseDate: new Date().toISOString(),
    anticipationLevel: 50,
    description: "",
    animeStyle: "One Piece",
  })

  const handleSaveGame = (game: Game) => {
    if (editingGame) {
      // Update existing game
      setGames(games.map(g => g.id === game.id ? game : g))
    } else {
      // Add new game
      setGames([...games, game])
    }
    setEditingGame(null)
    setShowAddForm(false)
    
    // In a real app, you'd save to database here
    console.log("Game saved:", game)
    alert("Game saved! (In production, this would update the database)")
  }

  const handleDeleteGame = (id: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      setGames(games.filter(g => g.id !== id))
      alert("Game deleted!")
    }
  }

  const GameForm = ({ game, onSave, onCancel }: { 
    game: Game, 
    onSave: (game: Game) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState(game)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.developer || !formData.description) {
        alert("Please fill in all required fields!")
        return
      }
      onSave(formData)
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1d29] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingGame ? "Edit Game" : "Add New Game"}
            </CardTitle>
            <CardDescription>
              Fill in the game details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">Game Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter game title"
                  />
                </div>
                <div>
                  <Label htmlFor="developer" className="text-white">Developer *</Label>
                  <Input
                    id="developer"
                    value={formData.developer}
                    onChange={(e) => setFormData({...formData, developer: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter developer name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre" className="text-white">Genre</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="animeStyle" className="text-white">Anime Style</Label>
                  <Select value={formData.animeStyle} onValueChange={(value) => setFormData({...formData, animeStyle: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animeStyles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="releaseDate" className="text-white">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="datetime-local"
                    value={formData.releaseDate.slice(0, 16)}
                    onChange={(e) => setFormData({...formData, releaseDate: new Date(e.target.value).toISOString()})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="anticipationLevel" className="text-white">Hype Level (%)</Label>
                  <Input
                    id="anticipationLevel"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.anticipationLevel}
                    onChange={(e) => setFormData({...formData, anticipationLevel: parseInt(e.target.value)})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail" className="text-white">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter image URL or use /placeholder.svg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  placeholder="Enter game description"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Game
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#1a1d29] to-[#151823] flex items-center justify-center relative">
        {/* Background image */}
        <div className="fixed inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
            style={{
              backgroundImage: 'url(/background-image.png)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117]/90 via-[#1a1d29]/80 to-[#151823]/90"></div>
        </div>
                  <Card className="w-full max-w-md bg-[#1a1d29] border-gray-800 relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter the admin password to manage games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Enter admin password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700">
                Login
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Demo password: roblox2025admin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#1a1d29] to-[#151823] p-6 relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url(/background-image.png)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117]/90 via-[#1a1d29]/80 to-[#151823]/90"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Game Admin Dashboard</h1>
            <p className="text-gray-400">Manage your Roblox anime countdown games</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">{games.length}</div>
              <p className="text-gray-400">Total Games</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">
                {games.filter(g => new Date(g.releaseDate) > new Date()).length}
              </div>
              <p className="text-gray-400">Upcoming Games</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1d29] border-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-white">
                {Math.round(games.reduce((acc, g) => acc + g.anticipationLevel, 0) / games.length)}%
              </div>
              <p className="text-gray-400">Average Hype</p>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        <div className="grid gap-4">
          {games.map((game) => (
            <Card key={game.id} className="bg-[#1a1d29] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-800"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{game.title}</h3>
                    <p className="text-gray-400">by {game.developer}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{game.genre}</Badge>
                      <Badge variant="outline">{game.animeStyle}</Badge>
                      <Badge className="bg-green-600">{game.anticipationLevel}% Hype</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Release Date</p>
                    <p className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingGame(game)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showAddForm && (
          <GameForm
            game={createEmptyGame()}
            onSave={handleSaveGame}
            onCancel={() => setShowAddForm(false)}
          />
        )}
        {editingGame && (
          <GameForm
            game={editingGame}
            onSave={handleSaveGame}
            onCancel={() => setEditingGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 