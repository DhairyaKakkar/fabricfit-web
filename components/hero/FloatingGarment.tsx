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
        zIndex: isDragging ? 20 : 5,
        ...dndStyle,
      }}
      {...listeners}
      {...attributes}
    >
      <motion.div
        animate={
          isDragging
            ? { opacity: 0, scale: 0.9 }
            : {
                y: [0, -12, 0, 12, 0],
                rotate: [
                  layout.rotation,
                  layout.rotation + 3,
                  layout.rotation,
                  layout.rotation - 3,
                  layout.rotation,
                ],
                opacity: 0.92,
                scale: 1,
              }
        }
        transition={
          isDragging
            ? { duration: 0.15 }
            : {
                duration: layout.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        whileHover={isDragging ? {} : { opacity: 1, scale: 1.06, transition: { duration: 0.15 } }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={garment.floatSrc}
          alt={garment.label}
          width={100}
          height={133}
          draggable={false}
          style={{
            width: 100,
            height: 133,
            objectFit: 'contain',
            borderRadius: 8,
            backgroundColor: garment.placeholderColor,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  );
}
