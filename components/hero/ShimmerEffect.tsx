'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isShimmering: boolean;
}

export default function ShimmerEffect({ isShimmering }: Props) {
  return (
    <AnimatePresence>
      {isShimmering && (
        <motion.div
          key="shimmer"
          className="absolute inset-0 z-10 pointer-events-none rounded-lg"
          initial={{ opacity: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)' }}
          animate={{
            opacity: [0, 1, 1, 0],
            background: [
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
              'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)',
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
            ],
          }}
          transition={{ duration: 0.4, ease: 'easeInOut', times: [0, 0.3, 0.7, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
