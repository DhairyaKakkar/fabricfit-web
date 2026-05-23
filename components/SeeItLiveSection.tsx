'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HeroSection from './hero/HeroSection';

export default function SeeItLiveSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div id="see-it-live" ref={ref} style={{ position: 'relative', backgroundColor: '#ffffff' }}>

      {/* Section header — desktop only, fades in above the DnD canvas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block"
        style={{
          paddingTop: 80,
          paddingBottom: 40,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#a8a29e',
            marginBottom: 12,
          }}
        >
          Virtual Try-On · Live Demo
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 700,
            color: '#09090b',
            lineHeight: 1.1,
            margin: '0 auto',
            maxWidth: 560,
          }}
        >
          Drag a garment.<br />
          <span style={{ fontStyle: 'italic', color: '#a8a29e' }}>See it on the model.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: '#71717a',
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          Drag any fabric card onto the model — exactly as your sales staff would.
        </motion.p>
      </motion.div>

      {/* The DnD canvas — completely unchanged */}
      <HeroSection />
    </div>
  );
}
