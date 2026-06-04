# Fix for Goticket FIFA World Cup 2026 API Errors

## Issues Encountered
When testing the API endpoints, I found two issues:

1. **Events endpoint** (`http://localhost:5000/api/events`):
   - Error: `{"message":"column events.date does not exist"}`
   - Root cause: The `events` table has incorrect schema (has `starts_at`/`ends_at` instead of `date`, missing several columns)

2. **Tickets endpoint** (`http://localhost:5000/api/tickets`):
   - Error: `{"message":"Could not find the table 'public.tickets' in the schema cache"}`
   - Root cause: The `tickets` table does not exist in the database

## Root Cause Analysis
According to the STARTUP_GUIDE.md, users are instructed to:
> "Run the SQL schema from database_schema.sql in your Supabase SQL editor"

It appears this step was not completed, resulting in missing or incorrectly structured tables.

## Recommended Solution
Since the tables are either missing or have incorrect schema, the most reliable fix is to:

### Step 1: Run the Complete Database Schema
1. Go to your Supabase project dashboard → SQL Editor
2. Copy and paste the entire contents of `database_schema.sql` and run it
3. This will create the correct tables with the proper schema:
   - `events` table with correct columns (including `date`, `venue`, etc.)
   - `users` table
   - `tickets` table
   - All necessary indexes

### Step 2: Verify Table Creation
After running the schema, you should see:
- `events` table with columns: id, title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url, created_at, updated_at
- `users` table with appropriate columns
- `tickets` table with appropriate columns

### Step 3: Seed Sample Data (Optional but Recommended)
Once the tables are correctly created, populate them with sample data:
```bash
# Seed sample events
npm run seed

# Seed sample users (optional)
npm run seed:users

# Or seed both at once
npm run seed:all
```

### Step 4: Restart Backend Server
```bash
cd backend
npm restart   # or: npm stop followed by npm start
```

## Verification
After completing these steps, test the endpoints:
```bash
curl http://localhost:5000/api/events
# Should return: [] (empty array if no events seeded) or array of event objects

curl http://localhost:5000/api/tickets
# Should return: [] (empty array) or array of ticket objects
```

## Why This Approach Is Best
- Ensures all tables have the exact schema expected by the application
- Matches the documentation in STARTUP_GUIDE.md
- Prevents future schema-related issues
- Is the standard setup process described in the project documentation

## Alternative Approach (If You Have Preserved Data)
If you have existing data in your tables that you need to preserve, please let me know and I can provide a more complex migration solution. However, based on my checks, both the events and tickets tables appear to be empty or non-existent, making the schema recreation approach safe and recommended.