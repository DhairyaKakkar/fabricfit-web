'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-8 backdrop-blur-md bg-[#fef9f0]/90 transition-all duration-200 ${
        scrolled ? 'border-b border-amber-200/60 shadow-sm' : ''
      }`}
    >
      {/* Logo */}
      <span
        className="text-xl font-bold text-amber-900 tracking-wide select-none"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        TrialRoomStudio
      </span>

      {/* Nav links */}
      <nav className="flex-1 flex justify-center gap-8">
        <a
          href="#how-it-works"
          className="text-sm text-gray-400 hover:text-amber-800 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          How it Works
        </a>
        <a
          href="#features"
          className="text-sm text-gray-400 hover:text-amber-800 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Features
        </a>
        <a
          href="/pricing"
          className="text-sm text-gray-400 hover:text-amber-800 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Pricing
        </a>
      </nav>

      {/* CTA */}
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-md bg-amber-800 text-white text-sm font-medium hover:bg-amber-900 transition-colors"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Book a Demo
      </a>
    </header>
  );
}
