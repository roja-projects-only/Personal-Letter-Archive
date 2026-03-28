# Personal Letter Archive — API

Express + Prisma + PostgreSQL + Upstash Redis (PIN rate limit).

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET` (16+ chars), and Upstash Redis URL/token (optional for local dev — PIN lockout is skipped if Redis is unset).

2. Apply migrations:

```bash
npx prisma migrate deploy
# or during development:
npx prisma migrate dev
```

3. Seed the single author + recipient:

```bash
npm run db:seed
```

Override defaults with `SEED_AUTHOR_EMAIL`, `SEED_AUTHOR_PASSWORD`, `SEED_RECIPIENT_NAME`, `SEED_RECIPIENT_PIN`.

4. Run:

```bash
npm run dev
```

API: `http://localhost:3000` — use with the Vite dev proxy (`/api` → this server).

## Health

`GET /health` — `{ "ok": true }`
