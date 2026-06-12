'use client';

import { useEffect, useActionState, useState } from 'react';
import { redeemCoupon } from '@/app/actions/subscriptions';

interface Outlet {
  business_name: string;
  owner_name: string | null;
  city: string | null;
  is_trial: boolean;
  preview_limit: number;
}

export default function SettingsPage() {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [form, setForm] = useState({ business_name: '', owner_name: '', city: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [couponState, couponAction, couponPending] = useActionState(redeemCoupon, undefined);

  useEffect(() => {
    fetch('/api/outlet').then(r => r.json()).then(data => {
      if (data) {
        setOutlet(data);
        setForm({
          business_name: data.business_name ?? '',
          owner_name: data.owner_name ?? '',
          city: data.city ?? '',
        });
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/outlet', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Settings</h2>
      <p className="text-sm text-zinc-400 mb-8">Your business details — synced across web and mobile</p>

      <div className="max-w-lg space-y-5">
        {/* Business details */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 text-sm mb-5">Business details</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Business name *</label>
              <input
                required
                value={form.business_name}
                onChange={e => setForm({ ...form, business_name: e.target.value })}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Owner name</label>
              <input
                value={form.owner_name}
                onChange={e => setForm({ ...form, owner_name: e.target.value })}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">City</label>
              <input
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-zinc-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Redeem coupon */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 text-sm mb-1">Redeem Coupon</h3>
          <p className="text-xs text-zinc-400 mb-4">Have a coupon code? Enter it below to add credits to your account.</p>
          <form action={couponAction} className="flex flex-col gap-3">
            <input
              name="coupon_code"
              type="text"
              placeholder="e.g. WELCOME50"
              autoCapitalize="characters"
              autoComplete="off"
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
            {couponState?.error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{couponState.error}</p>
            )}
            {couponState?.success && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{couponState.success}</p>
            )}
            <button
              type="submit"
              disabled={couponPending}
              className="w-full bg-zinc-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {couponPending ? 'Redeeming…' : 'Redeem'}
            </button>
          </form>
        </div>

        {/* Account info */}
        {outlet && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="font-semibold text-zinc-900 text-sm mb-4">Account</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Plan</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  outlet.is_trial
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  {outlet.is_trial ? 'Free trial' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Saved preview limit</span>
                <span className="text-xs font-semibold text-zinc-900">{outlet.preview_limit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
