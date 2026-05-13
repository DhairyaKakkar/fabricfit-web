'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  inView: boolean;
}

export default function ComingSoonPanel({ inView }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      className="rounded-2xl p-8 md:p-10 max-w-sm"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(251,191,36,0.15)',
      }}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Badge */}
      <div
        className="badge-pulse inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
        style={{
          background: 'rgba(217,119,6,0.15)',
          border: '1px solid rgba(217,119,6,0.4)',
          fontSize: 11,
          fontFamily: 'var(--font-inter)',
          color: '#fbbf24',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fbbf24',
            display: 'inline-block',
          }}
        />
        Coming Soon
      </div>

      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          color: '#d6c4a0',
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        Launching Q3 2026 — be first to embed FabricFit in your online store.
      </p>

      {submitted ? (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#86efac' }}>
          ✓ You&apos;re on the list!
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fef9f0',
              fontFamily: 'var(--font-inter)',
            }}
          />
          <button
            onClick={() => email && setSubmitted(true)}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              background: '#d97706',
              color: '#0a0a0a',
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Notify me
          </button>
        </div>
      )}
    </motion.div>
  );
}
