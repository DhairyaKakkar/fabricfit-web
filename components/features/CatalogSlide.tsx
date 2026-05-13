'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import CatalogFan from './CatalogFan';

const HEADLINE_WORDS = ['No shoot.', 'No agency.', 'Just your', 'catalog.'];

const STAT_CHIPS = [
  { label: 'Export PDF', delay: 0.8 },
  { label: 'Any outfit', delay: 0.95 },
  { label: 'Any model',  delay: 1.1 },
];

// Rich warm fabric texture simulation
const BG = 'radial-gradient(ellipse at 50% 80%, #2d1500 0%, #1a0d00 40%, #0f0a00 70%, #0a0a0a 100%)';

const ORBS = [
  { size: 500, x: '20%', y: '30%', opacity: 0.1,  duration: 14, color: '#b45309' },
  { size: 200, x: '75%', y: '20%', opacity: 0.08, duration: 9,  color: '#d97706' },
  { size: 160, x: '60%', y: '70%', opacity: 0.07, duration: 11, color: '#92400e' },
];

export default function CatalogSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="03 / Catalog Builder" background={BG} orbs={ORBS} id="catalog">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: Catalog fan + stat chips */}
        <div className="flex flex-col items-center md:items-start gap-8">
          <CatalogFan inView={inView} />

          <div className="flex flex-wrap gap-2">
            {STAT_CHIPS.map((chip) => (
              <motion.span
                key={chip.label}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(217,119,6,0.12)',
                  border: '1px solid rgba(217,119,6,0.3)',
                  color: '#fbbf24',
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.05em',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: chip.delay }}
              >
                {chip.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: headline + copy */}
        <div>
          <h2
            className="leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#fef9f0',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', color: '#d6c4a0' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            Dress virtual models in your collection and generate a full catalog — no studio, no photographer, no cost. Export as PDF and share with buyers the same day.
          </motion.p>

          <motion.div
            className="mt-8 h-px w-16"
            style={{ background: 'linear-gradient(to right, #d97706, transparent)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
        </div>
      </div>
    </FeatureSlide>
  );
}
