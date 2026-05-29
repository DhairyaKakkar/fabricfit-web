'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';

// Placeholder fabric/fashion images — swap with real product shots later
const ORB_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&q=80',
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&q=80',
];

const ORBS = [
  { angle: 0 },
  { angle: Math.PI / 4 },
  { angle: Math.PI / 2 },
  { angle: (3 * Math.PI) / 4 },
  { angle: Math.PI },
  { angle: (5 * Math.PI) / 4 },
  { angle: (3 * Math.PI) / 2 },
  { angle: (7 * Math.PI) / 4 },
];

const BASE_SIZE = 450;
const BASE_RADIUS = 182;
const BASE_ORB = 78;

function ExpandingOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const [size, setSize] = useState(BASE_SIZE);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      // On mobile use almost full width, cap at BASE_SIZE
      setSize(Math.min(BASE_SIZE, vw < 768 ? vw - 32 : BASE_SIZE));
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  const scale = size / BASE_SIZE;
  const radius = Math.round(BASE_RADIUS * scale);
  const orbSize = Math.round(BASE_ORB * scale);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      {/* Outer ring */}
      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.07)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
      />
      {/* Inner ring */}
      <div
        style={{ position: 'absolute', inset: '11%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.04)' }}
      />

      {/* Center gradient circle */}
      <div
        style={{
          position: 'absolute',
          inset: '27%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e4e4e7 0%, #d4d4d8 50%, #e4e4e7 100%)',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%', background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3,
        }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 700, color: '#09090b', lineHeight: 1 }}>Try-On</p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em' }}>In Seconds</p>
        </div>
      </div>

      {/* Orbiting image cards */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orbSize,
            height: orbSize,
            top: '50%',
            left: '50%',
            marginTop: -orbSize / 2,
            marginLeft: -orbSize / 2,
            borderRadius: Math.round(18 * scale),
            overflow: 'hidden',
            border: '3px solid white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            zIndex: 10,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={inView ? {
            x: Math.cos(orb.angle) * radius,
            y: Math.sin(orb.angle) * radius,
            opacity: 1,
            scale: 1,
          } : {}}
          transition={{
            duration: 0.75,
            delay: 0.1 + i * 0.07,
            type: 'spring',
            stiffness: 65,
            damping: 16,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ORB_IMAGES[i]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

const STEPS = [
  { num: '01', label: 'Upload customer photo' },
  { num: '02', label: 'Select fabric & outfit' },
  { num: '03', label: 'AI generates look in seconds' },
  { num: '04', label: 'Customer approves instantly' },
];

export default function InStoreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <FeatureSlide id="in-store" background="#fafafa">
      {/* Ghost number */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(200px, 30vw, 380px)',
          fontWeight: 700,
          color: 'rgba(0,0,0,0.03)',
          bottom: '-6%',
          left: '-1%',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        01
      </div>

      <div
        ref={ref}
        className="max-w-6xl mx-auto px-5 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8 md:py-0"
        style={{ zIndex: 1, position: 'relative' }}
      >
        {/* Left */}
        <div>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45 }}
          >
            <div style={{ width: 24, height: 2, background: '#09090b', borderRadius: 2 }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)', color: '#09090b', letterSpacing: '0.2em' }}
            >
              In-Store Experience
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              fontWeight: 700,
              color: '#09090b',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            {['Walk in a customer.', 'Walk out a sale.'].map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.14, type: 'spring', stiffness: 90 }}
              >
                {i === 1
                  ? <span style={{ fontStyle: 'italic', color: '#52525b' }}>{line}</span>
                  : line
                }
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-inter)', color: '#71717a', maxWidth: 320 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Staff uploads a customer photo. TrialRoomStudio overlays outfits in seconds. The customer sees themselves in the look before you stitch a single seam.
          </motion.p>

          {/* Steps */}
          <div className="relative flex flex-col gap-3">
            <motion.div
              style={{
                position: 'absolute',
                left: 20,
                top: 24,
                width: 1,
                background: 'linear-gradient(to bottom, #09090b 0%, transparent 100%)',
              }}
              initial={{ height: 0 }}
              animate={inView ? { height: '80%' } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
            />
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.1, type: 'spring', stiffness: 140 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1.5px solid #e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#09090b',
                    letterSpacing: '0.05em',
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid #e4e4e7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: '#09090b',
                    fontWeight: 500,
                  }}
                >
                  {step.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Expanding orbs — fully responsive via JS measurement */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
        >
          <ExpandingOrbs />
        </motion.div>
      </div>
    </FeatureSlide>
  );
}
