'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GarmentId, Gender, GARMENTS, BASE_MODELS } from '@/lib/garments';
import ShimmerEffect from './ShimmerEffect';

interface Props {
  gender: Gender;
  garmentId: GarmentId | null;
  isShimmering: boolean;
  isOver: boolean;
  width?: number;
  height?: number;
}

export default function ModelFigure({ gender, garmentId, isShimmering, isOver, width = 320, height = 640 }: Props) {
  const dropId = `${gender}-model`;
  const { setNodeRef } = useDroppable({ id: dropId });

  const [showBadge, setShowBadge] = useState(false);

  // Show badge whenever a new garment is applied
  useEffect(() => {
    if (!garmentId) return;
    setShowBadge(true);
    const timer = setTimeout(() => setShowBadge(false), 2500);
    return () => clearTimeout(timer);
  }, [garmentId]);

  const garment = garmentId ? GARMENTS.find((g) => g.id === garmentId) : null;
  const imageSrc = garment ? garment.compositeSrc : BASE_MODELS[gender];

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow behind model */}
      <div
        className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-300 ${
          isOver ? 'model-glow-active' : ''
        }`}
        style={{
          background: `radial-gradient(circle, rgba(245,158,11,${isOver ? '0.22' : '0.08'}), transparent 70%)`,
          transform: 'scale(1.3)',
          zIndex: 0,
        }}
      />

      {/* Drop zone wrapper */}
      <div
        ref={setNodeRef}
        className={`relative transition-all duration-200 ${
          isOver ? 'ring-2 ring-amber-400 ring-dashed ring-offset-2 rounded-lg' : ''
        }`}
        style={{ width, zIndex: 1, pointerEvents: 'none' }}
      >
        {/* Model image */}
        <motion.div
          className="relative"
          style={{ width, height }}
          animate={{ scale: isOver ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`${gender} model`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />

          <ShimmerEffect isShimmering={isShimmering} />
        </motion.div>

        {/* Foot shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 160,
            height: 20,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.12), transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Success badge */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            key="badge"
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute top-12 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg"
            style={{
              backgroundColor: '#f59e0b',
              fontFamily: 'var(--font-inter)',
              zIndex: 20,
              right: gender === 'male' ? -20 : 'auto',
              left: gender === 'female' ? -20 : 'auto',
            }}
          >
            Try-on complete ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
