# Fix for Goticket FIFA World Cup 2026 API Error

## Issue
When accessing `http://localhost:5000/api/events`, you receive a 500 Internal Server Error with the message:
```
{"message":"column events.date does not exist"}
```

## Root Cause
The `events` table in your Supabase database has a different schema than expected by the application. Specifically:

**Current table structure:**
- id, title, description, starts_at, ends_at, location, created_at, updated_at

**Expected table structure (from database_schema.sql):**
- id, title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url, created_at, updated_at

The application expects a `date` column, but your table has `starts_at` and `ends_at` columns instead. Additionally, several other columns are missing.

## Verification Steps Taken
1. Confirmed the backend server is running and connecting to Supabase correctly
2. Verified that the events table exists but is empty (0 rows)
3. Discovered the actual column names in the events table through direct API queries
4. Confirmed that the table schema does not match the application expectations

## Solution
Since the events table is currently empty, we can safely alter it to match the expected schema. Run the following SQL in your Supabase SQL editor:

```sql
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
```

## Post-Fix Steps
1. After running the SQL above, restart your backend server:
   ```bash
   cd backend
   npm restart   # or: npm stop followed by npm start
   ```
2. The `/api/events` endpoint should now return an empty array (since the table is empty) instead of a 500 error
3. To populate the table with sample events, run:
   ```bash
   npm run seed
   ```
4. To also seed sample users:
   ```bash
   npm run seed:users
   ```

## Additional Notes
- If you have existing data in your events table that you need to preserve, a different approach would be needed. However, since the table was found to be empty, the above solution is safe.
- If you continue to experience issues, verify that you're running the SQL against the correct Supabase project that your backend is connected to (check your SUPABASE_URL in backend/.env).
- The frontend should now be able to display events correctly once sample data is seeded.