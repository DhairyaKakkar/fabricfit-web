'use client';

import React from 'react';

// Translated from user's Tailwind shadow-[...] class — creates the 3D liquid-glass bubble
const GLASS_SHADOW =
  '0 0 6px rgba(0,0,0,0.03),0 2px 6px rgba(0,0,0,0.08),' +
  'inset 3px 3px 0.5px -3px rgba(0,0,0,0.9),' +
  'inset -3px -3px 0.5px -3px rgba(0,0,0,0.85),' +
  'inset 1px 1px 1px -0.5px rgba(0,0,0,0.6),' +
  'inset -1px -1px 1px -0.5px rgba(0,0,0,0.6),' +
  'inset 0 0 6px 6px rgba(0,0,0,0.12),' +
  'inset 0 0 2px 2px rgba(0,0,0,0.06),' +
  '0 0 12px rgba(255,255,255,0.15)';

interface LiquidButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  color?: string;
  bg?: string;
  padding?: string;
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function LiquidButton({
  href,
  target,
  rel,
  onClick,
  children,
  color = '#ffffff',
  bg = 'rgba(255,255,255,0.10)',
  padding = '13px 28px',
  fontSize = 14,
  style,
  className,
}: LiquidButtonProps) {
  const baseStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding,
    borderRadius: 9999,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize,
    fontWeight: 600,
    fontFamily: 'var(--font-inter)',
    color,
    background: bg,
    border: 'none',
    outline: 'none',
    transition: 'transform 0.22s cubic-bezier(0.1,0.4,0.2,1)',
    whiteSpace: 'nowrap',
    ...style,
  };

  const scale = (el: HTMLElement, v: string) => { el.style.transform = `scale(${v})`; };

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => scale(e.currentTarget as HTMLElement, '1.05'),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => scale(e.currentTarget as HTMLElement, '1'),
    onMouseDown:  (e: React.MouseEvent<HTMLElement>) => scale(e.currentTarget as HTMLElement, '0.97'),
    onMouseUp:    (e: React.MouseEvent<HTMLElement>) => scale(e.currentTarget as HTMLElement, '1.05'),
  };

  const inner = (
    <>
      {/* Glass shadow ring */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 9999, boxShadow: GLASS_SHADOW, pointerEvents: 'none' }} />
      {/* Liquid-distortion backdrop (filter defined once in layout.tsx) */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 9999, overflow: 'hidden', backdropFilter: 'url("#liquid-glass") blur(2px)', WebkitBackdropFilter: 'url("#liquid-glass") blur(2px)', pointerEvents: 'none' }} />
      {/* Content */}
      <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </>
  );

  if (href) {
    return <a href={href} target={target} rel={rel} onClick={onClick} style={baseStyle} className={className} {...handlers}>{inner}</a>;
  }
  return <button onClick={onClick} style={baseStyle} className={className} {...handlers}>{inner}</button>;
}
