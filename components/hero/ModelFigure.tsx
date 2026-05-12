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
}

export default function ModelFigure({ gender, garmentId, isShimmering, isOver }: Props) {
  const dropId = `${gender}-model`;
  const { setNodeRef } = useDroppable({ id: dropId });

  const [showBadge, setShowBadge] = useState(false);
  const [displayedGarmentId, setDisplayedGarmentId] = useState<GarmentId | null>(null);

  // Swap image at the shimmer midpoint (200ms into the 400ms shimmer)
  useEffect(() => {
    if (!isShimmering) return;
    const timer = setTimeout(() => setDisplayedGarmentId(garmentId), 200);
    return () => clearTimeout(timer);
  }, [isShimmering, garmentId]);

  // Show success badge when a new garment is successfully applied
  useEffect(() => {
    if (!garmentId) return;
    setShowBadge(true);
    const timer = setTimeout(() => setShowBadge(false), 2500);
    return () => clearTimeout(timer);
  }, [garmentId]);

  const garment = displayedGarmentId
    ? GARMENTS.find((g) => g.id === displayedGarmentId)
    : null;

  const imageSrc = garment ? garment.compositeSrc : BASE_MODELS[gender];
  const placeholderColor = garment ? garment.placeholderColor : gender === 'male' ? '#fef9f0' : '#fff1f2';

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
        className={`relative transition-all duration-200 rounded-lg ${
          isOver ? 'ring-2 ring-amber-400 ring-dashed ring-offset-2' : ''
        }`}
        style={{ width: 320, zIndex: 1 }}
      >
        {/* Model image */}
        <motion.div
          className="relative overflow-hidden rounded-lg"
          style={{ width: 320, height: 640 }}
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
              objectFit: 'contain',
              borderRadius: 8,
              backgroundColor: placeholderColor,
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
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.18), transparent 70%)',
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
