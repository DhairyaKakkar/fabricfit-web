'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LiquidButton from '@/components/ui/LiquidButton';
import { slowScrollTo } from '@/lib/scrollTo';
import { createClient } from '@/lib/supabase/client';

const NAV_LINKS = [
  { anchor: 'features', label: 'Features' },
] as const;
const PRICING_LINK = { href: '/pricing', label: 'Pricing' };
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const links = [
    ...NAV_LINKS.map(l => ({
      href: isHome ? `#${l.anchor}` : `/#${l.anchor}`,
      label: l.label,
    })),
    PRICING_LINK,
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      slowScrollTo(href.slice(1));
      setOpen(false);
    }
  };

  const accountLink = loggedIn ? { href: '/dashboard', label: 'Go to account' } : { href: '/login', label: 'Sign in' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? 'border-b border-zinc-200/80 shadow-sm' : 'border-b border-zinc-100'
      }`}
    >
      {/* Top bar */}
      <div className="h-14 flex items-center px-5 md:px-8">
        {/* Logo */}
        <a href="/" className="select-none hover:opacity-70 transition-opacity shrink-0 flex items-center">
          <Image src="/logo.png" alt="TrialRoomStudio" width={48} height={48} priority className="h-12 w-auto block" />
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchorClick(e, l.href)}
              className="text-sm text-zinc-400 hover:text-zinc-950 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={accountLink.href}
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {accountLink.label}
          </a>
          {!loggedIn && (
            <LiquidButton
              href="/signup"
              color="#ffffff"
              bg="rgba(9,9,11,0.92)"
              padding="9px 20px"
              fontSize={13}
            >
              Start Free Trial
            </LiquidButton>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex-1 md:hidden" />
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 -mr-1"
          aria-label="Toggle menu"
        >
          <span className="block h-[2px] w-5 bg-zinc-950 rounded-full transition-all duration-200 origin-center" style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span className="block h-[2px] w-5 bg-zinc-950 rounded-full transition-all duration-200" style={{ opacity: open ? 0 : 1 }} />
          <span className="block h-[2px] w-5 bg-zinc-950 rounded-full transition-all duration-200 origin-center" style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 300 : 0 }}>
        <div className="border-t border-zinc-100 bg-white/95 backdrop-blur-md px-5 py-5 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchorClick(e, l.href)}
              className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-2.5 border-b border-zinc-50 last:border-0"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={accountLink.href}
            className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-2.5"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {accountLink.label}
          </a>
          {!loggedIn && (
            <a
              href="/signup"
              className="mt-1 px-4 py-3 rounded-md bg-zinc-950 text-white text-sm font-semibold text-center"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Start Free Trial
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
