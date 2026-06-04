-- Fix for Goticket FIFA World Cup 2026 Events Table Schema Mismatch
-- 
-- PROBLEM: 
-- The events table in your Supabase database has a different schema than expected by the application.
-- This causes the API endpoint /api/events to return a 500 error with message "column events.date does not exist"
--
-- CURRENT TABLE STRUCTURE (as discovered):
-- id, title, description, starts_at, ends_at, location, created_at, updated_at
--
-- EXPECTED TABLE STRUCTURE (from database_schema.sql):
-- id, title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url, created_at, updated_at
--
-- SOLUTION:
-- Since the events table is currently empty (0 rows), we can safely alter it to match the expected schema.
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste the following SQL and run it
-- 4. After running this, restart your backend server
-- 5. The /api/events endpoint should now work correctly
-- 6. You can then run the seed scripts to populate sample data if desired

-- Begin SQL
-- Rename starts_at to date (the application expects a single date field)
ALTER TABLE events RENAME COLUMN starts_at TO date;

-- Drop the ends_at column (not used in current application schema)
ALTER TABLE events DROP COLUMN IF EXISTS ends_at;

-- Add all missing columns with appropriate defaults and constraints
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Match',
ADD COLUMN IF NOT EXISTS teams TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL CHECK (price >= 0) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS available_tickets INTEGER NOT NULL CHECK (available_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tickets INTEGER NOT NULL CHECK (total_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Ensure date is NOT NULL (all events should have a date)
ALTER TABLE events ALTER COLUMN date SET NOT NULL;

-- Update any existing NULL values for safety (though table should be empty)
UPDATE events SET venue = COALESCE(venue, '');
UPDATE events SET category = COALESCE(category, 'Match');
UPDATE events SET teams = COALESCE(teams, '{}');
UPDATE events SET price = COALESCE(price, 0.00);
UPDATE events SET available_tickets = COALESCE(available_tickets, 0);
UPDATE events SET total_tickets = COALESCE(total_tickets, 0);
UPDATE events SET image_url = COALESCE(image_url, '');

-- Verify the table structure
-- \d events  -- Uncomment this line if running in psql, not needed in Supabase SQL editor

-- Optional: Test that the table works correctly
-- INSERT INTO events (title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url)
-- VALUES (
--   'Test Event',
--   'Test description',
--   NOW(),
--   'Test Venue',
--   'Test Location',
--   'Test',
--   '{"Team A", "Team B"}',
--   100.00,
--   50,
--   50,
--   'https://example.com/test.jpg'
-- ) RETURNING *;
-- 
-- DELETE FROM events WHERE title = 'Test Event';
-- End SQL