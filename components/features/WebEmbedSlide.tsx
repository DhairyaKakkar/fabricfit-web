'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import ComingSoonPanel from './ComingSoonPanel';

const HEADLINE_WORDS = ['Plug in.', 'Let customers', 'try before', 'they buy.'];

const PLATFORMS = ['Shopify', 'WooCommerce', 'Any store'];

// Dark blue-green abstract gradient
const BG = 'radial-gradient(ellipse at 70% 30%, #0c1a2e 0%, #071018 50%, #0a0a0a 100%)';

const ORBS = [
  { size: 350, x: '60%', y: '15%', opacity: 0.08, duration: 12, color: '#0ea5e9' },
  { size: 250, x: '10%', y: '55%', opacity: 0.07, duration: 9,  color: '#6366f1' },
  { size: 150, x: '40%', y: '70%', opacity: 0.06, duration: 11, color: '#d97706' },
];

export default function WebEmbedSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="02 / Web Embed" background={BG} orbs={ORBS} id="web-embed">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: headline + platform chips */}
        <div>
          <h2
            className="leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#f0f4ff',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm mb-8"
            style={{ fontFamily: 'var(--font-inter)', color: '#94a3b8' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            One embed link. Drop it into your online store and your customers try on outfits without leaving your product page.
          </motion.p>

          {/* Platform chips */}
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform, i) => (
              <motion.span
                key={platform}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-inter)',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.7 + i * 0.1 }}
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: ComingSoonPanel */}
        <div className="flex justify-center md:justify-end">
          <ComingSoonPanel inView={inView} />
        </div>
      </div>
    </FeatureSlide>
  );
}
