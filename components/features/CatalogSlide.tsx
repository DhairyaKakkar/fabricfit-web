'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

const CHIPS = [
  { label: 'Export PDF' },
  { label: 'Any outfit' },
  { label: 'Any model' },
  { label: 'No studio' },
];

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

        {/* Text + visual */}
        <div className="max-w-6xl mx-auto px-5 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-8 md:py-0">
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
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
          >
            <Image
              src="/features3.png"
              alt="Catalog builder"
              width={480}
              height={480}
              className="w-full max-w-[480px] h-auto rounded-2xl"
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
        </div>
      </div>
    </FeatureSlide>
  );
}
