'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/inventory', label: 'Inventory' },
  { href: '/dashboard/outfits', label: 'Outfits' },
  { href: '/dashboard/catalogues', label: 'Catalogues' },
  { href: '/dashboard/subscription', label: 'Subscription' },
  { href: '/dashboard/settings', label: 'Settings' },
];

interface Props {
  businessName: string;
  isTrial: boolean;
  outletId: string | null;
}

export default function DashboardNav({ businessName, isTrial }: Props) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="shrink-0 flex items-center">
          <Image src="/logo.png" alt="TrialRoomStudio" width={48} height={48} className="h-12 w-auto block" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 px-4">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {isTrial && (
            <Link
              href="/pricing"
              className="hidden sm:block text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors"
            >
              Free trial
            </Link>
          )}
          <span className="text-xs text-zinc-400 hidden md:block truncate max-w-[140px]">{businessName}</span>
          <form action={logout}>
            <button type="submit" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-zinc-100 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
