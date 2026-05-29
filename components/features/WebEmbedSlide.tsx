'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

const PLATFORMS = [
  { name: 'Shopify', dot: '#96bf48' },
  { name: 'WooCommerce', dot: '#7f54b3' },
  { name: 'Any website', dot: '#374151' },
];

export default function WebEmbedSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <FeatureSlide id="web-embed" background="#ffffff">
      <div
        className="absolute select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(200px, 30vw, 380px)', fontWeight: 700, color: 'rgba(0,0,0,0.03)', bottom: '-6%', right: '-1%', lineHeight: 1, zIndex: 0 }}
      >
        02
      </div>

      <div
        ref={ref}
        className="max-w-6xl mx-auto px-5 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-8 md:py-0"
        style={{ zIndex: 1, position: 'relative' }}
      >
        {/* Left */}
        <div>
          <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.45 }}>
            <div style={{ width: 24, height: 2, background: '#09090b', borderRadius: 2 }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: 'var(--font-inter)', color: '#09090b', letterSpacing: '0.2em' }}>
              Web Embed
            </span>
          </motion.div>

          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 700, color: '#09090b', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            {['Plug in.', 'Let customers try', 'before they buy.'].map((line, i) => (
              <motion.span key={i} className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, type: 'spring', stiffness: 90 }}
              >
                {i === 2 ? <span style={{ fontStyle: 'italic', color: '#52525b' }}>{line}</span> : line}
              </motion.span>
            ))}
          </h2>

          <motion.p className="text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-inter)', color: '#71717a', maxWidth: 320 }} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.42 }}>
            One embed link. Drop it into your online store and customers try on outfits without leaving your product page.
          </motion.p>

          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p, i) => (
              <motion.span key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', color: '#09090b', fontFamily: 'var(--font-inter)' }}
                initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.05, background: '#e4e4e7' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, display: 'inline-block' }} />
                {p.name}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: Feature visual */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.35, type: 'spring', stiffness: 80 }}
        >
          <Image
            src="/features2.png"
            alt="Web embed virtual try-on"
            width={480}
            height={480}
            className="w-full max-w-[480px] h-auto rounded-2xl"
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
      </div>
    </FeatureSlide>
  );
}
