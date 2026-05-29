'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  useDraggable,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { GARMENTS, GarmentId, Gender } from '@/lib/garments';
import ModelFigure from './ModelFigure';
import GarmentDragOverlay from './GarmentDragOverlay';

const FABRIC_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 L10 0 M-2 2 L2-2 M18 22 L22 18' stroke='%23000000' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M10 20 L20 10 M-2 18 L2 22 M18-2 L22 2' stroke='%23000000' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`;

// ── Mobile garment wheel ──────────────────────────────────────────────────────
const WHEEL_RADIUS = 130;
const GARMENT_COUNT = 5;
const WHEEL_ANGLE_STEP = 360 / GARMENT_COUNT; // 72°
const CARD_SIZE = 80;

function MobileGarmentWheel({
  gender,
  steps,
  onSelect,
  corner,
}: {
  gender: Gender;
  steps: number;
  onSelect: (i: number) => void;
  corner: 'left' | 'right';
}) {
  const garments = GARMENTS.filter(g => g.gender === gender);
  const activeIndex = steps % GARMENT_COUNT;
  // Left corner: active at 280° (upper-right) + next at 352° both visible
  // Right corner: active at 260° (upper-left) + prev at 188° both visible
  const baseAngle = corner === 'left' ? 280 : 260;
  const ringDeg = baseAngle - steps * WHEEL_ANGLE_STEP;

  // Offset 20px inward from corner in both axes so cards aren't clipped at edges
  const posStyle: React.CSSProperties = corner === 'left'
    ? { bottom: -WHEEL_RADIUS + 20, left: -WHEEL_RADIUS + 20 }
    : { bottom: -WHEEL_RADIUS + 20, right: -WHEEL_RADIUS + 20 };

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
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

// ── Draggable garment card (strip) ───────────────────────────────────────────

function DraggableGarmentCard({
  garment,
  index,
  isSelected,
  onSelect,
}: {
  garment: (typeof GARMENTS)[number];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: garment.id });

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.055, duration: 0.22, ease: 'easeOut' }}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        draggable={false}
        onClick={onSelect}
        style={{
          width: 88,
          height: 96,
          borderRadius: 14,
          background: isSelected ? '#09090b' : 'white',
          border: `2px solid ${isSelected ? '#09090b' : 'rgba(0,0,0,0.09)'}`,
          boxShadow: isSelected
            ? '0 8px 28px rgba(0,0,0,0.22)'
            : '0 2px 12px rgba(0,0,0,0.08)',
          cursor: isDragging ? 'grabbing' : 'pointer',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none',
          position: 'relative',
          opacity: isDragging ? 0.2 : 1,
          transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s, opacity 0.15s',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={garment.floatSrc}
          alt={garment.label}
          draggable={false}
          style={{
            flex: 1,
            width: '100%',
            objectFit: 'contain',
            padding: '8px 8px 4px',
          }}
        />
      </div>
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
  const [maleSteps, setMaleSteps] = useState(0);
  const [femaleSteps, setFemaleSteps] = useState(0);
  const [activeModel, setActiveModel] = useState<Gender>('male');

  const maleGarmentRef = useRef<GarmentId | null>(null);
  const femaleGarmentRef = useRef<GarmentId | null>(null);
  const isDraggingRef = useRef(false);
  const activeModelRef = useRef<Gender>('male');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-spin both wheels independently on mobile — always forward
  useEffect(() => {
    if (isMobile !== true) return;
    const mTimer = setInterval(() => setMaleSteps(s => s + 1), 2500);
    const fTimer = setInterval(() => setFemaleSteps(s => s + 1), 3100);
    return () => { clearInterval(mTimer); clearInterval(fTimer); };
  }, [isMobile]);

  useEffect(() => { maleGarmentRef.current = maleGarment; }, [maleGarment]);
  useEffect(() => { femaleGarmentRef.current = femaleGarment; }, [femaleGarment]);
  useEffect(() => { activeModelRef.current = activeModel; }, [activeModel]);

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

        {/* ── Desktop: depth-staged models + garment strip ──────────── */}
        {isMobile === false && (
          <>
            {/* Garment strip — always visible, cross-fades when gender switches */}
            <div
              style={{
                position: 'absolute',
                right: 'calc(8% + 572px)',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: '#a1a1aa',
                    marginBottom: 4,
                    paddingLeft: 2,
                  }}>
                    {activeModel === 'male' ? 'Menswear' : 'Womenswear'}
                  </div>
                  {GARMENTS.filter((g) => g.gender === activeModel).map((garment, i) => (
                    <DraggableGarmentCard
                      key={garment.id}
                      garment={garment}
                      index={i}
                      isSelected={(activeModel === 'male' ? maleGarment : femaleGarment) === garment.id}
                      onSelect={() => {
                        if (activeModel === 'male') {
                          setMaleGarment(garment.id);
                          setMaleShimmering(true);
                          setTimeout(() => setMaleShimmering(false), 400);
                        } else {
                          setFemaleGarment(garment.id);
                          setFemaleShimmering(true);
                          setTimeout(() => setFemaleShimmering(false), 400);
                        }
                      }}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floor spotlight glow — always visible */}
            <div
              style={{
                position: 'absolute',
                right: 'calc(8% - 180px)',
                bottom: -160,
                width: 860,
                height: 560,
                background: 'radial-gradient(ellipse at 50% 82%, rgba(0,0,0,0.055) 0%, transparent 60%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 7,
              }}
            />

            {/* Female model — background depth layer */}
            <motion.div
              className="absolute flex items-end"
              style={{
                right: '8%',
                bottom: '-60px',
                zIndex: activeModel === 'female' ? 10 : 8,
                cursor: activeModel === 'female' ? 'default' : 'pointer',
                pointerEvents: activeModel === 'female' ? 'none' : 'auto',
                transformOrigin: 'bottom center',
              }}
              animate={
                activeModel === 'female'
                  ? { x: 0, scale: 1.0, opacity: 1, filter: 'blur(0px)' }
                  : { x: 280, scale: 0.78, opacity: 0.35, filter: 'blur(4px)' }
              }
              transition={{ type: 'spring', stiffness: 75, damping: 22 }}
              onClick={() => setActiveModel('female')}
            >
              <ModelFigure
                gender="female"
                garmentId={femaleGarment}
                isShimmering={femaleShimmering}
                isOver={femaleOver}
                width={553}
                height={763}
              />
            </motion.div>

            {/* Male model — foreground layer */}
            <motion.div
              className="absolute flex items-end"
              style={{
                right: '8%',
                bottom: '-60px',
                zIndex: activeModel === 'male' ? 10 : 9,
                cursor: activeModel === 'male' ? 'default' : 'pointer',
                pointerEvents: activeModel === 'male' ? 'none' : 'auto',
                transformOrigin: 'bottom center',
              }}
              animate={
                activeModel === 'male'
                  ? { x: 0, scale: 1.04, opacity: 1, filter: 'blur(0px)' }
                  : { x: -220, scale: 0.78, opacity: 0.35, filter: 'blur(4px)' }
              }
              transition={{ type: 'spring', stiffness: 75, damping: 22 }}
              onClick={() => setActiveModel('male')}
            >
              <ModelFigure
                gender="male"
                garmentId={maleGarment}
                isShimmering={maleShimmering}
                isOver={maleOver}
                width={547}
                height={791}
              />
            </motion.div>

            <GarmentDragOverlay activeGarment={activeGarment} />
          </>
        )}

        {/* ── Mobile: two-column — man left, woman right ── */}
        {isMobile === true && (() => {
          const maleGarments = GARMENTS.filter(g => g.gender === 'male');
          const femaleGarments = GARMENTS.filter(g => g.gender === 'female');
          const maleGarmentId = maleGarments[maleSteps % GARMENT_COUNT]?.id ?? null;
          const femaleGarmentId = femaleGarments[femaleSteps % GARMENT_COUNT]?.id ?? null;

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

              {/* Two-column model + wheel area */}
              <div
                style={{
                  position: 'absolute',
                  top: 130,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                }}
              >
                {/* ── Man column ── */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    bottom: WHEEL_RADIUS + 115,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}>
                    <div style={{ transform: 'scale(0.6)', transformOrigin: 'bottom center' }}>
                      <ModelFigure
                        gender="male"
                        garmentId={maleGarmentId}
                        isShimmering={false}
                        isOver={false}
                        width={547}
                        height={791}
                      />
                    </div>
                  </div>
                  <MobileGarmentWheel
                    gender="male"
                    steps={maleSteps}
                    corner="left"
                    onSelect={(i) => {
                      setMaleSteps(s => {
                        const curr = s % GARMENT_COUNT;
                        const fwd = (i - curr + GARMENT_COUNT) % GARMENT_COUNT;
                        return fwd === 0 ? s : s + fwd;
                      });
                    }}
                  />
                </div>

                {/* ── Woman column ── */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    bottom: WHEEL_RADIUS + 130,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}>
                    <div style={{ transform: 'scale(0.6)', transformOrigin: 'bottom center' }}>
                      <ModelFigure
                        gender="female"
                        garmentId={femaleGarmentId}
                        isShimmering={false}
                        isOver={false}
                        width={553}
                        height={763}
                      />
                    </div>
                  </div>
                  <MobileGarmentWheel
                    gender="female"
                    steps={femaleSteps}
                    corner="right"
                    onSelect={(i) => {
                      setFemaleSteps(s => {
                        const curr = s % GARMENT_COUNT;
                        const fwd = (i - curr + GARMENT_COUNT) % GARMENT_COUNT;
                        return fwd === 0 ? s : s + fwd;
                      });
                    }}
                  />
                </div>
              </div>
            </>
          );
        })()}

        {/* Desktop headline/subtitle removed — SeeItLiveSection provides the header overlay */}

      </section>
    </DndContext>
  );
}
