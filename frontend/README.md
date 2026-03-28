# Personal Letter Archive — Frontend

React (Vite) app for the recipient flow and the writer (`/write`) area. API calls use Axios with `withCredentials: true` so session cookies work.

See **[../README.md](../README.md)** for full project documentation and **[../docs/plain-english-overview.md](../docs/plain-english-overview.md)** for a non-technical overview.

## Local development

```bash
npm install
cp .env.example .env.development.local
# Leave VITE_API_URL empty — Vite proxies /api to http://localhost:3000
npm run dev
```

Run the **backend** on port 3000 at the same time (see `backend/README.md`).

## Production (e.g. Vercel)

Set **`VITE_API_URL`** to your API’s public base URL (no path), e.g. `https://your-service.up.railway.app`.

```bash
npm run build
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
