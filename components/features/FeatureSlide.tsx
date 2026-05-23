'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Entrance stagger by slide id — no prop change needed in callers
const ENTRANCE_DELAY: Record<string, number> = {
  'in-store':  0,
  'web-embed': 0.12,
  'catalog':   0.24,
};

interface Props {
  children: React.ReactNode;
  id?: string;
  background?: string;
}

export default function FeatureSlide({ children, id, background = '#fafaf7' }: Props) {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const delay  = id ? (ENTRANCE_DELAY[id] ?? 0) : 0;

  return (
    <motion.section
      ref={ref}
      id={id}
      className="snap-start relative w-full overflow-hidden flex items-center min-h-screen"
      style={{ height: 'auto', minHeight: '100vh', background }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: '0 0 0 1.5px rgba(245,158,11,0.35), 0 8px 48px rgba(245,158,11,0.06)',
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.section>
  );
}
