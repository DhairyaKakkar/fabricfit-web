'use client';

import { useState } from 'react';
import { GARMENTS, Gender, GarmentId } from '@/lib/garments';

export default function ProductsPageClient() {
  const [gender, setGender] = useState<Gender>('female');
  const [selectedId, setSelectedId] = useState<GarmentId>('casual-dress');

  const garments = GARMENTS.filter(g => g.gender === gender);
  const selected = garments.find(g => g.id === selectedId) ?? garments[0];

  const switchGender = (g: Gender) => {
    setGender(g);
    const first = GARMENTS.find(item => item.gender === g);
    if (first) setSelectedId(first.id);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F6F5F0', paddingTop: 56, overflow: 'hidden' }}>

      {/* Left: model viewer */}
      <div style={{
        width: '42%', flexShrink: 0, position: 'relative',
        background: 'radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #F1EFE9 55%, #E8E5DC 100%)',
        overflow: 'hidden',
      }}>
        {/* Soft vignette frame */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.06)',
        }} />

        {/* Model image — crossfade by key */}
        {garments.map((g) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={g.id}
            src={g.compositeSrc}
            alt={g.label}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center', zIndex: 1,
              opacity: g.id === selected.id ? 1 : 0,
              transition: 'opacity 0.45s ease',
            }}
          />
        ))}

        {/* Gentle bottom fade — subtle, not a harsh white wash */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to top, rgba(232,229,220,0.55) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Eyebrow + garment name, bottom-left */}
        <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 10 }}>
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)',
            margin: 0, marginBottom: 4,
          }}>
            Live Preview
          </p>
          <p style={{
            fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 700,
            color: '#09090b', margin: 0, lineHeight: 1,
          }}>
            {selected.label}
          </p>
        </div>

        {/* Gender toggle — top-right pill */}
        <div style={{
          position: 'absolute', top: 24, right: 24, zIndex: 10,
          display: 'flex',
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
          borderRadius: 999, padding: 4, border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          {(['female', 'male'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => switchGender(g)}
              style={{
                padding: '6px 16px', border: 'none', borderRadius: 999,
                background: gender === g ? '#09090b' : 'transparent',
                color: gender === g ? '#ffffff' : '#71717a',
                fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-inter)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {g === 'male' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      </div>

      {/* Right: catalogue */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '44px 48px 40px' }}>
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)', margin: 0, marginBottom: 12,
        }}>
          Browse the collection
        </p>
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(1.5rem, 2.2vw, 2.4rem)',
          fontWeight: 700, color: '#09090b', lineHeight: 1.1,
          letterSpacing: '-0.02em', marginBottom: '1.8rem', whiteSpace: 'nowrap',
        }}>
          Tap any style. See it on the model.
        </h2>

        <div style={{ height: 1, background: '#e5e5e3', marginBottom: 24 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {garments.map((garment) => {
            const isActive = garment.id === selectedId;
            return (
              <div
                key={garment.id}
                onClick={() => setSelectedId(garment.id)}
                style={{
                  borderRadius: 14,
                  background: isActive ? '#09090b' : '#efefed',
                  border: `1.5px solid ${isActive ? '#09090b' : 'transparent'}`,
                  cursor: 'pointer', overflow: 'hidden', aspectRatio: '4/5',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', position: 'relative',
                  transition: 'background 0.22s, border-color 0.22s, transform 0.15s',
                  boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.18)' : 'none',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={garment.floatSrc} alt={garment.label} style={{ width: '76%', height: '74%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                <span style={{
                  position: 'absolute', bottom: 12,
                  fontFamily: 'var(--font-inter)', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                  transition: 'color 0.22s', zIndex: 1,
                }}>
                  {garment.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
