-- Goticket FIFA World Cup 2026 - Fix Events Table Schema
-- Run these SQL commands in your Supabase SQL editor to fix the events table schema

-- First, backup the existing data (optional but recommended)
CREATE TABLE events_backup AS TABLE events;

-- Add missing columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Match',
ADD COLUMN IF NOT EXISTS teams TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL CHECK (price >= 0) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS available_tickets INTEGER NOT NULL CHECK (available_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tickets INTEGER NOT NULL CHECK (total_tickets >= 0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Convert starts_at to date (assuming we want to use starts_at as the main date)
-- First, add the date column
ALTER TABLE events ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE;

-- Copy data from starts_at to date
UPDATE events SET date = starts_at WHERE date IS NULL;

-- Make date NOT NULL (assuming all events should have a date)
ALTER TABLE events ALTER COLUMN date SET NOT NULL;

-- Optional: Drop ends_at column if not needed
-- ALTER TABLE events DROP COLUMN IF EXISTS ends_at;

-- Update any existing NULL values for new columns with defaults
UPDATE events SET venue = '' WHERE venue IS NULL;
UPDATE events SET category = 'Match' WHERE category IS NULL;
UPDATE events SET teams = '{}' WHERE teams IS NULL;
UPDATE events SET price = 0.00 WHERE price IS NULL;
UPDATE events SET available_tickets = 0 WHERE available_tickets IS NULL;
UPDATE events SET total_tickets = 0 WHERE total_tickets IS NULL;
UPDATE events SET image_url = '' WHERE image_url IS NULL;

-- Verify the table structure
\d events

-- Sample data verification
SELECT * FROM events LIMIT 5;