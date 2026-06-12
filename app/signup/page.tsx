'use client';

import { Suspense, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { signup } from '@/app/actions/auth';

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

const inputCls =
  'w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D9A046]/50 focus:border-[#D9A046] transition';
const labelCls = 'text-xs font-medium text-zinc-600 uppercase tracking-wide';

function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#1C1206 0%,#2b1a08 100%)' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#92400E,#D9A046,#92400E)' }} />
      <Link href="/" className="relative z-10 inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="TrialRoomStudio" width={40} height={40} className="h-10 w-auto" />
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: '#fff' }}>TrialRoomStudio</span>
      </Link>

      <div className="relative z-10">
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,3vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Open your
          <br />
          virtual trial room.
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 18, maxWidth: 360, lineHeight: 1.7 }}>
          Let customers see your fabric on real models in seconds — no photoshoot, no studio.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2">
        {['No card required', 'Works in-store', '2-minute setup'].map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D9A046' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const params = useSearchParams();
  const planId = params.get('plan') ?? null;
  const next = params.get('next') ?? '';
  const planLabel = planId ? PLAN_LABELS[planId] : null;

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF9F0' }}>
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden flex justify-center mb-6">
            <Image src="/logo.png" alt="TrialRoomStudio" width={64} height={64} className="h-16 w-auto" />
          </Link>

          <div className="mb-7">
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 30, fontWeight: 700, color: '#1C1206', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p className="text-sm text-zinc-500 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              {planLabel ? (
                <>Get started with the <span className="text-zinc-700 font-medium">{planLabel}</span> plan</>
              ) : (
                <>Free demo try-on · no card required</>
              )}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-8" style={{ boxShadow: '0 8px 24px rgba(28,18,6,0.06)' }}>
            <form action={action} className="flex flex-col gap-4">
              {planId && <input type="hidden" name="plan_id" value={planId} />}
              {next && <input type="hidden" name="next" value={next} />}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="company_name" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Company name</label>
                <input id="company_name" name="company_name" type="text" required placeholder="Jain Exports" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Work email</label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className={labelCls} style={{ fontFamily: 'var(--font-inter)' }}>Password</label>
                <input id="password" name="password" type="password" required autoComplete="new-password" placeholder="Min 8 characters" className={inputCls} style={{ fontFamily: 'var(--font-inter)' }} />
              </div>

              {state?.error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>{state.error}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer" style={{ fontFamily: 'var(--font-inter)' }}>
                <input type="checkbox" name="agreed_tnc" required className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-[#D9A046] shrink-0" />
                <span className="text-xs text-zinc-500 leading-relaxed">
                  I have read and agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-zinc-700 font-medium underline underline-offset-2 hover:text-zinc-900">Terms &amp; Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy" target="_blank" className="text-zinc-700 font-medium underline underline-offset-2 hover:text-zinc-900">Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={pending} className="w-full bg-[#09090b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                {pending ? 'Creating account…' : planLabel ? 'Create account & continue to payment' : 'Create Account'}
              </button>
            </form>

            {planLabel && (
              <p className="text-center text-xs text-zinc-400 mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
                You&apos;ll be taken to payment after account creation.
              </p>
            )}
          </div>

          <p className="text-center text-sm text-zinc-500 mt-5" style={{ fontFamily: 'var(--font-inter)' }}>
            Already have an account?{' '}
            <Link href={planId ? `/login?next=/checkout?plan=${planId}%26billing=monthly` : next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="font-semibold text-zinc-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
