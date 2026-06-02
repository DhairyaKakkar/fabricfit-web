'use client';

import { useEffect } from 'react';

export default function ScrollRestorationControl() {
  useEffect(() => {
    if (typeof history !== 'undefined') {
      history.scrollRestoration = 'manual';
    }
    const onPopState = () => window.scrollTo(0, 0);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}
