'use client';

import { useState } from 'react';

const GOLD = '#D9A046';

function Icon({ name }: { name: 'whatsapp' | 'mail' | 'pin' | 'clock' }) {
  const s = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: GOLD, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'whatsapp')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z" />
      </svg>
    );
  if (name === 'mail')
    return (<svg {...s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
  if (name === 'clock')
    return (<svg {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
  return (<svg {...s}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
}

const inputCls =
  'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D9A046]/50 focus:border-[#D9A046] transition';

const CHANNELS = [
  { icon: 'whatsapp' as const, label: 'WhatsApp', value: '+91 98847 44296', href: 'https://wa.me/919884744296?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20TrialRoomStudio' },
  { icon: 'mail' as const, label: 'Email', value: 'hello@trialroomstudio.com', href: 'mailto:hello@trialroomstudio.com' },
  { icon: 'pin' as const, label: 'Based in', value: 'Singapore & India', href: null },
  { icon: 'clock' as const, label: 'Response time', value: 'Within 24 hours', href: null },
];

export default function ContactClient() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6" style={{ background: '#FEF9F0' }}>
      <div className="mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20" style={{ maxWidth: 1100 }}>

        {/* Left — editorial + channels */}
        <div>
          <p className="text-xs font-semibold uppercase mb-4" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.2em', color: '#92400E' }}>
            Contact
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 700, color: '#1C1206', lineHeight: 1.03, letterSpacing: '-0.025em' }}>
            Let&apos;s bring your<br />showroom online.
          </h1>
          <p className="mt-5 mb-10" style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: '#57534E', maxWidth: 420, lineHeight: 1.7 }}>
            Questions about pricing, a custom plan, or a live demo with your own fabrics? Send a message or reach us directly — we reply fast.
          </p>

          <div className="flex flex-col gap-5">
            {CHANNELS.map((c) => {
              const inner = (
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: 'rgba(217,160,70,0.12)' }}>
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', color: '#a1a1aa' }}>{c.label}</p>
                    <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-inter)', color: '#1C1206' }}>{c.value}</p>
                  </div>
                </div>
              );
              return c.href ? (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group transition-opacity hover:opacity-70">
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
          </div>
        </div>

        {/* Right — form card */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 md:p-10 self-start" style={{ boxShadow: '0 12px 40px rgba(28,18,6,0.08)' }}>
          {status === 'sent' ? (
            <div className="flex flex-col items-center text-center py-12">
              <span className="flex items-center justify-center rounded-full mb-5" style={{ width: 64, height: 64, background: 'rgba(37,211,102,0.12)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
              </span>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 700, color: '#1C1206' }}>Message sent</h2>
              <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#57534E' }}>Thanks for reaching out — we&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold text-zinc-900 underline underline-offset-4" style={{ fontFamily: 'var(--font-inter)' }}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-zinc-600 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>Name</label>
                  <input id="name" name="name" required placeholder="Your name" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-xs font-medium text-zinc-600 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>Company <span className="text-zinc-300 normal-case">(optional)</span></label>
                  <input id="company" name="company" placeholder="Showroom / brand" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-600 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>Work email</label>
                <input id="email" name="email" type="email" required placeholder="you@company.com" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-medium text-zinc-600 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>Message</label>
                <textarea id="message" name="message" required rows={5} placeholder="Tell us what you're looking for…" className={`${inputCls} resize-none`} style={{ fontFamily: 'var(--font-inter)' }} />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#09090b] text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className="text-center text-xs text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Prefer to chat? <a href="https://wa.me/919884744296" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-700 underline underline-offset-2">Message us on WhatsApp</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
