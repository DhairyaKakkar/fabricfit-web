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
          {planLabel && (
            <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              Create your account to get started with the <span className="text-zinc-700 font-medium">{planLabel}</span> plan
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

            {/* T&C + Privacy Policy consent */}
            <label className="flex items-start gap-2.5 cursor-pointer" style={{ fontFamily: 'var(--font-inter)' }}>
              <input
                type="checkbox"
                name="agreed_tnc"
                required
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 shrink-0"
              />
              <span className="text-xs text-zinc-500 leading-relaxed">
                I have read and agree to the{' '}
                <Link href="/terms" target="_blank" className="text-zinc-700 font-medium underline underline-offset-2 hover:text-zinc-900">
                  Terms &amp; Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" target="_blank" className="text-zinc-700 font-medium underline underline-offset-2 hover:text-zinc-900">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit" disabled={pending}
              className="w-full bg-[#09090b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {pending
                ? 'Creating account…'
                : planLabel
                  ? `Create account & continue to payment`
                  : 'Create Account'}
            </button>
          </form>

          {planLabel && (
            <p className="text-center text-xs text-zinc-400 mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
              You&apos;ll be taken to payment after account creation.
            </p>
          )}
        </div>

        {/* Prominent Sign In section */}
        <div className="w-full mt-4 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 text-center">
          <p className="text-sm font-semibold text-zinc-800 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Already have an account?
          </p>
          <p className="text-xs text-zinc-400 mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
            Sign in to manage your account or top up credits
          </p>
          <Link
            href={planId ? `/login?next=/checkout?plan=${planId}%26billing=monthly` : '/login'}
            className="block w-full bg-white border-2 border-zinc-900 text-zinc-900 rounded-xl py-3 text-sm font-bold hover:bg-zinc-900 hover:text-white transition-colors duration-150"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Sign In →
          </Link>
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
