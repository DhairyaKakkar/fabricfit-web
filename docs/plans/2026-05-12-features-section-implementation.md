# Features Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build three full-viewport, scroll-triggered feature sections below the hero with editorial maximalist design — floating orbs, staggered text reveals, and feature-specific animated elements.

**Architecture:** All components live in `components/features/`. Each feature is a self-contained slide component using Framer Motion's `useInView` for scroll-triggered entrance. A shared `FeatureChapterLine` uses `useScroll` + `useTransform` to animate a fixed progress dot. `FeaturesSection` composes all slides and is added to `app/page.tsx`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4 (`@theme inline` syntax), Framer Motion (`motion`, `useInView`, `useScroll`, `useTransform`, `useSpring`), TypeScript

---

## Conventions (read before writing any code)

- Every interactive/animated component needs `'use client';` as the first line.
- Tailwind CSS 4 uses `@theme inline` — no `tailwind.config.ts` exists. Use standard utility classes.
- Inline `style={{}}` for one-off values that don't map cleanly to a utility class (e.g. exact pixel sizes, CSS variables).
- Font families: `fontFamily: 'var(--font-playfair)'` for headings, `fontFamily: 'var(--font-inter)'` for body.
- Brand colors: amber (`#b45309` dark, `#d97706` mid, `#fbbf24` bright), dark bg `#0a0a0a`.
- No external image dependencies — use CSS gradients for backgrounds. All visuals are SVG or CSS.
- `useInView` from framer-motion: `{ once: true, margin: '-100px' }` for scroll-trigger.

---

## Task 1: AmbientOrb component

**File:** Create `components/features/AmbientOrb.tsx`

This is a reusable floating amber orb with slow drift animation — same spirit as the hero's ambient glow but self-contained.

**Step 1: Create the file**

```tsx
'use client';

import { motion } from 'framer-motion';

interface Props {
  size: number;       // diameter in px
  x: string;         // CSS left value e.g. '20%'
  y: string;         // CSS top value e.g. '40%'
  opacity?: number;  // 0–1, default 0.15
  duration?: number; // drift duration in seconds, default 8
  color?: string;    // default amber
}

export default function AmbientOrb({
  size,
  x,
  y,
  opacity = 0.15,
  duration = 8,
  color = '#d97706',
}: Props) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        mixBlendMode: 'screen',
        filter: 'blur(40px)',
        zIndex: 1,
      }}
      animate={{
        x: [0, 20, -15, 10, 0],
        y: [0, -18, 12, -8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
```

**Step 2: Visual check**
Import it temporarily into `app/page.tsx` inside a `<div style={{ position: 'relative', height: 200, background: '#111' }}>` and run `npm run dev` to confirm a soft amber glow drifts slowly. Then remove the temporary import.

**Step 3: Commit**
```bash
git add components/features/AmbientOrb.tsx
git commit -m "feat: add AmbientOrb component for features section"
```

---

## Task 2: FeatureSlide component

**File:** Create `components/features/FeatureSlide.tsx`

Reusable full-viewport section shell. Handles the dark overlay, background gradient, orbs, chapter label, and exposes a slot for feature-specific content.

**Step 1: Create the file**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AmbientOrb from './AmbientOrb';

interface OrbConfig {
  size: number;
  x: string;
  y: string;
  opacity?: number;
  duration?: number;
  color?: string;
}

interface Props {
  chapterLabel: string;              // e.g. '01 / In-Store'
  background: string;                // CSS background value (gradient or color)
  orbs: OrbConfig[];
  children: React.ReactNode;
  id?: string;
}

export default function FeatureSlide({ chapterLabel, background, orbs, children, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{ minHeight: '100vh', background }}
    >
      {/* Dark overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.55)', zIndex: 2 }}
      />

      {/* Ambient orbs */}
      {orbs.map((orb, i) => (
        <AmbientOrb key={i} {...orb} />
      ))}

      {/* Chapter label */}
      <motion.span
        className="absolute top-10 left-12 text-xs tracking-widest uppercase text-amber-400/70"
        style={{ fontFamily: 'var(--font-inter)', zIndex: 10 }}
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {chapterLabel}
      </motion.span>

      {/* Feature content — positioned above overlay */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </section>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/FeatureSlide.tsx
git commit -m "feat: add FeatureSlide shell component"
```

---

## Task 3: WorkflowCard component

**File:** Create `components/features/WorkflowCard.tsx`

A small floating card showing one step of the in-store workflow. Animates in from below with a delay offset.

**Step 1: Create the file**

```tsx
'use client';

import { motion } from 'framer-motion';

interface Props {
  icon: string;
  label: string;
  delay: number;
  inView: boolean;
}

export default function WorkflowCard({ icon, label, delay, inView }: Props) {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(251,191,36,0.2)',
        fontFamily: 'var(--font-inter)',
        fontSize: 13,
        color: '#fef3c7',
        whiteSpace: 'nowrap',
      }}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/WorkflowCard.tsx
git commit -m "feat: add WorkflowCard component for in-store feature slide"
```

---

## Task 4: Feature 1 — InStoreSlide

**File:** Create `components/features/InStoreSlide.tsx`

Full in-store feature section. Moody boutique background (CSS gradient simulating warm store lighting), large staggered headline, workflow cards floating in bottom-right.

**Step 1: Create the file**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import WorkflowCard from './WorkflowCard';

const HEADLINE_WORDS = ['Walk in', 'a customer.', 'Walk out', 'a sale.'];

const WORKFLOW_STEPS = [
  { icon: '📸', label: 'Upload customer photo', delay: 0.6 },
  { icon: '🧵', label: 'Match fabric & outfit',  delay: 0.75 },
  { icon: '👀', label: 'Preview in seconds',      delay: 0.9 },
  { icon: '✓',  label: 'Customer approves',       delay: 1.05 },
];

// Warm boutique lighting: deep amber-brown gradient
const BG = 'radial-gradient(ellipse at 30% 60%, #3d1a00 0%, #1a0d00 50%, #0a0a0a 100%)';

const ORBS = [
  { size: 400, x: '5%',  y: '20%', opacity: 0.12, duration: 10 },
  { size: 280, x: '70%', y: '60%', opacity: 0.09, duration: 13, color: '#92400e' },
  { size: 180, x: '45%', y: '10%', opacity: 0.07, duration: 8  },
];

export default function InStoreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="01 / In-Store" background={BG} orbs={ORBS} id="in-store">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: headline + copy */}
        <div>
          <h2
            className="leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#fef9f0',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', color: '#d6c4a0' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          >
            Your staff uploads a photo of the customer. FabricFit overlays your store&apos;s outfits — Indian or western, men&apos;s or women&apos;s — in seconds. The customer sees themselves in the look before you stitch a single seam.
          </motion.p>

          {/* Amber divider */}
          <motion.div
            className="mt-8 h-px w-16"
            style={{ background: 'linear-gradient(to right, #d97706, transparent)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
        </div>

        {/* Right: workflow cards */}
        <div className="flex flex-col gap-3 items-start md:items-end">
          {WORKFLOW_STEPS.map((step) => (
            <WorkflowCard key={step.label} {...step} inView={inView} />
          ))}

          {/* Ambient glow behind cards */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 300,
              height: 300,
              right: '5%',
              bottom: '10%',
              background: 'radial-gradient(circle, #d97706 0%, transparent 70%)',
              opacity: 0.06,
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
        </div>
      </div>
    </FeatureSlide>
  );
}
```

**Step 2: Visual check**
Add `<InStoreSlide />` temporarily to `app/page.tsx` below `<HeroSection />` and run `npm run dev`. Scroll down to verify: chapter label fades in, headline words stagger in one by one, workflow cards float up from below. Remove the temporary addition after checking.

**Step 3: Commit**
```bash
git add components/features/InStoreSlide.tsx
git commit -m "feat: add InStoreSlide — feature 1 in-store try-on"
```

---

## Task 5: ComingSoonPanel component

**File:** Create `components/features/ComingSoonPanel.tsx`

Frosted glass panel that slides in from the right. Contains a pulsing "Coming Soon" badge and an email capture input (UI only — no backend).

**Step 1: Add CSS keyframe for badge pulse to `app/globals.css`**

Open `app/globals.css` and append after the last existing keyframe block:

```css
@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(217, 119, 6, 0); }
}

.badge-pulse {
  animation: badge-pulse 2s ease-in-out infinite;
}
```

**Step 2: Create `components/features/ComingSoonPanel.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  inView: boolean;
}

export default function ComingSoonPanel({ inView }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      className="rounded-2xl p-8 md:p-10 max-w-sm"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(251,191,36,0.15)',
      }}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Badge */}
      <div
        className="badge-pulse inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
        style={{
          background: 'rgba(217,119,6,0.15)',
          border: '1px solid rgba(217,119,6,0.4)',
          fontSize: 11,
          fontFamily: 'var(--font-inter)',
          color: '#fbbf24',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fbbf24',
            display: 'inline-block',
          }}
        />
        Coming Soon
      </div>

      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          color: '#d6c4a0',
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        Launching Q3 2026 — be first to embed FabricFit in your online store.
      </p>

      {submitted ? (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#86efac' }}>
          ✓ You&apos;re on the list!
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fef9f0',
              fontFamily: 'var(--font-inter)',
            }}
          />
          <button
            onClick={() => email && setSubmitted(true)}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              background: '#d97706',
              color: '#0a0a0a',
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Notify me
          </button>
        </div>
      )}
    </motion.div>
  );
}
```

**Step 3: Commit**
```bash
git add app/globals.css components/features/ComingSoonPanel.tsx
git commit -m "feat: add ComingSoonPanel with frosted glass and email capture"
```

---

## Task 6: Feature 2 — WebEmbedSlide

**File:** Create `components/features/WebEmbedSlide.tsx`

Coming Soon section. Dark blue-green abstract background, headline on the left, frosted ComingSoonPanel on the right, platform logo chips floating in.

**Step 1: Create the file**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import ComingSoonPanel from './ComingSoonPanel';

const HEADLINE_WORDS = ['Plug in.', 'Let customers', 'try before', 'they buy.'];

const PLATFORMS = ['Shopify', 'WooCommerce', 'Any store'];

// Dark blue-green abstract gradient
const BG = 'radial-gradient(ellipse at 70% 30%, #0c1a2e 0%, #071018 50%, #0a0a0a 100%)';

const ORBS = [
  { size: 350, x: '60%', y: '15%', opacity: 0.08, duration: 12, color: '#0ea5e9' },
  { size: 250, x: '10%', y: '55%', opacity: 0.07, duration: 9,  color: '#6366f1' },
  { size: 150, x: '40%', y: '70%', opacity: 0.06, duration: 11, color: '#d97706' },
];

export default function WebEmbedSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="02 / Web Embed" background={BG} orbs={ORBS} id="web-embed">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: headline + platform chips */}
        <div>
          <h2
            className="leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#f0f4ff',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm mb-8"
            style={{ fontFamily: 'var(--font-inter)', color: '#94a3b8' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            One embed link. Drop it into your online store and your customers try on outfits without leaving your product page.
          </motion.p>

          {/* Platform chips */}
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform, i) => (
              <motion.span
                key={platform}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-inter)',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.7 + i * 0.1 }}
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: ComingSoonPanel */}
        <div className="flex justify-center md:justify-end">
          <ComingSoonPanel inView={inView} />
        </div>
      </div>
    </FeatureSlide>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/WebEmbedSlide.tsx
git commit -m "feat: add WebEmbedSlide — feature 2 web embed coming soon"
```

---

## Task 7: CatalogFan component

**File:** Create `components/features/CatalogFan.tsx`

Three fanned "catalog page" SVGs that animate from a stacked pile into a spread fan on scroll entry.

**Step 1: Create the file**

```tsx
'use client';

import { motion } from 'framer-motion';

interface Props {
  inView: boolean;
}

// Three catalog page cards — each is a simple SVG rectangle with mock content lines
const PAGES = [
  { rotate: -12, x: -32, y: 8,  delay: 0.4, bg: '#1c1208', border: '#92400e' },
  { rotate:   0, x:   0, y: 0,  delay: 0.55, bg: '#1a110a', border: '#b45309' },
  { rotate:  12, x:  32, y: 8,  delay: 0.7, bg: '#1c1208', border: '#92400e' },
];

function CatalogPage({ bg, border }: { bg: string; border: string }) {
  return (
    <svg width="140" height="190" viewBox="0 0 140 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="190" rx="8" fill={bg} stroke={border} strokeWidth="1.5" />
      {/* Mock model silhouette */}
      <ellipse cx="70" cy="55" rx="18" ry="22" fill={border} opacity="0.3" />
      <rect x="48" y="80" width="44" height="60" rx="4" fill={border} opacity="0.25" />
      {/* Mock text lines */}
      <rect x="20" y="155" width="60" height="5" rx="2" fill={border} opacity="0.4" />
      <rect x="20" y="165" width="40" height="4" rx="2" fill={border} opacity="0.25" />
      {/* FabricFit logo mark */}
      <text x="105" y="20" fontSize="8" fill={border} opacity="0.5" fontFamily="serif">FF</text>
    </svg>
  );
}

export default function CatalogFan({ inView }: Props) {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 240, width: 280 }}>
      {PAGES.map((page, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ transformOrigin: 'bottom center' }}
          initial={{ rotate: 0, x: 0, y: 20, opacity: 0 }}
          animate={
            inView
              ? { rotate: page.rotate, x: page.x, y: page.y, opacity: 1 }
              : {}
          }
          transition={{ duration: 0.7, delay: page.delay, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <CatalogPage bg={page.bg} border={page.border} />
        </motion.div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/CatalogFan.tsx
git commit -m "feat: add CatalogFan animated PDF spread for catalog slide"
```

---

## Task 8: Feature 3 — CatalogSlide

**File:** Create `components/features/CatalogSlide.tsx`

Catalog builder section. Warm amber/brown fabric texture background (CSS gradient), headline offset right, catalog fan center-left, floating stat chips.

**Step 1: Create the file**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import CatalogFan from './CatalogFan';

const HEADLINE_WORDS = ['No shoot.', 'No agency.', 'Just your', 'catalog.'];

const STAT_CHIPS = [
  { label: 'Export PDF', delay: 0.8 },
  { label: 'Any outfit', delay: 0.95 },
  { label: 'Any model',  delay: 1.1 },
];

// Rich warm fabric texture simulation
const BG = 'radial-gradient(ellipse at 50% 80%, #2d1500 0%, #1a0d00 40%, #0f0a00 70%, #0a0a0a 100%)';

const ORBS = [
  { size: 500, x: '20%', y: '30%', opacity: 0.1,  duration: 14, color: '#b45309' },
  { size: 200, x: '75%', y: '20%', opacity: 0.08, duration: 9,  color: '#d97706' },
  { size: 160, x: '60%', y: '70%', opacity: 0.07, duration: 11, color: '#92400e' },
];

export default function CatalogSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="03 / Catalog Builder" background={BG} orbs={ORBS} id="catalog">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: Catalog fan + stat chips */}
        <div className="flex flex-col items-center md:items-start gap-8">
          <CatalogFan inView={inView} />

          <div className="flex flex-wrap gap-2">
            {STAT_CHIPS.map((chip) => (
              <motion.span
                key={chip.label}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(217,119,6,0.12)',
                  border: '1px solid rgba(217,119,6,0.3)',
                  color: '#fbbf24',
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.05em',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: chip.delay }}
              >
                {chip.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: headline + copy */}
        <div>
          <h2
            className="leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#fef9f0',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', color: '#d6c4a0' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            Dress virtual models in your collection and generate a full catalog — no studio, no photographer, no cost. Export as PDF and share with buyers the same day.
          </motion.p>

          <motion.div
            className="mt-8 h-px w-16"
            style={{ background: 'linear-gradient(to right, #d97706, transparent)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
        </div>
      </div>
    </FeatureSlide>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/CatalogSlide.tsx
git commit -m "feat: add CatalogSlide — feature 3 catalog builder"
```

---

## Task 9: FeatureChapterLine component

**File:** Create `components/features/FeatureChapterLine.tsx`

Fixed left-edge vertical line with an amber dot that travels down as the user scrolls through the features section. Uses `useScroll` scoped to the features section container.

**Step 1: Create the file**

```tsx
'use client';

import { useRef, RefObject } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function FeatureChapterLine({ containerRef }: Props) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Dot travels from 8% to 92% of the line height
  const dotY = useTransform(smoothProgress, [0, 1], ['8%', '92%']);

  return (
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 50, height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Chapter markers */}
      {['01', '02', '03'].map((num, i) => (
        <div
          key={num}
          className="absolute text-[9px] -left-5"
          style={{
            top: `${8 + i * 42}%`,
            color: 'rgba(251,191,36,0.4)',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
          }}
        >
          {num}
        </div>
      ))}

      {/* Vertical line */}
      <div
        className="w-px h-full"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(217,119,6,0.3) 20%, rgba(217,119,6,0.3) 80%, transparent)' }}
      />

      {/* Traveling dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 7,
          height: 7,
          background: '#d97706',
          top: dotY,
          boxShadow: '0 0 8px #d97706',
          translateX: '-50%',
          left: '50%',
        }}
      />
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/FeatureChapterLine.tsx
git commit -m "feat: add FeatureChapterLine scroll progress indicator"
```

---

## Task 10: FeaturesSection parent component

**File:** Create `components/features/FeaturesSection.tsx`

Composes InStoreSlide, WebEmbedSlide, CatalogSlide, and FeatureChapterLine into one exported component. The `containerRef` is passed to `FeatureChapterLine` so the scroll progress is scoped to only the features section.

**Step 1: Create the file**

```tsx
'use client';

import { useRef } from 'react';
import FeatureChapterLine from './FeatureChapterLine';
import InStoreSlide from './InStoreSlide';
import WebEmbedSlide from './WebEmbedSlide';
import CatalogSlide from './CatalogSlide';

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} id="features">
      <FeatureChapterLine containerRef={containerRef} />
      <InStoreSlide />
      <WebEmbedSlide />
      <CatalogSlide />
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add components/features/FeaturesSection.tsx
git commit -m "feat: add FeaturesSection parent component"
```

---

## Task 11: Wire FeaturesSection into the page

**File:** Modify `app/page.tsx`

**Step 1: Add the import and component**

Current `app/page.tsx`:
```tsx
import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  );
}
```

New `app/page.tsx`:
```tsx
import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import FeaturesSection from '@/components/features/FeaturesSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
```

**Step 2: Update the Navbar's "Features" link**

Open `components/nav/Navbar.tsx` and update the Features nav link href to `#features` so it scrolls to the section.

**Step 3: Visual verification**

Run `npm run dev` and verify:
- [ ] Hero section unchanged
- [ ] Scrolling past hero reveals Feature 1 (warm amber boutique feel, headline staggers in, workflow cards float up)
- [ ] Feature 2 has dark blue-green tone, frosted ComingSoonPanel slides in from right, badge pulses
- [ ] Feature 3 has warm brown/amber tone, catalog pages fan out from a stack, stat chips drift in from left
- [ ] Fixed left-edge chapter line appears with traveling amber dot during features scroll
- [ ] Ambient orbs drift slowly in each section
- [ ] Navbar "Features" link scrolls to the section

**Step 4: Commit**
```bash
git add app/page.tsx components/nav/Navbar.tsx
git commit -m "feat: wire FeaturesSection into page and update navbar link"
```

---

## Done

All components committed. The features section is ready for real photography assets — swap CSS gradient backgrounds for `<Image>` components with `objectFit: cover` once photos are available.
