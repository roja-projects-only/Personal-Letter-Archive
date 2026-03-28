# Personal Letter Archive

A small full-stack app: one **writer** (email + password) writes private letters; one **recipient** (name + PIN) reads them and can reply. The UI is split into a recipient experience and a writer (“/write”) area.

## Stack

| Part | Technology |
|------|------------|
| Frontend | React 19, Vite, Tailwind, React Router, TipTap (rich text), Axios |
| Backend | Node.js, Express 5, Prisma, PostgreSQL |
| Auth | HTTP-only JWT cookies (writer); recipient session cookie after PIN verify |
| Optional | Upstash Redis — PIN attempt rate limiting / lockout |

Typical hosting: **frontend on Vercel**, **API + Postgres on Railway** (or any Node + Postgres host).

## Repository layout

```
backend/     Express API, Prisma schema & migrations, seed script
frontend/    Vite React app
```

## Local development

### Prerequisites

- Node.js (current LTS is fine)
- PostgreSQL running locally (or a remote `DATABASE_URL`)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET (16+ characters), FRONTEND_URL=http://localhost:5173
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API listens on `http://localhost:3000` by default. Health check: [http://localhost:3000/health](http://localhost:3000/health).

### Frontend

```bash
cd frontend
cp .env.example .env.development.local
# Leave VITE_API_URL empty so /api is proxied to the backend (see vite.config.js)
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). API calls go to `/api/...` and the dev server proxies them to port 3000.

### Useful commands

| Command | Where | Purpose |
|---------|--------|---------|
| `npm run dev` | backend / frontend | Development servers |
| `npx prisma migrate dev` | backend | Create/apply migrations in development |
| `npx prisma migrate deploy` | backend | Apply migrations in production / CI |
| `npm run db:seed` | backend | Upsert seed author + recipient (uses env vars below) |

Seed overrides (optional): `SEED_AUTHOR_EMAIL`, `SEED_AUTHOR_PASSWORD`, `SEED_RECIPIENT_NAME`, `SEED_RECIPIENT_PIN`.

## Environment variables

### Backend (`backend/.env` or Railway variables)

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | At least 16 characters |
| `FRONTEND_URL` | Strongly recommended in prod | Exact origin of the site (e.g. `https://your-app.vercel.app`). Used for CORS and cookie logic. Must match what users type in the browser (no trailing slash). |
| `NODE_ENV` | Prod | Set to `production` on Railway |
| `PORT` | Usually auto | Railway sets this |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | No | If unset, PIN lockout is skipped locally |
| `LOG_LEVEL` | No | e.g. `info`, `debug` — see [Logging](#logging) |

### Frontend (Vercel / `.env.production`)

| Variable | Notes |
|----------|--------|
| `VITE_API_URL` | Full backend URL **without** a path, e.g. `https://your-service.up.railway.app`. In dev, leave empty to use the Vite proxy. |

Production builds call the API cross-origin; the browser sends cookies only if the backend sets `SameSite=None; Secure` (done when `NODE_ENV=production`) and CORS allows your frontend origin with credentials.

## Deployment checklist (Railway + Vercel)

1. **Postgres** on Railway (or attached DB). Copy `DATABASE_URL` into the API service.
2. **Run migrations** against that database before seeding or serving traffic:
   ```bash
   cd backend
   railway link   # if not already linked
   railway run npx prisma migrate deploy
   ```
3. **Seed** (optional, once or when you reset data):
   ```bash
   railway run npm run db:seed
   ```
   Set `SEED_*` variables in Railway if you do not want the seed script defaults.
4. **API service**: `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), `NODE_ENV=production`, Redis vars if you use Upstash.
5. **Vercel**: `VITE_API_URL` = your Railway API **public** URL.

If you see **401 Unauthorized** after login on production, almost always: wrong `FRONTEND_URL`, wrong `VITE_API_URL`, or migrations never applied (less common for session, but breaks other flows).

## Logging and errors

- **Backend**: [Pino](https://github.com/pinojs/pino) JSON logs. In development, logs are pretty-printed if `pino-pretty` is installed. On Railway, open **Deployments → View logs**. Each request is logged via `pino-http`; uncaught route errors go through a central handler and return JSON `{ "error": "..." }` without leaking stack traces in the body.
- **Startup**: One log line includes flags for whether `JWT_SECRET`, `DATABASE_URL`, and Upstash are present (not the secret values).
- **Frontend**: Failed API responses get a normalized `err.userMessage` on the Axios error object; toasts show user-facing messages where relevant.

Adjust verbosity with `LOG_LEVEL` on the API.

## API overview (high level)

| Prefix | Purpose |
|--------|---------|
| `GET /health` | Liveness |
| `/api/auth/*` | Writer login, logout, session |
| `/api/recipient/*` | PIN verify, recipient session |
| `/api/letters/*` | Letters CRUD (writer) and recipient reads/replies |

See route files under `backend/src/routes/` for exact paths and methods.

## Further reading

- **[docs/plain-english-overview.md](docs/plain-english-overview.md)** — What everything is for, in non-technical language, when you come back to this project later.
- **[backend/README.md](backend/README.md)** — Short API-focused notes.
