'use client';

import { useState } from 'react';
import Image from 'next/image';

const STEPS = [
  { num: '01', title: 'Open Showroom',       img: '/howitworks/1.png', bg: '#C9873A', textDark: false },
  { num: '02', title: 'Pick Fabric & Style', img: '/howitworks/2.png', bg: '#1C1206', textDark: false },
  { num: '03', title: 'Add a Photo',         img: '/howitworks/3.png', bg: '#F6F5F0', textDark: true  },
  { num: '04', title: 'See the Try-On',      img: '/howitworks/4.png', bg: '#09090b', textDark: false },
  { num: '05', title: 'Choose & Share',      img: '/howitworks/5.png', bg: '#7C3209', textDark: false },
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

      {/* Cards row — scrollable on mobile */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          style={{
            display: 'flex', gap: 10, alignItems: 'stretch',
            height: 'clamp(460px, 62vh, 660px)',
            minWidth: 640,
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {STEPS.map((step, i) => {
            const isActive   = hovered === i;
            const isInactive = hovered !== null && !isActive;
            const numClr     = step.textDark ? 'rgba(0,0,0,0.45)'  : 'rgba(255,255,255,0.5)';
            const titleClr   = step.textDark ? '#09090b'            : '#ffffff';

            return (
              <div
                key={step.num}
                onMouseEnter={() => setHovered(i)}
                style={{
                  flex: isActive ? 2.2 : isInactive ? 0.65 : 1,
                  minWidth: 0,
                  background: step.bg,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'flex 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '22px 20px 0',
                  boxShadow: isActive ? '0 24px 60px rgba(0,0,0,0.55)' : 'none',
                }}
              >
                {/* Step label */}
                <div style={{ flexShrink: 0, marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 800,
                    color: numClr, letterSpacing: '0.14em', display: 'block', marginBottom: 5,
                    textTransform: 'uppercase',
                  }}>
                    {step.num}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)',
                    fontWeight: 700, color: titleClr, lineHeight: 1.1, margin: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {step.title}
                  </h3>
                </div>

                {/* Phone screenshot */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '90%', maxWidth: 260,
                    transform: isActive ? 'scale(1.07)' : isInactive ? 'scale(0.93)' : 'scale(1)',
                    transformOrigin: 'bottom center',
                    transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    <Image
                      src={step.img}
                      alt={step.title}
                      width={440}
                      height={900}
                      loading="lazy"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
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
