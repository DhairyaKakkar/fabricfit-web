'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { PLAY_STORE_URL } from '@/lib/appLinks';
import { track } from '@/lib/track';

// Red gingham (checks) fabric pattern for the hover highlight box — a red base
// with two sets of darker-red stripes; overlaps read deepest. Kept red-dominant
// (no near-white cells) so the white text stays legible everywhere.
const FABRIC_BOX: CSSProperties = {
  backgroundColor: '#c4252b',
  backgroundImage: [
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 9px, transparent 9px 18px)',
    'repeating-linear-gradient(0deg,  rgba(0,0,0,0.22) 0 9px, transparent 9px 18px)',
  ].join(', '),
};

// Text stays white; on hover a fabric highlight rectangle fades in behind it.
function ShowroomsSpan() {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', cursor: 'default', pointerEvents: 'auto' }}
    >
      {/* Fabric highlight box */}
      <span
        aria-hidden
        style={{
          ...FABRIC_BOX,
          position: 'absolute',
          top: '-0.04em', bottom: '-0.12em',
          left: '-0.16em', right: '-0.16em',
          borderRadius: '0.1em',
          zIndex: 0,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.22s ease-out',
          boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.25)' : 'none',
          pointerEvents: 'none',
        }}
      />
      {/* Text — always white */}
      <span style={{ position: 'relative', zIndex: 1, color: '#ffffff', WebkitTextFillColor: '#ffffff', textShadow: '0 2px 16px rgba(0,0,0,0.35)' }}>
        fabric showrooms.
      </span>
    </span>
  );
}

export default function VideoSection() {
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
          <ShowroomsSpan />
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'clamp(13px, 1.6vw, 16px)',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.65,
          maxWidth: 560,
          margin: 0,
          textShadow: '0 1px 12px rgba(0,0,0,0.4)',
        }}>
          Your customer picks a fabric — 15 seconds later they see it stitched
          and draped on a model. In your store, on WhatsApp, or on your website.
          No photoshoot. No guesswork.
        </p>
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
            href="/demo"
            onClick={() => track('cta_click', { cta: 'hero_try_demo', location: 'hero' })}
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
            Try It Out
          </a>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('cta_click', { cta: 'hero_download_app', location: 'hero' })}
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
            Download the App
          </a>
        </div>
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.03em',
          textShadow: '0 1px 8px rgba(0,0,0,0.4)',
        }}>
          Free demo try-on · No credit card
        </p>
      </div>
    </section>
  );
}
