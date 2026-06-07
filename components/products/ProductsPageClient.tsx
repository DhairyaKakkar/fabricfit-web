'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { openTrialModal } from '@/lib/openTrialModal';

type Gender = 'female' | 'male';

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

const F_POS = [
  { top: '6%',  left: '67%', w: 86, rot: -8,  delay: '0s'   },
  { top: '24%', left: '-9%', w: 76, rot: 12,  delay: '1.1s' },
  { top: '47%', left: '73%', w: 82, rot: -6,  delay: '0.5s' },
  { top: '63%', left: '-7%', w: 78, rot: 9,   delay: '1.7s' },
  { top: '78%', left: '65%', w: 80, rot: -11, delay: '0.3s' },
];
const M_POS = [
  { top: '6%',  left: '22%', w: 86, rot: 8,   delay: '0.2s' },
  { top: '24%', left: '80%', w: 76, rot: -12, delay: '1.3s' },
  { top: '47%', left: '14%', w: 82, rot: 5,   delay: '0.7s' },
  { top: '63%', left: '76%', w: 78, rot: -9,  delay: '1.9s' },
  { top: '78%', left: '20%', w: 80, rot: 11,  delay: '0.5s' },
];

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

  function apply(id: string, gender: 'female' | 'male') {
    if (gender === 'female') { setFemaleId(id); setFReveal(r => r + 1); }
    else { setMaleId(id); setMReveal(r => r + 1); }
    resetTimer();
  }

  const fg = FEMALE.find(g => g.id === femaleId)!;
  const mg = MALE  .find(g => g.id === maleId)!;

  const GarmentCard = ({ g, pos, gender, active }: { g: typeof FEMALE[0]; pos: typeof F_POS[0]; gender: 'female' | 'male'; active: boolean }) => (
    <div style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.w, zIndex: 4, transform: `rotate(${pos.rot}deg)` }}>
      <div
        className="garment-float"
        draggable
        onClick={() => apply(g.id, gender)}
        onDragStart={e => { e.dataTransfer.setData('garment', g.id); e.dataTransfer.effectAllowed = 'move'; }}
        style={{
          cursor: 'grab',
          animationDelay: pos.delay,
          filter: active ? 'drop-shadow(0 6px 18px rgba(0,0,0,0.35))' : 'drop-shadow(0 3px 10px rgba(0,0,0,0.18))',
          transition: 'filter 0.3s, opacity 0.3s',
          borderRadius: 6,
          opacity: active ? 1 : 0.78,
        }}
      >
        <Image src={g.src} alt={g.label} width={pos.w} height={Math.round(pos.w * 1.4)}
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
      </div>
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 8, fontWeight: 600, color: active ? '#09090b' : '#c4c4c4', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '3px 0 0' }}>{g.label}</p>
    </div>
  );

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    const garments = mobileGender === 'female' ? FEMALE : MALE;
    const activeId = mobileGender === 'female' ? femaleId : maleId;
    const activeGarment = garments.find(g => g.id === activeId)!;
    return (
      <section style={{ background: '#ffffff', minHeight: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Heading — in normal flow, model starts below it */}
        <div style={{ padding: '84px 16px 4px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Live Demo</p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.3rem, 5.5vw, 1.8rem)', fontWeight: 700, color: '#09090b', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
            Your customers deserve<br />to see it first.
          </h2>
        </div>

        {/* Model — fills remaining screen */}
        <div style={{ flex: 1, position: 'relative', minHeight: 320, marginTop: 8 }}>
          <div key={mobileGender === 'female' ? fReveal : mReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
            <Image src={activeGarment.out} alt={`${mobileGender} model`} fill priority
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
          </div>
          <div key={`mob-scan-${mobileGender === 'female' ? fReveal : mReveal}`} className="model-scan-line" style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(9,9,11,0.55), transparent)', boxShadow: '0 0 22px 6px rgba(9,9,11,0.12)', zIndex: 5, pointerEvents: 'none' }} />
        </div>

        {/* Gender toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 16px 8px', background: '#ffffff', gap: 8 }}>
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => setMobileGender(g)}
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
                padding: '8px 28px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: mobileGender === g ? '#09090b' : '#f4f4f5',
                color: mobileGender === g ? '#ffffff' : '#71717a',
                transition: 'all 0.2s',
              }}
            >
              {g === 'female' ? 'Women' : 'Men'}
            </button>
          ))}
        </div>

        {/* Garments — horizontal scrollable strip */}
        <div style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '12px 0 16px' }}>
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

        {/* CTA button */}
        <div style={{ padding: '12px 24px 24px', background: '#fafafa' }}>
          <button
            onClick={openTrialModal}
            style={{ width: '100%', fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#09090b', border: 'none', borderRadius: 10, padding: '14px', cursor: 'pointer' }}
          >
            Request Access →
          </button>
        </div>
      </section>
    );
  }

  // ── Desktop layout ──────────────────────────────────────────────────────────
  return (
    <section style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'stretch', overflow: 'hidden', position: 'relative' }}>

      {/* Female zone */}
      <div
        style={{ width: '42%', flexShrink: 0, position: 'relative' }}
        onDragOver={e => { e.preventDefault(); setDragOver('female'); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('garment'); if (FEMALE.find(g => g.id === id)) apply(id, 'female'); setDragOver(null); }}
      >
        <div key={fReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
          <Image src={fg.out} alt="Female model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        {/* Scan line */}
        <div key={`fs-${fReveal}`} className="model-scan-line" style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(9,9,11,0.55), transparent)', boxShadow: '0 0 22px 6px rgba(9,9,11,0.12)', zIndex: 5, pointerEvents: 'none' }} />
        {/* Drop zone — invisible, just event target */}
        {dragOver === 'female' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.04)', pointerEvents: 'none', zIndex: 4 }} />
        )}
        {FEMALE.map((g, i) => <GarmentCard key={g.id} g={g} pos={F_POS[i]} gender="female" active={g.id === femaleId} />)}
      </div>

      {/* Center CTA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', textAlign: 'center', zIndex: 10 }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18 }}>
          Live Demo
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)', fontWeight: 700, color: '#09090b', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 14 }}>
          Your customers<br />deserve to see<br />it first.
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#a1a1aa', marginBottom: 28, lineHeight: 1.7 }}>
          Drag any garment onto<br />the model to try it on.
        </p>
        <button
          onClick={openTrialModal}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#09090b', border: 'none', borderRadius: 10, padding: '13px 28px', cursor: 'pointer', marginBottom: 10, whiteSpace: 'nowrap' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#27272a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#09090b')}
        >
          Request Access →
        </button>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#d4d4d8', letterSpacing: '0.04em' }}>← drag onto model →</p>
      </div>

      {/* Male zone */}
      <div
        style={{ width: '42%', flexShrink: 0, position: 'relative' }}
        onDragOver={e => { e.preventDefault(); setDragOver('male'); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('garment'); if (MALE.find(g => g.id === id)) apply(id, 'male'); setDragOver(null); }}
      >
        <div key={mReveal} className="model-reveal" style={{ position: 'absolute', inset: 0 }}>
          <Image src={mg.out} alt="Male model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        <div key={`ms-${mReveal}`} className="model-scan-line" style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(9,9,11,0.55), transparent)', boxShadow: '0 0 22px 6px rgba(9,9,11,0.12)', zIndex: 5, pointerEvents: 'none' }} />
        {dragOver === 'male' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.04)', pointerEvents: 'none', zIndex: 4 }} />
        )}
        {MALE.map((g, i) => <GarmentCard key={g.id} g={g} pos={M_POS[i]} gender="male" active={g.id === maleId} />)}
      </div>
    </section>
  );
}
