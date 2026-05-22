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

// ── Mobile garment wheel ──────────────────────────────────────────────────────
const WHEEL_RADIUS = 130;
const GARMENT_COUNT = 5;
const WHEEL_ANGLE_STEP = 360 / GARMENT_COUNT; // 72°
const CARD_SIZE = 70;

function MobileGarmentWheel({
  gender,
  activeIndex,
  onSelect,
}: {
  gender: Gender;
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const garments = GARMENTS.filter(g => g.gender === gender);
  // Rotate ring so garment[activeIndex] sits at 180° = leftmost visible point
  const ringDeg = 180 - activeIndex * WHEEL_ANGLE_STEP;

  return (
    <div
      style={{
        position: 'absolute',
        right: -WHEEL_RADIUS,
        top: '50%',
        transform: 'translateY(-40%)',
        width: WHEEL_RADIUS * 2,
        height: WHEEL_RADIUS * 2,
        zIndex: 5,
      }}
    >
      <motion.div
        animate={{ rotate: ringDeg }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.1)',
        }}
      >
        {garments.map((g, i) => {
          const rad = (i * WHEEL_ANGLE_STEP * Math.PI) / 180;
          const cx = Math.cos(rad) * WHEEL_RADIUS;
          const cy = Math.sin(rad) * WHEEL_RADIUS;
          const isActive = i === activeIndex;

          return (
            <motion.div
              key={g.id}
              animate={{ rotate: -ringDeg }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              onClick={() => onSelect(i)}
              style={{
                position: 'absolute',
                left: WHEEL_RADIUS + cx - CARD_SIZE / 2,
                top: WHEEL_RADIUS + cy - CARD_SIZE / 2,
                width: CARD_SIZE,
                height: CARD_SIZE,
                cursor: 'pointer',
                zIndex: isActive ? 2 : 1,
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 14,
                background: 'white',
                overflow: 'hidden',
                border: `2.5px solid ${isActive ? '#09090b' : 'rgba(210,210,210,0.8)'}`,
                boxShadow: isActive
                  ? '0 6px 20px rgba(0,0,0,0.22)'
                  : '0 2px 10px rgba(0,0,0,0.10)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.floatSrc}
                  alt={g.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
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
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const maleGarmentRef = useRef<GarmentId | null>(null);
  const femaleGarmentRef = useRef<GarmentId | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-spin wheel every 2.5s on mobile — resets on gender switch
  useEffect(() => {
    if (isMobile !== true) return;
    const timer = setInterval(() => {
      setMobileActiveIndex(i => (i + 1) % GARMENT_COUNT);
    }, 2500);
    return () => clearInterval(timer);
  }, [isMobile, activeMobileGender]);

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

        {/* ── Mobile: model left + garment wheel right ── */}
        {isMobile === true && (() => {
          const mobileGarments = GARMENTS.filter(g => g.gender === activeMobileGender);
          const mobileGarmentId = mobileGarments[mobileActiveIndex]?.id ?? null;
          return (
            <>
              {/* Title at top */}
              <div
                className="absolute left-0 right-0 px-5 text-center select-none pointer-events-none"
                style={{ top: 52, zIndex: 6 }}
              >
                <h1
                  className="font-bold text-zinc-950"
                  style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, lineHeight: 1.2, marginBottom: 6 }}
                >
                  From fabric to look,<br />in seconds.
                </h1>
                <div style={{ width: 32, height: 1, background: '#d4d4d8', margin: '0 auto 5px' }} />
                <p
                  className="font-medium uppercase text-zinc-500"
                  style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.13em', lineHeight: 1.6 }}
                >
                  Virtual try-on for fashion retailers
                </p>
              </div>

              {/* Model — left side, bottom-anchored */}
              <div style={{ position: 'absolute', bottom: 0, left: -135, zIndex: 2, pointerEvents: 'none' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMobileGender}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div style={{ transform: 'scale(0.75)', transformOrigin: 'bottom left' }}>
                      <ModelFigure
                        gender={activeMobileGender}
                        garmentId={mobileGarmentId}
                        isShimmering={false}
                        isOver={false}
                        width={547}
                        height={activeMobileGender === 'male' ? 791 : 763}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Garment wheel — right side, half off screen */}
              <MobileGarmentWheel
                gender={activeMobileGender}
                activeIndex={mobileActiveIndex}
                onSelect={setMobileActiveIndex}
              />

              {/* Gender toggle */}
              <div
                className="absolute flex gap-2 select-none"
                style={{ bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 6 }}
              >
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => { setActiveMobileGender(g); setMobileActiveIndex(0); }}
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
          );
        })()}

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
