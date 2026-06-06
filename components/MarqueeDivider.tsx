const SEGMENT = '15–20 second try-ons · No photoshoot · Works in-store · WhatsApp delivery · Fabric to look · ';

export default function MarqueeDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 44,
        overflow: 'hidden',
        background: '#ffffff',
        borderTop: '1px solid #ebebeb',
        borderBottom: '1px solid #ebebeb',
        display: 'flex',
        alignItems: 'center',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 50s linear infinite' }}>
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#a1a1aa',
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
