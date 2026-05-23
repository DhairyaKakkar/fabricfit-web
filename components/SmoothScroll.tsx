'use client';

import { useEffect } from 'react';

// Intercepts wheel events and replaces them with slow lerp-based scrolling.
// Wheel multiplier + lerp are tuned for "super slow, premium feel".
const LERP = 0.12;         // natural browser-like feel
const WHEEL_MULT = 1.0;    // full wheel delta

export default function SmoothScroll() {
  useEffect(() => {
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number;
    let running = false;

    const clamp = (v: number) =>
      Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight));

    const tick = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        running = false;
        return;
      }
      currentY += diff * LERP;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Normalise across deltaMode (pixels=0, lines=1, pages=2)
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 24;   // lines → pixels
      if (e.deltaMode === 2) delta *= window.innerHeight; // pages → pixels

      targetY = clamp(targetY + delta * WHEEL_MULT);

      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    // Keep targetY in sync when programmatic scrolls happen (e.g. smooth anchor links)
    const onScroll = () => {
      if (!running) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
