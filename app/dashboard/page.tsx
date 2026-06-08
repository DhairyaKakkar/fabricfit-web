import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PLAY_STORE_URL } from '@/lib/appLinks';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id, business_name, is_trial, preview_limit')
    .eq('user_id', user!.id)
    .single();

  const outletId = outlet?.id;

  const [
    { count: fabricCount },
    { count: outfitCount },
    { count: tryonCount },
    { count: catalogueCount },
  ] = await Promise.all([
    supabase.from('fabrics').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
    supabase.from('outfits').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
    supabase.from('tryons').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? '').eq('status', 'success').is('purged_at', null),
    supabase.from('catalogues').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
  ]);

  const stats = [
    { label: 'Fabrics', value: fabricCount ?? 0, href: '/dashboard/inventory' },
    { label: 'Outfits', value: outfitCount ?? 0, href: '/dashboard/outfits' },
    { label: 'Try-ons saved', value: tryonCount ?? 0, href: '/dashboard/gallery' },
    { label: 'Catalogues', value: catalogueCount ?? 0, href: '/dashboard/catalogues' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
        {outlet?.business_name ?? 'Dashboard'}
      </h2>
      <p className="text-sm text-zinc-400 mb-8">Welcome back — here's your account at a glance.</p>

      {/* Trial banner */}
      {outlet?.is_trial && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900 text-sm">You're on a free trial</p>
            <p className="text-xs text-amber-700 mt-0.5">Upgrade to unlock more features and remove limits</p>
          </div>
          <Link href="/pricing" className="inline-block bg-amber-800 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-amber-900 transition-colors shrink-0">
            Choose a plan →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-sm transition-all">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">{label}</p>
            <p className="text-3xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/inventory', title: 'Upload Fabrics', desc: 'Add fabric images to your inventory' },
          { href: '/dashboard/outfits', title: 'Upload Outfits', desc: 'Add outfit photos for try-on' },
          { href: '/dashboard/gallery', title: 'View Gallery', desc: 'Browse all your saved try-on results' },
          { href: '/dashboard/catalogues', title: 'Manage Catalogues', desc: 'Organise try-ons into collections' },
          { href: '/dashboard/settings', title: 'Settings', desc: 'Edit your business details' },
        ].map(({ href, title, desc }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all group">
            <p className="font-semibold text-zinc-900 text-sm mb-1 group-hover:text-zinc-700 transition-colors">{title}</p>
            <p className="text-xs text-zinc-400">{desc}</p>
          </Link>
        ))}

        {/* Get the app CTA */}
        <div className="bg-zinc-900 rounded-2xl p-6 text-white">
          <p className="font-semibold text-sm mb-1">Generate try-ons</p>
          <p className="text-xs text-zinc-400 mb-4">Try-on generation happens on the TrialRoomStudio Android app</p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.6 1.8a1 1 0 0 0-.5.87v18.66a1 1 0 0 0 .5.87l10.3-10.2zm11.7 8.4 2.9-2.87-9.9-5.6a1 1 0 0 0-.5-.13zm0 3.6L8 21.5a1 1 0 0 0 .5-.13l9.9-5.6zm1.4-1.4 3-1.7c.8-.45.8-1.6 0-2.05l-3-1.7-3.06 3.07z"/>
            </svg>
            Download on Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
