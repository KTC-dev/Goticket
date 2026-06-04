-- Goticket FIFA World Cup 2026 - Fix Events Table Schema
-- Run this SQL in your Supabase SQL editor to fix the events table schema
-- Since the table is empty (as verified), we can safely alter it

-- Rename starts_at to date
ALTER TABLE events RENAME COLUMN starts_at TO date;

-- Drop the ends_at column (not used in current schema)
ALTER TABLE events DROP COLUMN IF EXISTS ends_at;

-- Add missing columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Match',
ADD COLUMN IF NOT EXISTS teams TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL CHECK (price >= 0) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS available_tickets INTEGER NOT NULL CHECK (available_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tickets INTEGER NOT NULL CHECK (total_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Ensure date is NOT NULL (assuming all events should have a date)
ALTER TABLE events ALTER COLUMN date SET NOT NULL;

-- Update any existing NULL values for new columns with defaults (for safety)
UPDATE events SET venue = '' WHERE venue IS NULL;
UPDATE events SET category = 'Match' WHERE category IS NULL;
UPDATE events SET teams = '{}' WHERE teams IS NULL;
UPDATE events SET price = 0.00 WHERE price IS NULL;
UPDATE events SET available_tickets = 0 WHERE available_tickets IS NULL;
UPDATE events SET total_tickets = 0 WHERE total_tickets IS NULL;
UPDATE events SET image_url = '' WHERE image_url IS NULL;

-- Verify the table structure matches expectations
\d events

-- Insert sample data to verify everything works
INSERT INTO events (title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url)
VALUES (
  'Test Event',
  'Test description',
  NOW(),
  'Test Venue',
  'Test Location',
  'Test',
  '{"Team A", "Team B"}',
  100.00,
  50,
  50,
  'https://example.com/test.jpg'
) RETURNING *;

-- Clean up the test event
DELETE FROM events WHERE title = 'Test Event';