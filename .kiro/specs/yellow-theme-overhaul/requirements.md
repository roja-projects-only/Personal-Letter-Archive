# Requirements Document

## Introduction

The Personal Letter Archive frontend currently uses a warm yellow-gold palette with a near-black (`#120900`) body background and dark radial gradients. This feature replaces every dark surface, dark background, and near-black color with a cohesive bright yellow theme — energetic, high-contrast, and fully light — while preserving all layout, spacing, component structure, and functionality unchanged.

The overhaul touches: CSS custom properties and `@theme` tokens in `index.css`, hardcoded hex values in component-level JSX and SVG, Tailwind utility classes that reference the old `rose-*`, `ink-*`, `gold-*`, `amber-*`, `parchment`, `cream`, `blush`, and `card` tokens, and the `body` background declaration.

## Glossary

- **Theme_System**: The set of CSS custom properties, Tailwind `@theme` tokens, and hardcoded color values that collectively define the visual palette of the frontend.
- **Color_Token**: A named CSS custom property (e.g. `--color-rose`, `--ink`) or Tailwind alias that maps to a specific hex value.
- **Dark_Color**: Any color whose relative luminance (per WCAG 2.1) is below 0.10, including near-blacks, dark browns, and dark grays.
- **Body_Background**: The `background-color` and `background-image` declarations applied to the `<body>` element in `index.css`.
- **Page_Panel**: The `.page-panel` CSS class that renders the main cream content surface lifted above the body background.
- **Paper_Card**: The `.paper-card` CSS class used by `PaperCard.jsx` for letter cards and stat tiles.
- **Background_Scene**: The `BackgroundScene.jsx` SVG layer fixed behind all page content.
- **Primary_Button**: The `PrimaryButton.jsx` component, currently styled with `bg-rose` (yellow) fill.
- **Ghost_Button**: The `GhostButton.jsx` component, currently styled with a `border-gold-soft` outline.
- **WCAG_AA**: The Web Content Accessibility Guidelines 2.1 Level AA contrast requirement — minimum 4.5:1 for normal text, 3:1 for large text and UI components.

---

## Requirements

### Requirement 1: Eliminate All Dark Colors from the Body Background

**User Story:** As a visitor to the app, I want the page background to feel bright and energetic, so that the yellow theme is immediately apparent on every route.

#### Acceptance Criteria

1. THE Theme_System SHALL replace the `body` `background-color` value `#120900` with a bright yellow or warm cream value from the new palette (e.g. `#FFF9C4` or `#FFFDE7`).
2. THE Theme_System SHALL replace the `body` `background-image` radial gradients (currently using `#2e2000` and `#1e1400`) with gradients composed entirely of light yellow or amber tones with no Dark_Color stops.
3. WHEN the app is rendered at any viewport width, THE Body_Background SHALL contain no color value with a relative luminance below 0.10.

---

### Requirement 2: Replace All Dark Color Tokens with Yellow-Palette Equivalents

**User Story:** As a developer maintaining the app, I want all color tokens to map to the new yellow palette, so that every component that references a token automatically adopts the correct color without per-component overrides.

#### Acceptance Criteria

1. THE Theme_System SHALL update the `--color-ink` token (currently `#1a1200`) to a deep warm brown with sufficient contrast against light backgrounds (e.g. `#3B2800` or `#4A3000`), maintaining WCAG_AA contrast of at least 4.5:1 against the new Page_Panel background.
2. THE Theme_System SHALL update the `--color-ink-muted` token (currently `#5c4500`) to a medium warm brown that achieves at least 4.5:1 contrast against the new Page_Panel background.
3. THE Theme_System SHALL update the `--color-ink-faint` token (currently `#c8ae48`) to a soft golden tone used only for decorative or non-essential text, with no requirement for AA body-text contrast.
4. THE Theme_System SHALL update the `--color-rose` token to a bright yellow (e.g. `#FFD600` or `#FFE500`) — this token is already yellow in the current codebase and SHALL be verified to remain so.
5. THE Theme_System SHALL update the `--color-rose-deep` token (currently `#b8860b`) to a warm amber-brown that achieves at least 4.5:1 contrast against light card backgrounds.
6. THE Theme_System SHALL update the `--color-rose-light` token to a pale yellow tint (e.g. `#FFFDE0` or `#FFFBCC`) suitable for hover states and tag backgrounds.
7. THE Theme_System SHALL update the `--color-cream` and `--color-cream-dark` tokens to off-white or pale yellow values (e.g. `#FFFEF5`, `#FFF9DC`) with no Dark_Color component.
8. THE Theme_System SHALL update the `--color-parchment` token to a light warm yellow (e.g. `#FFF3C4`) — this is already light and SHALL be verified to remain so.
9. THE Theme_System SHALL update the `--color-card` token to a light yellow-tinted white (e.g. `#FFFEF5`) with no Dark_Color component.
10. THE Theme_System SHALL update the `--color-border` and `--color-gold-soft` tokens to light yellow-gold values (e.g. `#DDB830`, `#E8C84A`) that provide visible but non-harsh card borders.
11. THE Theme_System SHALL update the `--color-gold` token to a warm amber suitable for secondary text and decorative elements (e.g. `#9A7000`), achieving at least 3:1 contrast against the Page_Panel background for UI component use.
12. THE Theme_System SHALL update the `--color-gold-faint` token to a very pale yellow (e.g. `#FFF5CC`) for subtle background fills.
13. THE Theme_System SHALL update the `--color-blush` token to a pale warm yellow (e.g. `#FFFDE7`) with no pink or rose hue.
14. THE Theme_System SHALL update the `--color-amber` and `--color-amber-soft` tokens to warm golden-yellow values (e.g. `#F59F00`, `#FFE08A`) consistent with the yellow palette.
15. IF a Color_Token is referenced in both the `@theme` block and the `:root` block of `index.css`, THEN THE Theme_System SHALL update both declarations to the same value to prevent token drift.

---

### Requirement 3: Update the Page Panel and Paper Card Surfaces

**User Story:** As a user reading letters, I want the content surfaces to feel like warm, bright paper, so that the yellow theme is cohesive from background to foreground.

#### Acceptance Criteria

1. THE Page_Panel SHALL use a background color of off-white or pale yellow (e.g. `#FFFEF5`) with no Dark_Color component.
2. THE Page_Panel SHALL use a `border` color drawn from the updated `gold-soft` token, with no dark border values.
3. THE Page_Panel `box-shadow` SHALL use only warm yellow or amber shadow tones — the current near-black shadow value `rgba(18, 9, 0, 0.55)` SHALL be replaced with a warm amber or golden shadow (e.g. `rgba(180, 120, 0, 0.18)`).
4. THE Paper_Card SHALL use a background color of light warm yellow (e.g. `#FFF3C4`) with no Dark_Color component.
5. THE Paper_Card `box-shadow` SHALL use only warm amber tones — the current `rgba(26, 18, 0, 0.1)` shadow SHALL be replaced with a warm amber equivalent.
6. WHEN a Paper_Card has the `ribbon` modifier, THE Paper_Card SHALL render its left border using the updated `gold` token color, not a dark value.

---

### Requirement 4: Update All Component-Level Hardcoded Colors

**User Story:** As a developer, I want no hardcoded dark hex values remaining in any JSX or SVG component, so that the theme is fully token-driven and maintainable.

#### Acceptance Criteria

1. THE Background_Scene SHALL replace all SVG `fill`, `stroke`, and `stopColor` values that reference dark colors (e.g. `rgba(26,18,0,…)`, `#1a1200`) with warm yellow or amber equivalents.
2. THE Background_Scene `linearGradient` (`bgRoseFade`) SHALL use only yellow and amber stop colors with no dark stops.
3. THE Background_Scene ambient glow circles SHALL use yellow or amber fill values (e.g. `rgba(255,214,0,0.12)`) — these are already yellow and SHALL be verified to remain so.
4. THE WaxSeal component `feDropShadow` `floodColor` (currently `#1a1200`) SHALL be replaced with a warm amber value (e.g. `#7A5500`) to eliminate the dark shadow.
5. THE CornerOrnament component SVG `stroke` and `fill` values (currently `#8a6820`) SHALL be updated to a warm golden tone consistent with the new `gold` token (e.g. `#9A7000` or `#B8860B`).
6. THE DecorativeLine component `bg-blush` class SHALL render using the updated `blush` token, which SHALL be a pale yellow with no dark component.
7. WHEN the `TagReplied` component renders, THE Tag SHALL use the `green-soft` background and `green-text` color — these green tokens SHALL be preserved as-is since they serve a semantic status purpose distinct from the yellow theme.
8. WHEN the `TagNew` component renders, THE Tag SHALL use the updated `rose-light` background and `rose-deep` text color from the new yellow palette.

---

### Requirement 5: Update Interactive Component States

**User Story:** As a user interacting with buttons, inputs, and form controls, I want all hover, focus, and active states to use yellow-palette colors, so that no dark colors appear during interaction.

#### Acceptance Criteria

1. THE Primary_Button SHALL use the updated `rose` token (bright yellow) as its default background, with `rose-deep` (warm amber-brown) as its hover background.
2. THE Primary_Button focus ring SHALL use the updated `gold` token color with no dark ring values.
3. THE Ghost_Button default border SHALL use the updated `gold-soft` token; hover border SHALL use the updated `rose` token; hover background SHALL use the updated `rose-light` token.
4. WHEN a text input or textarea receives focus, THE input SHALL apply `border-rose` (bright yellow border) and `bg-cream` (pale yellow background) with no dark focus colors.
5. WHEN a text input or textarea receives focus, THE input focus ring (`focus-visible:ring`) SHALL use the updated `rose` token at reduced opacity.
6. THE sign-out and destructive action buttons (currently using `text-rose-deep` and `hover:text-rose`) SHALL use the updated `rose-deep` and `rose` token values from the new palette.
7. WHEN the PinInput cells are in a filled or active state, THE cells SHALL use the updated `rose-light` background and `rose` border from the new palette, with no dark cell colors.

---

### Requirement 6: Update the Paper Texture and Letter Editor

**User Story:** As a writer composing a letter, I want the editor surface to feel like warm bright paper, so that the writing experience matches the yellow theme.

#### Acceptance Criteria

1. THE `.paper-texture` CSS class `background-image` linear gradient (currently `#fff3c4` to `#ffe898`) SHALL use light warm yellow values consistent with the updated `parchment` token.
2. THE `.letter-editor` CSS class SHALL use the updated `parchment` token as its background, the updated `gold-soft` token for its border, and the updated `ink` token for text — all with no Dark_Color values.
3. WHEN the letter editor receives focus, THE editor SHALL apply the updated `rose` token as its border color and the updated `cream` token as its background.
4. THE letter editor focus ring SHALL use the updated `rose` token at reduced opacity with no dark ring values.

---

### Requirement 7: Maintain WCAG AA Contrast on All Text/Background Pairings

**User Story:** As a user with visual accessibility needs, I want all text to remain readable against its background, so that the bright yellow theme does not sacrifice legibility.

#### Acceptance Criteria

1. THE Theme_System SHALL ensure the `ink` token text color achieves a contrast ratio of at least 4.5:1 against the `card` token background.
2. THE Theme_System SHALL ensure the `ink` token text color achieves a contrast ratio of at least 4.5:1 against the `parchment` token background.
3. THE Theme_System SHALL ensure the `ink-muted` token text color achieves a contrast ratio of at least 4.5:1 against the `card` token background.
4. THE Theme_System SHALL ensure the `rose-deep` token text color (used for error states and destructive actions) achieves a contrast ratio of at least 4.5:1 against the `rose-light` token background.
5. THE Theme_System SHALL ensure the `gold` token text color (used for dates and secondary labels) achieves a contrast ratio of at least 3:1 against the `card` token background, as it is used for large or decorative text.
6. WHEN the Primary_Button renders with white text on a `rose` (bright yellow) background, THE button SHALL achieve a contrast ratio of at least 4.5:1 — IF the bright yellow does not meet this threshold with white text, THEN THE Primary_Button SHALL use a dark warm brown text color (e.g. `#3B2800`) instead of white.
7. THE Theme_System SHALL ensure the `green-text` token achieves at least 4.5:1 contrast against the `green-soft` background for the TagReplied component.

---

### Requirement 8: Preserve Layout, Spacing, and Functionality

**User Story:** As a developer reviewing the overhaul, I want to confirm that only colors changed, so that no regressions are introduced in layout, spacing, typography, or interactive behavior.

#### Acceptance Criteria

1. THE Theme_System SHALL not alter any `font-*`, `spacing-*`, `border-radius-*`, `padding`, `margin`, `width`, `height`, or `z-index` values during the color overhaul.
2. THE Theme_System SHALL not alter any animation keyframe geometry (translate, scale, rotate values) — only color values within keyframes may change.
3. THE Theme_System SHALL not alter any component JSX structure, event handlers, routing logic, or API calls.
4. WHEN the app is rendered after the overhaul, THE app SHALL pass all existing route navigations (RecipientGate, RecipientLetterList, RecipientLetterDetail, WriterLogin, WriterDashboard, WriterNewLetter, WriterLetterDetail) without JavaScript errors.
5. THE Theme_System SHALL preserve the `green-soft` and `green-text` tokens unchanged, as they serve a semantic status role (replied state) that is intentionally distinct from the yellow palette.
