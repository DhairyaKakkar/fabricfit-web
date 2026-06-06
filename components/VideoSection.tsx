'use client';

import { useEffect, useState } from 'react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

function ShowroomsSpan({ hovered, onEnter, onLeave }: { hovered: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: 'inline-block',
        position: 'relative',
        pointerEvents: 'auto',
        cursor: 'default',
      }}
    >
      {/* White highlight box — fades in on hover */}
      <span style={{
        position: 'absolute',
        top: '-0.08em', bottom: '-0.1em',
        left: '-0.18em', right: '-0.18em',
        background: '#ffffff',
        borderRadius: '0.1em',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      {/* White text — shown normally */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        WebkitTextFillColor: '#ffffff',
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.15s ease-out',
        textShadow: 'none',
      }}>fabric showrooms.</span>
      {/* Dark text — appears on hover so it reads on the white box */}
      <span style={{
        position: 'absolute',
        left: 0, top: 0,
        zIndex: 2,
        color: '#09090b',
        WebkitTextFillColor: '#09090b',
        whiteSpace: 'nowrap',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        pointerEvents: 'none',
        textShadow: 'none',
      }}>fabric showrooms.</span>
    </span>
  );
}

export default function VideoSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [showroomsHovered, setShowroomsHovered] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio`;

  if (isMobile) {
    return (
      <section id="hero" style={{ backgroundColor: '#09090b' }}>
        {/* Video at natural 16:9 height — no black bars */}
        <div style={{ position: 'relative' }}>
          <video
            src="/videos/hero-video.mp4"
            poster="/videos/hero-poster.jpg"
            autoPlay loop muted playsInline
            preload="metadata"
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 20px',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(24px, 7.5vw, 40px)',
              fontWeight: 700, color: '#ffffff',
              lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0,
              textShadow: '0 2px 32px rgba(0,0,0,0.55)',
            }}>
              AI try-on for{' '}
              <ShowroomsSpan
                hovered={showroomsHovered}
                onEnter={() => setShowroomsHovered(true)}
                onLeave={() => setShowroomsHovered(false)}
              />
            </h1>
          </div>
        </div>
        {/* Buttons below video in dark strip */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
          padding: '20px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        }}>
          <a
            href="/pricing"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700,
              color: '#09090b', background: '#ffffff', textDecoration: 'none',
              borderRadius: 8, padding: '13px 28px', whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            }}
          >
            Explore Pricing →
          </a>
          <a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600,
              color: '#ffffff', background: 'rgba(255,255,255,0.08)', textDecoration: 'none',
              borderRadius: 8, padding: '13px 28px',
              border: '1px solid rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            Book a Demo
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      style={{ height: '100dvh', position: 'relative', backgroundColor: '#09090b', overflow: 'hidden' }}
    >
      {/* Video */}
      <video
        src="/videos/hero-video.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay loop muted playsInline
        preload="metadata"
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 1,
          transform: 'translateZ(0)',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Headline */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, textAlign: 'center', padding: '0 24px', pointerEvents: 'none',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(34px, 9vw, 88px)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          margin: 0,
          textShadow: '0 2px 40px rgba(0,0,0,0.45)',
        }}>
          AI try-on for{' '}
          <ShowroomsSpan
            hovered={showroomsHovered}
            onEnter={() => setShowroomsHovered(true)}
            onLeave={() => setShowroomsHovered(false)}
          />
        </h1>
      </div>

      {/* CTA buttons */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 5,
        padding: '0 24px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="/pricing"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700,
              color: '#09090b', background: '#ffffff', textDecoration: 'none',
              borderRadius: 8, padding: '14px 36px', border: 'none',
              letterSpacing: '0.01em', whiteSpace: 'nowrap',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
            }}
          >
            Explore Pricing →
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600,
              color: '#ffffff', background: 'rgba(255,255,255,0.08)', textDecoration: 'none',
              borderRadius: 8, padding: '14px 36px',
              border: '1px solid rgba(255,255,255,0.35)',
              letterSpacing: '0.01em', whiteSpace: 'nowrap',
              transition: 'background 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(255,255,255,0.18)';
              el.style.borderColor = 'rgba(255,255,255,0.65)';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(255,255,255,0.08)';
              el.style.borderColor = 'rgba(255,255,255,0.35)';
              el.style.transform = 'translateY(0)';
            }}
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
