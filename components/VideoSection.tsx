'use client';

export default function VideoSection() {
  return (
    <section className="w-full relative" style={{ backgroundColor: '#1a0a00' }}>
      <video
        src="/videos/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          display: 'block',
          maxHeight: '100vh',
          objectFit: 'cover',
        }}
      />

      {/* Whitish dim overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          pointerEvents: 'none',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            margin: 0,
          }}
        >
          The future of fabric retail.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(12px, 1.2vw, 16px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow: '0 1px 12px rgba(0,0,0,0.3)',
            margin: 0,
          }}
        >
          TrialRoomStudio — Powered by AI
        </p>
      </div>
    </section>
  );
}
