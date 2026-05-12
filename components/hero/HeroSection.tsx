'use client';

import { useState, useCallback } from 'react';
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
import HeroCta from './HeroCta';

const FABRIC_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 L10 0 M-2 2 L2-2 M18 22 L22 18' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M10 20 L20 10 M-2 18 L2 22 M18-2 L22 2' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`;

export default function HeroSection() {
  const [maleGarment, setMaleGarment] = useState<GarmentId | null>(null);
  const [femaleGarment, setFemaleGarment] = useState<GarmentId | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeDragId, setActiveDragId] = useState<GarmentId | null>(null);
  const [maleShimmering, setMaleShimmering] = useState(false);
  const [femaleShimmering, setFemaleShimmering] = useState(false);
  const [maleOver, setMaleOver] = useState(false);
  const [femaleOver, setFemaleOver] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveDragId(active.id as GarmentId);
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

      if (!over) return;

      const garment = GARMENTS.find((g) => g.id === active.id);
      if (!garment) return;

      const targetGender: Gender = over.id === 'male-model' ? 'male' : 'female';
      if (garment.gender !== targetGender) return; // wrong gender — dnd-kit snaps back

      // Valid drop
      if (targetGender === 'male') {
        setMaleShimmering(true);
        setTimeout(() => setMaleGarment(garment.id), 200);
        setTimeout(() => setMaleShimmering(false), 400);
      } else {
        setFemaleShimmering(true);
        setTimeout(() => setFemaleGarment(garment.id), 200);
        setTimeout(() => setFemaleShimmering(false), 400);
      }

      setHasInteracted(true);
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
        className="relative w-full overflow-hidden"
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
          className="absolute bottom-0 flex items-end"
          style={{ left: '4%', zIndex: 10, paddingBottom: 0 }}
        >
          <ModelFigure
            gender="male"
            garmentId={maleGarment}
            isShimmering={maleShimmering}
            isOver={maleOver}
          />
        </div>

        {/* Female model — right */}
        <div
          className="absolute bottom-0 flex items-end"
          style={{ right: '4%', zIndex: 10, paddingBottom: 0 }}
        >
          <ModelFigure
            gender="female"
            garmentId={femaleGarment}
            isShimmering={femaleShimmering}
            isOver={femaleOver}
          />
        </div>

        {/* Center tagline */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none pointer-events-none"
          style={{ top: '30%', zIndex: 15 }}
        >
          <h1
            className="text-[28px] font-extrabold text-amber-900 tracking-wide"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            FabricFit
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-amber-600 to-amber-400" />
          <p
            className="text-sm font-medium tracking-widest text-amber-700 uppercase text-center"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em' }}
          >
            Virtual Try-On
            <br />
            for Fabric Outlets
          </p>
          <motion.p
            className="mt-3 text-xs text-gray-400 bounce-hint"
            style={{ fontFamily: 'var(--font-inter)' }}
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

        {/* Post-interaction CTA */}
        <HeroCta visible={hasInteracted} />
      </section>
    </DndContext>
  );
}
