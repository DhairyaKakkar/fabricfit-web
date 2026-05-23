'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HeroSection from './hero/HeroSection';

export default function SeeItLiveSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    // Outer div is exactly the HeroSection height (100vh).
    // The header overlays the top of the canvas absolutely so nothing overflows.
    <div id="see-it-live" ref={ref} style={{ position: 'relative' }}>

      {/* Header overlay — sits on top of the DnD canvas, desktop only */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 48,
          gap: 6,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 70%, transparent 100%)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#a8a29e',
          }}
        >
          Virtual Try-On · Live Demo
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 700,
            color: '#09090b',
            lineHeight: 1.1,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Drag a garment.{' '}
          <span style={{ fontStyle: 'italic', color: '#a8a29e' }}>See it on the model.</span>
        </h2>
      </motion.div>

      {/* HeroSection fills 100vh — exactly one viewport, no overflow */}
      <HeroSection />
    </div>
  );
}
