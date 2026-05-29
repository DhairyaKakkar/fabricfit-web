import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

const PLAN_LABELS: Record<string, string> = {
  payg: 'Pay As You Go',
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

const STATUS_STYLES: Record<string, string> = {
  active: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  trialing: 'text-blue-700 bg-blue-50 border-blue-200',
  past_due: 'text-red-700 bg-red-50 border-red-200',
  canceled: 'text-zinc-500 bg-zinc-50 border-zinc-200',
};

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  const { data: credits } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div>
      <h2
        className="text-2xl font-bold text-zinc-900 mb-1"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Subscription
      </h2>
      <p className="text-sm text-zinc-400 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
        Your current plan and billing details
      </p>

      <div className="max-w-lg space-y-4">
        {/* Plan card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>Current plan</p>
            {sub?.status && (
              <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${STATUS_STYLES[sub.status] ?? ''}`} style={{ fontFamily: 'var(--font-inter)' }}>
                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            {PLAN_LABELS[sub?.plan_id ?? ''] ?? 'Free trial'}
          </p>
          {sub?.billing_cycle && (
            <p className="text-sm text-zinc-400 mt-1 capitalize" style={{ fontFamily: 'var(--font-inter)' }}>
              {sub.billing_cycle} billing · {sub.currency ?? 'SGD'}
            </p>
          )}
          {periodEnd && (
            <p className="text-xs text-zinc-400 mt-3" style={{ fontFamily: 'var(--font-inter)' }}>
              Renews on {periodEnd}
            </p>
          )}
        </div>

        {/* Credits card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-3" style={{ fontFamily: 'var(--font-inter)' }}>Credits</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              {credits?.balance ?? 0}
            </p>
            <p className="text-sm text-zinc-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
              / {credits?.total_allocated ?? 0} allocated
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all"
              style={{ width: `${credits?.total_allocated ? Math.round((credits.balance / credits.total_allocated) * 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Upgrade CTA */}
        {sub?.status !== 'active' && (
          <Link
            href="/pricing"
            className="block w-full text-center bg-zinc-900 text-white text-sm font-semibold py-3 rounded-2xl hover:bg-zinc-800 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Upgrade your plan →
          </Link>
        )}
        {sub?.status === 'active' && (
          <Link
            href="/pricing"
            className="block w-full text-center border border-zinc-200 text-zinc-600 text-sm font-semibold py-3 rounded-2xl hover:bg-zinc-50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Change plan
          </Link>
        )}
      </div>
    </div>
  );
}
