import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateDatabase() {
  console.log('🔄 Testing links column in games table...')
  
  try {
    // Test if links column exists by inserting test data
    console.log('🔍 Testing if links column exists by inserting test data...')
    
    const testGame = {
      title: 'Test Game With Links',
      developer: 'Test Dev',
      description: 'Testing links functionality',
      release_date: '2025-12-31T00:00:00Z',
      links: {
        discord: 'https://discord.gg/testgame',
        twitter: 'https://twitter.com/testgame',
        roblox: 'https://roblox.com/games/test'
      }
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('games')
      .insert([testGame])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Links column does not exist. Error:', insertError.message)
      console.log('\n🔧 MANUAL FIX REQUIRED:')
      console.log('1. Go to your Supabase dashboard (https://supabase.com/dashboard)')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run this SQL command:')
      console.log('   ALTER TABLE games ADD COLUMN links JSONB;')
      console.log('\nThen run this script again.')
      return false
    }
    
    console.log('✅ Links column exists! Test game inserted:', insertData.title)
    
    // Clean up test data
    await supabase.from('games').delete().eq('id', insertData.id)
    console.log('🗑️ Test data cleaned up')
    
    // Now test reading games with links
    console.log('🔍 Testing games with links...')
    const { data: games, error: selectError } = await supabase
      .from('games')
      .select('*')
      .limit(5)
    
    if (selectError) {
      console.error('❌ Error reading games:', selectError)
      return false
    }
    
    console.log(`📊 Found ${games.length} games in database`)
    games.forEach(game => {
      console.log(`- ${game.title}: ${game.links ? 'Has links' : 'No links'}`)
      if (game.links) {
        const linkTypes = Object.keys(game.links).filter(key => game.links[key])
        console.log(`  Links: ${linkTypes.join(', ')}`)
      }
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

// Run the update
updateDatabase().then(success => {
  if (success) {
    console.log('\n🎉 Database update completed successfully!')
    console.log('You can now add Discord links and other social links to games in the admin panel.')
  } else {
    console.log('\n❌ Database update failed. Please check the errors above.')
  }
  process.exit(success ? 0 : 1)
}) 