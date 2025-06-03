import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateDatabase() {
  console.log('🔄 Adding links column to games table...')
  
  try {
    // Add links column to games table
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE games ADD COLUMN IF NOT EXISTS links JSONB;'
    })
    
    if (alterError) {
      console.error('❌ Error adding links column:', alterError)
      
      // Try alternative method using raw SQL
      console.log('🔄 Trying alternative method...')
      const { error: rawError } = await supabase
        .from('_supabase_migrations')
        .insert([])
        .select()
      
      // Since we can't execute DDL directly, let's test if links column already exists
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
        console.log('Please run this SQL command in your Supabase SQL Editor:')
        console.log('ALTER TABLE games ADD COLUMN links JSONB;')
        console.log('\nThen run this script again.')
        return false
      }
      
      console.log('✅ Links column exists! Test game inserted:', insertData.title)
      
      // Clean up test data
      await supabase.from('games').delete().eq('id', insertData.id)
      console.log('🗑️ Test data cleaned up')
      
    } else {
      console.log('✅ Links column added successfully!')
    }
    
    // Now test reading games with links
    console.log('🔍 Testing games with links...')
    const { data: games, error: selectError } = await supabase
      .from('games')
      .select('*')
      .limit(3)
    
    if (selectError) {
      console.error('❌ Error reading games:', selectError)
      return false
    }
    
    console.log(`📊 Found ${games.length} games in database`)
    games.forEach(game => {
      console.log(`- ${game.title}: ${game.links ? 'Has links' : 'No links'}`)
      if (game.links) {
        console.log(`  Links:`, Object.keys(game.links).filter(key => game.links[key]))
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