'use client';

import { PLAY_STORE_URL } from '@/lib/appLinks';

function ShowroomsSpan() {
  const text = 'fabric showrooms.';
  return (
    <span className="showrooms">
      {/* Base white text — defines layout, shown when not hovered */}
      <span className="showrooms__base">{text}</span>
      {/* Single gradient-filled copy that flows through playful fabric hues on
          hover — continuous, so the glyphs never fade (no pulsing) */}
      <span aria-hidden className="showrooms__fill">{text}</span>

      <style jsx>{`
        .showrooms {
          position: relative;
          display: inline-block;
          pointer-events: auto;
          cursor: default;
          white-space: nowrap;
        }
        .showrooms__base {
          color: #ffffff;
          -webkit-text-fill-color: #ffffff;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
          transition: opacity 0.3s ease-out;
        }
        .showrooms:hover .showrooms__base {
          opacity: 0;
        }
        .showrooms__fill {
          position: absolute;
          inset: 0;
          pointer-events: none;
          /* soft, playful palette — pinks, gold, sky, lilac */
          background-image: linear-gradient(
            90deg,
            #ff6fb5,
            #ffb86b,
            #5ec8e0,
            #b78bff,
            #ff6fb5
          );
          background-size: 300% 100%;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          /* faint dark halo keeps the colourful glyphs legible over video */
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        .showrooms:hover .showrooms__fill {
          opacity: 1;
          animation: showroomsFlow 7s linear infinite;
        }
        @keyframes showroomsFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .showrooms:hover .showrooms__fill {
            animation: none;
          }
        }
      `}</style>
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
            href={PLAY_STORE_URL}
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
            Download the App
          </a>
        </div>
      </div>
    </section>
  );
}
