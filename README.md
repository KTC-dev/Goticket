# Goticket FIFA World Cup 2026

A full-stack ticketing system for the FIFA World Cup 2026 tournament.

## Project Structure

- `backend/` - Node.js/Express API with Supabase PostgreSQL
- `frontend/` - React application

## Backend Features

- RESTful API for events and tickets
- Supabase PostgreSQL database with tables for Events, Tickets, and Users
- JWT authentication (placeholder - can be extended)
- Seed data for FIFA World Cup 2026 events
- Environment configuration with .env file

### API Endpoints

**Events:**
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID
- POST `/api/events` - Create new event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

**Tickets:**
- GET `/api/tickets` - Get all tickets
- GET `/api/tickets/:id` - Get ticket by ID
- POST `/api/tickets` - Create new ticket
- PUT `/api/tickets/:id` - Update ticket
- GET `/api/tickets/user/:userId` - Get tickets by user

## Frontend Features

- React 18 with React Router v6
- Responsive design
- Pages:
  - Home: Landing page with information
  - Events: Browse and view FIFA World Cup events
  - Tickets: View purchased tickets
  - About: Information about Goticket

## Setup Instructions

### Backend
1. Navigate to `backend/` directory
2. Install dependencies: `npm install`
3. Set up Supabase project and get your URL and keys
4. Create `.env` file with Supabase credentials (see below)
5. Seed database: `npm run seed` (for events) and `npm run seed:users` (for sample users)
6. Start server: `npm start` or `npm run dev` for development

### Frontend
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Create `frontend/.env` with your Supabase URL and anon key
4. Start development server: `npm start`

## Environment Variables

Create a `.env` file in the backend directory with:
```
PORT=5000
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NODE_ENV=development
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
WELCOME_EMAIL_FROM="Goticket <no-reply@yourdomain.com>"
```

Create a `.env` file in the frontend directory with:
```
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find your Supabase URL, anon key, and service role key in your Supabase project settings.

## Sample Data

The backend includes seed data for:
- Opening Match
- USA vs Canada
- Brazil vs Argentina
- Semifinal 1
- Final

## Technologies Used

**Backend:**
- Node.js
- Express.js
- Supabase PostgreSQL
- @supabase/supabase-js client
- CORS middleware
- dotenv for environment variables
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v6
- CSS3 for styling

## Future Enhancements

- User authentication and authorization
- Payment processing integration
- QR code generation for tickets
- Admin dashboard for event management
- Real-time ticket availability updates
- Mobile responsiveness improvements
- Testing suite (Jest, React Testing Library)
 
## Deployment

See [DEPLOY.md](DEPLOY.md) for instructions to push to GitHub and deploy the frontend to Vercel. A GitHub Actions workflow is included to build the frontend and deploy to Vercel on pushes to `main`.

If your backend is hosted on Supabase (database, Edge Functions, or REST), set `REACT_APP_API_URL` in Vercel to point at your Supabase function endpoint or the public API URL used for server endpoints. Also set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in Vercel for client-side Supabase operations.
