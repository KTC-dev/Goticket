# Goticket FIFA World Cup 2026 - Startup Guide

## Prerequisites

- Node.js (version 18+ recommended for backend, 16+ should work for frontend)
- Supabase account and project
- npm or yarn

## Backend Setup

1. Navigate to backend directory:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create `.env` file based on the example:
    ```bash
    # OR create manually:
    echo "PORT=5000
    SUPABASE_URL=your-supabase-project-url
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    NODE_ENV=development" > .env
    ```

4. Set up your Supabase project:
   - Create a new project at https://supabase.com
   - Get your URL, anon key, and service role key from Project Settings > API
   - Run the SQL schema from database_schema.sql in your Supabase SQL editor
   - Optional: Run the seed scripts to populate sample data

5. Seed the database with sample events:
    ```bash
    npm run seed
    ```
    To also seed sample users:
    ```bash
    npm run seed:users
    ```
    Or seed both at once:
    ```bash
    npm run seed:all
    ```

6. Start the backend server:
    ```bash
    npm start          # for production
    npm run dev        # for development (with nodemon)
    ```

    The API will be available at http://localhost:5000

## Frontend Setup

1. Navigate to frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

    The frontend will be available at http://localhost:3000

## Docker Alternative (Optional)

If you prefer using Docker, you can create docker-compose.yml files for both services.

## API Documentation

Once the backend is running, visit:
- http://localhost:5000/api/events - to see sample events
- http://localhost:5000/ - for the welcome message

## Usage Flow

1. Browse events at http://localhost:3000/events
2. Select an event and "Buy Ticket" (note: payment integration would be needed for actual purchases)
3. View your tickets at http://localhost:3000/tickets
4. Learn more at http://localhost:3000/about

## Troubleshooting

### Backend Issues
- "Supabase connection error": Ensure your SUPABASE_URL and SUPABASE_ANON_KEY are correct in .env
- "Address already in use": Change the PORT in .env or stop the conflicting process
- Module not found errors: Run `npm install` again
- "Permission denied" errors: Make sure your Supabase user has the necessary permissions

### Frontend Issues
- Cannot connect to backend: Ensure backend is running on http://localhost:5000
- Blank page: Check browser console for errors
- Dependency issues: Delete node_modules and package-lock.json, then run `npm install` again

## Production Deployment

For production, consider:
- Using a process manager like PM2 for the backend
- Serving the frontend build files through a web server (nginx, Apache)
- Setting up SSL certificates
- Using environment-specific configuration files
- Implementing proper authentication and authorization
- Adding rate limiting and security headers
- Using Supabase's built-in authentication instead of the placeholder JWT system
