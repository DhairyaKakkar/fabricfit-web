'use client';

import LiquidButton from '@/components/ui/LiquidButton';
import { openTrialModal } from '@/lib/openTrialModal';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

export default function VideoSection() {
  return (
    <section
      id="hero"
      style={{ height: '100vh', position: 'relative', backgroundColor: '#09090b', overflow: 'hidden' }}
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
          fontSize: 'clamp(48px, 6.5vw, 88px)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          margin: 0,
          textShadow: '0 2px 40px rgba(0,0,0,0.45)',
        }}>
          Stop guessing.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #fcd34d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Let your customers see it on themselves.</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Fewer returns &nbsp;·&nbsp; More walk-in conversions &nbsp;·&nbsp; No studio required
        </p>
      </div>

      {/* CTA buttons */}
      <div style={{
        position: 'absolute', bottom: 48, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 4,
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <LiquidButton onClick={openTrialModal} color="#09090b" bg="#ffffff" padding="16px 44px" fontSize={16}>
            Request Access
          </LiquidButton>
          <LiquidButton
            href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio`}
            target="_blank"
            rel="noopener noreferrer"
            color="#ffffff"
            bg="#25D366"
            padding="16px 44px"
            fontSize={16}
          >
            Book a Demo
          </LiquidButton>
        </div>
      </div>
    </section>
  );
}
