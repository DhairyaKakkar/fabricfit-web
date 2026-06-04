const TESTIMONIALS = [
  {
    quote: 'We used to lose customers who said "let me think about it". Now 7 out of 10 customers who try it on decide in the store.',
    name: 'Rajesh Kumar',
    role: 'Owner',
    business: 'Shree Textiles, Surat',
  },
  {
    quote: 'Our WhatsApp catalogue went from flat fabric photos to virtual try-ons. Customer enquiries literally doubled in the first month.',
    name: 'Priya Nair',
    role: 'Manager',
    business: 'Lakshmi Silks, Chennai',
  },
  {
    quote: 'Setup took 20 minutes. The first try-on impressed our first customer. No photoshoot, no model, no agency — nothing.',
    name: 'Mohammed Rafiq',
    role: 'Proprietor',
    business: 'Al-Noor Fabrics, Mumbai',
  },
];

export default function TestimonialsSection() {
  return (
    <section style={{ background: '#ffffff', padding: 'clamp(5rem, 10vw, 9rem) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Label */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '4px 16px',
            borderRadius: 999,
            marginBottom: '1.25rem',
          }}>
            What showrooms say
          </span>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#09090b',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Real results. Real showrooms.
          </h2>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {TESTIMONIALS.map(({ quote, name, role, business }) => (
            <div key={name} style={{
              background: '#F6F5F0',
              borderRadius: 20,
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              border: '1px solid rgba(0,0,0,0.04)',
            }}>
              {/* Quote mark */}
              <div style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 64,
                lineHeight: 0.6,
                color: 'rgba(0,0,0,0.08)',
                userSelect: 'none',
              }}>
                &ldquo;
              </div>

              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 15,
                color: 'rgba(0,0,0,0.72)',
                lineHeight: 1.7,
                margin: 0,
                flex: 1,
              }}>
                {quote}
              </p>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 20 }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: '#09090b', margin: 0 }}>
                  {name}
                </p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(0,0,0,0.38)', margin: '3px 0 0' }}>
                  {role} · {business}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
