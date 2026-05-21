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
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-8 backdrop-blur-md bg-white/90 transition-all duration-200 ${
        scrolled ? 'border-b border-zinc-200/80 shadow-sm' : ''
      }`}
    >
      {/* Logo */}
      <a
        href="/"
        className="text-xl font-bold text-zinc-950 tracking-wide select-none hover:opacity-70 transition-opacity"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        TrialRoomStudio
      </a>

      {/* Nav links */}
      <nav className="flex-1 flex justify-center gap-8">
        <a
          href="#how-it-works"
          className="text-sm text-zinc-400 hover:text-zinc-950 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          How it Works
        </a>
        <a
          href="#features"
          className="text-sm text-zinc-400 hover:text-zinc-950 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Features
        </a>
        <a
          href="/pricing"
          className="text-sm text-zinc-400 hover:text-zinc-950 transition-colors"
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
        className="px-4 py-2 rounded-md bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Book a Demo
      </a>
    </header>
  );
}
