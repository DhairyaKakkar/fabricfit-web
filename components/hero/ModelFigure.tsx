'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
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
        className="relative"
        style={{ width, zIndex: 1, pointerEvents: 'none' }}
      >
        {/* Model image */}
        <motion.div
          className="relative"
          style={{ width, height, overflow: 'hidden' }}
          animate={{ scale: isOver ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="sync">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={imageSrc}
              src={imageSrc}
              alt={`${gender} model`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </AnimatePresence>

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

    </div>
  );
}
