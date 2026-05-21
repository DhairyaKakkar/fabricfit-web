'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

const CHIPS = [
  { label: 'Export PDF' },
  { label: 'Any outfit' },
  { label: 'Any model' },
  { label: 'No studio' },
];

const MARQUEE_ITEMS = [
  { color: '#e2e8f0', label: 'Silk Saree', price: '₹4,200' },
  { color: '#dcfce7', label: 'Cotton Kurta', price: '₹1,800' },
  { color: '#fae8ff', label: 'Chiffon Dupatta', price: '₹950' },
  { color: '#fef9c3', label: 'Banarasi Lehenga', price: '₹12,500' },
  { color: '#fee2e2', label: 'Anarkali Suit', price: '₹3,400' },
  { color: '#e0f2fe', label: 'Sherwani', price: '₹8,800' },
  { color: '#f0fdf4', label: 'Linen Salwar', price: '₹2,200' },
  { color: '#ede9fe', label: 'Georgette Saree', price: '₹5,600' },
];

function MarqueeTrack({ reverse = false }: { reverse?: boolean }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{ display: 'flex', gap: 16, width: 'max-content' }}
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            style={{
              flexShrink: 0,
              width: 140,
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: 14,
              padding: '16px 14px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: item.color, marginBottom: 10 }} />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#09090b', marginBottom: 3 }}>{item.label}</p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#71717a' }}>{item.price}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function CatalogSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <FeatureSlide id="catalog" background="#f9fafb">
      <div
        className="absolute select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(200px, 30vw, 380px)', fontWeight: 700, color: 'rgba(0,0,0,0.03)', bottom: '-6%', left: '-1%', lineHeight: 1, zIndex: 0 }}
      >
        03
      </div>

      <div ref={ref} className="w-full" style={{ zIndex: 1, position: 'relative' }}>

        {/* Top: text content */}
        <div className="max-w-6xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10">
          <div>
            <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.45 }}>
              <div style={{ width: 24, height: 2, background: '#09090b', borderRadius: 2 }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: 'var(--font-inter)', color: '#09090b', letterSpacing: '0.2em' }}>
                Catalog Builder
              </span>
            </motion.div>

            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 700, color: '#09090b', lineHeight: 1.1, marginBottom: '1.2rem' }}>
              {['No shoot.', 'No agency.', 'Just your catalog.'].map((line, i) => (
                <motion.span key={i} className="block"
                  initial={{ opacity: 0, x: 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.12, type: 'spring', stiffness: 90 }}
                >
                  {i === 2 ? <span style={{ fontStyle: 'italic', color: '#52525b' }}>{line}</span> : line}
                </motion.span>
              ))}
            </h2>

            <motion.p className="text-sm leading-relaxed mb-6" style={{ fontFamily: 'var(--font-inter)', color: '#71717a', maxWidth: 320 }} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}>
              Dress virtual models in your collection. Generate a full catalog — no studio, no photographer. Export as PDF and share with buyers the same day.
            </motion.p>

            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip, i) => (
                <motion.span key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: '#ffffff', border: '1px solid #e4e4e7', color: '#09090b', fontFamily: 'var(--font-inter)' }}
                  initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                  whileHover={{ scale: 1.06, background: '#f4f4f5' }}
                >
                  {chip.label}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3rem, 7vw, 7rem)', fontWeight: 700, color: '#09090b', lineHeight: 1 }}>∞</div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#a1a1aa', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>Looks. One platform.</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom: marquee strips */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MarqueeTrack reverse={false} />
          <MarqueeTrack reverse={true} />
        </motion.div>
      </div>
    </FeatureSlide>
  );
}
