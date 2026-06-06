'use client';

import { useState } from 'react';
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
    desc: 'AI renders the fabric on your customer in under 90 seconds. A photorealistic preview they can see before you stitch a single thread.',
    bullets: ['Results in under 90 seconds', 'Photorealistic, not a cartoon', 'Share on WhatsApp with one tap'],
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
                  <div style={{ position: 'absolute', top: 52, left: -20, right: -20, bottom: -10 }}>
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
