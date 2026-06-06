const SEGMENT = '30-SECOND TRY-ONS · NO PHOTOSHOOT · WHATSAPP DELIVERY · FABRIC TO LOOK · ';

export default function MarqueeDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 52,
        overflow: 'hidden',
        backgroundColor: '#1C1206',
        display: 'flex',
        alignItems: 'center',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 40s linear infinite' }}>
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#D9A046',
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
