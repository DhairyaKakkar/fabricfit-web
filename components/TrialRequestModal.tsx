'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TrialRequestModal({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/trial-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, phone, email }),
      });
      if (!res.ok) throw new Error('Request failed');
      setDone(true);
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setDone(false); setError(''); setName(''); setCompany(''); setPhone(''); setEmail(''); }, 300);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
        style={{ border: '1px solid #e4e4e7' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          style={{ fontFamily: 'var(--font-inter)', fontSize: 18, lineHeight: 1 }}
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-8">
          {done ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                You&apos;re on the list!
              </h3>
              <p className="text-sm text-zinc-500" style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.6 }}>
                We&apos;ll review your request and send your access code to <strong className="text-zinc-700">{email}</strong> shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 w-full bg-zinc-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="TrialRoomStudio" width={36} height={36} className="h-9 w-auto" />
                <div>
                  <h3 className="text-base font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Request Access
                  </h3>
                  <p className="text-xs text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>
                    We&apos;ll send your access code by email
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                    Full Name
                  </label>
                  <input
                    ref={firstRef}
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ravi Jain"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                    Company / Showroom Name
                  </label>
                  <input
                    type="text" required value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="Jain Silk House"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                      Phone
                    </label>
                    <input
                      type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                      Email
                    </label>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-zinc-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {loading ? 'Sending request…' : 'Request Access →'}
                </button>
              </form>

              <p className="text-center text-xs text-zinc-400 mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
                We review every request personally and respond within 24 hours.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
