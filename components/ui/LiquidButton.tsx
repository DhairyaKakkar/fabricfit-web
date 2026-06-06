'use client';

import React, { useRef } from 'react';

interface LiquidButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  color?: string;
  bg?: string;
  hoverBg?: string;
  hoverColor?: string;
  padding?: string;
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function LiquidButton({
  href, target, rel, onClick, children,
  color = '#ffffff',
  bg = 'rgba(255,255,255,0.10)',
  hoverBg,
  hoverColor,
  padding = '13px 28px',
  fontSize = 14,
  style,
  className,
}: LiquidButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding, borderRadius: 9999, cursor: 'pointer', textDecoration: 'none',
    fontSize, fontWeight: 600, fontFamily: 'var(--font-inter)',
    color, background: bg,
    border: '1px solid rgba(255,255,255,0.15)',
    outline: 'none', whiteSpace: 'nowrap',
    transition: 'background 0.22s ease, color 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease',
    willChange: 'transform',
    ...style,
  };

  const resolvedHoverBg    = hoverBg    ?? (bg === '#ffffff' ? '#09090b' : 'rgba(255,255,255,0.22)');
  const resolvedHoverColor = hoverColor ?? (bg === '#ffffff' ? '#ffffff' : color);

  function enter(el: HTMLElement) {
    el.style.background  = resolvedHoverBg;
    el.style.color       = resolvedHoverColor;
    el.style.transform   = 'translateY(-3px) scale(1.03)';
    el.style.boxShadow   = bg === '#ffffff'
      ? '0 8px 28px rgba(0,0,0,0.35)'
      : '0 8px 28px rgba(37,211,102,0.35)';
  }

  function leave(el: HTMLElement) {
    el.style.background  = bg;
    el.style.color       = color;
    el.style.transform   = 'translateY(0) scale(1)';
    el.style.boxShadow   = 'none';
  }

  if (href) {
    return (
      <a
        href={href} target={target} rel={rel} onClick={onClick}
        style={baseStyle} className={className}
        onMouseEnter={e => enter(e.currentTarget as HTMLElement)}
        onMouseLeave={e => leave(e.currentTarget as HTMLElement)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      style={baseStyle} className={className}
      onMouseEnter={e => enter(e.currentTarget as HTMLElement)}
      onMouseLeave={e => leave(e.currentTarget as HTMLElement)}
    >
      {children}
    </button>
  );
}
