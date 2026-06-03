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

function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const params = useSearchParams();
  const planId = params.get('plan') ?? null;
  const planLabel = planId ? PLAN_LABELS[planId] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="TrialRoomStudio" width={80} height={80} className="h-20 w-auto block" />
          </div>
          {planLabel ? (
            <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              Create your account to get started with the <span className="text-zinc-700 font-medium">{planLabel}</span> plan
            </p>
          ) : (
            <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              Start your 14-day free trial — no card required
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <form action={action} className="flex flex-col gap-4">
            {/* Pass plan through form */}
            {planId && <input type="hidden" name="plan_id" value={planId} />}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company_name" className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                Company name
              </label>
              <input
                id="company_name" name="company_name" type="text" required
                placeholder="Jain Exports"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                Work email
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                Password
              </label>
              <input
                id="password" name="password" type="password" required autoComplete="new-password"
                placeholder="Min 8 characters"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            {state?.error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>
                {state.error}
              </p>
            )}

            <button
              type="submit" disabled={pending}
              className="w-full bg-[#09090b] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {pending
                ? 'Creating account…'
                : planLabel
                  ? `Create account & continue to payment`
                  : 'Start free trial'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
            {planLabel ? 'You\'ll be taken to payment after account creation.' : 'Includes 40 free credits · No card required'}
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5" style={{ fontFamily: 'var(--font-inter)' }}>
          Already have an account?{' '}
          <Link href={planId ? `/login?next=/checkout?plan=${planId}%26billing=monthly` : '/login'} className="text-zinc-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
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
