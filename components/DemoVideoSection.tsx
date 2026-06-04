export default function DemoVideoSection() {
  return (
    <section style={{
      background: '#09090b',
      padding: 'clamp(5rem, 10vw, 9rem) 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        {/* Label */}
        <span style={{
          display: 'inline-block',
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.8)',
          border: '1px solid rgba(201,168,76,0.2)',
          padding: '4px 16px',
          borderRadius: 999,
          marginBottom: '1.5rem',
        }}>
          Watch the Demo
        </span>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          margin: '0 0 1.1rem',
        }}>
          Two minutes.<br />That&apos;s all it takes.
        </h2>

        {/* Sub */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
          color: 'rgba(255,255,255,0.42)',
          maxWidth: 480,
          margin: '0 auto 3.5rem',
          lineHeight: 1.75,
        }}>
          A live try-on with real fabric photos — no studio, no model, no agency involved.
        </p>

        {/* Video player */}
        <div style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          background: '#111314',
          aspectRatio: '16/9',
        }}>
          <video
            src="/videos/app-demo.mp4"
            controls
            playsInline
            preload="none"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Caption */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'rgba(255,255,255,0.2)',
          marginTop: '1.25rem',
          letterSpacing: '0.04em',
        }}>
          Recorded live on TrialRoomStudio · No post-production
        </p>

      </div>
    </section>
  );
}
