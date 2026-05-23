# TrialRoomStudio Website Redesign — Design Spec
**Date:** 2026-05-23  
**Status:** Approved by user

---

## Overview

Redesign the fabricfit-web marketing site to promote the video to hero position, move the drag-and-drop try-on demo into its own "See It Live" section, add premium animations throughout, and introduce Lenis smooth scrolling. Every existing feature (DnD, GSAP HowItWorks, snap scroll, mobile wheel, custom cursor) must continue to work exactly as before.

---

## Visual Tone

Option B (user-selected): warm cream/white base (`#faf9f6` / `#ffffff`), animated amber/gold ambient blobs, premium feel without going dark. Only the existing CTA section stays dark.

---

## New Section Order

| # | Section | Source | Change |
|---|---------|---------|--------|
| 1 | **Hero** | `VideoSection.tsx` | Promoted to #1, full redesign with ambient blobs + scroll-expansion + stagger headline |
| 2 | **See It Live** | `HeroSection.tsx` (models + DnD) | New section wrapper + header; internals untouched |
| 3 | **How It Works** | `HowItWorksSection.tsx` | Untouched |
| 4 | **Features** | `FeaturesSection.tsx` (3 slides) | Bento grid wrapper + hover glow + entrance animations |
| 5 | **Traction** | `TractionSection.tsx` | Untouched |
| 6 | **CTA** | `CtaSection.tsx` | Untouched |

Velocity-skew marquee dividers inserted between sections 1→2 and 3→4.

---

## Section 1 — Hero (`VideoSection.tsx` rewrite)

### Background
- `backgroundColor: #faf9f6`
- Three absolutely-positioned amber blob divs: `borderRadius: 50%`, `filter: blur(100px)`, colours `rgba(245,158,11,0.10)`, `rgba(180,100,30,0.07)`, `rgba(251,191,36,0.08)`
- Each blob animates via CSS `@keyframes` (drift + scale), durations 24s / 30s / 18s, no two in sync
- `pointerEvents: none`, `zIndex: 0`

### Headline + Subtitle
- `zIndex: 2`, positioned above blobs and video card
- Headline: "The future of fabric retail." — Playfair Display, `clamp(52px, 6.5vw, 88px)`, `color: #09090b`
- Split by word → each word wrapped in `motion.span` with: `initial={{ opacity:0, filter:'blur(4px)', y:12 }}`, `animate={{ opacity:1, filter:'blur(0px)', y:0 }}`, `transition={{ duration:0.35, delay: index*0.08, ease:'easeOut' }}`
- Subtitle: "TrialRoomStudio — Powered by AI" — Inter, 12px, uppercase, `letterSpacing: 0.18em`, `color: #78716c`, fades in at `delay: 0.9s`
- CTA buttons (WhatsApp + secondary) from existing `HeroCta`, fade in at `delay: 1.1s`. Desktop only (mobile stays as-is)

### Video Card — Scroll Expansion
- Wrapper div tracked by `useScroll({ target: sectionRef, offset: ['start start', 'end start'] })`
- `scrollYProgress` 0→0.45 maps via `useTransform` to:
  - `top`: 32 → 0 (px)
  - `left`: 32 → 0 (px)
  - `right`: 32 → 0 (px)
  - `bottom`: 32 → 0 (px)
  - `borderRadius`: 24 → 0 (px)
- All five values driven by `useSpring` for butter smoothness (`stiffness:80, damping:20`)
- Video element inside stays `width:100% height:100% objectFit:cover`
- Existing white overlay (`rgba(255,255,255,0.35)`) and existing text overlay are removed from the video (text is now above it)
- `overflow: hidden` on wrapper clips rounded corners correctly
- `zIndex: 1`

### Scroll Indicator
- Small `↓` icon, `position: absolute`, `bottom: 24px`, centered
- `motion.div` with `animate={{ y: [0,6,0] }}`, `transition={{ repeat:Infinity, duration:1.6 }}`
- Fades out when `scrollYProgress > 0.05`

### Section height
- `height: '200vh'` — gives enough scroll room for the expansion while keeping content pinned at top via `position: sticky`
- Inner content container: `position: sticky; top: 0; height: 100vh`

---

## Velocity-Skew Marquee Divider (`MarqueeDivider.tsx` — new component)

Used twice: between Hero→See It Live, and HowItWorks→Features.

```
Implementation:
- useScroll + useVelocity(scrollY) + useSpring
- velocity mapped to skewX (-8 to +8 deg) and x offset
- Text: "VIRTUAL TRY-ON · AI POWERED · FABRIC TO LOOK · 30 SECONDS ·" repeated
- Font: Inter, 13px, uppercase, letterSpacing 0.2em, color: #d4d4d4
- Height: 48px, overflow hidden, backgroundColor: white
- Two copies side by side for infinite loop (CSS translateX animation)
- Skew only triggers when |velocity| > 20
```

---

## Section 2 — "See It Live" (`SeeItLiveSection.tsx` — new wrapper)

Wraps the existing `HeroSection` component unchanged. Adds:

- `backgroundColor: #ffffff`
- Section entry header (above the existing DnD canvas):
  - Label: `"VIRTUAL TRY-ON"` — Inter 10px, uppercase, letterSpacing 0.2em, color `#a8a29e`
  - Headline: `"Try it yourself."` — Playfair Display, `clamp(32px, 4vw, 52px)`, `color: #09090b`
  - Both use `useInView` + `motion.div` entrance: `y: 20→0`, `opacity: 0→1`, staggered 0.15s apart
  - Only shown on desktop (`isMobile !== true`) since mobile has its own layout
- The existing `<HeroSection />` renders below with its full existing logic (DnD, snap, garments, mobile wheel — everything)
- `id="see-it-live"` for ScrollSnapper

### ScrollSnapper update
- Replace `'hero'` with `'see-it-live'` in SNAP_IDS (Hero section is now `200vh`, handled differently)
- Hero snap: snap to top of hero; the sticky+scroll expansion plays naturally within that 200vh
- Add `'see-it-live'` after `'video-section'` → actually video IS the hero now, so:
  - New SNAP_IDS order: `['hero', 'see-it-live', 'how-it-works', 'in-store', 'web-embed', 'catalog', 'traction', 'cta']`
  - `'hero'` = the new VideoSection (id="hero")
  - `'see-it-live'` = the new SeeItLiveSection

---

## Section 3 — How It Works

No changes. GSAP pinned animations fully preserved.

---

## Section 4 — Features (Bento upgrade)

`FeaturesSection.tsx` gets a wrapper container with entrance + hover upgrades. The three slide components (`InStoreSlide`, `WebEmbedSlide`, `CatalogSlide`) are kept exactly as-is internally.

Changes:
- Each `FeatureSlide` section gets `useInView` entrance: `y: 40→0`, `opacity: 0→1`, `duration: 0.6s`
- Each slide gets an amber hover glow border: on `mouseenter`, animate `boxShadow` from `none` → `0 0 0 1.5px rgba(245,158,11,0.4), 0 8px 40px rgba(245,158,11,0.08)` using framer-motion `whileHover` or CSS transition
- Stagger delay: InStore 0s, WebEmbed 0.1s, Catalog 0.2s

---

## Lenis Smooth Scrolling (`useLenis.ts` — new hook)

- Install `lenis` package
- `useLenis` hook initializes Lenis on mount, destroys on unmount
- Applied in a new `SmoothScrollProvider` client component, rendered in `layout.tsx`
- Lenis replaces native scroll feel site-wide on desktop
- Mobile: Lenis disabled (`touchAction` preserved for mobile wheel)
- Lenis initialized with `smoothWheel: false` — it listens to scroll position changes rather than intercepting wheel events, so it does NOT conflict with ScrollSnapper's `preventDefault` calls
- ScrollSnapper calls `element.scrollIntoView({ behavior: 'smooth' })` — Lenis intercepts native smooth scroll and applies its own easing on top, which is the desired behaviour

---

## Preserved / Untouched

| Feature | Where | Status |
|---------|-------|--------|
| Desktop DnD (drag garments onto models) | `HeroSection.tsx` internals | Untouched |
| Mobile two-column wheel layout | `HeroSection.tsx` mobile branch | Untouched |
| `pointerWithin` collision detection | `HeroSection.tsx` | Untouched |
| GSAP HowItWorks 3-page pin | `HowItWorksSection.tsx` | Untouched |
| ScrollSnapper + HowItWorks exemption | `ScrollSnapper.tsx` | Updated SNAP_IDS only |
| Custom cursor | `CustomCursor.tsx` | Untouched |
| Navbar | `Navbar.tsx` | Untouched |
| Pricing page | `app/pricing/` | Untouched |
| Mobile snap scroll exclusion | `ScrollSnapper.tsx` | Untouched |
| Video margins + rounded corners | Hero wrapper | Preserved during expansion (starts at 32px, expands on scroll) |

---

## New Files

| File | Purpose |
|------|---------|
| `components/MarqueeDivider.tsx` | Velocity-skew infinite marquee between sections |
| `components/SeeItLiveSection.tsx` | Wrapper for HeroSection with header |
| `lib/useLenis.ts` | Lenis smooth scroll hook |
| `components/SmoothScrollProvider.tsx` | Client wrapper that calls useLenis |

## Modified Files

| File | Change |
|------|--------|
| `components/VideoSection.tsx` | Full rewrite: ambient blobs, scroll-expansion, stagger headline, scroll indicator |
| `components/ScrollSnapper.tsx` | Update SNAP_IDS order only |
| `app/page.tsx` | New section order, add MarqueeDividers, SeeItLiveSection |
| `app/layout.tsx` | Add SmoothScrollProvider |
| `package.json` | Add `lenis` dependency |

---

## Constraints

- No changes to `HeroSection.tsx` internals (DnD, mobile, states, sensors)
- No changes to `HowItWorksSection.tsx`
- No changes to `TractionSection.tsx`, `CtaSection.tsx`, `Navbar.tsx`
- No changes to feature slide internals (`InStoreSlide`, `WebEmbedSlide`, `CatalogSlide`)
- Mobile layout must remain fully functional (test at <768px)
- All existing section IDs preserved for ScrollSnapper compatibility
