'use client';

import LiquidButton from '@/components/ui/LiquidButton';
import { openTrialModal } from '@/lib/openTrialModal';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

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
          position: 'absolute', inset: 0, width: '100%', height: '100%',
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
        position: 'absolute', inset: 0, zIndex: 3,
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
          <span style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #fcd34d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>fabric showrooms.</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Fewer returns · More walk-in conversions · No studio required
        </p>
      </div>

      {/* CTA buttons */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 4,
        padding: '0 24px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Explore Pricing — white → lifts with shadow on hover */}
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

          {/* Book a Demo — ghost → fills white on hover */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600,
              color: '#ffffff', background: 'rgba(255,255,255,0.08)', textDecoration: 'none',
              borderRadius: 8, padding: '14px 36px',
              border: '1px solid rgba(255,255,255,0.35)',
              letterSpacing: '0.01em', whiteSpace: 'nowrap',
              transition: 'background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease',
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
