'use client';

import { motion } from 'framer-motion';

interface Props {
  inView: boolean;
}

// Three catalog page cards — each is a simple SVG rectangle with mock content lines
const PAGES = [
  { rotate: -12, x: -32, y: 8,  delay: 0.4, bg: '#1c1208', border: '#92400e' },
  { rotate:   0, x:   0, y: 0,  delay: 0.55, bg: '#1a110a', border: '#b45309' },
  { rotate:  12, x:  32, y: 8,  delay: 0.7, bg: '#1c1208', border: '#92400e' },
];

function CatalogPage({ bg, border }: { bg: string; border: string }) {
  return (
    <svg width="140" height="190" viewBox="0 0 140 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="190" rx="8" fill={bg} stroke={border} strokeWidth="1.5" />
      {/* Mock model silhouette */}
      <ellipse cx="70" cy="55" rx="18" ry="22" fill={border} opacity="0.3" />
      <rect x="48" y="80" width="44" height="60" rx="4" fill={border} opacity="0.25" />
      {/* Mock text lines */}
      <rect x="20" y="155" width="60" height="5" rx="2" fill={border} opacity="0.4" />
      <rect x="20" y="165" width="40" height="4" rx="2" fill={border} opacity="0.25" />
      {/* FabricFit logo mark */}
      <text x="105" y="20" fontSize="8" fill={border} opacity="0.5" fontFamily="serif">FF</text>
    </svg>
  );
}

export default function CatalogFan({ inView }: Props) {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 240, width: 280 }}>
      {PAGES.map((page, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ transformOrigin: 'bottom center' }}
          initial={{ rotate: 0, x: 0, y: 20, opacity: 0 }}
          animate={
            inView
              ? { rotate: page.rotate, x: page.x, y: page.y, opacity: 1 }
              : {}
          }
          transition={{ duration: 0.7, delay: page.delay, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <CatalogPage bg={page.bg} border={page.border} />
        </motion.div>
      ))}
    </div>
  );
}
