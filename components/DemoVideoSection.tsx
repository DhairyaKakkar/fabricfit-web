'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const STEPS = [
  {
    num: '01', title: 'Open Showroom', img: '/howitworks/1.png',
    bg: '#C9873A', textDark: false, imgPos: 'center bottom',
    desc: 'Manage your showroom from one screen. Browse recent try-ons, access your full fabric library, and track your team\'s activity — all in one place.',
    bullets: ['Your full catalogue, always with you', 'See recent customer previews instantly', 'Multi-branch support'],
  },
  {
    num: '02', title: 'Pick Fabric & Style', img: '/howitworks/2.png',
    bg: '#1C1206', textDark: false, imgPos: 'left bottom',
    desc: 'Choose a fabric from your catalogue and pick the garment type. Set the collar, length, sleeve and style — no measuring tape needed.',
    bullets: ['Saree, kurta, sherwani, suit & more', 'Collar, length, sleeve in seconds', 'Saved style presets for repeat customers'],
  },
  {
    num: '03', title: 'Add a Photo', img: '/howitworks/3.png',
    bg: '#F6F5F0', textDark: true, imgPos: 'center bottom',
    desc: 'Take a live photo of your customer in-store or upload from their gallery. No studio, no lighting setup — just point and shoot.',
    bullets: ['Works with any phone camera', 'In-store or from existing photos', 'No special equipment needed'],
  },
  {
    num: '04', title: 'See the Try-On', img: '/howitworks/4.png',
    bg: '#09090b', textDark: false, imgPos: 'center bottom',
    desc: 'AI renders the fabric on your customer in under 15–20 seconds. A photorealistic preview they can see before you stitch a single thread.',
    bullets: ['Results in under 15–20 seconds', 'Photorealistic, not a cartoon', 'Share on WhatsApp with one tap'],
  },
  {
    num: '05', title: 'Choose & Share', img: '/howitworks/5.png',
    bg: '#7C3209', textDark: false, imgPos: 'center bottom',
    desc: 'Generate multiple garment styles from the same fabric in one go. Let your customer pick their favourite and close the sale on the spot.',
    bullets: ['Suit, kurta, jodhpuri & more', 'Customer chooses from their phone', 'Export or share the catalogue look'],
  },
];

export default function DemoVideoSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile: pinned storytelling. The section sticks on screen while the
  // wrapper provides ~80vh of scroll per step — slow, deliberate, no jumpiness.
  useEffect(() => {
    if (!isMobile) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const wrap = listRef.current;
        if (!wrap) return;
        const vh = window.innerHeight;
        const r = wrap.getBoundingClientRect();
        const total = Math.max(1, r.height - vh);
        const scrolled = Math.min(Math.max(-r.top, 0), total);
        const pos = (scrolled / total) * STEPS.length; // 0..5 float
        setActiveIdx((prev) => {
          const t = Math.min(STEPS.length - 1, Math.max(0, Math.floor(pos)));
          if (t === prev) return prev;
          // gentle hysteresis — 15% into the new band before switching
          if (t > prev) return (pos - t >= 0.15 || t - prev >= 2) ? t : prev;
          return ((t + 1 - pos) >= 0.15 || prev - t >= 2) ? t : prev;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // ── Mobile: sticky stack — active card grows, others stay slim bars ───────
  if (isMobile) {
    return (
      <div ref={listRef} style={{ position: 'relative', height: `${STEPS.length * 80 + 100}svh`, background: '#09090b' }}>
        <section style={{
          position: 'sticky', top: 0, height: '100svh',
          display: 'flex', flexDirection: 'column',
          padding: '52px 16px 16px', overflow: 'hidden',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 16, flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
              How it works
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }}>
              Five steps. Under two minutes.
            </h2>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
            {STEPS.map((step, i) => {
              const isActive  = activeIdx === i;
              const titleClr  = step.textDark ? '#09090b'           : '#ffffff';
              const numClr    = step.textDark ? 'rgba(0,0,0,0.4)'   : 'rgba(255,255,255,0.45)';
              const textClr   = step.textDark ? 'rgba(0,0,0,0.7)'   : 'rgba(255,255,255,0.75)';
              const divClr    = step.textDark ? 'rgba(0,0,0,0.1)'   : 'rgba(255,255,255,0.12)';
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    flex: isActive ? '1 1 auto' : '0 0 48px',
                    minHeight: 0,
                    background: step.bg,
                    borderRadius: 16,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'flex 0.6s cubic-bezier(0.4,0,0.2,1)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Header bar — always visible */}
                  <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 800, color: numClr, letterSpacing: '0.14em' }}>
                      {step.num}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: isActive ? '1.2rem' : '1rem', fontWeight: 700, color: titleClr, lineHeight: 1.1, margin: 0, whiteSpace: 'nowrap', transition: 'font-size 0.4s ease' }}>
                      {step.title}
                    </h3>
                  </div>

                  {/* Body — fades in as the card grows */}
                  <div style={{
                    flex: 1, minHeight: 0,
                    display: 'flex', flexDirection: 'column',
                    opacity: isActive ? 1 : 0,
                    transition: isActive ? 'opacity 0.45s ease 0.2s' : 'opacity 0.15s ease',
                    pointerEvents: 'none',
                  }}>
                    <div style={{ padding: '10px 18px 0', flexShrink: 0 }}>
                      <div style={{ width: 26, height: 1, background: divClr, marginBottom: 8 }} />
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: textClr, lineHeight: 1.55, margin: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 0, marginTop: 8 }}>
                      <Image
                        src={step.img}
                        alt={step.title}
                        fill
                        loading="lazy"
                        style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <section style={{ background: '#09090b', padding: 'clamp(4rem, 7vw, 6rem) clamp(1.5rem, 4vw, 4rem)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
          How it works
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>
          Five steps. Under two minutes.
        </h2>
      </div>

      {/* Cards row */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          style={{ display: 'flex', gap: 10, height: 'clamp(540px, 70vh, 720px)', minWidth: 640 }}
          onMouseLeave={() => setHovered(null)}
        >
          {STEPS.map((step, i) => {
            const isActive   = hovered === i;
            const isInactive = hovered !== null && !isActive;
            const numClr   = step.textDark ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.4)';
            const titleClr = step.textDark ? '#09090b'           : '#ffffff';
            const textClr  = step.textDark ? 'rgba(0,0,0,0.7)'  : 'rgba(255,255,255,0.75)';
            const bulletClr= step.textDark ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.35)';
            const divClr   = step.textDark ? 'rgba(0,0,0,0.1)'  : 'rgba(255,255,255,0.1)';

            return (
              <div
                key={step.num}
                onMouseEnter={() => setHovered(i)}
                style={{
                  flex: isActive ? 2.6 : isInactive ? 0.72 : 1,
                  minWidth: 0,
                  background: step.bg,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'flex 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
                  display: 'flex',
                  boxShadow: isActive ? '0 28px 70px rgba(0,0,0,0.55)' : 'none',
                }}
              >
                {/* Image — always visible, fills card */}
                <div style={{
                  position: 'relative',
                  flex: isActive ? '0 0 52%' : '1',
                  transition: 'flex 0.45s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                }}>
                  {/* Step label over image */}
                  <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 2 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 800, color: numClr, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      {step.num}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(0.85rem, 1.4vw, 1.2rem)', fontWeight: 700, color: titleClr, lineHeight: 1.1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.title}
                    </h3>
                  </div>
                  <div style={{ position: 'absolute', top: 52, left: -35, right: -35, bottom: -10 }}>
                    <Image
                      src={step.img}
                      alt={step.title}
                      fill
                      loading="lazy"
                      style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                    />
                  </div>
                </div>

                {/* Description panel — slides in on hover */}
                <div style={{
                  flex: isActive ? '1' : '0',
                  overflow: 'hidden',
                  opacity: isActive ? 1 : 0,
                  transition: isActive
                    ? 'flex 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease 0.42s'
                    : 'flex 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.1s ease 0s',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  padding: isActive ? '28px 24px' : '0',
                  minWidth: 0,
                }}>
                  <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 700, color: titleClr, letterSpacing: '-0.01em', marginBottom: 12, lineHeight: 1.3 }}>
                    {step.title}
                  </p>
                  <div style={{ width: 28, height: 1, background: divClr, marginBottom: 14 }} />
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem, 1vw, 0.88rem)', color: textClr, lineHeight: 1.7, marginBottom: 20 }}>
                    {step.desc}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {step.bullets.map((b) => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: bulletClr, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)', color: textClr, lineHeight: 1.4 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 20, letterSpacing: '0.06em' }}>
        Hover any step to explore
      </p>
    </section>
  );
}
