'use client';

import { DragOverlay } from '@dnd-kit/core';
import { Garment } from '@/lib/garments';

interface Props {
  activeGarment: Garment | null;
}

export default function GarmentDragOverlay({ activeGarment }: Props) {
  return (
    <DragOverlay dropAnimation={null}>
      {activeGarment ? (
        <div
          style={{
            width: 100,
            height: 133,
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))',
            transform: `rotate(${activeGarment.id === 'shirt' ? -3 : 3}deg) scale(1.08)`,
            cursor: 'grabbing',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeGarment.floatSrc}
            alt={activeGarment.label}
            width={100}
            height={133}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 8,
              backgroundColor: activeGarment.placeholderColor,
            }}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
}
