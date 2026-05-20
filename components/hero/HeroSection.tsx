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
  useDroppable,
  DragOverEvent,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GARMENTS, GarmentId, Gender } from '@/lib/garments';
import FloatingGarment from './FloatingGarment';
import ModelFigure from './ModelFigure';
import GarmentDragOverlay from './GarmentDragOverlay';

const FABRIC_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 L10 0 M-2 2 L2-2 M18 22 L22 18' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M10 20 L20 10 M-2 18 L2 22 M18-2 L22 2' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`;

export default function HeroSection() {
  const [maleGarment, setMaleGarment] = useState<GarmentId | null>('kurta');
  const [femaleGarment, setFemaleGarment] = useState<GarmentId | null>('anarkali');
const [activeDragId, setActiveDragId] = useState<GarmentId | null>(null);
  const [maleShimmering, setMaleShimmering] = useState(false);
  const [femaleShimmering, setFemaleShimmering] = useState(false);
  const [maleOver, setMaleOver] = useState(false);
  const [femaleOver, setFemaleOver] = useState(false);

  // Refs to avoid stale closures in interval
  const maleGarmentRef = useRef<GarmentId | null>(null);
  const femaleGarmentRef = useRef<GarmentId | null>(null);
  const isDraggingRef = useRef(false);

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

    // First cycle after 3s
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

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveDragId(null);
      setMaleOver(false);
      setFemaleOver(false);
      isDraggingRef.current = false;

      if (!over) return;

      const garment = GARMENTS.find((g) => g.id === active.id);
      if (!garment) return;

      const targetGender: Gender = over.id === 'male-model' ? 'male' : 'female';
      if (garment.gender !== targetGender) return; // wrong gender — dnd-kit snaps back

      // Valid drop — update garment immediately, shimmer plays over the new image
      if (targetGender === 'male') {
        setMaleGarment(garment.id);
        setMaleShimmering(true);
        setTimeout(() => setMaleShimmering(false), 400);
      } else {
        setFemaleGarment(garment.id);
        setFemaleShimmering(true);
        setTimeout(() => setFemaleShimmering(false), 400);
      }

    },
    []
  );

  const activeGarment = activeDragId ? GARMENTS.find((g) => g.id === activeDragId) ?? null : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section
        className="snap-start relative w-full overflow-hidden"
        style={{
          height: '100vh',
          minHeight: 700,
          backgroundColor: '#fef9f0',
        }}
      >
        {/* Fabric texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: FABRIC_TEXTURE,
            opacity: 0.04,
            zIndex: 0,
          }}
        />

        {/* Male model — left */}
        <div
          className="absolute flex items-end"
          style={{ left: 'calc(18% - 30px)', bottom: '-60px', zIndex: 10, pointerEvents: 'none' }}
        >
          <ModelFigure
            gender="male"
            garmentId={maleGarment}
            isShimmering={maleShimmering}
            isOver={maleOver}
            width={547}
            height={791}
          />
        </div>

        {/* Female model — right */}
        <div
          className="absolute flex items-end"
          style={{ right: 'calc(18% - 30px)', bottom: '-60px', zIndex: 10, pointerEvents: 'none' }}
        >
          <ModelFigure
            gender="female"
            garmentId={femaleGarment}
            isShimmering={femaleShimmering}
            isOver={femaleOver}
            width={553}
            height={763}
          />
        </div>

        {/* Center tagline */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none pointer-events-none"
          style={{ top: 'calc(10% - 20px)', zIndex: 3, marginLeft: '10px' }}
        >
          <div className="w-16 h-px bg-gradient-to-r from-amber-600 to-amber-400" />
          <p
            className="font-medium text-amber-800 text-center"
            style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(13px, 1.3vw, 17px)', maxWidth: 340, lineHeight: 1.5 }}
          >
            Virtual try-on for fashion retailers,<br />in-store and online.
          </p>
          <p
            className="text-amber-700/70 text-center"
            style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: 300, lineHeight: 1.5 }}
          >
            Let customers preview outfits and fabrics before they buy.
          </p>
          <motion.p
            className="text-gray-400"
            style={{ fontFamily: 'var(--font-inter)', fontSize: '11px' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓ Drag a garment onto a model ↓
          </motion.p>
        </div>

        {/* 10 Floating garments */}
        {GARMENTS.map((garment) => (
          <FloatingGarment
            key={garment.id}
            garment={garment}
            activeDragId={activeDragId}
          />
        ))}

        {/* Drag preview overlay */}
        <GarmentDragOverlay activeGarment={activeGarment} />

      </section>
    </DndContext>
  );
}
