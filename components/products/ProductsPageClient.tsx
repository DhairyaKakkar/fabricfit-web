'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { openTrialModal } from '@/lib/openTrialModal';

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

// Mobile garment positions — pinned to the side edges so the centred model stays clear
const POS_M = [
  { top: '2%',  left: '2%',  w: 60, rot: -8,  delay: '0s'   },
  { top: '4%',  left: '78%', w: 60, rot: 10,  delay: '1.1s' },
  { top: '34%', left: '0%',  w: 56, rot: 6,   delay: '0.5s' },
  { top: '36%', left: '80%', w: 56, rot: -9,  delay: '1.7s' },
  { top: '66%', left: '2%',  w: 58, rot: 8,   delay: '0.3s' },
];

export default function ProductsPageClient() {
  const [femaleId, setFemaleId] = useState(FEMALE[0].id);
  const [maleId,   setMaleId]   = useState(MALE[0].id);
  const [dragOver, setDragOver] = useState<'female' | 'male' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(id: string, gender: 'female' | 'male') {
    if (gender === 'female') setFemaleId(id);
    else setMaleId(id);
    resetTimer();
  }

  const fg = FEMALE.find(g => g.id === femaleId)!;
  const mg = MALE  .find(g => g.id === maleId)!;

  // ── Mobile: stacked zones, tap a garment to apply it ───────────────────────
  if (isMobile) {
    const MobileZone = ({ list, current, gender, label }: { list: typeof FEMALE; current: string; gender: 'female' | 'male'; label: string }) => {
      const sel = list.find(g => g.id === current)!;
      return (
        <div style={{ position: 'relative', height: 460, marginTop: 8 }}>
          <p style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 5,
            fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: '#a1a1aa',
            letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0,
          }}>{label}</p>
          <div style={{ position: 'absolute', inset: '24px 60px 0' }}>
            <Image key={sel.out} src={sel.out} alt={`${label} model`} fill
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
          </div>
          {list.map((g, i) => {
            const pos = POS_M[i];
            const active = g.id === current;
            return (
              <div key={g.id} style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.w, zIndex: 4, transform: `rotate(${pos.rot}deg)` }}>
                <div
                  className="garment-float"
                  onClick={() => apply(g.id, gender)}
                  style={{
                    cursor: 'pointer',
                    animationDelay: pos.delay,
                    filter: active ? 'drop-shadow(0 0 12px rgba(217,160,70,0.9))' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.18))',
                    transition: 'filter 0.3s',
                    borderRadius: 6,
                    outline: active ? '2px solid rgba(217,160,70,0.7)' : 'none',
                  }}
                >
                  <Image src={g.src} alt={g.label} width={pos.w} height={Math.round(pos.w * 1.4)}
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                </div>
                <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 7, fontWeight: 600, color: active ? '#D9A046' : '#c4c4c4', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '2px 0 0' }}>{g.label}</p>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <section style={{ background: '#ffffff', padding: '48px 16px 40px', overflow: 'hidden' }}>
        {/* CTA header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
            Live Demo
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, color: '#09090b', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 10 }}>
            Your customers deserve<br />to see it first.
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#a1a1aa', marginBottom: 18, lineHeight: 1.6 }}>
            Tap any garment to try it on the model.
          </p>
          <button
            onClick={openTrialModal}
            style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#09090b', border: 'none', borderRadius: 10, padding: '13px 28px', cursor: 'pointer' }}
          >
            Request Access →
          </button>
        </div>

        <MobileZone list={FEMALE} current={femaleId} gender="female" label="Women" />
        <MobileZone list={MALE}   current={maleId}   gender="male"   label="Men" />
      </section>
    );
  }

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
          filter: active ? 'drop-shadow(0 0 14px rgba(217,160,70,0.9))' : 'drop-shadow(0 3px 10px rgba(0,0,0,0.2))',
          transition: 'filter 0.3s',
          borderRadius: 6,
          outline: active ? '2px solid rgba(217,160,70,0.7)' : 'none',
        }}
      >
        <Image src={g.src} alt={g.label} width={pos.w} height={Math.round(pos.w * 1.4)}
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
      </div>
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 8, fontWeight: 600, color: active ? '#D9A046' : '#c4c4c4', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '3px 0 0' }}>{g.label}</p>
    </div>
  );

  return (
    <section style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'stretch', overflow: 'hidden', position: 'relative' }}>

      {/* Female zone */}
      <div
        style={{ width: '42%', flexShrink: 0, position: 'relative' }}
        onDragOver={e => { e.preventDefault(); setDragOver('female'); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('garment'); if (FEMALE.find(g => g.id === id)) apply(id, 'female'); setDragOver(null); }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image key={fg.out} src={fg.out} alt="Female model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        {dragOver === 'female' && (
          <div style={{ position: 'absolute', top: '8%', left: '20%', right: '20%', bottom: '2%', borderRadius: '50% 50% 30% 30%', border: '3px dashed #D9A046', background: 'rgba(217,160,70,0.07)', pointerEvents: 'none', zIndex: 6 }} />
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
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image key={mg.out} src={mg.out} alt="Male model" fill priority
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
        {dragOver === 'male' && (
          <div style={{ position: 'absolute', top: '8%', left: '20%', right: '20%', bottom: '2%', borderRadius: '50% 50% 30% 30%', border: '3px dashed #D9A046', background: 'rgba(217,160,70,0.07)', pointerEvents: 'none', zIndex: 6 }} />
        )}
        {MALE.map((g, i) => <GarmentCard key={g.id} g={g} pos={M_POS[i]} gender="male" active={g.id === maleId} />)}
      </div>
    </section>
  );
}
