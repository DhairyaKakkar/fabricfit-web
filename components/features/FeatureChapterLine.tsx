'use client';

import { RefObject } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function FeatureChapterLine({ containerRef }: Props) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Dot travels from 8% to 92% of the line height
  const dotY = useTransform(smoothProgress, [0, 1], ['8%', '92%']);

  return (
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 50, height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Chapter markers */}
      {['01', '02', '03'].map((num, i) => (
        <div
          key={num}
          className="absolute text-[9px] -left-5"
          style={{
            top: `${8 + i * 42}%`,
            color: 'rgba(251,191,36,0.4)',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
          }}
        >
          {num}
        </div>
      ))}

      {/* Vertical line */}
      <div
        className="w-px h-full"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(217,119,6,0.3) 20%, rgba(217,119,6,0.3) 80%, transparent)' }}
      />

      {/* Traveling dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 7,
          height: 7,
          background: '#d97706',
          top: dotY,
          boxShadow: '0 0 8px #d97706',
          translateX: '-50%',
          left: '50%',
        }}
      />
    </div>
  );
}
