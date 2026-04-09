# Tasks — Yellow Theme Overhaul

## Task List

- [x] 1. Update color tokens in `index.css` (both `@theme` and `:root` blocks)
  - [x] 1.1 Update `--color-ink` from `#1a1200` to `#3B2800` in both blocks
  - [x] 1.2 Update `--color-ink-muted` from `#5c4500` to `#6B4400` in both blocks
  - [x] 1.3 Update `--color-ink-faint` from `#c8ae48` to `#A07800` in both blocks
  - [x] 1.4 Update `--color-rose-deep` from `#b8860b` to `#7A5500` in both blocks
  - [x] 1.5 Verify `--color-rose`, `--color-rose-light`, `--color-cream`, `--color-cream-dark`, `--color-parchment`, `--color-blush`, `--color-card`, `--color-border`, `--color-gold`, `--color-gold-soft`, `--color-gold-faint`, `--color-amber`, `--color-amber-soft` are already light values and leave them unchanged

- [x] 2. Update `body` background in `index.css`
  - [x] 2.1 Replace `background-color: #120900` with `background-color: #FFF9C4`
  - [x] 2.2 Replace the two dark radial-gradient stops (`#2e2000`, `#1e1400`) with light amber-yellow equivalents (`#FFE082`, `#FFF176`)

- [x] 3. Update `.page-panel` shadow in `index.css`
  - [x] 3.1 Replace `rgba(18, 9, 0, 0.55)` shadow stop with `rgba(180, 120, 0, 0.18)`
  - [x] 3.2 Replace `rgba(18, 9, 0, 0.3)` shadow stop with `rgba(180, 120, 0, 0.12)`

- [x] 4. Update `.paper-card` shadow in `index.css`
  - [x] 4.1 Replace `rgba(26, 18, 0, 0.1)` shadow stop with `rgba(180, 120, 0, 0.10)`

- [x] 5. Update `WaxSeal.jsx` SVG drop shadow
  - [x] 5.1 Replace `floodColor="#1a1200"` with `floodColor="#7A5500"` in the `feDropShadow` filter

- [x] 6. Update `CornerOrnament.jsx` SVG colors
  - [x] 6.1 Replace all occurrences of `#8a6820` (stroke and fill attributes) with `#9A7000`

- [x] 7. Update `PrimaryButton.jsx` text color for WCAG AA compliance
  - [x] 7.1 Replace `text-white` with `text-[#3B2800]` so dark warm-brown text is used on the bright yellow (`#FFD600`) background, achieving ≥ 4.5:1 contrast

- [x] 8. Verify `BackgroundScene.jsx` contains no dark color values
  - [x] 8.1 Confirm all SVG `fill`, `stroke`, and `stopColor` values use only `rgba(255,…)` amber/yellow tones — no changes expected, read-only verification

- [x] 9. Smoke-test: grep for removed dark hex values
  - [x] 9.1 Run `grep -rn "#120900\|#2e2000\|#1e1400\|#1a1200\|#8a6820" frontend/src/` and confirm zero matches

- [-] 10. Commit all changes
  - [-] 10.1 Stage all modified files with `git add .`
  - [~] 10.2 Commit with message `feat: yellow theme overhaul — replace all dark colors with bright yellow palette`
