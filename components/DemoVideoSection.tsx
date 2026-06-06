'use client';

import { useState } from 'react';
import Image from 'next/image';

const STEPS = [
  { num: '01', title: 'Open Showroom',       img: '/howitworks/1.png', bg: '#C9873A', textDark: false, ringClr: 'rgba(255,255,255,0.7)' },
  { num: '02', title: 'Pick Fabric & Style', img: '/howitworks/2.png', bg: '#1C1206', textDark: false, ringClr: 'rgba(255,255,255,0.6)' },
  { num: '03', title: 'Add a Photo',         img: '/howitworks/3.png', bg: '#F6F5F0', textDark: true,  ringClr: 'rgba(234,179,8,0.75)' },
  { num: '04', title: 'See the Try-On',      img: '/howitworks/4.png', bg: '#09090b', textDark: false, ringClr: 'rgba(255,255,255,0.6)' },
  { num: '05', title: 'Choose & Share',      img: '/howitworks/5.png', bg: '#7C3209', textDark: false, ringClr: 'rgba(255,255,255,0.65)' },
];

export default function DemoVideoSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: '#09090b', padding: 'clamp(4rem, 7vw, 6rem) clamp(1.5rem, 4vw, 4rem)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700,
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.22em',
          textTransform: 'uppercase', marginBottom: 14,
        }}>
          How it works
        </p>
        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 700, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0,
        }}>
          Five steps. Under two minutes.
        </h2>
      </div>

      {/* Cards row */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          style={{ display: 'flex', gap: 10, height: 'clamp(500px, 66vh, 700px)', minWidth: 640 }}
          onMouseLeave={() => setHovered(null)}
        >
          {STEPS.map((step, i) => {
            const isActive   = hovered === i;
            const isInactive = hovered !== null && !isActive;
            const numClr   = step.textDark ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.45)';
            const titleClr = step.textDark ? '#09090b'           : '#ffffff';

            return (
              <div
                key={step.num}
                onMouseEnter={() => setHovered(i)}
                style={{
                  flex: isActive ? 1.8 : isInactive ? 0.75 : 1,
                  minWidth: 0,
                  background: step.bg,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'flex 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isActive ? '0 28px 70px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                {/* Step label — top of card */}
                <div style={{
                  padding: '20px 18px 12px',
                  flexShrink: 0,
                  position: 'relative', zIndex: 2,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 800,
                    color: numClr, letterSpacing: '0.14em', display: 'block', marginBottom: 4,
                    textTransform: 'uppercase',
                  }}>
                    {step.num}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)', fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)',
                    fontWeight: 700, color: titleClr, lineHeight: 1.1, margin: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {step.title}
                  </h3>
                </div>

                {/* Image — fills remaining card, always fully visible */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    loading="lazy"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'bottom center',
                    }}
                  />

                  {/* Button pulse ring — pinned to CTA button position */}
                  {isActive && (
                    <>
                      <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 200,
                        height: 44,
                        borderRadius: 12,
                        border: `2px solid ${step.ringClr}`,
                        animation: 'btn-ping-2 1.5s ease-out infinite',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 200,
                        height: 44,
                        borderRadius: 12,
                        border: `2px solid ${step.ringClr}`,
                        animation: 'btn-ping 1.5s ease-out 0.4s infinite',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{
        fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.18)',
        textAlign: 'center', marginTop: 20, letterSpacing: '0.06em',
      }}>
        Hover any step to explore
      </p>
    </section>
  );
}
