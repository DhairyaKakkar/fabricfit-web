'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { openTrialModal } from '@/lib/openTrialModal';

type Gender = 'female' | 'male';

// One marquee row's worth of the repeating text wall behind the center CTA.
const REPEAT_PHRASE = '20 free try-ons · '.repeat(8);

const FEMALE = [
  { id: 'casual-dress', label: 'Casual Dress', src: '/garments/casual-dress.webp', out: '/models/female-casual-dress.webp' },
  { id: 'jumpsuit',     label: 'Jumpsuit',     src: '/garments/jumpsuit.webp',     out: '/models/female-jumpsuit.webp' },
  { id: 'anarkali',     label: 'Anarkali',     src: '/garments/anarkali.webp',     out: '/models/female-anarkali.webp' },
  { id: 'saree',        label: 'Saree',        src: '/garments/saree.webp',        out: '/models/female-saree.webp' },
  { id: 'lehenga',      label: 'Lehenga',      src: '/garments/lehenga.webp',      out: '/models/female-lehenga.webp' },
];

const MALE = [
  { id: 'shirt',      label: 'Shirt',      src: '/garments/shirt.webp',      out: '/models/male-shirt.webp' },
  { id: 'kurta',      label: 'Kurta',      src: '/garments/kurta.webp',      out: '/models/male-kurta.webp' },
  { id: 'sherwani',   label: 'Sherwani',   src: '/garments/sherwani.webp',   out: '/models/male-sherwani.webp' },
  { id: 'nehru-coat', label: 'Nehru Coat', src: '/garments/nehru-coat.webp', out: '/models/male-nehru-coat.webp' },
  { id: 'blazer',     label: 'Blazer',     src: '/garments/blazer.webp',     out: '/models/male-blazer.webp' },
];

type GarmentItem = typeof FEMALE[0];

function GarmentPanel({
  garments,
  activeId,
  gender,
  side,
  onApply,
}: {
  garments: GarmentItem[];
  activeId: string;
  gender: Gender;
  side: 'left' | 'right';
  onApply: (id: string, gender: Gender) => void;
}) {
  const posStyle = side === 'left' ? { left: 14 } : { right: 14 };
  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        zIndex: 10,
        background: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 20,
        padding: '10px 7px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 7,
        fontWeight: 700,
        color: '#c4c4c4',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingBottom: 7,
        borderBottom: '1px solid rgba(0,0,0,0.055)',
        marginBottom: 2,
      }}>
        {gender === 'female' ? 'Women' : 'Men'}
      </p>
      {garments.map(g => {
        const active = g.id === activeId;
        return (
          <div
            key={g.id}
            draggable
            onClick={() => onApply(g.id, gender)}
            onDragStart={e => {
              e.dataTransfer.setData('garment', g.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            title={g.label}
            style={{
              width: 68,
              borderRadius: 12,
              padding: '6px 4px 5px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: active ? '#09090b' : 'transparent',
              boxShadow: active ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.label}
              draggable={false}
              style={{ width: 50, height: 56, objectFit: 'contain', display: 'block' }}
            />
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 7,
              fontWeight: 700,
              color: active ? '#fff' : '#b4b4b4',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              marginTop: 4,
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {g.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductsPageClient() {
  const [femaleId, setFemaleId] = useState(FEMALE[0].id);
  const [maleId,   setMaleId]   = useState(MALE[0].id);
  const [dragOver, setDragOver] = useState<Gender | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileGender, setMobileGender] = useState<Gender>('female');
  const [fReveal, setFReveal] = useState(0);
  const [mReveal, setMReveal] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    [...FEMALE, ...MALE].forEach(g => {
      const a = new window.Image(); a.src = g.src;
      const b = new window.Image(); b.src = g.out;
    });
  }, []);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFemaleId(id => FEMALE[(FEMALE.findIndex(g => g.id === id) + 1) % FEMALE.length].id);
      setMaleId(id =>   MALE  [(MALE  .findIndex(g => g.id === id) + 1) % MALE  .length].id);
      setFReveal(r => r + 1);
      setMReveal(r => r + 1);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(id: string, gender: Gender) {
    if (gender === 'female') { setFemaleId(id); setFReveal(r => r + 1); }
    else { setMaleId(id); setMReveal(r => r + 1); }
    resetTimer();
  }

  const fg = FEMALE.find(g => g.id === femaleId)!;
  const mg = MALE  .find(g => g.id === maleId)!;

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    const garments = mobileGender === 'female' ? FEMALE : MALE;
    const activeId = mobileGender === 'female' ? femaleId : maleId;
    const activeGarment = garments.find(g => g.id === activeId)!;
    return (
      <section style={{ background: '#f8f7f5', minHeight: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div style={{ padding: '84px 16px 4px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Live Demo</p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.9rem, 8vw, 2.6rem)', fontWeight: 800, color: '#09090b', lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
            20 free try-ons.
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: '#52525b', marginTop: 8 }}>
            Tap the button below to claim yours.
          </p>
        </div>

        <div style={{ flex: 1, position: 'relative', minHeight: 320, marginTop: 8 }}>
          <div key={mobileGender === 'female' ? fReveal : mReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
            <Image src={activeGarment.out} alt={`${mobileGender} model`} fill priority
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 16px 8px', background: '#f8f7f5', gap: 8 }}>
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => setMobileGender(g)}
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
                padding: '8px 28px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: mobileGender === g ? '#09090b' : 'rgba(0,0,0,0.06)',
                color: mobileGender === g ? '#ffffff' : '#71717a',
                transition: 'all 0.2s',
              }}
            >
              {g === 'female' ? 'Women' : 'Men'}
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 0 16px' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#c4c4c4', textAlign: 'center', letterSpacing: '0.06em', marginBottom: 10 }}>
            Tap any outfit to try on
          </p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
            {garments.map(g => {
              const active = g.id === activeId;
              return (
                <button
                  key={g.id}
                  onClick={() => apply(g.id, mobileGender)}
                  style={{
                    flexShrink: 0, width: 80, background: active ? '#09090b' : '#ffffff',
                    border: `1.5px solid ${active ? '#09090b' : '#e4e4e7'}`,
                    borderRadius: 12, padding: '8px 4px 6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    boxShadow: active ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Image src={g.src} alt={g.label} width={60} height={70}
                    style={{ width: 60, height: 70, objectFit: 'contain' }} />
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, fontWeight: 600, color: active ? '#ffffff' : '#a1a1aa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '12px 24px 24px', background: 'rgba(255,255,255,0.85)' }}>
          <button
            onClick={openTrialModal}
            style={{ width: '100%', fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700, color: '#ffffff', background: '#09090b', border: 'none', borderRadius: 12, padding: '16px', cursor: 'pointer' }}
          >
            Get My Free Try-ons →
          </button>
        </div>
      </section>
    );
  }

  // ── Desktop layout ──────────────────────────────────────────────────────────
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'stretch', overflow: 'hidden', background: '#09090b' }}>
      {/* Full-page background: repeating text wall */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.18em', pointerEvents: 'none', userSelect: 'none' }}>
        {Array.from({ length: 26 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-playfair)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 2.4vw, 2.6rem)',
              lineHeight: 1,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: i % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.05)',
              animation: `${i % 2 ? 'cta-marquee-rev' : 'cta-marquee'} 44s linear infinite`,
            }}
          >
            <span style={{ flexShrink: 0, paddingRight: '0.35em' }}>{REPEAT_PHRASE}</span>
            <span style={{ flexShrink: 0, paddingRight: '0.35em' }}>{REPEAT_PHRASE}</span>
          </div>
        ))}
      </div>
      {/* Radial vignette — fades the wall into a clean dark focal circle */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, #09090b 0%, #09090b 11%, rgba(9,9,11,0.55) 26%, rgba(9,9,11,0) 55%)' }} />
      {/* Soft glow behind the button */}
      <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', width: 420, height: 420, transform: 'translate(-50%,-50%)', zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 68%)' }} />

      {/* Female zone */}
      <div
        style={{ width: '38%', flexShrink: 0, position: 'relative', zIndex: 2 }}
        onDragOver={e => { e.preventDefault(); setDragOver('female'); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => {
          e.preventDefault();
          const id = e.dataTransfer.getData('garment');
          if (FEMALE.find(g => g.id === id)) apply(id, 'female');
          setDragOver(null);
        }}
      >
        <div key={fReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
          <Image src={fg.out} alt="Female model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        {dragOver === 'female' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 4 }} />
        )}
        <GarmentPanel garments={FEMALE} activeId={femaleId} gender="female" side="left" onApply={apply} />
      </div>

      {/* Center focal content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 12px', textAlign: 'center' }}>
        <button
          onClick={openTrialModal}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(14px, 1.1vw, 16px)', fontWeight: 700, color: '#09090b', background: '#ffffff', border: 'none', borderRadius: 999, padding: '16px 30px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 50px rgba(255,255,255,0.18)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 0 70px rgba(255,255,255,0.32)'; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 0 50px rgba(255,255,255,0.18)'; }}
        >
          Get My Free Try-ons →
        </button>
        <p style={{ margin: 0, fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.4)' }}>
          20 free try-ons · no card needed
        </p>
      </div>

      {/* Male zone */}
      <div
        style={{ width: '38%', flexShrink: 0, position: 'relative', zIndex: 2 }}
        onDragOver={e => { e.preventDefault(); setDragOver('male'); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => {
          e.preventDefault();
          const id = e.dataTransfer.getData('garment');
          if (MALE.find(g => g.id === id)) apply(id, 'male');
          setDragOver(null);
        }}
      >
        <div key={mReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
          <Image src={mg.out} alt="Male model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        {dragOver === 'male' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 4 }} />
        )}
        <GarmentPanel garments={MALE} activeId={maleId} gender="male" side="right" onApply={apply} />
      </div>
    </section>
  );
}
