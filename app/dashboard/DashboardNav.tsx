'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/app/actions/auth';

const NAV_LINKS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/gallery',
    label: 'Gallery',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 9l3.5-3.5L7 8l3-3 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="5" cy="4.5" r="1" fill="currentColor"/>
        <path d="M4 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/inventory',
    label: 'Inventory',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4.5L8 2l6 2.5v5.5L8 14 2 10V4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 2v12M2 4.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/outfits',
    label: 'Outfits',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.5 2C5.5 2 4 3 4 4.5V13.5H12V4.5C12 3 10.5 2 10.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5.5 2C5.5 3.1 6.6 4 8 4C9.4 4 10.5 3.1 10.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 4.5L5.5 2M14 4.5L10.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 4.5C2 4.5 2.5 5 4 4.5M14 4.5C14 4.5 13.5 5 12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/catalogues',
    label: 'Catalogues',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 6h6M5 8.5h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/subscription',
    label: 'Subscription',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L10 6h4.5L11 9l1.5 4.5L8 11l-4.5 2.5L5 9 1.5 6H6L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface Props {
  businessName: string;
  isTrial: boolean;
  outletId: string | null;
}

export default function DashboardNav({ businessName, isTrial }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  return (
    <>
      {/* Mobile top bar — only below lg */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 z-30" style={{ fontFamily: 'var(--font-inter)' }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="TrialRoomStudio" width={28} height={28} className="h-7 w-auto" />
          <span className="text-sm font-semibold text-zinc-900">TrialRoomStudio</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2 text-zinc-700 hover:text-zinc-900"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Backdrop for the mobile drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-zinc-900/40 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 lg:w-56 bg-white border-r border-zinc-200 flex flex-col z-50 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-100 shrink-0">
        <Link href="/dashboard" onClick={close} className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="TrialRoomStudio" width={32} height={32} className="h-8 w-auto" />
          <span className="text-sm font-semibold text-zinc-900 leading-tight">TrialRoom<br/>Studio</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="lg:hidden p-2 -mr-2 text-zinc-500 hover:text-zinc-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              onClick={close}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                active
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <span className={active ? 'text-zinc-800' : 'text-zinc-400'}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: business name + trial badge + sign out */}
      <div className="shrink-0 border-t border-zinc-100 px-3 py-3 space-y-2">
        {isTrial && (
          <Link
            href="/pricing"
            onClick={close}
            className="flex items-center justify-center w-full text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
          >
            ✦ Upgrade from Free Trial
          </Link>
        )}
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-xs text-zinc-400 truncate flex-1">{businessName}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors shrink-0"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
      </aside>
    </>
  );
}
