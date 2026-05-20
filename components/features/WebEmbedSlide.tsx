'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

const PLATFORMS = [
  { name: 'Shopify', dot: '#96bf48' },
  { name: 'WooCommerce', dot: '#7f54b3' },
  { name: 'Any website', dot: '#374151' },
];

function TiltCard({ inView }: { inView: boolean }) {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 30 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.35, type: 'spring', stiffness: 90 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
        border: '1px solid #e7e5e4',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
        maxWidth: 380,
        width: '100%',
        cursor: 'none',
      }}
    >
      {/* Glow overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(245,158,11,0.07) 0%, transparent 60%)`,
          zIndex: 10,
        }}
      />

      {/* Chrome */}
      <div style={{ background: '#f5f5f4', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e7e5e4' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
        <div style={{ flex: 1, marginLeft: 10, background: 'white', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#a8a29e', fontFamily: 'var(--font-inter)', border: '1px solid #e7e5e4' }}>
          yourstore.com/product
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 72, height: 88, borderRadius: 10, background: 'linear-gradient(135deg, #fef3c7, #fed7aa)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
            🧥
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, width: '80%', background: '#f5f5f4', borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 10, width: '55%', background: '#f5f5f4', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ height: 10, width: '40%', background: '#f5f5f4', borderRadius: 6, marginBottom: 16 }} />
            <motion.div
              style={{ background: '#92400e', color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 12, fontFamily: 'var(--font-inter)', fontWeight: 600, display: 'inline-block' }}
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(146,64,14,0.3)', '0 0 0 8px rgba(146,64,14,0)', '0 0 0 0 rgba(146,64,14,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Try it on
            </motion.div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: 16, marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#92400e', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
            <motion.span
              style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            Coming Q3 2026
          </div>
        </div>

        {notified ? (
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#16a34a', fontWeight: 500 }}>✓ You&apos;re on the list!</p>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, border: '1px solid #e7e5e4', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-inter)', outline: 'none', color: '#1c1917' }}
            />
            <button
              onClick={() => email && setNotified(true)}
              style={{ background: '#92400e', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-inter)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Notify me
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function WebEmbedSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <FeatureSlide id="web-embed" background="#ffffff">
      <div
        className="absolute select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(200px, 30vw, 380px)', fontWeight: 700, color: 'rgba(30,64,175,0.03)', bottom: '-6%', right: '-1%', lineHeight: 1, zIndex: 0 }}
      >
        02
      </div>

      <div
        ref={ref}
        className="max-w-6xl mx-auto px-8 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        style={{ zIndex: 1, position: 'relative' }}
      >
        {/* Left */}
        <div>
          <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.45 }}>
            <div style={{ width: 24, height: 2, background: '#1e40af', borderRadius: 2 }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: 'var(--font-inter)', color: '#1e40af', letterSpacing: '0.2em' }}>
              Web Embed
            </span>
          </motion.div>

          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 700, color: '#1c1917', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            {['Plug in.', 'Let customers try', 'before they buy.'].map((line, i) => (
              <motion.span key={i} className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, type: 'spring', stiffness: 90 }}
              >
                {i === 2 ? <span style={{ color: '#1e40af', fontStyle: 'italic' }}>{line}</span> : line}
              </motion.span>
            ))}
          </h2>

          <motion.p className="text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-inter)', color: '#78716c', maxWidth: 320 }} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.42 }}>
            One embed link. Drop it into your online store and customers try on outfits without leaving your product page.
          </motion.p>

          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p, i) => (
              <motion.span key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#f5f5f4', border: '1px solid #e7e5e4', color: '#1c1917', fontFamily: 'var(--font-inter)' }}
                initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.05, background: '#fff7ed', borderColor: '#fed7aa' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, display: 'inline-block' }} />
                {p.name}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: 3D tilt browser */}
        <div className="flex justify-end">
          <TiltCard inView={inView} />
        </div>
      </div>
    </FeatureSlide>
  );
}
