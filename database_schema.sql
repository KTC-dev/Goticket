-- Goticket FIFA World Cup Database Schema for Supabase PostgreSQL (with Supabase Auth)
-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(50) DEFAULT 'Match',
    teams TEXT[], -- Array of strings for teams
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    available_tickets INTEGER NOT NULL CHECK (available_tickets >= 0),
    total_tickets INTEGER NOT NULL CHECK (total_tickets >= 0),
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events policies:
-- Anyone can view events (public)
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

-- Only authenticated users can create events (admins in practice, but we'll check in app logic)
CREATE POLICY "Authenticated users can create events" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update/delete events (we'll refine this in app logic)
CREATE POLICY "Users can update own events" ON events
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own events" ON events
    FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- PROFILES TABLE (instead of users)
-- =============================================
-- This extends auth.users from Supabase Auth
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    avatar_url TEXT,
    website TEXT,
    -- Note: password is handled by auth.users, not stored here
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies:
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- =============================================
-- TICKETS TABLE
-- =============================================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- References auth.users directly
    seat_number VARCHAR(10),
    section VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'reserved',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Tickets policies:
-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create tickets (when purchasing)
CREATE POLICY "Users can create tickets" ON tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets
CREATE POLICY "Users can update own tickets" ON tickets
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own tickets
CREATE POLICY "Users can delete own tickets" ON tickets
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets" ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Admins can update all tickets
CREATE POLICY "Admins can update all tickets" ON tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Admins can delete all tickets
CREATE POLICY "Admins can delete all tickets" ON tickets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- =============================================
-- INDEXES FOR BETTER QUERY PERFORMANCE
-- =============================================
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- =============================================
-- INITIAL ROLE SETUP (Optional - run once to set up first admin)
-- =============================================
-- After creating your first user via Supabase Auth UI or signup,
-- you can update their profile to make them an admin:
-- UPDATE profiles SET is_admin = true WHERE id = 'your-user-uuid';
