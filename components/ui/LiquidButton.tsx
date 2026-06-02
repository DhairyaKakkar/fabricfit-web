'use client';

import React from 'react';

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
  href, target, rel, onClick, children,
  color = '#ffffff',
  bg = 'rgba(255,255,255,0.10)',
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
    transition: 'opacity 0.2s',
    ...style,
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} style={baseStyle} className={className}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} style={baseStyle} className={className}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
}
