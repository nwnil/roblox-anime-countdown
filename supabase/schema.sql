-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- Create tables for the Roblox Anime Countdown app

-- Games table to store game information
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    developer VARCHAR(255) NOT NULL,
    description TEXT,
    release_date TIMESTAMP WITH TIME ZONE,
    anime_style VARCHAR(100),
    genre VARCHAR(100),
    image_url TEXT,
    trailer_url TEXT,
    anticipation_level INTEGER DEFAULT 1 CHECK (anticipation_level >= 1 AND anticipation_level <= 10),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'released', 'delayed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name VARCHAR(100),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User game notifications/watchlist
CREATE TABLE IF NOT EXISTS user_game_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) DEFAULT 'release_date' CHECK (notification_type IN ('release_date', 'updates', 'all')),
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, game_id)
);

-- User preferences for filtering/sorting
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_genres TEXT[], -- Array of preferred genres
    preferred_anime_styles TEXT[], -- Array of preferred anime styles
    default_sort_option VARCHAR(50) DEFAULT 'release_date',
    show_released_games BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Game updates/news table
CREATE TABLE IF NOT EXISTS game_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    update_type VARCHAR(50) DEFAULT 'news' CHECK (update_type IN ('news', 'delay', 'release', 'screenshot', 'trailer')),
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_updates ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Games policies (public read, admin write)
CREATE POLICY "Games are viewable by everyone" ON games
    FOR SELECT USING (true);

CREATE POLICY "Games can be inserted by everyone" ON games
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Games can be updated by everyone" ON games
    FOR UPDATE USING (true);

CREATE POLICY "Games can be deleted by everyone" ON games
    FOR DELETE USING (true);

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- User game notifications policies
CREATE POLICY "Users can view own notifications" ON user_game_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON user_game_notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_game_notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON user_game_notifications
    FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Game updates policies (public read)
CREATE POLICY "Game updates are viewable by everyone" ON game_updates
    FOR SELECT USING (true);

CREATE POLICY "Game updates can be inserted by authenticated users" ON game_updates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO games (title, developer, description, release_date, anime_style, genre, anticipation_level, image_url) VALUES
('Anime Fighting Simulator X', 'BlockZone Studio', 'The ultimate anime fighting experience with over 100 characters from popular anime series.', '2024-03-15 00:00:00+00', 'Shonen', 'Fighting', 9, 'https://example.com/afs.jpg'),
('Blox Fruits: New World', 'Gamer Robot Inc.', 'Explore the vast ocean world inspired by One Piece with new devil fruits and adventures.', '2024-04-20 00:00:00+00', 'Shonen', 'Adventure', 10, 'https://example.com/bloxfruits.jpg'),
('Demon Slayer RPG', 'Anime Games Studio', 'Experience the world of Demon Slayer with breathing techniques and demon battles.', '2024-02-28 00:00:00+00', 'Shonen', 'RPG', 8, 'https://example.com/demonslayer.jpg'); 