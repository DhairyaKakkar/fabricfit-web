'use client';

import { useEffect, useState } from 'react';

interface Outlet {
  business_name: string;
  owner_name: string | null;
  city: string | null;
  is_trial: boolean;
  preview_limit: number;
  access_code: string | null;
}

export default function SettingsPage() {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [form, setForm] = useState({ business_name: '', owner_name: '', city: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

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

        {/* App access code */}
        {outlet?.access_code && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="font-semibold text-zinc-900 text-sm mb-1">App Access Code</h3>
            <p className="text-xs text-zinc-400 mb-4">Use this code to log in to the TrialRoomStudio mobile app</p>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
              <span className="flex-1 font-mono text-lg font-bold text-zinc-900 tracking-widest">
                {outlet.access_code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(outlet.access_code!);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                className="shrink-0 text-xs font-semibold text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                {codeCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

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
