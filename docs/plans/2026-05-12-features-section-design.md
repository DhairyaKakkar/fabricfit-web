# Features Section Design — FabricFit

**Date:** 2026-05-12
**Author:** Vishesh Jain
**Status:** Approved, ready for implementation

---

## Context

FabricFit is a B2B virtual try-on SaaS targeting Indian retail store owners. The landing page currently has only a hero section. This document specifies the Features section that follows the hero.

**Audience:** Store owners / retailers making a buying decision (B2B)
**Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, dnd-kit
**Existing aesthetic:** Dark background (#0a0a0a), amber/gold accents, Playfair Display headings, Inter body, floating ambient orbs

---

## Visual Direction

Editorial maximalism — full-bleed immersive imagery per feature, large overlapping serif typography directly on the visual (no containing cards/boxes), floating ambient orbs with `mix-blend-mode: screen`, scroll-triggered entrance animations. Reference: Cevra.app editorial style.

---

## Layout Architecture

- Three stacked `min-h-screen` sections, one per feature
- Fixed vertical chapter progress line on the left edge — amber dot travels down as user scrolls
- Background images crossfade with 0.3s blur dissolve at section boundaries
- Global floating amber orbs (2–3 per section), slow drift animation, matching hero

---

## Feature 1 — In-Store Try-On

**Section label:** `01 / In-Store`

**Background:** Moody warm-lit boutique interior — fabric bolts, hangers, soft store lighting. Dark overlay for text legibility.

**Headline (Playfair Display, large):**
> "Walk in a customer. Walk out a sale."
Split across 2–3 lines, top-center or center-left placement.

**Supporting copy (Inter, small):**
Short 2-sentence description: store staff uploads a customer photo, AI matches it against the store's fabric/outfit inventory, customer approves on the spot.

**Floating workflow cards (3–4 items):**
- `📸 Upload photo`
- `🧵 Match fabric`
- `✓ Customer approves`
Cards drift in from bottom-right with staggered delays.

**Ambient element:** Soft amber radial glow blooms behind the headline on scroll entry.

**Scroll animations:**
- Headline words stagger in one-by-one (Framer Motion `staggerChildren`)
- Workflow cards float up from `y: 40` to `y: 0` with staggered delays
- Orbs drift on loop

---

## Feature 2 — Web Embed *(Coming Soon)*

**Section label:** `02 / Web Embed`

**Background:** Dark abstract — browser/laptop frame partially visible, soft blue-green gradient haze. Intentionally minimal and "locked" feeling.

**Headline (Playfair Display, large):**
> "Plug in. Let customers try before they buy."

**Supporting copy:** One sentence explaining the embed widget for Shopify, WooCommerce, and other ecommerce platforms.

**Platform chips:** Shopify + WooCommerce logos as small frosted-glass pills, floating in staggered.

**Coming Soon overlay:** Large frosted glass panel covers ~40% of section. Contains:
- Pulsing amber `Coming Soon` badge
- Small text: "Launching Q3 2026 — join the waitlist"
- Email input field + submit button
- Blurred content visible behind frosted panel (teaser effect)

**Scroll animations:**
- Frosted panel slides in from the right (`x: 100` → `x: 0`)
- Platform logos float in staggered from below
- Badge pulses on loop (amber glow)

---

## Feature 3 — Catalog Builder

**Section label:** `03 / Catalog Builder`

**Background:** Close-up fabric texture — rich silk, visible threads, warm amber/brown tones. Tactile and physical feeling.

**Headline (Playfair Display, large):**
> "No shoot. No agency. Just your catalog."
Offset to the right side.

**Supporting copy:** One sentence — use virtual try-on to compose catalog pages and export as PDF, no photoshoot required.

**Animated catalog fan:** 3 illustrated flat PDF "pages" spread like playing cards from a single stacked pile as the section scrolls into view. Cards rotate slightly (±5–10°).

**Floating stat chips:** `Export PDF` · `Any outfit` · `Any model` — drift in from left.

**Scroll animations:**
- Pages fan out from stack on scroll entry
- Chips drift in from left with stagger
- Headline slides in from right

---

## Global Components to Build

| Component | Description |
|---|---|
| `FeaturesSection.tsx` | Parent wrapper, manages scroll progress |
| `FeatureChapterLine.tsx` | Fixed left-edge vertical line + scrolling amber dot |
| `FeatureSlide.tsx` | Reusable full-viewport section with bg image + overlay |
| `WorkflowCard.tsx` | Floating mini-card for feature 1 workflow steps |
| `ComingSoonPanel.tsx` | Frosted glass overlay with email capture for feature 2 |
| `CatalogFan.tsx` | Animated fanning PDF page stack for feature 3 |
| `AmbientOrb.tsx` | Reusable drifting orb (already exists in spirit from hero — extract/reuse) |

---

## Assets Needed

- Feature 1 bg: boutique interior photo (dark/moody) — placeholder ok for now
- Feature 2 bg: dark abstract tech visual — can generate with CSS gradient
- Feature 3 bg: fabric texture photo (silk/thread close-up) — placeholder ok for now
- PDF page illustrations: simple flat SVGs, 3 variants

---

## Out of Scope

- Actual waitlist backend (email input UI only, no API)
- Real customer photos or try-on functionality
- Mobile-specific layout (desktop-first, mobile pass later)
