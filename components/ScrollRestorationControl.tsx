'use client';

import { useEffect } from 'react';

/**
 * Sets history.scrollRestoration = 'manual' globally so neither the browser
 * nor Next.js ever auto-restores scroll position on back/forward navigation.
 * This ensures GSAP ScrollTrigger always initialises at scroll=0 on every
 * page visit, preventing broken pin/rotation states on back navigation.
 */
export default function ScrollRestorationControl() {
  useEffect(() => {
    if (typeof history !== 'undefined') {
      history.scrollRestoration = 'manual';
    }
    // On every navigation (including back button), scroll to top
    const onPopState = () => window.scrollTo(0, 0);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}
