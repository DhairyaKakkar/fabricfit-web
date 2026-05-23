'use client';

import { useEffect, useRef } from 'react';

// Ordered list of snap-section IDs. HowItWorks is intentionally absent.
const SNAP_IDS = [
  'hero',
  'video-section',
  'in-store',
  'web-embed',
  'catalog',
  'traction',
  'cta',
];

// ID prefix that belongs to HowItWorks — wheel events here scroll naturally.
const HOW_IT_WORKS_ID = 'how-it-works';

export default function ScrollSnapper() {
  const isSnapping = useRef(false);
  const lastSnap = useRef(0);

  useEffect(() => {
    const COOLDOWN = 800; // ms between snaps

    function inHowItWorks(): boolean {
      const el = document.getElementById(HOW_IT_WORKS_ID);
      if (!el) return false;
      const { top, bottom } = el.getBoundingClientRect();
      return top <= window.innerHeight * 0.5 && bottom >= window.innerHeight * 0.5;
    }

    function getSnapEls(): HTMLElement[] {
      return SNAP_IDS
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
    }

    function currentIndex(els: HTMLElement[]): number {
      // Find the section whose top is closest to 0 (viewport top)
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el, i) => {
        const dist = Math.abs(el.getBoundingClientRect().top);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    function snapTo(el: HTMLElement) {
      isSnapping.current = true;
      lastSnap.current = Date.now();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isSnapping.current = false; }, COOLDOWN);
    }

    function onWheel(e: WheelEvent) {
      if (inHowItWorks()) return; // let HowItWorks scroll naturally
      if (isSnapping.current) { e.preventDefault(); return; }
      if (Date.now() - lastSnap.current < COOLDOWN) { e.preventDefault(); return; }

      const els = getSnapEls();
      if (els.length === 0) return;

      const idx = currentIndex(els);
      const next = e.deltaY > 0 ? Math.min(idx + 1, els.length - 1) : Math.max(idx - 1, 0);
      if (next === idx) return;

      e.preventDefault();
      snapTo(els[next]);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return null;
}
