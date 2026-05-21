'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      dotX += (mouseX - dotX) * 0.85;
      dotY += (mouseY - dotY) * 0.85;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    document.documentElement.style.cursor = 'none';
    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(tick);

    const onEnterInteractive = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '52px';
        ringRef.current.style.height = '52px';
        ringRef.current.style.marginLeft = '-6px';
        ringRef.current.style.marginTop = '-6px';
        ringRef.current.style.borderColor = 'rgba(255,255,255,0.9)';
      }
    };
    const onLeaveInteractive = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '40px';
        ringRef.current.style.height = '40px';
        ringRef.current.style.marginLeft = '0';
        ringRef.current.style.marginTop = '0';
        ringRef.current.style.borderColor = 'rgba(146,64,14,0.35)';
      }
    };

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  );
}
