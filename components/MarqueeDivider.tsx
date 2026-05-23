'use client';

import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

const SEGMENT = 'VIRTUAL TRY-ON · AI POWERED · FABRIC TO LOOK · 30 SECONDS · ';
const FULL = SEGMENT.repeat(10);

export default function MarqueeDivider() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const rawSkew  = useTransform(velocity, [-2000, 0, 2000], [6, 0, -6]);
  const skewX    = useSpring(rawSkew, { stiffness: 120, damping: 30 });

  return (
    <div
      aria-hidden="true"
      style={{
        height: 44,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.045)',
        borderBottom: '1px solid rgba(0,0,0,0.045)',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          skewX,
          willChange: 'transform',
        }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map(k => (
          <span
            key={k}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d4d4d4',
            }}
          >
            {FULL}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
