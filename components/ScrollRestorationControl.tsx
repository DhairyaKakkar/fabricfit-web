'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollRestorationControl() {
  useEffect(() => {
    if (typeof history !== 'undefined') {
      history.scrollRestoration = 'manual';
    }

    const onPopState = () => {
      // Kill all GSAP ScrollTrigger instances before resetting scroll position.
      // This prevents stale pin/rotation states from corrupting the incoming page.
      ScrollTrigger.getAll().forEach(t => t.kill());
      ScrollTrigger.clearScrollMemory();
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}
