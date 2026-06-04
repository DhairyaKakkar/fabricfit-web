import Link from 'next/link';

const PLANS = [
  {
    name: 'Pay As You Go',
    price: '₹25',
    unit: 'per try-on',
    desc: 'Perfect for getting started. No monthly commitment.',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₹2,500',
    unit: 'per month',
    desc: '200 try-ons/month. Everything you need to run a showroom.',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '₹4,500',
    unit: 'per month',
    desc: '400 try-ons/month. Multi-staff access and priority support.',
    highlight: false,
  },
];

export default function PricingTeaserSection() {
  return (
    <section style={{
      background: '#09090b',
      padding: 'clamp(5rem, 10vw, 9rem) 24px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            marginBottom: '1.25rem',
          }}>
            Simple pricing
          </span>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem',
          }}>
            Start free. Scale as you grow.
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}>
            40 free credits included. No credit card required.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: '2.5rem',
        }}>
          {PLANS.map(({ name, price, unit, desc, highlight }) => (
            <div key={name} style={{
              borderRadius: 20,
              padding: '32px 28px',
              background: highlight ? '#ffffff' : 'rgba(255,255,255,0.04)',
              border: highlight ? 'none' : '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: highlight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)',
                margin: 0,
              }}>
                {name}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  color: highlight ? '#09090b' : '#ffffff',
                  lineHeight: 1,
                }}>
                  {price}
                </span>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                  color: highlight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)',
                }}>
                  {unit}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                color: highlight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/pricing" style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: 2,
            letterSpacing: '0.02em',
          }}>
            View full pricing &amp; annual plans →
          </Link>
        </div>

      </div>
    </section>
  );
}
