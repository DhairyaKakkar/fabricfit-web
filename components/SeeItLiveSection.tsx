'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HeroSection from './hero/HeroSection';

export default function SeeItLiveSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div id="see-it-live" ref={ref} style={{ position: 'relative' }}>
      {/* Subtle label overlaid at top — desktop only */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#a8a29e',
          }}
        >
          See It Live
        </span>
        <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.1)' }} />
      </motion.div>

      {/* HeroSection entirely unchanged */}
      <HeroSection />
    </div>
  );
}
