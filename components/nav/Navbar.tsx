'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { slowScrollTo } from '@/lib/scrollTo';
import { createClient } from '@/lib/supabase/client';
import TrialRequestModal from '@/components/TrialRequestModal';

const NAV_LINKS = [{ anchor: 'features', label: 'Features' }] as const;
const PRICING_LINK = { href: '/pricing', label: 'Pricing' };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const showPill = scrolled;
  // Treat as light when menu is open (background forces white)
  const onDark = isHome && !scrolled && !menuOpen;

  const links = [
    ...NAV_LINKS.map(l => ({ href: isHome ? `#${l.anchor}` : `/#${l.anchor}`, label: l.label })),
    PRICING_LINK,
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 40);
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 40) setMenuOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setTrialOpen(true);
    window.addEventListener('open-trial-modal', handler);
    return () => window.removeEventListener('open-trial-modal', handler);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) { e.preventDefault(); slowScrollTo(href.slice(1)); }
  };

  const accountLink = loggedIn
    ? { href: '/dashboard', label: 'Dashboard' }
    : { href: '/signup', label: 'Sign up' };

  const linkColor     = onDark ? 'rgba(255,255,255,0.55)' : 'rgba(9,9,11,0.5)';
  const linkHover     = onDark ? '#ffffff' : '#09090b';
  const linkHoverBg   = onDark ? 'rgba(255,255,255,0.08)' : 'rgba(9,9,11,0.05)';
  const wordmarkColor = onDark ? '#ffffff' : '#09090b';
  const wordmarkMuted = onDark ? 'rgba(255,255,255,0.38)' : 'rgba(9,9,11,0.32)';
  const accountColor  = onDark ? 'rgba(255,255,255,0.5)' : 'rgba(9,9,11,0.45)';
  const accountHover  = onDark ? '#ffffff' : '#09090b';

  return (
    <>
      {/* Outer shell — transparent, handles padding animation */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        pointerEvents: 'none',
        padding: showPill ? '12px 20px' : '0',
        transition: 'padding 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <header
          ref={headerRef}
          style={{
            pointerEvents: 'auto',
            margin: '0 auto',
            maxWidth: showPill ? 1200 : '100%',
            borderRadius: showPill ? 14 : 0,
            background: (showPill || menuOpen) ? '#ffffff' : isHome ? 'transparent' : '#ffffff',
            boxShadow: showPill ? '0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)' : 'none',
            border: showPill
              ? '1px solid rgba(0,0,0,0.07)'
              : isHome ? '1px solid transparent' : '1px solid rgba(9,9,11,0.08)',
            transition: 'max-width 0.35s cubic-bezier(0.4,0,0.2,1), border-radius 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Nav bar row */}
          <div style={{
            height: showPill ? 52 : 64,
            display: 'flex', alignItems: 'center',
            padding: isMobile ? '0 16px' : (showPill ? '0 20px' : '0 32px'),
            transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}>

            {/* Logo + wordmark */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
              <Image
                src="/logo.png" alt="TrialRoomStudio" width={32} height={32} priority
                style={{ height: showPill ? 32 : 38, width: 'auto', display: 'block', transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)' }}
              />
              <span style={{
                fontFamily: 'var(--font-playfair)', fontSize: showPill ? 17 : 20, fontWeight: 700,
                color: wordmarkColor, letterSpacing: '-0.01em', lineHeight: 1,
                transition: 'color 0.3s, font-size 0.35s',
              }}>
                TrialRoom
                <span style={{ color: wordmarkMuted, fontWeight: 400, transition: 'color 0.3s' }}>Studio</span>
              </span>
            </a>

            {/* Desktop: Nav links centered */}
            {!isMobile && (
              <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
                {links.map((l) => (
                  <a
                    key={l.href} href={l.href}
                    onClick={(e) => handleAnchorClick(e, l.href)}
                    style={{
                      fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 500,
                      color: linkColor, textDecoration: 'none',
                      padding: '5px 14px', borderRadius: 6,
                      letterSpacing: '0.01em',
                      transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = linkHover;
                      (e.currentTarget as HTMLElement).style.background = linkHoverBg;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = linkColor;
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            )}

            {/* Desktop: Right CTAs */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <a
                  href={accountLink.href}
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 500,
                    color: accountColor, textDecoration: 'none', padding: '5px 10px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = accountHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = accountColor}
                >
                  {accountLink.label}
                </a>
                {!loggedIn && (
                  <a
                    href="/pricing"
                    style={{
                      fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 800,
                      color: '#09090b', background: '#ffffff',
                      border: 'none', borderRadius: 8, padding: '8px 20px',
                      cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none',
                      transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = '#09090b';
                      el.style.color = '#ffffff';
                      el.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = '#ffffff';
                      el.style.color = '#09090b';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    Explore Pricing →
                  </a>
                )}
              </div>
            )}

            {/* Mobile: hamburger */}
            {isMobile && (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px', display: 'flex', flexDirection: 'column',
                    gap: 5, justifyContent: 'center', alignItems: 'center',
                    width: 40, height: 40,
                  }}
                >
                  <span style={{
                    display: 'block', width: 22, height: 2,
                    background: wordmarkColor, borderRadius: 2,
                    transition: 'transform 0.25s ease',
                    transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                  }} />
                  <span style={{
                    display: 'block', width: 22, height: 2,
                    background: wordmarkColor, borderRadius: 2,
                    transition: 'opacity 0.2s',
                    opacity: menuOpen ? 0 : 1,
                  }} />
                  <span style={{
                    display: 'block', width: 22, height: 2,
                    background: wordmarkColor, borderRadius: 2,
                    transition: 'transform 0.25s ease',
                    transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                  }} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile dropdown */}
          {isMobile && (
            <div style={{
              maxHeight: menuOpen ? 320 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div style={{
                padding: '4px 16px 20px',
                borderTop: '1px solid rgba(9,9,11,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                {links.map((l) => (
                  <a
                    key={l.href} href={l.href}
                    onClick={(e) => handleAnchorClick(e, l.href)}
                    style={{
                      fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 500,
                      color: 'rgba(9,9,11,0.65)', textDecoration: 'none',
                      padding: '11px 12px', borderRadius: 8,
                      display: 'block',
                    }}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={accountLink.href}
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 500,
                    color: 'rgba(9,9,11,0.65)', textDecoration: 'none',
                    padding: '11px 12px', borderRadius: 8,
                    display: 'block',
                  }}
                >
                  {accountLink.label}
                </a>
                {!loggedIn && (
                  <button
                    onClick={() => { setMenuOpen(false); setTrialOpen(true); }}
                    style={{
                      marginTop: 8,
                      fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 800,
                      color: '#ffffff', background: '#09090b',
                      border: 'none', borderRadius: 10, padding: '14px 20px',
                      cursor: 'pointer', width: '100%', textAlign: 'center',
                    }}
                  >
                    Request Access →
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      <TrialRequestModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </>
  );
}
