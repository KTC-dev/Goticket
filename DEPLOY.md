Deploying this project
======================

This repo contains a `frontend/` React app and a `backend/` Express API. Two common deployment options:

1) Push the repo to GitHub (recommended) and enable Vercel for the frontend.
2) Deploy the backend to a server (Heroku, Render, Railway) and point the frontend to its URL.

Quick steps — push to GitHub

- Initialize a git repo and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-username>/<repo>.git
git push -u origin main
```

Deploy frontend to Vercel

- Create a Vercel project and point it to this GitHub repo, or use the GitHub Actions workflow included at `.github/workflows/vercel-deploy.yml`.
- If your backend is hosted on Supabase (Postgres + Edge Functions / REST), configure the frontend to call the Supabase endpoints rather than a localhost server.
- Set these Vercel Environment Variables (Project → Settings → Environment Variables):
  - `REACT_APP_SUPABASE_URL` — your Supabase URL
  - `REACT_APP_SUPABASE_ANON_KEY` — your Supabase anon/public key
  - `REACT_APP_API_URL` — the public URL for your backend API (if you use an external API or Supabase Edge Function), e.g. `https://<project>.supabase.co/functions/v1` or your custom API URL

If you prefer to keep the custom Node backend in this repo but run DB on Supabase, deploy the Node app to Render/Railway and set `REACT_APP_API_URL` to that host.

Deploy backend

- For the backend, recommended hosts: Render, Railway, or Heroku.
- If you want to deploy the backend on Vercel Serverless Functions, create a separate Vercel project from the `backend/` folder and configure `build` to run `npm install && npm run build` (or run with Node server on Render/Railway).
- Ensure backend env vars (in `backend/.env`) are set on the host: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and any SMTP vars if you use welcome emails.

Using Supabase for backend

- If you are using Supabase as the primary backend (database + Edge Functions):
  - Seed your `events` and `profiles` tables via the `backend/seeds` scripts or via Supabase SQL editor.
  - Consider moving backend logic (pricing, event transformation) into Supabase Edge Functions. If you do that, set `REACT_APP_API_URL` to the function endpoint and ensure the function uses the `SUPABASE_SERVICE_ROLE_KEY` securely on the server side.
  - For serverless edge functions use the Supabase dashboard or `supabase` CLI to deploy functions and get their public URL.


Local testing

```bash
# Backend
cd backend
npm ci
npm run dev

# Frontend
cd ../frontend
npm ci
npm start
```

If you want, I can create a GitHub repo and push these changes for you — you will need to provide a GitHub token with repo permissions, or run the push commands locally. I can also add a separate workflow to deploy the `backend/` automatically if you prefer.
