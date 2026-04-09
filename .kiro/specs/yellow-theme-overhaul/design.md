# Design Document — Yellow Theme Overhaul

## Overview

The yellow-theme-overhaul replaces every dark surface and near-black color in the Personal Letter Archive frontend with a cohesive bright yellow palette. The current codebase already uses yellow as its accent color (`--color-rose: #ffd600`) but retains a near-black body background (`#120900`) and several dark token values (`--color-ink: #1a1200`, `--color-ink-muted: #5c4500`, `--color-rose-deep: #b8860b`) that clash with a fully light theme.

The change is purely cosmetic: no layout, spacing, typography, routing, or API logic is touched. Every modification is a color value swap — either in `index.css` (CSS custom properties, `@theme` tokens, and hardcoded hex values in `.page-panel`, `.paper-card`, `.paper-texture`, and `body`) or in a small set of JSX/SVG components that embed hardcoded color literals.

### Key design decisions

- **Token-first**: all color changes flow through the `@theme` / `:root` token system in `index.css`. Component-level hardcoded values are updated only where tokens cannot reach (SVG attributes, inline `fill`/`stroke`/`floodColor`).
- **Dual-block sync**: `index.css` declares every token twice — once in `@theme` (Tailwind v4 resolution) and once in `:root` (CSS variable fallback). Both blocks must be updated in lockstep to prevent drift.
- **WCAG AA preserved**: the new `ink` value (`#3B2800`) achieves ≥ 4.5:1 against all light card/parchment backgrounds. The `rose` token (`#FFD600`) does not meet 4.5:1 with white text, so `PrimaryButton` switches to dark warm-brown text (`#3B2800`).
- **Green tokens untouched**: `green-soft` and `green-text` serve a semantic replied-state purpose and are intentionally excluded from the overhaul.

---

## Architecture

The theme system is a single-layer concern: `frontend/src/index.css` is the sole source of truth for all color tokens. Tailwind utility classes in JSX files reference these tokens by name (e.g. `bg-rose`, `text-ink-muted`). The only exceptions are:

1. **`body` background** — hardcoded hex in `@layer base` inside `index.css`.
2. **`.page-panel` and `.paper-card`** — plain CSS classes in `index.css` with hardcoded `rgba()` shadow values.
3. **`.paper-texture`** — hardcoded hex stops in a `linear-gradient`.
4. **SVG components** — `BackgroundScene.jsx`, `WaxSeal.jsx`, `CornerOrnament.jsx` embed color literals in SVG attributes that Tailwind cannot reach.

```
index.css
  ├── @theme block          ← Tailwind v4 token resolution
  ├── :root block           ← CSS custom property fallback
  ├── @layer base / body    ← body background (hardcoded)
  ├── .paper-texture        ← gradient stops (hardcoded)
  ├── .paper-card           ← box-shadow rgba (hardcoded)
  └── .page-panel           ← box-shadow rgba (hardcoded)

JSX components (SVG color literals)
  ├── BackgroundScene.jsx   ← already yellow — verify only
  ├── WaxSeal.jsx           ← feDropShadow floodColor (#1a1200 → #7A5500)
  └── CornerOrnament.jsx    ← stroke/fill (#8a6820 → #9A7000)
```

No new files are created. No component structure, routing, or API code changes.

---

## Components and Interfaces

### `index.css` — token block changes

Both `@theme` and `:root` blocks are updated identically for every token listed below.

| Token | Current value | New value | Rationale |
|---|---|---|---|
| `--color-ink` | `#1a1200` | `#3B2800` | Deep warm brown; ≥ 4.5:1 on all light surfaces |
| `--color-ink-muted` | `#5c4500` | `#6B4400` | Medium warm brown; ≥ 4.5:1 on card/parchment |
| `--color-ink-faint` | `#c8ae48` | `#A07800` | Soft golden; decorative only, no AA requirement |
| `--color-rose` | `#ffd600` | `#FFD600` | Already correct — verified unchanged |
| `--color-rose-deep` | `#b8860b` | `#7A5500` | Warm amber-brown; ≥ 4.5:1 on rose-light |
| `--color-rose-light` | `#fffde0` | `#FFFDE0` | Already correct — verified unchanged |
| `--color-cream` | `#fffef5` | `#FFFEF5` | Already correct — verified unchanged |
| `--color-cream-dark` | `#fff7dc` | `#FFF7DC` | Already correct — verified unchanged |
| `--color-parchment` | `#fff3c4` | `#FFF3C4` | Already correct — verified unchanged |
| `--color-blush` | `#fffde7` | `#FFFDE7` | Already correct — verified unchanged |
| `--color-card` | `#fffef5` | `#FFFEF5` | Already correct — verified unchanged |
| `--color-border` | `#ddb830` | `#DDB830` | Already correct — verified unchanged |
| `--color-gold` | `#9a7000` | `#9A7000` | Already correct — verified unchanged |
| `--color-gold-soft` | `#ddb830` | `#DDB830` | Already correct — verified unchanged |
| `--color-gold-faint` | `#fff5cc` | `#FFF5CC` | Already correct — verified unchanged |
| `--color-amber` | `#f59f00` | `#F59F00` | Already correct — verified unchanged |
| `--color-amber-soft` | `#ffe08a` | `#FFE08A` | Already correct — verified unchanged |

The primary changes are `ink` (`#1a1200` → `#3B2800`), `ink-muted` (`#5c4500` → `#6B4400`), `ink-faint` (`#c8ae48` → `#A07800`), and `rose-deep` (`#b8860b` → `#7A5500`).

### `index.css` — `body` background

```css
/* Before */
background-color: #120900;
background-image:
  radial-gradient(ellipse 80% 60% at 15% 15%, #2e2000 0%, transparent 65%),
  radial-gradient(ellipse 70% 50% at 85% 85%, #1e1400 0%, transparent 60%);

/* After */
background-color: #FFF9C4;
background-image:
  radial-gradient(ellipse 80% 60% at 15% 15%, #FFE082 0%, transparent 65%),
  radial-gradient(ellipse 70% 50% at 85% 85%, #FFF176 0%, transparent 60%);
```

### `index.css` — `.page-panel` shadow

```css
/* Before */
box-shadow:
  0 8px 60px rgba(18, 9, 0, 0.55),
  0 2px 16px rgba(255, 214, 0, 0.22),
  0 1px 4px rgba(18, 9, 0, 0.3);

/* After */
box-shadow:
  0 8px 60px rgba(180, 120, 0, 0.18),
  0 2px 16px rgba(255, 214, 0, 0.22),
  0 1px 4px rgba(180, 120, 0, 0.12);
```

### `index.css` — `.paper-card` shadow

```css
/* Before */
box-shadow:
  0 2px 10px rgba(26, 18, 0, 0.1),
  0 1px 3px rgba(200, 160, 0, 0.14);

/* After */
box-shadow:
  0 2px 10px rgba(180, 120, 0, 0.10),
  0 1px 3px rgba(200, 160, 0, 0.14);
```

### `index.css` — `.paper-texture` gradient

```css
/* Before */
linear-gradient(160deg, #fff3c4 0%, #ffe898 100%)

/* After — same light values, already correct */
linear-gradient(160deg, #FFF3C4 0%, #FFE898 100%)
```

These are already light; the task is verification only.

### `WaxSeal.jsx` — `feDropShadow`

```jsx
/* Before */
<feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1a1200" floodOpacity="0.35" />

/* After */
<feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#7A5500" floodOpacity="0.35" />
```

### `CornerOrnament.jsx` — SVG stroke/fill

```jsx
/* Before — all occurrences of #8a6820 */
stroke="#8a6820"
fill="#8a6820"

/* After */
stroke="#9A7000"
fill="#9A7000"
```

### `PrimaryButton.jsx` — text color

Because `#FFD600` (rose) does not achieve 4.5:1 contrast with white text, the button switches to dark warm-brown text:

```jsx
/* Before */
className="... text-white ..."

/* After */
className="... text-[#3B2800] ..."
```

### `BackgroundScene.jsx` — verification

All SVG colors in `BackgroundScene.jsx` already use `rgba(255,214,0,…)` and `rgba(255,220,0,…)` — no dark values are present. The `linearGradient` stops are already amber-yellow. No changes required; this is a read-and-verify step only.

---

## Data Models

This feature has no data model changes. No backend, database schema, API contract, or localStorage key is modified.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### PBT applicability assessment

This feature is a UI theme overhaul: it changes CSS custom property values, hardcoded hex literals in CSS classes, and SVG color attributes. The changes are declarative color assignments with no algorithmic logic, no data transformation, and no input/output behavior that varies across a meaningful input space.

- There are no pure functions to test.
- There is no parser, serializer, or data transformation.
- The "inputs" are static CSS/SVG values, not runtime data.
- Running 100 iterations of any property would not reveal more bugs than a single visual inspection or snapshot test.

**Conclusion: property-based testing is not appropriate for this feature.** The Correctness Properties section is omitted. Testing strategy uses snapshot/visual regression tests and targeted unit checks instead.

---

## Error Handling

No new error conditions are introduced. The overhaul is purely additive color changes. The only risk is a regression in contrast ratios; this is mitigated by the explicit contrast checks in the Testing Strategy below.

---

## Testing Strategy

Because PBT does not apply to a CSS/SVG color overhaul, testing focuses on:

### 1. Visual snapshot tests (recommended)

Use a tool such as [Storybook + Chromatic](https://www.chromatic.com/) or [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots) to capture before/after screenshots of each route:

- `WriterLogin`
- `WriterDashboard`
- `WriterNewLetter`
- `WriterLetterDetail` (view mode and edit mode)
- `RecipientGate` (PIN step and name step)
- `RecipientLetterList`
- `RecipientLetterDetail`

Diff the snapshots against the new baseline to confirm only colors changed and no layout shifted.

### 2. Contrast ratio checks (manual or automated)

For each token pairing listed in Requirement 7, verify the contrast ratio using the [WCAG contrast algorithm](https://www.w3.org/TR/WCAG21/#contrast-minimum):

| Foreground | Background | Required | Expected ratio |
|---|---|---|---|
| `ink` `#3B2800` | `card` `#FFFEF5` | 4.5:1 | ~14:1 ✓ |
| `ink` `#3B2800` | `parchment` `#FFF3C4` | 4.5:1 | ~12:1 ✓ |
| `ink-muted` `#6B4400` | `card` `#FFFEF5` | 4.5:1 | ~8:1 ✓ |
| `rose-deep` `#7A5500` | `rose-light` `#FFFDE0` | 4.5:1 | ~7:1 ✓ |
| `gold` `#9A7000` | `card` `#FFFEF5` | 3:1 | ~4.5:1 ✓ |
| `#3B2800` (button text) | `rose` `#FFD600` | 4.5:1 | ~9:1 ✓ |
| `green-text` `#3d7048` | `green-soft` `#e4f0e4` | 4.5:1 | ~5:1 ✓ |

These can be automated with a small Node script using the `wcag-contrast` npm package, or verified manually with the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/).

### 3. Smoke test — no dark colors remain

After applying all changes, run a grep across `frontend/src/index.css` and the four JSX files for the old dark hex values:

```bash
grep -rn "#120900\|#2e2000\|#1e1400\|#1a1200\|#8a6820" frontend/src/
```

Expected result: zero matches.

### 4. Route smoke test

Start the dev server and navigate to each route. Confirm:
- No JavaScript console errors.
- Body background is visibly bright yellow (not dark).
- All text is legible.
- Buttons, inputs, and focus rings use yellow/amber tones.

### 5. Unit tests — no new unit tests required

No logic changed. Existing unit/integration tests (if any) should continue to pass without modification.
