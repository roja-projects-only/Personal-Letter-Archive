# Plain English: What This Project Is

This note is for **future you** (or anyone helping you) who does not want to read code. It explains what the app does, where it lives, and what usually goes wrong.

---

## What problem does this solve?

You wanted a **private place** to write letters to one person. They can open the site, prove who they are with a **PIN**, read what you wrote, and **reply**. You log in separately as the **writer** with **email and password** so only you can create or edit letters.

There are basically **two doors** into the same website:

1. **Recipient path** — Home page → enter PIN → see letters and replies.
2. **Writer path** — “Write” / `/write` → email + password → dashboard to compose letters.

---

## Where does it actually run?

Think of two separate programs that talk over the internet:

| Piece | What it is | Typical home |
|-------|----------------|---------------|
| **The website** (buttons, pages, colors) | The “frontend” | **Vercel** (or similar) |
| **The brain + filing cabinet** (saving letters, checking passwords) | The “backend” + database | **Railway** (or similar) |

Your **database** (where letters and accounts are stored) is almost always next to the backend — on Railway, that is usually a **PostgreSQL** add-on.

So: browser loads the site from Vercel → the site calls your API on Railway → Railway reads/writes Postgres.

---

## What are “environment variables”?

They are **settings the server reads**, not part of the code. Things like “where is the database?”, “what is the secret key for login tokens?”, “what is the exact URL of my website?”

You already added **seed** settings on Railway (`SEED_AUTHOR_EMAIL`, etc.). Those are only for the **one-time script** that creates the first writer and recipient in the database. They are not what keeps day-to-day login working — that still needs `JWT_SECRET`, `DATABASE_URL`, `FRONTEND_URL`, and (on Vercel) `VITE_API_URL`.

---

## Database: migrations vs seed (easy mix-up)

- **Migrations** = “create the empty tables (User, Letter, …)”. **You must run these before the app or seed can work.**  
  If something says the table `User` does not exist, migrations were not applied to **that** database.

- **Seed** = “put the first accounts in those tables”. Run **after** migrations.

On your computer, from the `backend` folder with Railway linked, people often run:

- `railway run npx prisma migrate deploy` — create/update tables on Railway’s Postgres  
- `railway run npm run db:seed` — fill initial writer + recipient (using your `SEED_*` variables)

---

## “Unauthorized” after login — what that usually means

The writer login **sets a small cookie** in the browser so the next request proves you are logged in. For that to work when the site is on **Vercel** and the API on **Railway**:

1. **The backend must trust your real site address** — variable `FRONTEND_URL` must be exactly your Vercel URL (for example `https://something.vercel.app`), no typo, no extra slash at the end unless you really use it that way everywhere.

2. **The frontend must know where the API is** — on Vercel, `VITE_API_URL` must be your Railway API URL (the one that shows `health` when you open `/health` in a browser).

3. **Production mode** — the server should think it is in production (`NODE_ENV=production`) so cookies are set the way browsers require for cross-site use.

If **PIN verify works** but **session fails** right after, it is very often a cookie or URL mismatch, not “wrong password.”

---

## Logs when something breaks

- **Railway**: open your API service → **Deployments** → **View logs**. You should see lines for each request and errors when something throws. That is the first place to look after a deploy.

- **Your laptop**: when developing, the backend terminal prints the same style of logs (easier to read locally).

You do not need to understand every line — look for **error** right before the time you clicked something that failed.

---

## Quick “I forgot everything” checklist

1. Frontend on Vercel, backend + DB on Railway (or same idea elsewhere).  
2. Migrations applied to the **production** database.  
3. `FRONTEND_URL` = Vercel site URL.  
4. `VITE_API_URL` = Railway API base URL.  
5. `JWT_SECRET` set and long enough.  
6. Seed ran if you need the first user/recipient.

---

## Where to read technical detail

The main **[README.md](../README.md)** in the project root has commands, env tables, and deployment steps for developers.
