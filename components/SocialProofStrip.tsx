const STATS = [
  { value: '120+', label: 'Fabric showrooms' },
  { value: '12,000+', label: 'Try-ons generated' },
  { value: '3 countries', label: 'India · Singapore · UAE' },
  { value: 'NTU-backed', label: 'Nanyang Technological University' },
];

export default function SocialProofStrip() {
  return (
    <section style={{ background: '#ffffff', borderBottom: '1px solid #e4e4e7' }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '32px 32px',
        display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px 16px',
      }}>
        {STATS.map(({ value, label }) => (
          <div key={value} style={{ textAlign: 'center', flex: '1 1 160px' }}>
            <p style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
              fontWeight: 700,
              color: '#09090b',
              margin: 0,
              lineHeight: 1,
            }}>
              {value}
            </p>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'rgba(0,0,0,0.38)',
              margin: '7px 0 0',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
