'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Does it work with all fabric types?',
    a: 'Yes — sarees, salwar suits, kurtas, lehengas, sherwanis, blazers, and more. If you can photograph the fabric, TRS can drape it on a virtual model.',
  },
  {
    q: 'Does my customer need to download anything?',
    a: 'No. The try-on runs on the TrialRoomStudio mobile app that your staff use in-store. Your customer simply watches — no app, no account, no friction.',
  },
  {
    q: 'How long does each try-on take?',
    a: 'About 15–20 seconds from uploading the fabric photo to seeing the draped result on-screen. Most showrooms run 10–15 try-ons in a single customer visit.',
  },
  {
    q: 'Are my fabric images safe?',
    a: 'Yes. Your images are stored securely in your own account and are never shared with other showrooms or third parties. You can delete them at any time.',
  },
  {
    q: 'Do I need a tech team to set this up?',
    a: 'No. You upload fabric photos directly from your phone. Most showrooms are live within 20 minutes of signing up — no IT, no agency, no configuration.',
  },
  {
    q: 'What happens when my free credits run out?',
    a: 'You can upgrade to any paid plan or top up with a one-time credit pack. There is no lock-in on the Pay As You Go plan — you only pay for what you use.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: '#fafafa', padding: 'clamp(5rem, 10vw, 9rem) 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
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
            Common questions
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
            Everything you&apos;d ask<br />before signing up.
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <div
                key={q}
                style={{
                  borderTop: i === 0 ? '1px solid rgba(0,0,0,0.08)' : undefined,
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '22px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#09090b',
                    lineHeight: 1.5,
                  }}>
                    {q}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: isOpen ? '#09090b' : 'rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d={isOpen ? 'M2 5h6' : 'M5 2v6M2 5h6'}
                        stroke={isOpen ? '#fff' : '#09090b'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 14,
                    color: 'rgba(0,0,0,0.55)',
                    lineHeight: 1.75,
                    margin: '0 0 22px',
                    paddingRight: 40,
                  }}>
                    {a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
