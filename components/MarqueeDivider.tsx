const SEGMENT = 'VIRTUAL TRY-ON · AI POWERED · FABRIC TO LOOK · 30 SECONDS · ';

export default function MarqueeDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 44,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.045)',
        borderBottom: '1px solid rgba(0,0,0,0.045)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 28s linear infinite' }}>
        {[0, 1, 2].map(k => (
          <span
            key={k}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d4d4d4',
              paddingRight: '2em',
            }}
          >
            {SEGMENT.repeat(6)}
          </span>
        ))}
      </div>
    </div>
  );
}
