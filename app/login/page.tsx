'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { login, loginWithAccessCode } from '@/app/actions/auth';

type Mode = 'email' | 'code';

const inputCls =
  'w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D9A046]/50 focus:border-[#D9A046] transition';
const labelCls = 'text-xs font-medium text-zinc-600 uppercase tracking-wide';

function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#1C1206 0%,#2b1a08 100%)' }}
    >
      {/* gold accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#92400E,#D9A046,#92400E)' }} />
      <Link href="/" className="relative z-10 inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="TrialRoomStudio" width={40} height={40} className="h-10 w-auto" />
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: '#fff' }}>TrialRoomStudio</span>
      </Link>

      <div className="relative z-10">
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,3vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          See it before
          <br />
          you stitch it.
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 18, maxWidth: 360, lineHeight: 1.7 }}>
          AI-powered virtual try-on for fabric &amp; garment showrooms. Welcome back.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2">
        {['No photoshoot', 'WhatsApp delivery', '30-second try-ons'].map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D9A046' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('email');
  const [emailState, emailAction, emailPending] = useActionState(login, undefined);
  const [codeState, codeAction, codePending] = useActionState(loginWithAccessCode, undefined);

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF9F0' }}>
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex justify-center mb-6">
            <Image src="/logo.png" alt="TrialRoomStudio" width={64} height={64} className="h-16 w-auto" />
          </Link>

          <div className="mb-7">
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 30, fontWeight: 700, color: '#1C1206', letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              Sign in to manage your showroom
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-8" style={{ boxShadow: '0 8px 24px rgba(28,18,6,0.06)' }}>
            {/* Mode toggle */}
            <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 mb-6">
              {(['email', 'code'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                    mode === m ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {m === 'email' ? 'Email & Password' : 'Access Code'}
                </button>
              ))}
            </div>

            {mode === 'email' ? (
              <form action={emailAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Password</label>
                  <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
                </div>
                {emailState?.error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>{emailState.error}</p>
                )}
                <button type="submit" disabled={emailPending} className="w-full bg-[#09090b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                  {emailPending ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            ) : (
              <form action={codeAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="access_code" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Access Code</label>
                  <input id="access_code" name="access_code" type="text" required autoComplete="off" placeholder="e.g. ABC-1234" className={`${inputCls} tracking-widest font-mono uppercase`} style={{ fontFamily: 'var(--font-inter)' }} />
                  <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Find your access code in the TrialRoomStudio app under Settings.</p>
                </div>
                {codeState?.error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>{codeState.error}</p>
                )}
                <button type="submit" disabled={codePending} className="w-full bg-[#09090b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                  {codePending ? 'Verifying…' : 'Sign in with Access Code'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-zinc-500 mt-5" style={{ fontFamily: 'var(--font-inter)' }}>
            New to TrialRoomStudio?{' '}
            <Link href="/signup" className="font-semibold text-zinc-900 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
