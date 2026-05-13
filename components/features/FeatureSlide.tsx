'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AmbientOrb from './AmbientOrb';

interface OrbConfig {
  size: number;
  x: string;
  y: string;
  opacity?: number;
  duration?: number;
  color?: string;
}

interface Props {
  chapterLabel: string;              // e.g. '01 / In-Store'
  background: string;                // CSS background value (gradient or color)
  orbs: OrbConfig[];
  children: React.ReactNode;
  id?: string;
}

export default function FeatureSlide({ chapterLabel, background, orbs, children, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{ minHeight: '100vh', background }}
    >
      {/* Dark overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.55)', zIndex: 2 }}
      />

      {/* Ambient orbs */}
      {orbs.map((orb, i) => (
        <AmbientOrb key={i} {...orb} />
      ))}

      {/* Chapter label */}
      <motion.span
        className="absolute top-10 left-12 text-xs tracking-widest uppercase text-amber-400/70"
        style={{ fontFamily: 'var(--font-inter)', zIndex: 10 }}
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {chapterLabel}
      </motion.span>

      {/* Feature content — positioned above overlay */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </section>
  );
}
