'use client';

import { useEffect, useState } from 'react';
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
  const pathname = usePathname();
  const isHome = pathname === '/';

  // pill only when scrolled
  const showPill = scrolled;
  // white text only when over dark hero (home, not yet scrolled)
  const onDark = isHome && !scrolled;

  const links = [
    ...NAV_LINKS.map(l => ({ href: isHome ? `#${l.anchor}` : `/#${l.anchor}`, label: l.label })),
    PRICING_LINK,
  ];

  useEffect(() => {
    // Read immediately — handles anchor-jump navigation where scroll fires before listener attaches
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
  const ctaBg         = onDark ? '#ffffff' : '#09090b';
  const ctaColor      = onDark ? '#09090b' : '#ffffff';

  return (
    <>
      {/* Outer shell — transparent, handles padding animation */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        pointerEvents: 'none',
        padding: showPill ? '12px 20px' : '0',
        transition: 'padding 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <header style={{
          pointerEvents: 'auto',
          margin: '0 auto',
          maxWidth: showPill ? 1200 : '100%',
          borderRadius: showPill ? 14 : 0,
          background: showPill ? '#ffffff' : isHome ? 'transparent' : '#ffffff',
          boxShadow: showPill ? '0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)' : 'none',
          border: showPill
            ? '1px solid rgba(0,0,0,0.07)'
            : isHome ? '1px solid transparent' : '1px solid rgba(9,9,11,0.08)',
          transition: 'max-width 0.35s cubic-bezier(0.4,0,0.2,1), border-radius 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
        }}>
          <div style={{
            height: showPill ? 60 : 72,
            display: 'flex', alignItems: 'center',
            padding: showPill ? '0 24px' : '0 40px',
            transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}>

            {/* Logo + wordmark */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
              <Image
                src="/logo.png" alt="TrialRoomStudio" width={32} height={32} priority
                style={{ height: showPill ? 32 : 38, width: 'auto', display: 'block', transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)' }}
              />
              <span style={{
                fontFamily: 'var(--font-playfair)', fontSize: showPill ? 17 : 19, fontWeight: 700,
                color: wordmarkColor, letterSpacing: '-0.01em', lineHeight: 1,
                transition: 'color 0.3s, font-size 0.35s',
              }}>
                TrialRoom
                <span style={{ color: wordmarkMuted, fontWeight: 400, transition: 'color 0.3s' }}>Studio</span>
              </span>
            </a>

            {/* Nav links — centered */}
            <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
              {links.map((l) => (
                <a
                  key={l.href} href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
                    color: linkColor, textDecoration: 'none',
                    padding: '5px 12px', borderRadius: 6,
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

            {/* Right CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <a
                href={accountLink.href}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
                  color: accountColor, textDecoration: 'none', padding: '5px 10px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = accountHover}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = accountColor}
              >
                {accountLink.label}
              </a>
              {!loggedIn && (
                <button
                  onClick={() => setTrialOpen(true)}
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
                    color: ctaColor, background: ctaBg,
                    border: 'none', borderRadius: 8, padding: '7px 18px',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'opacity 0.15s, transform 0.15s, background 0.3s, color 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.82';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  Request Access →
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      <TrialRequestModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </>
  );
}
