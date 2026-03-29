# Agent instructions — Personal Letter Archive

This file is for AI coding agents working in this repository. Follow it in addition to any user rules or project README.

## What this project is

**Personal Letter Archive** is a small full-stack app:

- A **writer** signs in with email and password and writes private letters (rich text via TipTap).
- A **recipient** enters their name and PIN to read letters and reply.

| Area | Stack |
|------|--------|
| `frontend/` | React 19, Vite, Tailwind, React Router, TipTap, Axios |
| `backend/` | Node.js, Express 5, Prisma, PostgreSQL |
| Auth | HTTP-only JWT cookies (writer); recipient session after PIN verification |
| Optional | Upstash Redis for PIN rate limiting |

Layout: `backend/` (API, Prisma schema and migrations, seed), `frontend/` (Vite app). See the root `README.md` for local setup, env vars, and deployment notes.

## Version control (required)

**After each completed task**, record the work in Git so the repo stays versioned and reversible.

1. From the **repository root**, stage **all** changes:

   ```bash
   git add .
   ```

2. Commit with a **clear, descriptive message** that states what was done and why (not a vague message like “updates”):

   ```bash
   git commit -m "Brief imperative summary of the change"
   ```

**Rules:**

- Use `git add .` for staging as part of this workflow unless the user explicitly asks for a different staging strategy.
- If the task produced **no** file changes, do not create an empty commit.
- Do **not** commit secrets or override `.gitignore` to add `.env` or similar; keep credentials out of the repository.

Push when the user asks for it or when your workflow expects it; the minimum bar after each task is **add + commit** as above.
