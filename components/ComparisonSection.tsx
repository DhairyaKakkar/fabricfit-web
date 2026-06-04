const ROWS = [
  { label: 'Cost per look',       traditional: '₹800 – ₹2,000',  trs: '₹25',                trsWins: true  },
  { label: 'Turnaround time',     traditional: '3 – 5 days',      trs: '90 seconds',         trsWins: true  },
  { label: 'Requires a model',    traditional: 'Yes',             trs: 'No',                 trsWins: true  },
  { label: 'Works in-store',      traditional: 'No',              trs: 'Yes',                trsWins: true  },
  { label: 'Setup time',          traditional: 'Days + agency',   trs: 'Under 20 minutes',   trsWins: true  },
  { label: 'Customer sees it',    traditional: 'Post-shoot only', trs: 'In real time',       trsWins: true  },
];

export default function ComparisonSection() {
  return (
    <section style={{ background: '#F6F5F0', padding: 'clamp(5rem, 10vw, 9rem) 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Label */}
        <span style={{
          display: 'inline-block',
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(0,0,0,0.12)',
          padding: '4px 16px',
          borderRadius: 999,
          marginBottom: '1.5rem',
        }}>
          Why switch
        </span>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          fontWeight: 700,
          color: '#09090b',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 3.5rem',
        }}>
          Replace your<br />photo studio.
        </h2>

        {/* Table */}
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>

          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: '#09090b', padding: '16px 28px',
          }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>

            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0, textAlign: 'center' }}>
              Traditional Studio
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: 'rgba(201,168,76,0.9)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0, textAlign: 'center' }}>
              TrialRoomStudio
            </p>
          </div>

          {/* Rows */}
          {ROWS.map(({ label, traditional, trs }, i) => (
            <div
              key={label}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                padding: '18px 28px',
                background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                alignItems: 'center',
              }}
            >
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: '#09090b', margin: 0 }}>
                {label}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(0,0,0,0.4)', margin: 0, textAlign: 'center' }}>
                {traditional}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: '#09090b', margin: 0, textAlign: 'center' }}>
                {trs}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
