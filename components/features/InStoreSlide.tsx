'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import FabricWheel from './FabricWheel';

const STEPS = [
  { emoji: '📸', label: 'Upload customer photo' },
  { emoji: '🧵', label: 'Select fabric & outfit' },
  { emoji: '⚡', label: 'AI generates look in seconds' },
  { emoji: '✅', label: 'Customer approves instantly' },
];

export default function InStoreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <FeatureSlide id="in-store" background="#fafaf7">
      {/* Ghost number */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(200px, 30vw, 380px)',
          fontWeight: 700,
          color: 'rgba(146,64,14,0.04)',
          bottom: '-6%',
          left: '-1%',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        01
      </div>

      <div
        ref={ref}
        className="max-w-6xl mx-auto px-8 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        style={{ zIndex: 1, position: 'relative' }}
      >
        {/* Left */}
        <div>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45 }}
          >
            <div style={{ width: 24, height: 2, background: '#92400e', borderRadius: 2 }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)', color: '#92400e', letterSpacing: '0.2em' }}
            >
              In-Store Experience
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              fontWeight: 700,
              color: '#1c1917',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            {['Walk in a customer.', 'Walk out a sale.'].map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.14, type: 'spring', stiffness: 90 }}
              >
                {i === 1
                  ? <span style={{ color: '#92400e', fontStyle: 'italic' }}>{line}</span>
                  : line
                }
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-inter)', color: '#78716c', maxWidth: 320 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Staff uploads a customer photo. FabricFit overlays outfits in seconds. The customer sees themselves in the look before you stitch a single seam.
          </motion.p>

          {/* Steps */}
          <div className="relative flex flex-col gap-3">
            <motion.div
              style={{
                position: 'absolute',
                left: 20,
                top: 24,
                width: 1,
                background: 'linear-gradient(to bottom, #f59e0b 0%, transparent 100%)',
              }}
              initial={{ height: 0 }}
              animate={inView ? { height: '80%' } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
            />
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.1, type: 'spring', stiffness: 140 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#fff7ed',
                    border: '1.5px solid #f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {step.emoji}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: '#1c1917',
                    fontWeight: 500,
                  }}
                >
                  {step.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Fabric Wheel */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
        >
          <FabricWheel />
        </motion.div>
      </div>
    </FeatureSlide>
  );
}
