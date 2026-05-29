'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GARMENTS, Gender, GarmentId } from '@/lib/garments';

export default function ProductsPageClient() {
  const [gender, setGender] = useState<Gender>('male');
  const [selectedId, setSelectedId] = useState<GarmentId>('kurta');

  const garments = GARMENTS.filter(g => g.gender === gender);
  const selected = garments.find(g => g.id === selectedId) ?? garments[0];

  const switchGender = (g: Gender) => {
    setGender(g);
    const first = GARMENTS.find(item => item.gender === g);
    if (first) setSelectedId(first.id);
  };

  return (
    <div className="snap-start" style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#F6F5F0',
      paddingTop: 56,
      overflow: 'hidden',
    }}>

      {/* ── Left: model viewer ─────────────────────────────── */}
      <div style={{
        width: '42%',
        flexShrink: 0,
        position: 'relative',
        background: '#F6F5F0',
        overflow: 'hidden',
      }}>
        {/* Model image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={selected.compositeSrc}
            src={selected.compositeSrc}
            alt={selected.label}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              zIndex: 1,
            }}
          />
        </AnimatePresence>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 180,
          background: 'linear-gradient(to top, rgba(246,245,240,0.97) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Garment name — top left */}
        <AnimatePresence mode="wait">
          <motion.span
            key={selected.id + '-label'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              zIndex: 10,
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.35)',
            }}
          >
            {selected.label}
          </motion.span>
        </AnimatePresence>

        {/* Gender toggle — bottom center */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 999,
          padding: '6px 20px',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          {(['male', 'female'] as Gender[]).map((g, i) => (
            <button
              key={g}
              onClick={() => switchGender(g)}
              style={{
                padding: '4px 18px',
                border: 'none',
                borderRight: i === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                background: 'transparent',
                color: gender === g ? '#09090b' : '#a1a1aa',
                fontSize: 11,
                fontWeight: gender === g ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
            >
              {g === 'male' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: catalogue ───────────────────────────────── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 48px 40px',
      }}>

        {/* Selected garment name */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={selected.id + '-heading'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.8rem, 4vw, 4.5rem)',
              fontWeight: 700,
              color: '#09090b',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              marginBottom: '1.8rem',
            }}
          >
            {selected.label}
          </motion.h2>
        </AnimatePresence>

        {/* Divider */}
        <div style={{ height: 1, background: '#e5e5e3', marginBottom: 24 }} />

        {/* Garment grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gender + '-grid'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            {garments.map((garment, i) => {
              const isActive = garment.id === selectedId;
              return (
                <motion.div
                  key={garment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22 }}
                  whileHover={{ y: isActive ? 0 : -3, transition: { duration: 0.15 } }}
                  onClick={() => setSelectedId(garment.id)}
                  style={{
                    borderRadius: 14,
                    background: isActive ? '#09090b' : '#efefed',
                    border: `1.5px solid ${isActive ? '#09090b' : 'transparent'}`,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    aspectRatio: '4/5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'background 0.22s, border-color 0.22s',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={garment.floatSrc}
                    alt={garment.label}
                    style={{
                      width: '76%',
                      height: '74%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 12,
                    fontFamily: 'var(--font-inter)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)',
                    transition: 'color 0.22s',
                    zIndex: 1,
                  }}>
                    {garment.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
