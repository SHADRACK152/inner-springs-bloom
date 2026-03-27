# InnerSprings Africa

## Run locally

1. Create an environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL (pick one):

Option A - Docker (recommended):

```bash
npm run db:start
```

Option B - Local PostgreSQL service:

```bash
createdb innersprings
```

3. Ensure your `DATABASE_URL` in `.env` points to your running database:

```bash
postgresql://postgres:postgres@localhost:5432/innersprings
```

4. Install dependencies:

```bash
npm install
```

5. Start frontend and local API together:

```bash
npm run dev:full
```

Or start the full local stack (DB + API + frontend) with one command:

```bash
npm run app:start
```

`app:start` will try to start PostgreSQL via Docker Compose first, then run API + frontend.
If Docker is unavailable, it still starts API + frontend and the API keeps retrying DB connection until PostgreSQL is up.

6. Open the app at `http://localhost:8080`

Local API runs at `http://localhost:4000` and persists data in PostgreSQL.
Health endpoint: `http://localhost:4000/api/health`

## Demo credentials

- Client login:
	- Email: `sarah.w@email.com`
	- Password: `password123`
- Admin login:
	- Email: `admin@innersprings.africa`
	- Password: `admin123`

## Deploy to Vercel

This project is configured for a single Vercel deployment that serves:

- React frontend (Vite)
- API routes under `/api/*` using `api/index.js` (Express app from `server/index.js`)

### 1. Push code to GitHub

Commit and push this repository to GitHub (or GitLab/Bitbucket).

### 2. Import project in Vercel

In Vercel:

1. Click **Add New...** -> **Project**
2. Import your repository
3. Keep framework preset as **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

### 3. Set environment variables in Vercel

Add these variables for Production (and Preview if desired):

- `DATABASE_URL`: your Neon/Postgres connection string
- `VITE_API_URL`: leave empty (recommended when frontend and API are on same Vercel domain)

If you deploy API and frontend to different domains, set `VITE_API_URL` to the full API domain URL.

### 4. Deploy

Click **Deploy**. After deployment:

- App URL serves frontend
- API health check is available at `/api/health`

### Notes

- `vercel.json` rewrites `/api/*` to the serverless API handler and all other paths to `index.html` for React Router.
- First request after cold start may take longer while DB initialization runs.
