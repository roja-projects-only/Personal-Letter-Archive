# Personal Letter Archive — API

Express + Prisma + PostgreSQL + optional Upstash Redis (PIN rate limit). Structured logs with **Pino** / **pino-http**.

For **architecture, deployment, env vars, and troubleshooting**, see the **[repository root README.md](../README.md)**.

## Quick setup (local)

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET` (16+ chars), `FRONTEND_URL` (e.g. `http://localhost:5173`). Upstash vars are optional locally — PIN lockout is skipped if Redis is unset.

2. Apply migrations:

```bash
npx prisma migrate deploy
# or during active schema work:
npx prisma migrate dev
```

3. Seed the author + recipient:

```bash
npm run db:seed
```

Override defaults with `SEED_AUTHOR_EMAIL`, `SEED_AUTHOR_PASSWORD`, `SEED_RECIPIENT_NAME`, `SEED_RECIPIENT_PIN`.

4. Run:

```bash
npm run dev
```

## Production (Railway)

Apply migrations to the **same** `DATABASE_URL` the app uses, then seed if needed:

```bash
railway run npx prisma migrate deploy
railway run npm run db:seed
```

If the seed says a table does not exist, migrations were not applied to that database.

## Health

`GET /health` — `{ "ok": true }`

## Logging

Set `LOG_LEVEL` (e.g. `info`, `debug`). Production uses JSON logs suitable for Railway’s log viewer.
