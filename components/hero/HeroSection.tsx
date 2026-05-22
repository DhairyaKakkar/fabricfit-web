'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { GARMENTS, GarmentId, Gender } from '@/lib/garments';
import FloatingGarment from './FloatingGarment';
import ModelFigure from './ModelFigure';
import GarmentDragOverlay from './GarmentDragOverlay';
import HeroCta from './HeroCta';

const FABRIC_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 L10 0 M-2 2 L2-2 M18 22 L22 18' stroke='%23000000' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M10 20 L20 10 M-2 18 L2 22 M18-2 L22 2' stroke='%23000000' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`;

// ── Mobile floating garment positions (orbit around centered model) ───────────
interface MobileGarmentPos {
  id: GarmentId;
  side: 'left' | 'right';
  offset: number; // px from edge — varies per garment to create an arc
  top: string;    // % of viewport height
  rot: number;
  dur: number;
}

// Left: 3 garments at 3 heights with slight x variation (arc inward at mid)
// Right: 2 garments mirrored. Both groups close to model edges.
const MOBILE_GARMENT_LAYOUT: MobileGarmentPos[] = [
  { id: 'kurta',         side: 'left',  offset: 6,  top: '30%', rot: 10,  dur: 4.2 },
  { id: 'sherwani',      side: 'left',  offset: 18, top: '48%', rot: -6,  dur: 3.5 },
  { id: 'nehru-coat',    side: 'left',  offset: 6,  top: '64%', rot: 12,  dur: 4.7 },
  { id: 'shirt',         side: 'right', offset: 6,  top: '33%', rot: -8,  dur: 3.8 },
  { id: 'blazer',        side: 'right', offset: 18, top: '51%', rot: -10, dur: 3.6 },
  { id: 'anarkali',      side: 'left',  offset: 6,  top: '30%', rot: 6,   dur: 4.4 },
  { id: 'saree',         side: 'left',  offset: 18, top: '48%', rot: -7,  dur: 3.9 },
  { id: 'lehenga',       side: 'left',  offset: 6,  top: '64%', rot: 9,   dur: 4.6 },
  { id: 'casual-dress',  side: 'right', offset: 6,  top: '33%', rot: 8,   dur: 4.1 },
  { id: 'jumpsuit',      side: 'right', offset: 18, top: '51%', rot: -12, dur: 3.5 },
];

function MobileGarmentFloat({ pos, src, label, idx, isSelected, onClick }: {
  pos: MobileGarmentPos; src: string; label: string; idx: number;
  isSelected: boolean; onClick: () => void;
}) {
  return (
    <motion.div
      style={{ position: 'absolute', [pos.side]: pos.offset, top: pos.top, zIndex: 4, cursor: 'pointer' }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.35, delay: idx * 0.07 }}
      onClick={onClick}
    >
      <motion.div
        animate={{ y: [0, -9, 0, 9, 0], rotate: [pos.rot, pos.rot + 3, pos.rot, pos.rot - 3, pos.rot] }}
        transition={{ duration: pos.dur, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          background: isSelected ? '#09090b' : 'rgba(255,255,255,0.93)',
          borderRadius: 14,
          padding: 6,
          boxShadow: isSelected
            ? '0 6px 24px rgba(0,0,0,0.3), 0 0 0 2px #09090b'
            : '0 6px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} style={{ width: 82, height: 110, objectFit: 'contain', display: 'block', userSelect: 'none' }} />
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: isSelected ? '#a1a1aa' : '#71717a', textAlign: 'center', marginTop: 4, lineHeight: 1 }}>
            {label}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [maleGarment, setMaleGarment] = useState<GarmentId | null>('kurta');
  const [femaleGarment, setFemaleGarment] = useState<GarmentId | null>('anarkali');
  const [activeDragId, setActiveDragId] = useState<GarmentId | null>(null);
  const [maleShimmering, setMaleShimmering] = useState(false);
  const [femaleShimmering, setFemaleShimmering] = useState(false);
  const [maleOver, setMaleOver] = useState(false);
  const [femaleOver, setFemaleOver] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [activeMobileGender, setActiveMobileGender] = useState<'male' | 'female'>('male');
  const [cycleKey, setCycleKey] = useState(0);

  const maleGarmentRef = useRef<GarmentId | null>(null);
  const femaleGarmentRef = useRef<GarmentId | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Cycle male ↔ female every 30s on mobile — resets when user manually taps
  useEffect(() => {
    if (isMobile !== true) return;
    const timer = setInterval(() => {
      setActiveMobileGender(g => g === 'male' ? 'female' : 'male');
    }, 30000);
    return () => clearInterval(timer);
  }, [isMobile, cycleKey]);

  useEffect(() => { maleGarmentRef.current = maleGarment; }, [maleGarment]);
  useEffect(() => { femaleGarmentRef.current = femaleGarment; }, [femaleGarment]);

  const applyRandomMale = useCallback(() => {
    const opts = GARMENTS.filter(g => g.gender === 'male' && g.id !== maleGarmentRef.current);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    setMaleGarment(pick.id);
    setMaleShimmering(true);
    setTimeout(() => setMaleShimmering(false), 400);
  }, []);

  const applyRandomFemale = useCallback(() => {
    const opts = GARMENTS.filter(g => g.gender === 'female' && g.id !== femaleGarmentRef.current);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    setFemaleGarment(pick.id);
    setFemaleShimmering(true);
    setTimeout(() => setFemaleShimmering(false), 400);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const cycle = () => {
      if (!isDraggingRef.current) {
        applyRandomMale();
        applyRandomFemale();
      }
      timer = setTimeout(cycle, 10000);
    };
    timer = setTimeout(cycle, 10000);
    return () => clearTimeout(timer);
  }, [applyRandomMale, applyRandomFemale]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveDragId(active.id as GarmentId);
    isDraggingRef.current = true;
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setMaleOver(over?.id === 'male-model');
    setFemaleOver(over?.id === 'female-model');
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveDragId(null);
    setMaleOver(false);
    setFemaleOver(false);
    isDraggingRef.current = false;
    if (!over) return;
    const garment = GARMENTS.find((g) => g.id === active.id);
    if (!garment) return;
    const targetGender: Gender = over.id === 'male-model' ? 'male' : 'female';
    if (garment.gender !== targetGender) return;
    if (targetGender === 'male') {
      setMaleGarment(garment.id);
      setMaleShimmering(true);
      setTimeout(() => setMaleShimmering(false), 400);
    } else {
      setFemaleGarment(garment.id);
      setFemaleShimmering(true);
      setTimeout(() => setFemaleShimmering(false), 400);
    }
  }, []);

  const activeGarment = activeDragId ? GARMENTS.find((g) => g.id === activeDragId) ?? null : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section
        className="snap-start relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: 600, backgroundColor: '#ffffff' }}
      >
        {/* Fabric texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: FABRIC_TEXTURE, opacity: 0.04, zIndex: 0 }}
        />

        {/* ── Desktop: models + garments (UNCHANGED) ──────── */}
        {isMobile === false && (
          <>
            <div
              className="absolute flex items-end"
              style={{ left: 'calc(18% - 30px)', bottom: '-60px', zIndex: 10, pointerEvents: 'none' }}
            >
              <ModelFigure gender="male" garmentId={maleGarment} isShimmering={maleShimmering} isOver={maleOver} width={547} height={791} />
            </div>
            <div
              className="absolute flex items-end"
              style={{ right: 'calc(18% - 30px)', bottom: '-60px', zIndex: 10, pointerEvents: 'none' }}
            >
              <ModelFigure gender="female" garmentId={femaleGarment} isShimmering={femaleShimmering} isOver={femaleOver} width={553} height={763} />
            </div>
            {GARMENTS.map((garment) => (
              <FloatingGarment key={garment.id} garment={garment} activeDragId={activeDragId} />
            ))}
            <GarmentDragOverlay activeGarment={activeGarment} />
          </>
        )}

        {/* ── Mobile: one centered model cycling + floating garments ── */}
        {isMobile === true && (
          <>
            {/* Title + subtitle stacked at top — no overlap */}
            <div
              className="absolute left-0 right-0 px-5 text-center select-none pointer-events-none"
              style={{ top: 64, zIndex: 6 }}
            >
              <h1
                className="font-bold text-zinc-950"
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, lineHeight: 1.18, marginBottom: 8 }}
              >
                From fabric to look,<br />in seconds.
              </h1>
              <div style={{ width: 36, height: 1, background: '#d4d4d8', margin: '0 auto 6px' }} />
              <p
                className="font-medium uppercase text-zinc-500"
                style={{ fontFamily: 'var(--font-inter)', fontSize: 9.5, letterSpacing: '0.14em', lineHeight: 1.6 }}
              >
                Virtual try-on for fashion retailers,<br />in-store and online.
              </p>
            </div>

            {/* Floating garments — tap to apply, switch with gender */}
            <AnimatePresence>
              {MOBILE_GARMENT_LAYOUT
                .filter(pos => GARMENTS.find(g => g.id === pos.id)!.gender === activeMobileGender)
                .map((pos, idx) => {
                  const g = GARMENTS.find(gg => gg.id === pos.id)!;
                  const isSelected = activeMobileGender === 'male'
                    ? maleGarment === pos.id
                    : femaleGarment === pos.id;
                  return (
                    <MobileGarmentFloat
                      key={`${activeMobileGender}-${pos.id}`}
                      pos={pos}
                      src={g.floatSrc}
                      label={g.label}
                      idx={idx}
                      isSelected={isSelected}
                      onClick={() => {
                        if (activeMobileGender === 'male') {
                          setMaleGarment(pos.id);
                          setMaleShimmering(true);
                          setTimeout(() => setMaleShimmering(false), 400);
                        } else {
                          setFemaleGarment(pos.id);
                          setFemaleShimmering(true);
                          setTimeout(() => setFemaleShimmering(false), 400);
                        }
                      }}
                    />
                  );
                })}
            </AnimatePresence>

            {/* Centered model — fades between male and female */}
            <div
              style={{
                position: 'absolute',
                bottom: 78,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                pointerEvents: 'none',
                width: 547,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileGender}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <div style={{ transform: 'scale(0.62)', transformOrigin: 'bottom center' }}>
                    <ModelFigure
                      gender={activeMobileGender}
                      garmentId={activeMobileGender === 'male' ? maleGarment : femaleGarment}
                      isShimmering={activeMobileGender === 'male' ? maleShimmering : femaleShimmering}
                      isOver={false}
                      width={547}
                      height={activeMobileGender === 'male' ? 791 : 763}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Gender toggle — tap to switch, auto-cycles every 30s */}
            <div
              className="absolute flex gap-2 select-none"
              style={{ bottom: 86, left: '50%', transform: 'translateX(-50%)', zIndex: 6 }}
            >
              {(['male', 'female'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => { setActiveMobileGender(g); setCycleKey(k => k + 1); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 13px',
                    borderRadius: 20,
                    border: '1.5px solid',
                    borderColor: g === activeMobileGender ? '#3f3f46' : '#d4d4d8',
                    background: g === activeMobileGender ? '#3f3f46' : 'rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: g === activeMobileGender ? '#ffffff' : '#a1a1aa',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {g === 'male' ? '♂ Man' : '♀ Woman'}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Headline — desktop + SSR only ───────────────── */}
        {isMobile !== true && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none pointer-events-none px-4"
            style={{ top: 'clamp(60px, 10%, 80px)', zIndex: 3 }}
          >
            <h1
              className="font-bold text-zinc-950 text-center"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(36px, 6vw, 52px)', lineHeight: 1.15 }}
            >
              From fabric to look,<br />in seconds.
            </h1>
          </div>
        )}

        {/* ── Subtitle — desktop + SSR only ───────────────── */}
        {isMobile !== true && (
          <div
            className="absolute left-1/2 flex flex-col items-center gap-2 select-none pointer-events-none px-6 text-center"
            style={{ top: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, marginTop: 'clamp(-60px, -5vw, -40px)' }}
          >
            <div className="w-12 h-px bg-zinc-300" />
            <p
              className="font-medium tracking-widest text-zinc-500 uppercase text-center"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em', fontSize: 'clamp(10px, 1.2vw, 14px)' }}
            >
              Virtual try-on for fashion retailers,<br />in-store and online.
            </p>
            <p
              className="text-zinc-400 text-center"
              style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(10px, 0.9vw, 13px)', maxWidth: 280, lineHeight: 1.5 }}
            >
              Let customers preview outfits and fabrics before they buy.
            </p>
            {isMobile === false && (
              <motion.p
                className="text-zinc-400"
                style={{ fontFamily: 'var(--font-inter)', fontSize: '11px' }}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓ Drag a garment onto a model ↓
              </motion.p>
            )}
          </div>
        )}

        {/* ── CTA buttons — always visible ────────────────── */}
        <HeroCta visible />
      </section>
    </DndContext>
  );
}
