'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

const STEPS = [
  { num: '01', label: 'Upload customer photo' },
  { num: '02', label: 'Select fabric & outfit' },
  { num: '03', label: 'AI generates look in seconds' },
  { num: '04', label: 'Customer approves instantly' },
];

export default function InStoreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <FeatureSlide id="in-store" background="#ABB0AF">
      {/* Ghost number */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(200px, 30vw, 380px)',
          fontWeight: 700,
          color: 'rgba(0,0,0,0.03)',
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
        className="max-w-6xl mx-auto px-5 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8 md:py-0"
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
            <div style={{ width: 24, height: 2, background: '#09090b', borderRadius: 2 }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)', color: '#09090b', letterSpacing: '0.2em' }}
            >
              In-Store Experience
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              fontWeight: 700,
              color: '#09090b',
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
                  ? <span style={{ fontStyle: 'italic', color: '#52525b' }}>{line}</span>
                  : line
                }
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-inter)', color: '#71717a', maxWidth: 320 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Staff uploads a customer photo. TrialRoomStudio overlays outfits in seconds. The customer sees themselves in the look before you stitch a single seam.
          </motion.p>

          {/* Steps */}
          <div className="relative flex flex-col gap-3">
            <motion.div
              style={{
                position: 'absolute',
                left: 20,
                top: 24,
                width: 1,
                background: 'linear-gradient(to bottom, #09090b 0%, transparent 100%)',
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
                    background: '#ffffff',
                    border: '1.5px solid #e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#09090b',
                    letterSpacing: '0.05em',
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid #e4e4e7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: '#09090b',
                    fontWeight: 500,
                  }}
                >
                  {step.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Feature visual */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
        >
          <Image
            src="/features1.png"
            alt="In-store virtual try-on"
            width={480}
            height={480}
            className="w-full max-w-[480px] h-auto rounded-2xl"
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
      </div>
    </FeatureSlide>
  );
}
