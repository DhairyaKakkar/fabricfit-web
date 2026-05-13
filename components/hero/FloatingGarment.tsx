'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Garment, GarmentId, GARMENT_LAYOUT } from '@/lib/garments';

interface Props {
  garment: Garment;
  activeDragId: GarmentId | null;
}

export default function FloatingGarment({ garment, activeDragId }: Props) {
  const layout = GARMENT_LAYOUT[garment.id];
  const isDragging = activeDragId === garment.id;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: garment.id,
  });

  const dndStyle = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        zIndex: isDragging ? 50 : 5,
        ...dndStyle,
      }}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
    >
      {/* Opacity/scale wrapper — never loops, just fades out when dragging */}
      <motion.div
        animate={{ opacity: isDragging ? 0 : 1, scale: isDragging ? 0.9 : 1 }}
        transition={{ duration: 0.15 }}
        whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Float animation wrapper — only y and rotate loop */}
        <motion.div
          animate={isDragging ? {} : {
            y: [0, -12, 0, 12, 0],
            rotate: [
              layout.rotation,
              layout.rotation + 3,
              layout.rotation,
              layout.rotation - 3,
              layout.rotation,
            ],
          }}
          transition={isDragging ? {} : {
            duration: layout.floatDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={garment.floatSrc}
            alt={garment.label}
            width={140}
            height={187}
            draggable={false}
            style={{
              width: 140,
              height: 187,
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
