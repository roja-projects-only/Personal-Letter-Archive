# Project Plan — Personal Letter Archive

> A private, intimate web application for writing and sharing personal letters with one specific recipient. Accessible only by the author and a single person granted access via a PIN and name verification system.

---

## Overview

This is a two-sided application. On one side, the **author** (you) logs in securely to write, manage, and review letters and replies. On the other side, the **recipient** accesses the site through a shared link, passes a PIN and name verification gate, and reads the letters and optionally replies to them. No one else can access any part of the content.

---

## Architecture

The application is split into two separate deployments that communicate over HTTP:

### Frontend — Vite + React
- Deployed on **Vercel**
- Handles all UI — login screens, the letter editor, the recipient gate, the letter viewer, and the reply system
- Communicates with the backend via a REST API
- Uses React Router for client-side routing
- Stores session tokens in `httpOnly` cookies for security

### Backend — Express.js
- Deployed on **Railway**
- Exposes a REST API consumed by the frontend
- Handles all business logic: authentication, letter CRUD, recipient validation, rate limiting, and reply management
- Never exposes sensitive data like raw passwords or PINs

### Database — PostgreSQL
- Also on **Railway**, in the same project as the backend
- Managed through **Prisma ORM**
- Stores users, letters, recipient credentials, and replies

### Rate Limiting — Upstash Redis
- A serverless Redis instance (free tier)
- Tracks failed PIN attempts per IP address
- Locks out an IP for 5 minutes after 5 consecutive failed attempts

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | Vite + React | Fast dev experience, SPA architecture |
| Routing | React Router v6 | Client-side page navigation |
| Styling | Tailwind CSS | Utility-first styling, fast to build with |
| Rich Text Editor | Tiptap | Extensible editor built on ProseMirror, outputs HTML |
| HTTP Client | Axios | Communicates with the Express backend |
| HTML Sanitization | DOMPurify | Sanitizes letter HTML before rendering in the browser |
| Backend Framework | Express.js | Lightweight Node.js server, REST API |
| ORM | Prisma | Type-safe database access, schema management |
| Database | PostgreSQL (Railway) | Persistent relational data storage |
| Password Hashing | bcrypt | Hashes passwords and PINs before storing |
| Session/Auth Tokens | jose (JWT) | Issues and verifies signed JWT tokens |
| Rate Limiting | Upstash Redis | Tracks and limits failed PIN attempts |
| Deployment (FE) | Vercel | Hosts the React SPA |
| Deployment (BE) | Railway | Hosts the Express server and PostgreSQL DB |

---

## Database Schema

### `User` — The Author (You)
Stores your login credentials. There will only ever be one row in this table.

| Field | Type | Description |
|---|---|---|
| id | String (UUID) | Primary key |
| email | String | Your login email |
| passwordHash | String | bcrypt-hashed password |
| createdAt | DateTime | Account creation timestamp |

---

### `Recipient` — Her
Stores the recipient's access credentials. There will only ever be one row.

| Field | Type | Description |
|---|---|---|
| id | String (UUID) | Primary key |
| name | String | Her name — must match exactly on login |
| pinHash | String | bcrypt-hashed 4-digit PIN |
| createdAt | DateTime | Record creation timestamp |

---

### `Letter` — Your Writings
Each letter is a timestamped entry with a rich-text body.

| Field | Type | Description |
|---|---|---|
| id | String (UUID) | Primary key |
| title | String? | Optional title for the letter (nullable in DB) |
| content | Text | Rich HTML content from Tiptap editor |
| createdAt | DateTime | When the letter was written |
| updatedAt | DateTime | Last edit timestamp |
| viewedAt | DateTime? | Set on first recipient `GET /api/letters/:id` — drives the "new" tag in the list |
| authorId | String | Foreign key → User |

---

### `Reply` — Her Responses
Each reply is linked to a specific letter and to the recipient.

| Field | Type | Description |
|---|---|---|
| id | String (UUID) | Primary key |
| content | Text | Plain or rich text reply content |
| createdAt | DateTime | When the reply was written |
| letterId | String | Foreign key → Letter |
| recipientId | String | Foreign key → Recipient |

---

## Application Routes

### Frontend Routes (React Router)

| Path | View | Who Accesses It |
|---|---|---|
| `/write` | Author login page | You |
| `/write/dashboard` | Overview of all letters + reply notifications | You |
| `/write/new` | New letter form with Tiptap editor | You |
| `/write/letters/:id` | View/edit a specific letter + see her replies | You |
| `/` | Recipient gate — PIN + name entry form | Her |
| `/letters` | Chronological list of all your letters | Her |
| `/letters/:id` | Read a single letter + submit a reply | Her |

---

### Backend API Endpoints (Express.js)

#### Auth — Author
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Accepts email + password, returns a signed JWT |
| POST | `/api/auth/logout` | Clears the author's session cookie |
| GET | `/api/auth/me` | Returns current author session info |

#### Auth — Recipient
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/recipient/verify` | Accepts PIN + name, validates both, returns a signed JWT. Rate limited. |
| GET | `/api/recipient/session` | Returns 200 if recipient JWT is valid; 401 if missing or expired (used by route guards) |
| POST | `/api/recipient/logout` | Clears the recipient's session cookie |

#### Letters
| Method | Endpoint | Who | Description |
|---|---|---|---|
| GET | `/api/letters` | Both | Returns all letters (chronological). Each item includes `replyCount` (integer) for dashboard/list UIs. Author sees full data; recipient sees published content. |
| GET | `/api/letters/:id` | Both | Returns a single letter with its replies. On first recipient access, backend sets `viewedAt` if null. |
| POST | `/api/letters` | Author only | Creates a new letter |
| PUT | `/api/letters/:id` | Author only | Updates an existing letter |
| DELETE | `/api/letters/:id` | Author only | Deletes a letter |

#### Replies
| Method | Endpoint | Who | Description |
|---|---|---|---|
| POST | `/api/letters/:id/replies` | Recipient only | Submits a reply to a specific letter |
| GET | `/api/letters/:id/replies` | Author only | Gets all replies to a specific letter |

---

## Authentication Flow

### Author Login
1. You navigate to `/write`
2. Enter email + password
3. Frontend sends `POST /api/auth/login`
4. Backend looks up the User by email, compares password with `bcrypt.compare()`
5. If valid → backend signs a JWT with your user ID and role (`author`), sets it as an `httpOnly` cookie
6. Frontend redirects you to `/write/dashboard`
7. All `/write/*` routes check for a valid author JWT on every request. If missing or expired → redirect to `/write`

### Recipient Access
1. She opens the shared link, lands on `/`
2. Enters her 4-digit PIN and her name
3. Frontend sends `POST /api/recipient/verify`
4. Backend checks Upstash Redis — if IP has 5+ recent failures, return a 429 with a retry-after time
5. If not rate limited → compare PIN with `bcrypt.compare()` against the stored pinHash
6. Compare submitted name (case-insensitive) against the stored recipient name
7. Both must match. If either fails → increment failure count in Redis, return an error
8. If both match → sign a JWT with recipient ID and role (`recipient`), set as `httpOnly` cookie
9. Frontend redirects her to `/letters`
10. All `/letters/*` routes verify the recipient JWT. If missing or expired → redirect to `/`

---

## Rate Limiting Logic (PIN Gate)

- Tracked per IP address in Upstash Redis
- Key format: `pin_attempts:<ip_address>`
- Each failed attempt increments the counter with a TTL of 5 minutes
- On the 5th failed attempt (and while lockout is active), the backend returns:
  ```
  HTTP 429 — Too Many Requests
  { error: "Too many attempts. Try again in 5 minutes.", retryAfter: <seconds> }
  ```
  `retryAfter` is the remaining lockout time in seconds so the frontend can show an accurate countdown.
- After 5 minutes the Redis key expires automatically, resetting the counter
- Successful login clears the counter immediately

---

## Letter Editor (Tiptap)

The Tiptap editor will support:
- **Bold**, *italic*
- Headings (H1, H2, H3 via starter-kit)
- Paragraph breaks
- Blockquotes (good for reflective writing)
- Bullet and numbered lists
- The output is clean HTML stored in the `content` field of the Letter table

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| Password/PIN stored as plaintext | All hashed with bcrypt (cost factor 12) |
| JWT stolen from cookies | Cookies are `httpOnly` and `Secure` — inaccessible to JavaScript |
| PIN brute force | Rate limited to 5 attempts per 5 minutes per IP via Upstash Redis |
| Unauthorized letter access | Every API route checks JWT role — author vs recipient — server-side |
| CORS | Production: backend only allows the Vercel frontend origin. Development: allow `http://localhost:5173` or use a Vite dev proxy so the browser calls same-origin `/api` |
| Environment secrets | All credentials (DB URL, JWT secret, Redis URL) stored in `.env`, never committed |

---

## Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://...
JWT_SECRET=a_long_random_secret_string
JWT_EXPIRES_IN=7d
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend `.env`
```
VITE_API_URL=https://your-backend.railway.app
```

---

## Project Folder Structure

```
/
├── frontend/                   # Vite + React app → deployed to Vercel
│   ├── src/
│   │   ├── pages/
│   │   │   ├── WriterLogin.jsx
│   │   │   ├── WriterDashboard.jsx
│   │   │   ├── WriterNewLetter.jsx
│   │   │   ├── WriterLetterDetail.jsx
│   │   │   ├── RecipientGate.jsx
│   │   │   ├── RecipientLetterList.jsx
│   │   │   └── RecipientLetterDetail.jsx
│   │   ├── components/
│   │   │   ├── ui/                 # PrimaryButton, GhostButton, tags, LetterCard, etc.
│   │   │   ├── Editor.jsx          # Tiptap rich text editor
│   │   │   ├── PinInput.jsx
│   │   │   ├── RequireAuthor.jsx
│   │   │   └── RequireRecipient.jsx
│   │   ├── api/                    # Axios wrappers
│   │   ├── hooks/                  # useAuthorSession, useRecipientSession
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── backend/                    # Express.js app → deployed to Railway
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js             # Author login/logout
│   │   │   ├── recipient.js        # Recipient verify/logout
│   │   │   ├── letters.js          # Letter CRUD
│   │   │   └── replies.js          # Reply endpoints
│   │   ├── middleware/
│   │   │   ├── requireAuthor.js    # JWT check for author routes
│   │   │   ├── requireRecipient.js # JWT check for recipient routes
│   │   │   └── rateLimit.js        # Upstash Redis rate limiter
│   │   ├── lib/
│   │   │   ├── prisma.js           # Prisma client singleton
│   │   │   └── redis.js            # Upstash client
│   │   └── index.js                # Express app entry point
│   └── .env
```

---

## Build & Deployment Order

1. **Set up Railway** — create a project, add PostgreSQL plugin, add a service for the Express backend
2. **Set up Upstash** — create a Redis database, copy REST URL and token
3. **Initialize backend** — `npm init`, install dependencies, write Prisma schema, run first migration
4. **Seed the database** — insert the one User row (your email + hashed password) and the one Recipient row (her name + hashed PIN) via a seed script
5. **Build and deploy backend** to Railway
6. **Initialize frontend** — `npm create vite@latest`, install dependencies, configure `VITE_API_URL`
7. **Deploy frontend** to Vercel, set environment variables in Vercel dashboard
8. **Test the full flow** — author login → write a letter → recipient gate → read letter → reply → author sees reply

---

*This document covers the full planning scope of the project. Frontend implementation lives under `frontend/`; backend is separate.*
