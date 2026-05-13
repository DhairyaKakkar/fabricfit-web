'use client';

import { motion } from 'framer-motion';

interface Props {
  size: number;       // diameter in px
  x: string;         // CSS left value e.g. '20%'
  y: string;         // CSS top value e.g. '40%'
  opacity?: number;  // 0–1, default 0.15
  duration?: number; // drift duration in seconds, default 8
  color?: string;    // default amber
}

export default function AmbientOrb({
  size,
  x,
  y,
  opacity = 0.15,
  duration = 8,
  color = '#d97706',
}: Props) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        mixBlendMode: 'screen',
        filter: 'blur(40px)',
        zIndex: 1,
      }}
      animate={{
        x: [0, 20, -15, 10, 0],
        y: [0, -18, 12, -8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
