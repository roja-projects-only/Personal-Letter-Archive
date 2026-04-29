---
name: Personal Letter Archive
description: A private correspondence archive. Two people, one relationship, no audience.
colors:
  candlelight: "#ffd600"
  candlelight-deep: "#f59f00"
  ink: "#3B2800"
  ink-muted: "#6B4400"
  ink-faint: "#A07800"
  gold: "#9a7000"
  gold-soft: "#ddb830"
  gold-faint: "#fff5cc"
  parchment: "#fff3c4"
  cream: "#fffef5"
  cream-dark: "#fff7dc"
  blush: "#fffde7"
  rose-light: "#fffde0"
  green-soft: "#e4f0e4"
  green-text: "#3d7048"
typography:
  display:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "28px–34px"
    fontWeight: 600
    lineHeight: 1.1
    fontStyle: "italic"
  headline:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "20px–24px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
    fontStyle: "italic"
  label:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px–13px"
    fontWeight: 400
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  ui:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "9999px"
  md: "12px"
  lg: "16px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.candlelight}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.candlelight-deep}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.rose-light}"
    textColor: "{colors.ink}"
  paper-card:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.lg}"
    padding: "16px–32px"
  tag-new:
    backgroundColor: "{colors.rose-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  tag-replied:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green-text}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  input-focus:
    backgroundColor: "{colors.cream}"
---

# Design System: Personal Letter Archive

## 1. Overview: The Writing Desk

**Creative North Star: "The Writing Desk"**

Everything in this system starts from a single physical scene: a person sitting down at a quiet desk, in warm light, to write something that matters to exactly one other person. The interface should feel like that surface — unhurried, warm, steeped in the texture and ceremony of paper correspondence. There is no navigation overload, no gamification, no urgency. There is a desk. There is a letter. There is someone who will read it.

The design strategy is Committed: the candlelight yellow (#ffd600) and parchment surface carry 40–60% of every screen. This is not a neutral product with an accent — the warmth IS the product. The ink-brown text on aged parchment is not a color choice, it is a physical stance. The system should feel as though it was printed, not loaded.

Typography is display serif for all titles and letter bodies (Cormorant Garamond, EB Garamond). Lato handles UI chrome — labels, buttons, metadata — in lightweight uppercase spaced tracking. The pairing is deliberate: the serif is the voice of the letter; the sans is the hand of the archivist.

**This system explicitly rejects:**
- Generic SaaS productivity minimalism (Linear, Notion) — too cold and utilitarian.
- Overdecorated wedding/anniversary apps — ornament should serve atmosphere, not perform sentiment.
- Dark-mode journaling apps (Day One, Bear) — this is correspondence, not introspection; warm and handwritten, not writer-focused.
- AI writing tools and note-taking apps — wrong register entirely.

**Key Characteristics:**
- Parchment-primary surface; warm yellow accent throughout
- Serif letters, sans chrome — two voices, never mixed within a role
- Ornament as ceremony: corner vines, floral dividers, wax seal serve atmosphere not decoration
- Flat-by-default with warm-gold shadow lift on hover
- Two users, one relationship — every interaction is bilateral, private, complete

---

## 2. Colors: The Candlelight Palette

The palette is built entirely from the warm-amber end of the spectrum. There are no cool tones: no blues, no purples, no clean whites. Every neutral is tinted toward the brand hue.

### Primary
- **Candlelight** (`#ffd600`): The dominant accent. Used on primary buttons, FloralDivider ornament, PinInput focus state, and the WaxSeal. Warm, luminous, like light coming through parchment. Not used as resting text color — it lacks contrast for body copy.
- **Candlelight Deep** (`#f59f00`): The hover state for primary buttons. Slightly shifted amber — more amber-warm, less lemon. Also used for sparse interactive states.

### Neutral (Warm)
- **Antique Ink** (`#3B2800`): All primary text. The darkest warm-dark in the system. Never pure black — always brown-warm.
- **Ink Muted** (`#6B4400`): Secondary text, metadata labels, placeholder copy.
- **Ink Faint** (`#A07800`): Tertiary UI copy. Barely legible against parchment — used only for genuinely ambient text (dates, letter numbers at rest).
- **Harvest Gold** (`#9a7000`): The semantic gold for metadata, dates, `letter no.` labels. Lower saturation than candlelight — readable at body scale.
- **Gold Soft** (`#ddb830`): Card borders, divider lines, scrollbar thumb. The connecting tissue of the system — warm but not bright.
- **Gold Faint** (`#fff5cc`): Very light tint; used for chip/tag backgrounds and input highlight.
- **Parchment** (`#fff3c4`): The main card surface. Paper-warm, with a slight honey tint. All PaperCards, all letter content surfaces.
- **Cream** (`#fffef5`): The page panel — one step lighter than parchment. The writing desk surface.
- **Cream Dark** (`#fff7dc`): Mid-surface; used for hover states and lighter tonal backgrounds.
- **Blush** (`#fffde7`): The lightest warm tint; used when a barely-there background is needed.
- **Rose Light** (`#fffde0`): Ghost button hover background; TagNew background.

### Semantic
- **Green Soft** (`#e4f0e4`): TagReplied background. A reply is a small piece of good news.
- **Green Text** (`#3d7048`): TagReplied text and success states.

### Named Rules
**The Contrast Rule.** `#ffd600` (Candlelight) is banned as resting text on parchment — contrast is below 1.5:1. Use `#9a7000` (Harvest Gold) or `#7A5500` (Ink Dark) when color-distinguishing metadata text. Candle light belongs on surfaces and accents, not type.

**The Warm Monopoly Rule.** No cool-toned neutrals anywhere. Every gray is tinted amber at minimum chroma 0.005. The coldest tone in the system is the green on TagReplied — and even that is warm-sage, not clinical.

---

## 3. Typography: Two Voices

**Display Font:** Cormorant Garamond, EB Garamond, Georgia, serif
**Body / Letter Font:** EB Garamond, Georgia, serif
**UI Font:** Lato, ui-sans-serif, system-ui, sans-serif

**Character:** The serif is the voice of the letter — unhurried, literary, italic by default for letter bodies. The sans is the archivist's hand — compact, spaced, always lowercase or small-caps. They never occupy the same role. A button is Lato; a letter title is Cormorant. A label is Lato; a reply body is EB Garamond.

### Hierarchy

- **Display** (Cormorant Garamond, semibold italic, 28–34px, line-height 1.1): Page titles and letter titles only. The voice that says "this is the thing that matters on this screen."
- **Headline** (EB Garamond, regular, 20–24px, line-height 1.4): Section headers within letter detail views. Used sparingly.
- **Body / Letter** (EB Garamond, regular italic, 16px, line-height 1.8): All letter body content and reply content. Line length capped at 65–70ch. The italic is intentional — it reads as handwritten, not typed.
- **UI / Button** (Lato, regular, 14px, line-height 1.5, tracking-wide): All interactive controls, navigation items, button labels. Never italic. Never display weight.
- **Label / Metadata** (Lato, regular, 11px, line-height 1, letter-spacing 0.2em, UPPERCASE): Dates, letter numbers, stat annotations, section headers. The archivist's notation in the margin.

### Named Rules
**The Two Voices Rule.** Cormorant/Garamond = letter voice. Lato = interface voice. Never cross them: do not use a serif font in a button; do not use Lato in letter body copy.

**The Italic Body Rule.** Letter body text is always italic. This is not decorative — it is the visual encoding of "handwritten" in a digital medium. Removing the italic from letter content breaks the physical metaphor.

---

## 4. Elevation: Warm Paper Lift

This system does not use structural shadows. There is no dark ambient shadow suggesting a floating UI layer. Instead, elevation is warm and atmospheric — paper cards sit slightly above the cream desk surface, and the shadows that suggest this use the same warm-amber tones as the palette.

**Elevation philosophy:** Flat at rest, lifted on interaction. Cards are distinguished from the page panel through surface color (parchment on cream), not primarily through shadow. Hover reveals the lift — the shadow deepens and the card translates 1px upward.

### Shadow Vocabulary

- **Card ambient** (`0 2px 10px rgba(180, 120, 0, 0.10), 0 1px 3px rgba(200, 160, 0, 0.14)`): Default state for all PaperCards. Barely visible — suggests paper resting on a desk.
- **Card hover** (`0 4px 16px rgba(180, 120, 0, 0.15), 0 1px 4px rgba(200, 160, 0, 0.18)` + `translateY(-1px)`): Applied on hover. The shadow deepens and the card rises — physical lift.
- **Page panel** (`0 8px 60px rgba(180, 120, 0, 0.18), 0 2px 16px rgba(255, 214, 0, 0.22), 0 1px 4px rgba(180, 120, 0, 0.12)`): The `page-panel` container (the cream card wrapping each page). More dramatic shadow — the desk surface itself is lifted off the deep amber-gold background.
- **WaxSeal drop shadow** (`feDropShadow dx=0 dy=2 stdDeviation=4 floodColor=#7A5500 floodOpacity=0.35`): SVG filter only on the wax seal ornament. Warm ink-brown shadow.

### Named Rules
**The Warm Shadow Rule.** All shadows use warm amber-brown tones, never neutral grey. `rgba(180, 120, 0, x)` — not `rgba(0, 0, 0, x)`. A cold shadow on parchment breaks the physical metaphor.

**The Flat-By-Default Rule.** PaperCards are flat at rest. The hover lift (shadow + translate) is the only elevation state. There is no always-elevated card style.

---

## 5. Components: Tender and Ceremonial

Every component in this system is shaped by the same physical metaphor: warm, rounded, paper-like, with the texture and care of handmade stationery. No sharp corners. No clinical borders. No cold neutrals.

### Buttons

The primary button is a rounded pill with warm Candlelight fill — the most visible interactive element on any screen.

- **Shape:** Fully rounded pill (`border-radius: 9999px`)
- **Primary** (`bg-rose` = `#ffd600`, `text-ink` = `#3B2800`): Fill: candlelight. Text: dark walnut ink. Padding: 12px 28px. Min height 48px for touch targets.
- **Primary hover:** Fill shifts to Candlelight Deep (`#f59f00`). Shadow deepens. No color change on text.
- **Primary active:** `scale(0.97)` — brief physical press.
- **Primary disabled:** `opacity: 0.60`, `cursor: not-allowed`, active scale suppressed.
- **Ghost:** Transparent background, `border: 1px solid #ddb830` (gold-soft), `text-ink-muted`. Rounded pill. Used for secondary actions (back, cancel, edit).
- **Ghost hover:** `bg-rose-light` (`#fffde0`), `text-ink`, border shifts to `#ffd600`.
- **Focus ring (both):** `ring-2 ring-gold ring-offset-1` — warm gold ring, never blue.

### Cards / Containers

PaperCard is the primary content surface. It represents a physical piece of paper.

- **Corner Style:** `border-radius: 16px` (`rounded-lg`)
- **Background:** Parchment (`#fff3c4`) with paper-texture SVG noise overlay and `linear-gradient(160deg, parchment, #ffe898)` — gives the card a subtle aged gradient
- **Border:** `1px solid #ddb830` (gold-soft). Not a decorative stripe — full border all around.
- **Shadow:** Warm ambient (see Elevation section)
- **Hover lift:** `-translate-y-1px` + shadow deepens — LetterCards only; static PaperCards do not lift
- **Corner Ornaments:** Optional SVG vine/curl decorations at corners (`<CornerOrnament>`). Used on full-width letter display cards only. Opacity 0.45.
- **Internal Padding:** compact `p-4`, comfortable `p-5 sm:p-7`, hero `p-6 sm:p-8`. Never use arbitrary padding — pick a scale step.

### Tags / Chips

Tags are status indicators on letter cards. They are the only place green appears.

- **TagNew:** `bg-rose-light` / `border-blush` / `text-rose-deep` (the deep amber-brown, not the yellow). Rounded full. Uppercase 11px Lato, letter-spacing 0.2em.
- **TagReplied:** `bg-green-soft` / `border-green-text/20` / `text-green-text`. Same shape and typography. The green signals "this exchange is alive."

### Inputs / Fields

All inputs use the parchment surface with serif italic body typography to maintain the letter-voice.

- **Style:** `border: 1px solid #ddb830/0.9` (gold-soft, slightly transparent), `background: parchment/0.95`, `border-radius: 12px`, `padding: 20px`
- **Typography:** EB Garamond italic 16px, ink text, ink-muted placeholder
- **Focus:** Border shifts to `#ffd600` (Candlelight), background lightens to cream, `ring-2 ring-rose/45`
- **Min font-size:** Always `font-size: max(16px, 1rem)` — prevents iOS auto-zoom
- **Textarea:** Same style; `min-height: 120–320px`, `resize: vertical`

### PinInput

A 4-cell PIN entry replacing a password field for the recipient's authentication ceremony.

- **Cells:** 4 square cells (`w-14 h-14`, `border-radius: 12px`). Filled cells: parchment bg with gold border. Active cell: rose/candlelight ring. Empty cells: parchment, gold-soft border.
- **Container focus ring:** `ring-2 ring-rose/50` when the hidden input is focused
- **Error state:** `animate-shake` on the container
- **Fill pulse:** `animate-pulse-pop` on the cell index when a digit is entered

### FloralDivider

A decorative separator rendered as a centered text ornament with flanking gradient lines.

- **Structure:** `::before` and `::after` pseudo-elements — `height: 1px`, `background: linear-gradient(to right, transparent, gold-soft, transparent)`. Center content is an ornament character (❧, ✦, ♡).
- **Color:** `color: #ffd600` (Candlelight) on the ornament glyph.
- **Usage:** Section boundaries within a page, never as a primary header element.

### WaxSeal

A SVG stamp ornament representing the ceremony of sending a sealed letter.

- **Shape:** Starburst with 8 petals + center circle
- **Fill:** Radial gradient: Candlelight (#ffd600) at 0% → amber-warm at 60% → deep honey (#c49000) at 100%
- **Drop shadow:** Warm ink-brown (see Elevation)
- **Entrance:** `sealAppear` — scale(0.75) + rotate(-6deg) → scale(1) rotate(0deg), 0.6s ease-out-expo
- **Idle pulse:** `sealPulse` — gentle scale 1→1.04 over 1.4s, used on loading/waiting states

### CornerOrnament

A small SVG vine corner decoration placed at card corners.

- **Size:** 20–28px (two scales: SM for list cards, MD for hero cards)
- **Stroke:** `#9A7000` (Harvest Gold), `strokeWidth: 1.4`, `strokeLinecap: round`, `opacity: 0.45`
- **Variants:** TL/TR/BL/BR via `scaleX(-1)` and `scaleY(-1)` transforms
- **Usage:** Placed absolutely at card corners. Used only on full display cards, not on compact list items.

### Navigation

This application has no traditional navigation component. Navigation is contextual and inline:

- "← back" and "← dashboard" links rendered as Ghost Buttons
- "sign out" and "leave" rendered as bare text links (`underline decoration-transparent`, hover reveals decoration)
- Confirmation patterns for destructive actions (delete, sign out) are always inline — no modals

---

## 6. Do's and Don'ts

### Do:

- **Do** use `#9a7000` (Harvest Gold) or `#7A5500` (Ink Dark) when you need colored text on parchment. Candlelight `#ffd600` is a surface color, not a text color.
- **Do** use Cormorant Garamond italic for all letter titles and display headlines. The weight should be semibold (600); the italic is non-negotiable.
- **Do** use Lato uppercase with `letter-spacing: 0.2em` for all metadata labels, section labels, and dates. Never use the serif for these.
- **Do** keep shadows warm: `rgba(180, 120, 0, x)` or `rgba(200, 160, 0, x)`. Cold black shadows (`rgba(0,0,0,x)`) break the physical metaphor.
- **Do** use `border-radius: 9999px` (fully rounded) for all buttons. No square or lightly-rounded buttons in this system.
- **Do** cap letter body text at 65–70ch line length. Long lines in an italic serif at 1.8 line-height become hard to track.
- **Do** animate content entrances with `fadeUp` (page level) and `cardReveal` (card level), with stagger delays for list items. Timing: 350–500ms with `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Do** respect `prefers-reduced-motion`: all entrance animations and pulse effects are suppressed; hover transforms are also suppressed with `button:active { transform: none !important }`.
- **Do** use full-border PaperCards (`border: 1px solid gold-soft`). The card identity comes from the parchment surface + warm border, not a side stripe.
- **Do** treat the PaperCard's paper-texture gradient as non-negotiable: `linear-gradient(160deg, parchment, #ffe898)` + SVG noise overlay. Remove either and the paper illusion breaks.

### Don't:

- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on cards or list items. This is an absolute ban — it reads as a SaaS notification pattern, not correspondence.
- **Don't** use `background-clip: text` with a gradient. Gradient text is banned entirely. Use a solid color for all text; use weight and size for emphasis.
- **Don't** use blue, purple, teal, or any cool-spectrum color anywhere in this system. The palette is warm amber exclusively.
- **Don't** render letter body or reply content in `font-sans`. All letter content (body, replies, placeholders) must use the serif italic stack.
- **Don't** display letter statistics (letter count, reply count, days since first) as large-number hero tiles with small labels — this is the SaaS hero-metric template and is banned. Render stats as metadata annotations in the header.
- **Don't** use identical card grids — same-sized cards with repeated icon + heading + text. Cards in this system are letter previews or reply surfaces, not feature tiles.
- **Don't** use modals as a first resort. All confirmation flows (delete, sign out, leave) are inline. If a modal becomes necessary, it requires explicit justification.
- **Don't** use bounce or elastic easing. The system uses `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo) exclusively. Bounce easing feels playful and light; this product is intimate and deliberate.
- **Don't** use over-decorated wedding or anniversary app aesthetics — lace backgrounds, pink roses, heart confetti. Ornament here (corner vines, wax seal, floral divider) is restrained and serves atmosphere, not sentiment.
- **Don't** introduce generic SaaS patterns: empty states with illustrated mascots, progress bars for onboarding completion, notification badges, or activity feeds. This is not a productivity tool.
