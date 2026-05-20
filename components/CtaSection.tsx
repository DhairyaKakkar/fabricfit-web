'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MagneticButton({ children, href, dark = false }: { children: React.ReactNode; href: string; dark?: boolean }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 36px',
        borderRadius: 100,
        fontFamily: 'var(--font-inter)',
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'none',
        background: dark ? 'rgba(0,0,0,0.2)' : '#fff',
        color: dark ? '#fff' : '#92400e',
        border: dark ? '1.5px solid rgba(255,255,255,0.25)' : 'none',
        boxShadow: dark ? 'none' : '0 8px 32px rgba(0,0,0,0.15)',
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';

  return (
    <section
      ref={ref}
      className="snap-start relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #ca8a04 0%, #92400e 45%, #7c2d12 100%)',
      }}
    >
      {/* Animated background blobs */}
      <motion.div
        style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '-20%', left: '-10%', filter: 'blur(80px)' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-10%', right: '-5%', filter: 'blur(80px)' }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Watermark */}
      <div
        className="absolute select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(100px, 20vw, 220px)', fontWeight: 700, color: 'rgba(0,0,0,0.07)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', lineHeight: 1, whiteSpace: 'nowrap' }}
      >
        2 min
      </div>

      <div className="max-w-2xl mx-auto px-8 text-center relative">
        <motion.span
          className="inline-block text-xs font-semibold tracking-widest uppercase mb-5"
          style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.22em' }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}
        >
          Get Started
        </motion.span>

        <motion.h2
          style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.08, marginBottom: '1.2rem' }}
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.1, type: 'spring', stiffness: 80 }}
        >
          See it on your fabric.<br />
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>In 2 minutes.</span>
        </motion.h2>

        <motion.p
          className="text-sm leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.65)', maxWidth: 420, margin: '0 auto 2.5rem' }}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
        >
          No setup. No contract. We&apos;ll run a live demo with your own fabric photos on a WhatsApp call — so you see exactly what your customers would see.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MagneticButton href={`https://wa.me/${waNumber}`}>
            <WhatsAppIcon />
            Chat on WhatsApp
          </MagneticButton>
          <MagneticButton href="/pricing" dark>
            See Pricing →
          </MagneticButton>
        </motion.div>

        <motion.p
          className="mt-10 text-xs"
          style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.3)' }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.5 }}
        >
          Backed by Nanyang Technological University, Singapore · No commitment required
        </motion.p>
      </div>
    </section>
  );
}
