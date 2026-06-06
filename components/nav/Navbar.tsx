'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { slowScrollTo } from '@/lib/scrollTo';
import { createClient } from '@/lib/supabase/client';
import TrialRequestModal from '@/components/TrialRequestModal';

const NAV_LINKS = [{ anchor: 'features', label: 'Features' }] as const;
const PRICING_LINK = { href: '/pricing', label: 'Pricing' };
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const links = [
    ...NAV_LINKS.map(l => ({ href: isHome ? `#${l.anchor}` : `/#${l.anchor}`, label: l.label })),
    PRICING_LINK,
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    if (href.startsWith('#')) { e.preventDefault(); slowScrollTo(href.slice(1)); setOpen(false); }
  };

  const accountLink = loggedIn
    ? { href: '/dashboard', label: 'Dashboard' }
    : { href: '/login', label: 'Sign in' };

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          background: scrolled ? 'rgba(9,9,11,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        <div style={{
          height: 64, display: 'flex', alignItems: 'center',
          padding: '0 32px', maxWidth: 1400, margin: '0 auto', gap: 0,
        }}>

          {/* Logo + wordmark */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <Image src="/logo.png" alt="TrialRoomStudio" width={36} height={36} priority style={{ height: 36, width: 'auto', display: 'block' }} />
            <span style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 17,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              TrialRoom<span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>Studio</span>
            </span>
          </a>

          {/* Desktop nav — centered */}
          <nav style={{
            display: 'flex', flex: 1, justifyContent: 'center', gap: 8, alignItems: 'center',
          }} className="hidden md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  letterSpacing: '0.01em',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <a
              href={accountLink.href}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                padding: '6px 12px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ffffff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
            >
              {accountLink.label}
            </a>

            {!loggedIn && (
              <button
                onClick={() => setTrialOpen(true)}
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#09090b',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'opacity 0.15s, transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.88';
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

          {/* Mobile spacer + hamburger */}
          <div style={{ flex: 1 }} className="md:hidden" />
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden"
            aria-label="Toggle menu"
            style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', height: 2, width: 20, background: '#ffffff', borderRadius: 2,
                transition: 'all 0.2s',
                transform: i === 0 && open ? 'translateY(7px) rotate(45deg)' : i === 2 && open ? 'translateY(-7px) rotate(-45deg)' : 'none',
                opacity: i === 1 && open ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className="md:hidden"
          style={{
            overflow: 'hidden', maxHeight: open ? 320 : 0,
            transition: 'max-height 0.3s ease',
            background: 'rgba(9,9,11,0.95)',
            backdropFilter: 'blur(24px)',
            borderTop: open ? '1px solid rgba(255,255,255,0.07)' : 'none',
          }}
        >
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                style={{
                  fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={accountLink.href}
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 500,
                color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0',
              }}
            >
              {accountLink.label}
            </a>
            {!loggedIn && (
              <button
                onClick={() => { setOpen(false); setTrialOpen(true); }}
                style={{
                  marginTop: 8, padding: '14px 20px', borderRadius: 10,
                  background: '#ffffff', color: '#09090b', border: 'none',
                  fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                Request Access →
              </button>
            )}
          </div>
        </div>
      </header>

      <TrialRequestModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </>
  );
}
