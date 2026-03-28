# Frontend UI/UX Plan — Personal Letter Archive

> This document covers the complete frontend design and implementation plan for the personal letter archive app. Stack: Vite + React, Tailwind CSS, React Router v6, Tiptap. Deployed on Vercel.

---

## Design System

Before building any page, set up the design system first. Every color, font, spacing, and component decision flows from here.

### Color Palette

Define these as CSS custom properties in `src/index.css`:

```css
:root {
  --cream:       #FDF6F0;
  --blush:       #F5D5CE;
  --rose:        #C97B84;
  --rose-deep:   #A55A66;
  --rose-light:  #FFF0EE;
  --amber:       #D4956A;
  --ink:         #3D2B1F;
  --ink-muted:   #9B7B6F;
  --card:        #FFFAF8;
  --border:      #EDD8D0;
  --green-soft:  #EEF5EE;
  --green-text:  #5A8A5A;
}
```

**Color usage rules:**
- `--cream` — page backgrounds
- `--card` — card/letter surfaces
- `--blush` — decorative fills, soft highlights, new-letter tags
- `--rose` — all primary interactive elements (buttons, active states, tags, reply counts)
- `--rose-deep` — rose text on blush backgrounds
- `--rose-light` — hover states, reply textarea background
- `--amber` — neutral stats, secondary accents
- `--ink` — all body text and headings
- `--ink-muted` — timestamps, labels, placeholders, secondary text
- `--border` — all borders and dividers
- `--green-soft / --green-text` — "replied" tag only

---

### Typography

Install these fonts via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Lato:wght@300;400&display=swap" rel="stylesheet" />
```

| Use | Font | Weight | Style |
|---|---|---|---|
| Page headings, letter titles | EB Garamond | 400 | Italic |
| Subheadings, letter body | EB Garamond | 400 | Regular |
| Labels, timestamps, UI text | Lato | 300 / 400 | Regular |
| Uppercase tracking labels | Lato | 400 | Uppercase + letter-spacing: 2px |

**Rules:**
- All letter content uses EB Garamond, line-height 1.9
- All UI chrome (buttons, nav, inputs, labels) uses Lato
- Italic is used intentionally for letter titles and emotional headings only
- Never use font-weight 700+ — the design is soft, not heavy

---

### Spacing Scale

Follow Tailwind's default scale. Key values used in this design:

| Token | Value | Usage |
|---|---|---|
| `p-4` | 16px | Card internal padding |
| `p-6` | 24px | Page section padding |
| `p-8` | 32px | Letter reading view padding |
| `gap-2` | 8px | Pin boxes, small gaps |
| `gap-3` | 12px | Stat cards grid gap |
| `mb-4` | 16px | Standard block spacing |
| `mb-6` | 24px | Section spacing |

---

### Border Radius

| Element | Value |
|---|---|
| Buttons | `rounded-full` (pill shape) |
| Cards, letter cards | `rounded-xl` (12px) |
| Inputs | `rounded-[10px]` |
| PIN boxes | `rounded-[10px]` |
| Tags / badges | `rounded-full` |
| Stat cards | `rounded-[10px]` |

---

### Reusable Components

Build these first before pages. They are used everywhere.

#### `<PrimaryButton />`
- Background: `--rose`, text: white
- Shape: `rounded-full`, padding: `py-2.5 px-7`
- Font: Lato 14px
- Hover: slightly darker rose (`--rose-deep`)
- Used for: "open ♡", "+ new letter", "send ♡"

#### `<GhostButton />`
- Background: transparent, border: `1px solid var(--border)`
- Text: `--ink-muted`
- Shape: `rounded-full`, padding: `py-1.5 px-3`
- Font: Lato 12px
- Used for: "← back", "edit"

#### `<TagNew />`
- Background: `--blush`, text: `--rose-deep`
- Font: Lato 10px uppercase, `rounded-full`, padding: `py-0.5 px-2`
- Label: "new"

#### `<TagReplied />`
- Background: `--green-soft`, text: `--green-text`
- Same sizing as `<TagNew />`
- Label: "replied"

#### `<DecorativeLine />`
- `width: 40px`, `height: 1px`, `background: --blush`
- Used as a section divider under page headings

#### `<LetterCard />`
- Background: `--card`, border: `1px solid var(--border)`, `rounded-xl`
- Padding: `p-4`, margin-bottom: `mb-2.5`
- Hover: border changes to `--rose`
- Transition: `border-color 0.2s`
- **`variant="vertical"` (default):** title (italic EB Garamond 15px), timestamp (Lato 12px muted), excerpt (Lato 13px muted), optional tag — used on recipient list
- **`variant="horizontal"`:** flex row — left: title (italic 14px) + timestamp + reply count line; right: slot for `<GhostButton>` "edit" — used on writer dashboard. No excerpt in this variant.

**Tag logic (recipient list):** show `<TagNew />` when `viewedAt` is null; show `<TagReplied />` when `replyCount > 0` (if both apply, prefer "replied" or show both per product choice — default: show "replied" if any replies, else "new" if unread).

#### `<PageShell />`
- Wraps all pages
- Background: `--cream`, min height: 100vh
- **`maxWidth` prop:** Tailwind max-width class for the inner content wrapper — default `max-w-xl` (recipient flows); writer pages pass `max-w-2xl` (matches dashboard / editor pages)

---

## Pages

---

### 1. Recipient Gate — `/`

**Purpose:** The first and only thing she sees before entering. Should feel like receiving a sealed envelope — intimate, quiet, a little nervous. The gate must feel precious, not like a login screen.

**Layout:** Fully centered, vertically and horizontally. Single column. No header, no footer. Just the gate.

**Elements (top to bottom):**

```
[Heart circle icon]          52x52px circle, --blush bg, ♡ character, centered

[Micro-label]               "something made just" — Lato 11px uppercase, letter-spacing 2px, --ink-muted

[Main heading]              "for you" — EB Garamond 32px italic, --ink

[Decorative line]           40px --blush line, centered, margin 14px vertical

[Sub-label]                 "enter your pin to continue" — Lato 13px, --ink-muted

[PIN boxes]                 4 boxes in a row, centered
                            Each box: 44px wide, 52px tall, --card bg, 1.5px border --border
                            Filled state: border --rose, bg --rose-light, shows "•" in rose
                            Empty state: blank

[Name label]                "and your name" — Lato 12px, --ink-muted

[Name input]                Full width, centered text, font: Lato 14px
                            Placeholder: "your name..."
                            Border: 1.5px solid --border, rounded-[10px], --card bg

[Submit button]             Full width <PrimaryButton> "open ♡"

[Attempt counter]           "5 attempts remaining" — Lato 11px, --blush, centered
                            Changes to red with warning at 2 remaining
                            Hidden on success
```

**Behavior:**
- PIN input is keyboard-driven — each digit typed fills the next box automatically
- Backspace clears the last filled box
- On submit: POST to `/api/recipient/verify` with `{ pin, name }`
- On success: store JWT in httpOnly cookie (handled by backend), redirect to `/letters`
- On failure: shake animation on the pin boxes, increment attempt counter
- On 5 failures: show lockout message "too many attempts. try again in 5 minutes." and disable the form for 5 minutes with a countdown timer

**Animations:**
- Page load: fade in the content from slightly below (translateY 12px → 0, opacity 0 → 1, 0.4s ease)
- PIN box fill: subtle scale pulse (scale 1 → 1.05 → 1) on each digit entered
- Error shake: `keyframes shake` horizontal shake on the PIN row

---

### 2. Recipient Letters List — `/letters`

**Purpose:** The main archive she lands on after entering. She sees all your letters chronologically, newest first. Should feel like opening a box of handwritten notes.

**Layout:** Single column, max-width `max-w-xl`, centered.

**Header section:**

```
[Micro-label]               "letters written" — Lato 11px uppercase, letter-spacing 2px, --ink-muted

[Page heading]              "for her" — EB Garamond 26px italic, --ink

[Letter count]              "4 letters" — Lato 12px, --ink-muted, right-aligned on same row as heading
```

Separated from the list by a 1px `--border` bottom border.

**Letter list:**

Each entry is a `<LetterCard />` containing:
- Title (EB Garamond 15px italic, `--ink`) + tag on the right (`<TagNew />` or `<TagReplied />`)
- Date (Lato 12px, `--ink-muted`) — formatted as "March 28, 2026"
- Excerpt (Lato 13px, `--ink-muted`, line-height 1.5) — first ~120 chars of letter content, stripped of HTML tags, ending in "..."

Clicking any card navigates to `/letters/:id`.

**Empty state:**
If no letters yet, show a centered message: EB Garamond 16px italic, `--ink-muted`, "nothing here yet. check back soon." with the ♡ icon above it.

**Navigation:**
No top nav bar. Just a small discrete logout link at the bottom of the page: Lato 11px, `--ink-muted`, "leave" — clicking clears her session and returns to `/`.

---

### 3. Recipient Single Letter — `/letters/:id`

**Purpose:** Reading a single letter. This is the emotional core of the app. It should feel like unfolding a handwritten letter — generous whitespace, slow pace, nothing distracting. The reply box sits at the bottom, unobtrusive.

**Layout:** Max-width `max-w-lg`, centered, generous padding.

**Top bar:**
- `<GhostButton>` "← back" on the left — navigates to `/letters`
- Date on the right: Lato 12px, `--ink-muted`

**Letter header:**

```
[Letter number]             "letter no. 4" — Lato 11px uppercase, letter-spacing 2px, --rose
                            Compute as 1-based index after sorting letters oldest→newest (same order as API chronological list); frontend derives from list position or backend may include `letterNumber`

[Title]                     EB Garamond 26px italic, --ink

[Decorative line]           margin 14px vertical
```

**Letter body:**
- Font: EB Garamond 14px, `--ink`, line-height 1.9
- Paragraphs have `mb-3` spacing between them
- Content is rendered from stored rich HTML (sanitize with DOMPurify before rendering)
- No max-height, no scroll — letter expands naturally

**Reply section:**
Separated from letter body by a 1px `--border` top border, `pt-5`.

```
[Label]                     "write something back" — Lato 12px, --ink-muted, letter-spacing 0.5px

[Reply textarea]            Background: --rose-light, border: 1.5px solid --blush
                            Border-radius: rounded-xl, padding: p-3
                            Font: Lato 13px, --ink
                            Placeholder: "say something..."
                            Min-height: 72px, resizable vertically only
                            No resize handle on x-axis

[Send button]               <PrimaryButton> "send ♡" — right-aligned
```

**After sending a reply:**
- Button shows a loading spinner (small, inline, rose-colored)
- On success: textarea clears, button changes to "sent ♡" with a soft green color for 2 seconds, then resets
- On error: show a small error message below the textarea in `--rose-deep`

**If she already replied:**
- Show her existing reply in a quoted block above the textarea
- Block styling: left border 2px `--blush`, padding-left 12px, EB Garamond 13px italic, `--ink-muted`
- She can submit another reply (replies are not limited to one)

---

### 4. Writer Login — `/write`

**Purpose:** Your private login. Should feel secure but still warm — not clinical. No public access, no sign-up. Just a clean form.

**Layout:** Fully centered, single column, max-width `max-w-xs`.

**Elements:**

```
[Micro-label]               "writer's entrance" — Lato 11px uppercase, letter-spacing 2px, --ink-muted

[Heading]                   "welcome back" — EB Garamond 28px italic, --ink

[Decorative line]

[Email input]               Label: "email" — Lato 12px, --ink-muted
                            Input: standard, full width

[Password input]            Label: "password" — Lato 12px, --ink-muted
                            Input: type="password", full width
                            Small show/hide toggle icon on the right edge

[Submit button]             Full width <PrimaryButton> "enter"

[Error message]             Lato 13px, --rose-deep, centered, shown below button on failed login
                            "incorrect email or password"
```

**Behavior:**
- POST to `/api/auth/login` with `{ email, password }`
- On success: redirect to `/write/dashboard`
- On fail: show error, shake the form card subtly

---

### 5. Writer Dashboard — `/write/dashboard`

**Purpose:** Your home base. See your letters at a glance, track replies, and jump into writing. Should feel warm and organized, not cold like a CMS.

**Layout:** Max-width `max-w-2xl`, left-aligned.

**Header:**

```
[Micro-label]               "your letters" — Lato 11px uppercase, letter-spacing 2px, --ink-muted

[Heading]                   "dashboard" — EB Garamond 20px italic, --ink

[New letter button]         <PrimaryButton> "+ new letter" — right-aligned on same row
```

Separated from content by a 1px `--border` bottom border.

**Stat cards row:**
Three equal-width cards in a row (`grid grid-cols-3 gap-3`):

| Card | Value | Label |
|---|---|---|
| Letters | count (rose) | "letters" |
| Replies | count (amber) | "replies" |
| Days | days since first letter (ink) | "days" |

Each stat card: `--card` bg, 1px `--border` border, `rounded-[10px]`, `p-4`, centered. Value: EB Garamond 24px, `--rose`/`--amber`/`--ink`. Label: Lato 11px, `--ink-muted`, margin-top 4px.

**Recent letters list:**
Label: "recent" — Lato 11px uppercase, `--ink-muted`, letter-spacing 1.5px, margin-bottom 10px.

Each row is a `<LetterCard />` in a horizontal layout:
- Left: letter title (italic, 14px) + timestamp + reply count
- Right: `<GhostButton>` "edit"

Reply count shown as: Lato 11px, `--ink-muted` — "1 reply ♡" in `--rose`, or "no replies yet" in `--ink-muted`.

Clicking the card (not the edit button) navigates to `/write/letters/:id` to see replies.
Clicking "edit" navigates to `/write/letters/:id?mode=edit`.

**Logout:**
Discrete link at bottom: Lato 11px, `--ink-muted`, "sign out".

---

### 6. New Letter — `/write/new`

**Purpose:** Where you write. The editor should feel like a blank page — not a form. Minimal chrome, maximum focus on the writing.

**Layout:** Max-width `max-w-2xl`, centered.

**Top bar:**
- `<GhostButton>` "← dashboard" on the left
- `<PrimaryButton>` "save letter" on the right
- Draft auto-save indicator between them: Lato 11px, `--ink-muted` — "saving..." / "saved" / "unsaved changes"

**Title input:**
- No label, no border — just a bare input
- Font: EB Garamond 26px italic, `--ink`
- Placeholder: "a title, if you'd like..." in `--ink-muted`
- Full width, no box, no outline — blends with the page

**Tiptap editor:**
- Sits below the title input, separated by the `<DecorativeLine />`
- Font: EB Garamond 14px, `--ink`, line-height 1.9
- Min-height: 320px
- No border on the editor itself — the page is the editor
- Placeholder text (when empty): "begin here..." — EB Garamond 14px italic, `--ink-muted`

**Tiptap toolbar:**
Floats above the editor as a slim toolbar strip. Only shown when text is selected or when focused.

Toolbar buttons (icon only, 28px each):
- Bold
- Italic
- Blockquote
- H2 heading
- Bullet list
- Numbered list

Style: `--card` background, 1px `--border` border, `rounded-full`, `shadow-sm`, `flex gap-1 px-2 py-1`.
Active state: button background `--blush`, icon color `--rose-deep`.

**Behavior:**
- Auto-save to localStorage as draft every 30 seconds
- On "save letter": POST to `/api/letters` with `{ title, content }`
- On success: redirect to `/write/dashboard`
- On fail: show inline error below toolbar

---

### 7. Writer Letter Detail — `/write/letters/:id`

**Purpose:** View a specific letter with all her replies, and optionally edit it.

**Layout:** Max-width `max-w-2xl`, centered. Two modes: view and edit.

**View mode (default):**

Top bar:
- `<GhostButton>` "← dashboard"
- `<GhostButton>` "edit" on right — switches to edit mode

Letter displayed exactly like the recipient sees it (same typography, same spacing) but with the reply thread below.

**Reply thread section:**
Label: "her replies" — Lato 11px uppercase, `--ink-muted`, letter-spacing 1.5px.

If no replies: EB Garamond 14px italic, `--ink-muted`, "no replies yet."

Each reply:
- Background: `--rose-light`, border-left: 2px solid `--blush`, padding: 12px 14px, rounded-r-xl
- Timestamp: Lato 11px, `--ink-muted`
- Content: Lato 13px, `--ink`, line-height 1.7
- Replies listed oldest first

**Edit mode (`?mode=edit`):**
- Title becomes an editable input (same bare EB Garamond style)
- Body becomes the Tiptap editor pre-filled with existing content
- Toolbar appears
- Top bar buttons change to: `<GhostButton>` "cancel" and `<PrimaryButton>` "update letter"
- On save: PUT to `/api/letters/:id`
- Delete option: small "delete letter" link below the editor — Lato 11px, `--rose-deep`. Clicking shows a simple inline confirmation: "are you sure? this can't be undone." with a confirm and cancel option.

---

## Route Protection

### Auth guard components

**`<RequireAuthor />`**
- Wraps all `/write/*` routes
- On mount: GET `/api/auth/me`
- If not authenticated → redirect to `/write`
- If authenticated → render children

**`<RequireRecipient />`**
- Wraps all `/letters/*` routes
- On mount: GET `/api/recipient/session`
- If not authenticated → redirect to `/`
- If authenticated → render children

---

## React Router Structure

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<RecipientGate />} />

    <Route element={<RequireRecipient />}>
      <Route path="/letters" element={<RecipientLetterList />} />
      <Route path="/letters/:id" element={<RecipientLetterDetail />} />
    </Route>

    <Route path="/write" element={<WriterLogin />} />

    <Route element={<RequireAuthor />}>
      <Route path="/write/dashboard" element={<WriterDashboard />} />
      <Route path="/write/new" element={<WriterNewLetter />} />
      <Route path="/write/letters/:id" element={<WriterLetterDetail />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

`<NotFound />` — minimal centered message (e.g. "nothing here") with link to `/` or `/write` as appropriate; keeps the SPA from rendering a blank screen.

---

## Folder Structure

```
src/
├── pages/
│   ├── RecipientGate.jsx
│   ├── RecipientLetterList.jsx
│   ├── RecipientLetterDetail.jsx
│   ├── NotFound.jsx
│   ├── WriterLogin.jsx
│   ├── WriterDashboard.jsx
│   ├── WriterNewLetter.jsx
│   └── WriterLetterDetail.jsx
│
├── components/
│   ├── ui/
│   │   ├── PrimaryButton.jsx
│   │   ├── GhostButton.jsx
│   │   ├── TagNew.jsx
│   │   ├── TagReplied.jsx
│   │   ├── DecorativeLine.jsx
│   │   └── LetterCard.jsx
│   ├── Editor.jsx              # Tiptap editor + toolbar
│   ├── PinInput.jsx            # 4-box PIN keyboard handler
│   ├── RequireAuthor.jsx       # Auth guard
│   └── RequireRecipient.jsx    # Auth guard
│
├── api/
│   ├── auth.js                 # login, logout, me
│   ├── letters.js              # CRUD for letters
│   └── recipient.js            # verify, session, replies
│
├── hooks/
│   ├── useAuthorSession.js     # returns author session state
│   └── useRecipientSession.js  # returns recipient session state
│
├── index.css                   # CSS custom properties + base styles
└── main.jsx
```

---

## Tailwind CSS v4 (Vite plugin)

Use **Tailwind v4** with the official Vite plugin — no `tailwind.config.js` or PostCSS pipeline required.

**1. Install**

```bash
npm install tailwindcss @tailwindcss/vite
```

**2. `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**3. `src/index.css` — import Tailwind and define design tokens with `@theme`**

Custom colors become utilities (`bg-cream`, `text-ink`, `border-border`, etc.); fonts become `font-serif` / `font-sans`:

```css
@import "tailwindcss";

@theme {
  --color-cream: #fdf6f0;
  --color-blush: #f5d5ce;
  --color-rose: #c97b84;
  --color-rose-deep: #a55a66;
  --color-rose-light: #fff0ee;
  --color-amber: #d4956a;
  --color-ink: #3d2b1f;
  --color-ink-muted: #9b7b6f;
  --color-card: #fffaf8;
  --color-border: #edd8d0;
  --color-green-soft: #eef5ee;
  --color-green-text: #5a8a5a;

  --font-serif: "EB Garamond", Georgia, serif;
  --font-sans: Lato, ui-sans-serif, system-ui, sans-serif;
}
```

Keep the same `:root` CSS variables (for `var(--cream)` etc.) and animation classes in this file alongside `@theme` and `@layer base { ... }`.

---

## Animations

Define these in `index.css`:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}

@keyframes pulsePop {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

.animate-fade-up   { animation: fadeUp 0.4s ease both; }
.animate-shake     { animation: shake 0.4s ease; }
.animate-pulse-pop { animation: pulsePop 0.2s ease; }
```

**Where each is used:**
- `animate-fade-up` — on every page's root container, applied on mount
- `animate-shake` — on the PIN row when a wrong attempt is made
- `animate-pulse-pop` — on each PIN box when a digit is entered

---

## Local development — Vite proxy

In `vite.config.js`, proxy `/api` to the Express server so the browser uses same-origin requests and cookies work predictably in dev:

```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:3000', changeOrigin: true },
  },
},
```

With this, set `VITE_API_URL` to `''` (empty) in `.env.development` so axios uses relative `/api/...` URLs, or use `import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL` in the API client.

---

## Packages to Install

From the repo root (creates `frontend/`):

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios dompurify
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder
npm install -D tailwindcss @tailwindcss/vite
```

---

## Build Order Recommendation

Follow this sequence in Cursor to avoid building pages before their dependencies exist:

1. `vite.config.js` — add `@tailwindcss/vite` and dev proxy for `/api`
2. `index.css` — `@import "tailwindcss"`, `@theme` tokens, `:root`, animation keyframes, `@layer base`
3. `index.html` — add Google Fonts link
4. All `components/ui/` — build the atomic components first
5. `api/` files — set up all API call functions (can use placeholder URLs)
6. `hooks/` — auth session hooks
7. `RequireAuthor.jsx` and `RequireRecipient.jsx`
8. `PinInput.jsx` — the PIN keyboard logic is the trickiest component, do it early
9. `Editor.jsx` — Tiptap setup
10. Pages in this order:
    - `RecipientGate.jsx`
    - `WriterLogin.jsx`
    - `WriterDashboard.jsx`
    - `WriterNewLetter.jsx`
    - `RecipientLetterList.jsx`
    - `RecipientLetterDetail.jsx`
    - `WriterLetterDetail.jsx`
11. `main.jsx` — wire up React Router last (include `NotFound` route)

---

*This document is the complete frontend plan. No backend logic lives here — all data comes from the Express API documented in `project-plan.md`.*
