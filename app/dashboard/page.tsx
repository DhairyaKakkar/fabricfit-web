import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PLAY_STORE_URL } from '@/lib/appLinks';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';
const REQUEST_CREDITS_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi, I'd like to request more trial credits for my TrialRoomStudio account",
)}`;

const TRY_ON_COST = 2; // credits per 'low' quality try-on

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
    { data: credit },
    { count: fabricCount },
    { count: outfitCount },
    { count: tryonCount },
    { count: catalogueCount },
  ] = await Promise.all([
    supabase.from('credits').select('balance').eq('user_id', user!.id).single(),
    supabase.from('fabrics').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
    supabase.from('outfits').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
    supabase.from('tryons').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? '').eq('status', 'success').is('purged_at', null),
    supabase.from('catalogues').select('*', { count: 'exact', head: true }).eq('outlet_id', outletId ?? ''),
  ]);

  const balance = credit?.balance ?? 0;
  const canTryOn = balance >= TRY_ON_COST;

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
      <p className="text-sm text-zinc-400 mb-6">Welcome back. Here&apos;s what you can do.</p>

      {/* ── Credits + primary action ─────────────────────────────────── */}
      <div className="rounded-2xl bg-zinc-900 text-white p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Your credits</p>
            <p className="text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              {balance}
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              {canTryOn
                ? `Each try-on uses ${TRY_ON_COST} credits — you can run ${Math.floor(balance / TRY_ON_COST)} more.`
                : 'You’re out of credits. Request more, or pick a plan to keep generating.'}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:items-end shrink-0">
            {canTryOn ? (
              <Link
                href="/demo"
                className="inline-flex items-center justify-center bg-white text-zinc-900 text-sm font-bold px-6 py-3 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Run a try-on →
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-white text-zinc-900 text-sm font-bold px-6 py-3 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Choose a plan →
              </Link>
            )}
            <a
              href={REQUEST_CREDITS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-zinc-700 text-zinc-300 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }} aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Request more credits
            </a>
          </div>
        </div>
      </div>

      {/* Trial banner */}
      {outlet?.is_trial && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900 text-sm">You&apos;re on the free trial</p>
            <p className="text-xs text-amber-700 mt-0.5">Pick a plan when you&apos;re ready — Pay As You Go starts at ₹25 per try-on</p>
          </div>
          <Link href="/pricing" className="inline-block bg-amber-800 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-amber-900 transition-colors shrink-0">
            See plans →
          </Link>
        </div>
      )}

      {/* ── Your library ─────────────────────────────────────────────── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Your library</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-sm transition-all">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">{label}</p>
            <p className="text-3xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
            <p className="text-xs text-zinc-400 mt-2">View →</p>
          </Link>
        ))}
      </div>

      {/* ── Get set up ───────────────────────────────────────────────── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Get set up</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/inventory', title: '1 · Add your fabrics', desc: 'Upload phone photos of your fabrics — they become your try-on inventory' },
          { href: '/demo', title: '2 · Run a try-on', desc: 'Drape a fabric on a model in 15–20 seconds, right from the browser' },
          { href: '/dashboard/gallery', title: '3 · Share the results', desc: 'Your generated looks are saved here — share them with customers on WhatsApp' },
        ].map(({ href, title, desc }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all group">
            <p className="font-semibold text-zinc-900 text-sm mb-1 group-hover:text-zinc-700 transition-colors">{title}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      {/* ── The app ──────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 rounded-2xl p-6 text-white mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-sm mb-1">Using it in your showroom?</p>
          <p className="text-xs text-zinc-400">The Android app is built for the shop floor — camera-first, customer photos, instant WhatsApp sharing.</p>
        </div>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-white text-zinc-900 px-5 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.6 1.8a1 1 0 0 0-.5.87v18.66a1 1 0 0 0 .5.87l10.3-10.2zm11.7 8.4 2.9-2.87-9.9-5.6a1 1 0 0 0-.5-.13zm0 3.6L8 21.5a1 1 0 0 0 .5-.13l9.9-5.6zm1.4-1.4 3-1.7c.8-.45.8-1.6 0-2.05l-3-1.7-3.06 3.07z"/>
          </svg>
          Get the Android app
        </a>
      </div>
    </div>
  );
}
