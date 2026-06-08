'use client';

import { useState } from 'react';

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
      {/* Fabric mosaic highlight box */}
      <span style={{
        position: 'absolute',
        top: '-0.08em', bottom: '-0.1em',
        left: '-0.18em', right: '-0.18em',
        borderRadius: '0.12em',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        zIndex: 0,
        overflow: 'hidden',
        display: 'flex',
        pointerEvents: 'none',
      }}>
        {[
          { src: '/fabrics/fabric1.jpg', pos: 'center center' },
          { src: '/fabrics/fabric2.jpg', pos: 'center center' },
          { src: '/fabrics/fabric3.jpg', pos: 'center center' },
          { src: '/fabrics/fabric4.jpg', pos: 'center center' },
          { src: '/fabrics/fabric2.jpg', pos: 'center 40%' },
        ].map(({ src, pos }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <span key={src} style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'block' }}>
            <img src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
          </span>
        ))}
        {/* Dark scrim so white text stays legible */}
        <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      </span>
      {/* Text — always white, readable on both video and fabric bg */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        WebkitTextFillColor: '#ffffff',
        textShadow: hovered ? 'none' : '0 2px 20px rgba(0,0,0,0.4)',
        transition: 'text-shadow 0.2s ease-out',
      }}>fabric showrooms.</span>
    </span>
  );
}

export default function VideoSection() {
  const [showroomsHovered, setShowroomsHovered] = useState(false);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio`;

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
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              boxShadow: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#09090b';
              el.style.color = '#ffffff';
              el.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#ffffff';
              el.style.color = '#09090b';
              el.style.boxShadow = 'none';
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
