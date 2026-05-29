'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GARMENTS, Gender, GarmentId } from '@/lib/garments';

const DESCRIPTIONS: Record<GarmentId, string> = {
  shirt:          'Crisp tailored fit for formal and casual occasions',
  kurta:          'Traditional elegance with modern everyday comfort',
  sherwani:       'Regal ceremonial wear crafted for grand occasions',
  'nehru-coat':   'Structured mandarin collar jacket with timeless appeal',
  blazer:         'Smart-casual versatility that transitions with ease',
  'casual-dress': 'Effortless silhouette for relaxed everyday moments',
  jumpsuit:       'Contemporary one-piece with a streamlined modern edge',
  anarkali:       'Flowing layers adorned with graceful embroidery work',
  saree:          'Six yards of timeless Indian draping elegance',
  lehenga:        'Celebratory ensemble rich with intricate embellishment',
};

const TAGS: Record<GarmentId, string[]> = {
  shirt:          ['Formal', 'Casual'],
  kurta:          ['Traditional', 'Festive'],
  sherwani:       ['Wedding', 'Ceremonial'],
  'nehru-coat':   ['Smart', 'Festive'],
  blazer:         ['Business', 'Casual'],
  'casual-dress': ['Everyday', 'Summer'],
  jumpsuit:       ['Modern', 'Statement'],
  anarkali:       ['Festive', 'Traditional'],
  saree:          ['Wedding', 'Formal'],
  lehenga:        ['Bridal', 'Festive'],
};

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
      backgroundColor: '#ffffff',
      paddingTop: 56,
      overflow: 'hidden',
    }}>

      {/* ── Left: model viewer ─────────────────────────────────── */}
      <div style={{
        width: '42%',
        flexShrink: 0,
        position: 'relative',
        background: '#f4f4f4',
        overflow: 'hidden',
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Model image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={selected.compositeSrc}
            src={selected.compositeSrc}
            alt={selected.label}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.42, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              zIndex: 2,
            }}
          />
        </AnimatePresence>

        {/* Bottom vignette */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, rgba(244,244,244,0.98) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* Top vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to bottom, rgba(244,244,244,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* Garment label tag — top left */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          borderRadius: 8,
          padding: '6px 12px',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={selected.id + '-tag'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#09090b',
              }}
            >
              {selected.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Gender toggle — bottom center */}
        <div style={{
          position: 'absolute',
          bottom: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: 999,
          padding: 4,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          {(['male', 'female'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => switchGender(g)}
              style={{
                padding: '8px 24px',
                borderRadius: 999,
                border: 'none',
                background: gender === g ? '#09090b' : 'transparent',
                color: gender === g ? '#ffffff' : '#71717a',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'background 0.22s, color 0.22s',
              }}
            >
              {g === 'male' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: catalogue ───────────────────────────────────── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 44px 40px',
      }}>

        {/* Page header */}
        <div style={{ marginBottom: 10 }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            marginBottom: 10,
          }}>
            Virtual Catalogue &nbsp;·&nbsp; {gender === 'male' ? 'Menswear' : 'Womenswear'} &nbsp;·&nbsp; {garments.length} Styles
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id + '-info'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h1 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                fontWeight: 700,
                color: '#09090b',
                lineHeight: 1.08,
                marginBottom: 6,
              }}>
                {selected.label}
              </h1>

              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                color: '#71717a',
                lineHeight: 1.6,
                maxWidth: 340,
                marginBottom: 10,
              }}>
                {DESCRIPTIONS[selected.id]}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6 }}>
                {TAGS[selected.id].map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: '#52525b',
                      background: '#f4f4f5',
                      borderRadius: 6,
                      padding: '4px 10px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 16 }} />

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
              gap: 14,
            }}
          >
            {garments.map((garment, i) => {
              const isActive = garment.id === selectedId;
              return (
                <motion.div
                  key={garment.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.24 }}
                  whileHover={{ y: isActive ? 0 : -4, transition: { duration: 0.15 } }}
                  onClick={() => setSelectedId(garment.id)}
                  style={{
                    borderRadius: 18,
                    background: isActive ? '#09090b' : garment.placeholderColor,
                    border: `1.5px solid ${isActive ? '#09090b' : 'transparent'}`,
                    boxShadow: isActive
                      ? '0 16px 40px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    aspectRatio: '4/5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'box-shadow 0.22s, background 0.22s',
                  }}
                >
                  {/* Garment image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={garment.floatSrc}
                    alt={garment.label}
                    style={{
                      width: '78%',
                      height: '76%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />

                  {/* Garment name */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    fontFamily: 'var(--font-inter)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.35)',
                    transition: 'color 0.22s',
                    zIndex: 1,
                  }}>
                    {garment.label}
                  </div>

                  {/* Active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.65)',
                          zIndex: 2,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
