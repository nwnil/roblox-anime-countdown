"use client"

import { useState } from 'react'
import { gameService } from '@/lib/supabase-service'
import { Button } from '@/components/ui/button'

export default function DebugSupabase() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      console.log('Testing Supabase connection...')
      const games = await gameService.getAllGames()
      console.log('Games from database:', games)
      setResult({
        success: true,
        count: games.length,
        games: games,
        message: `Found ${games.length} games in database`
      })
    } catch (error) {
      console.error('Supabase error:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch games'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 max-w-md">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Supabase Debug</h3>
        
        <Button 
          onClick={testConnection} 
          disabled={loading}
          size="sm"
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </Button>

        {result && (
          <div className="text-xs">
            <div className={`font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </div>
            
            {result.success ? (
              <div className="mt-2 space-y-1">
                <div className="text-gray-300">Games found:</div>
                {result.games.map((game: any, index: number) => (
                  <div key={index} className="text-gray-400 text-xs">
                    • {game.title} by {game.developer}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-400 mt-2">
                Error: {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 