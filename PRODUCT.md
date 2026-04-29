# Product

## Register

product

## Users

Two roles, one relationship:

- **Writer** — a single person who logs in with email and password to compose and manage private letters. Uses a desktop or laptop, in moments of reflection or intention. The primary task is writing a letter that feels worth keeping.
- **Recipient** — a single known person who enters their name and a PIN to read the letters and reply. May use the app on any device, including mobile. The primary task is reading a letter that was written just for them, and optionally writing back.

This is a private, intimate app for two specific people — not a multi-user or social platform.

## Product Purpose

A personal letter archive: one person writes private letters to one person they care about. The recipient can read and reply; the writer can edit or delete. Letters persist. The product's success is the feeling — opening the site should feel like receiving a letter sealed with care, not logging into a tool.

## Brand Personality

Intimate, timeless, tender.

Voice: quiet confidence. No exclamation points, no FOMO, no gamification. Every word earns its place. The tone mirrors handwritten correspondence — unhurried, deliberate, warm.

## Anti-references

- Generic SaaS productivity minimalism (Linear, Notion templates) — too cold and utilitarian for this purpose.
- Overdecorated wedding/anniversary apps — too kitsch; ornament should serve atmosphere, not shout.
- Dark-mode journaling apps (Day One, Bear) — this is correspondence, not journaling; the palette should feel warm and handwritten, not writer-focused.
- AI writing tools and note-taking apps — wrong register entirely; this is for one person writing to one other person.

## Design Principles

1. **Correspondence, not software.** The interface should feel closer to opening a physical letter than loading an app. Each screen has one job; there is no navigation overload.
2. **The recipient's moment is sacred.** Reading a letter written for you should feel special. Ornament and atmosphere exist to serve this moment.
3. **The writer's flow is uninterrupted.** The composition screen gets out of the way. The tools serve the text.
4. **Restraint over decoration.** If an ornamental element doesn't add meaning or atmosphere, it shouldn't be there. Less is more credible.
5. **Private and personal at every touch.** Two-role auth with PIN is not bureaucracy — it is ceremony.

## Accessibility & Inclusion

- Target: WCAG AA
- Input font sizes pinned to minimum 16px to prevent iOS auto-zoom
- All interactive controls have explicit `<label>` elements or `aria-label`
- Reduced motion preferences respected via `prefers-reduced-motion` media query
