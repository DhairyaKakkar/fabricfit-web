'use client';

import { useEffect, useRef } from 'react';

// All snap targets in page order.
// hero + how-it-works are also passthrough zones — wheel events pass through naturally
// so the video expansion and GSAP animations play undisturbed.
const SNAP_IDS = [
  'hero',
  'see-it-live',
  'how-it-works',
  'in-store',
  'web-embed',
  'catalog',
  'traction',
  'cta',
];

// Sections with complex internal scroll — natural scroll, no snap intercept.
// see-it-live contains the DnD canvas; any wheel over it would otherwise immediately
// snap the user away before they can interact with the demo.
const PASSTHROUGH_IDS = ['hero', 'see-it-live', 'how-it-works'];

const SNAP_COOLDOWN    = 1100;
const EXIT_PT_COOLDOWN = 1600;

export default function ScrollSnapper() {
  const isSnapping       = useRef(false);
  const wasInPassthrough = useRef(false);
  const exitCooldown     = useRef(false);

  useEffect(() => {
    function inPassthroughZone(): boolean {
      return PASSTHROUGH_IDS.some(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (id === 'hero') {
          // 200vh sticky element — passthrough covers the full scroll range
          return top <= 0 && bottom > 0;
        }
        // Other sections: midpoint check
        return top < vh * 0.5 && bottom > vh * 0.5;
      });
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

      const onScrollEnd = () => {
        isSnapping.current = false;
        window.removeEventListener('scrollend', onScrollEnd);
      };
      window.addEventListener('scrollend', onScrollEnd, { once: true });

      setTimeout(() => {
        isSnapping.current = false;
        window.removeEventListener('scrollend', onScrollEnd);
      }, SNAP_COOLDOWN);
    }

    let exitTimer: ReturnType<typeof setTimeout> | null = null;

    function onWheel(e: WheelEvent) {
      const nowInPT = inPassthroughZone();

      // Track enter / exit transitions for passthrough zones
      if (!wasInPassthrough.current && nowInPT) {
        wasInPassthrough.current = true;
        exitCooldown.current = false;
        if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
      } else if (wasInPassthrough.current && !nowInPT) {
        wasInPassthrough.current = false;
        isSnapping.current = false;
        exitCooldown.current = true;
        if (exitTimer) clearTimeout(exitTimer);
        exitTimer = setTimeout(() => { exitCooldown.current = false; }, EXIT_PT_COOLDOWN);
      }

      // In passthrough zone or cooling down after exit: let natural scroll happen
      if (nowInPT || exitCooldown.current) return;

      // Block scroll during active snap animation
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
