# Supabase Setup Guide for Roblox Anime Countdown

## Quick Setup (Recommended)

### 1. Copy and Run the SQL Schema

1. **Go to your Supabase dashboard** at [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Select your project**
3. **Navigate to SQL Editor** (left sidebar)
4. **Create a new query**
5. **Copy the entire contents** of `supabase/schema.sql`
6. **Paste it into the SQL editor**
7. **Click "Run"** to execute all the SQL commands

This will create:
- All necessary tables (games, user_profiles, user_game_notifications, user_preferences, game_updates)
- Row Level Security policies
- Triggers for automatic timestamp updates
- Sample game data

### 2. Enable Authentication

1. **Go to Authentication** in your Supabase dashboard
2. **Navigate to Settings** → **Authentication**
3. **Enable Email authentication** (should be enabled by default)
4. **Optional**: Configure email templates and SMTP settings

### 3. Verify Setup

After running the SQL script, you should see these tables in your **Database** → **Tables**:
- `games`
- `user_profiles`
- `user_game_notifications`
- `user_preferences`
- `game_updates`

## What's Included

### Database Tables

#### 1. `games` - Store game information
- Basic game details (title, developer, description)
- Release dates and status
- Anime style and genre categorization
- Anticipation levels
- Media URLs (images, trailers)

#### 2. `user_profiles` - Extended user information
- Display names and avatars
- Notification preferences
- Timezone settings

#### 3. `user_game_notifications` - User watchlist/notifications
- Per-game notification settings
- Notification types (release_date, updates, all)
- Enable/disable toggles

#### 4. `user_preferences` - User app preferences
- Preferred genres and anime styles
- Default sorting options
- UI preferences

#### 5. `game_updates` - News and updates for games
- Game announcements
- Screenshots and trailers
- Release date changes

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **Public read access** for games and game updates
- **Authenticated write access** for game management

### Sample Data

The schema includes sample games:
- Anime Fighting Simulator X
- Blox Fruits: New World
- Demon Slayer RPG

## Manual Setup (Alternative)

If you prefer to set up tables manually:

### Step 1: Create Tables
Run each CREATE TABLE statement from `supabase/schema.sql` individually.

### Step 2: Enable RLS
Run the ALTER TABLE statements to enable Row Level Security.

### Step 3: Create Policies
Run each CREATE POLICY statement to set up access controls.

### Step 4: Add Triggers
Run the function and trigger creation statements for automatic timestamps.

### Step 5: Add Sample Data
Run the INSERT statements to add sample games.

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Setup

1. **Start your development server**: `pnpm dev`
2. **Open the app** in your browser
3. **Look for the Supabase connection status** (you should see a green checkmark)
4. **Try signing up** for a new account
5. **Test notification toggles** on game cards

## Troubleshooting

### Common Issues

1. **Connection errors**: Check your environment variables
2. **Permission denied**: Verify RLS policies are set up correctly
3. **Table not found**: Ensure all tables were created successfully

### Checking Logs

Go to **Logs** in your Supabase dashboard to see detailed error messages.

### Resetting Database

To start fresh:
1. Go to **Database** → **Tables**
2. Delete all custom tables
3. Re-run the schema.sql script

## Next Steps

Once set up, you can:
- Add more games through the Supabase dashboard
- Customize the database schema for your needs
- Set up email notifications
- Add user avatars and profiles
- Implement admin features

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the SQL error messages in the dashboard
3. Ensure your project has the latest Supabase updates 