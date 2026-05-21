'use client';

import { useEffect, useRef, useState } from 'react';

const FABRICS = [
  { name: 'Silk', color: '#f4f4f5' },
  { name: 'Cotton', color: '#f0fdf4' },
  { name: 'Chiffon', color: '#fdf4ff' },
  { name: 'Linen', color: '#f9fafb' },
  { name: 'Georgette', color: '#eff6ff' },
  { name: 'Velvet', color: '#fff1f2' },
  { name: 'Satin', color: '#fefce8' },
  { name: 'Khadi', color: '#f5f5f4' },
  { name: 'Brocade', color: '#f0f9ff' },
  { name: 'Muslin', color: '#f7fee7' },
];

const RADIUS = 148;
const SPEED = 12;

export default function FabricWheel() {
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef<number>(0);
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current && !pausedRef.current) {
        const delta = (time - lastTimeRef.current) / 1000;
        rotRef.current = (rotRef.current + (360 / SPEED) * delta) % 360;
        setRotation(rotRef.current);
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleEnter = (name: string) => {
    pausedRef.current = true;
    setHovered(name);
  };

  const handleLeave = () => {
    pausedRef.current = false;
    setHovered(null);
  };

  const centerColor = hovered
    ? FABRICS.find(f => f.name === hovered)?.color ?? '#f4f4f5'
    : '#f4f4f5';

  return (
    <div
      style={{ position: 'relative', width: 340, height: 340, flexShrink: 0 }}
    >
      {/* Outer dashed ring */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(0,0,0,0.1)',
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: 'absolute',
          inset: '20%',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      />

      {/* Fabric items orbiting */}
      {FABRICS.map((fabric, i) => {
        const baseAngle = (i / FABRICS.length) * 360;
        const totalAngle = rotation + baseAngle - 90;
        const rad = (totalAngle * Math.PI) / 180;
        const x = Math.cos(rad) * RADIUS;
        const y = Math.sin(rad) * RADIUS;
        const isActive = hovered === fabric.name;

        return (
          <div
            key={fabric.name}
            onMouseEnter={() => handleEnter(fabric.name)}
            onMouseLeave={handleLeave}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              cursor: 'default',
              transition: 'transform 0.05s linear',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: isActive ? 14 : 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#09090b' : '#a1a1aa',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s, font-size 0.2s, font-weight 0.2s',
                letterSpacing: isActive ? '0.06em' : '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {fabric.name}
            </span>
          </div>
        );
      })}

      {/* Center circle */}
      <div
        style={{
          position: 'absolute',
          inset: '28%',
          borderRadius: '50%',
          background: centerColor,
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: 'background 0.4s',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {hovered ? (
          <span
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 12,
              color: '#09090b',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            {hovered}
          </span>
        ) : (
          <>
            <span style={{ fontSize: 18, marginBottom: 2, color: '#09090b' }}>✦</span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 9,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                textAlign: 'center',
              }}
            >
              Hover fabric
            </span>
          </>
        )}
      </div>

      {/* Tick marks around the ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const ang = (i / 36) * 360 - 90;
        const r = (ang * Math.PI) / 180;
        const inner = 155, outer = 162;
        const x1 = 170 + Math.cos(r) * inner;
        const y1 = 170 + Math.sin(r) * inner;
        const x2 = 170 + Math.cos(r) * outer;
        const y2 = 170 + Math.sin(r) * outer;
        return (
          <svg
            key={i}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.1)" strokeWidth={i % 9 === 0 ? 2 : 1} />
          </svg>
        );
      })}
    </div>
  );
}
