'use client';

import { useEffect, useRef } from 'react';

// Ordered snap targets. how-it-works IS included so we snap to its top entry,
// then GSAP handles the internal 3 pages, then snapping resumes after.
const SNAP_IDS = [
  'hero',
  'video-section',
  'how-it-works',
  'in-store',
  'web-embed',
  'catalog',
  'traction',
  'cta',
];

const SNAP_COOLDOWN = 1100;      // ms: lock after a snap fires
const EXIT_HIW_COOLDOWN = 1600;  // ms: grace period after leaving HowItWorks

export default function ScrollSnapper() {
  const isSnapping   = useRef(false);
  const wasInHIW     = useRef(false);
  const exitCooldown = useRef(false);

  useEffect(() => {
    function inHowItWorks(): boolean {
      const el = document.getElementById('how-it-works');
      if (!el) return false;
      const { top, bottom } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Inside if the viewport midpoint is within the element
      return top < vh * 0.5 && bottom > vh * 0.5;
    }

    function getSnapEls(): HTMLElement[] {
      return SNAP_IDS
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
    }

    function currentIndex(els: HTMLElement[]): number {
      let best = 0, bestDist = Infinity;
      els.forEach((el, i) => {
        const d = Math.abs(el.getBoundingClientRect().top);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function snapTo(el: HTMLElement) {
      isSnapping.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Primary: listen for scrollend (Chrome 109+, Firefox 109+)
      const onScrollEnd = () => {
        isSnapping.current = false;
        window.removeEventListener('scrollend', onScrollEnd);
      };
      window.addEventListener('scrollend', onScrollEnd, { once: true });

      // Fallback: always release after SNAP_COOLDOWN regardless
      setTimeout(() => {
        isSnapping.current = false;
        window.removeEventListener('scrollend', onScrollEnd);
      }, SNAP_COOLDOWN);
    }

    let exitTimer: ReturnType<typeof setTimeout> | null = null;

    function onWheel(e: WheelEvent) {
      const nowInHIW = inHowItWorks();

      // Track enter / exit transitions
      if (!wasInHIW.current && nowInHIW) {
        wasInHIW.current = true;
        exitCooldown.current = false;
        if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
      } else if (wasInHIW.current && !nowInHIW) {
        wasInHIW.current = false;
        isSnapping.current = false;   // clear any stale lock from before HIW
        exitCooldown.current = true;
        if (exitTimer) clearTimeout(exitTimer);
        exitTimer = setTimeout(() => { exitCooldown.current = false; }, EXIT_HIW_COOLDOWN);
      }

      // Let GSAP / natural scroll handle HowItWorks and the grace period after it
      if (nowInHIW || exitCooldown.current) return;

      // Block during an active snap
      if (isSnapping.current) { e.preventDefault(); return; }

      const els = getSnapEls();
      if (!els.length) return;

      const idx  = currentIndex(els);
      const dir  = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(idx + dir, els.length - 1));
      if (next === idx) return;

      e.preventDefault();
      snapTo(els[next]);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  return null;
}
