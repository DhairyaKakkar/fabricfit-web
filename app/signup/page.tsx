'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signup } from '@/app/actions/auth';

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="TrialRoomStudio" width={80} height={80} className="h-20 w-auto block" />
          </div>
          <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Start your 14-day free trial — no card required
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="company_name"
                className="text-xs font-medium text-zinc-500 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Company name
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                required
                placeholder="Jain Exports"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-zinc-500 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-zinc-500 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
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
              type="submit"
              disabled={pending}
              className="w-full bg-[#09090b] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {pending ? 'Creating account…' : 'Start free trial'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-zinc-100">
            <a
              href={`mailto:hqnudge@gmail.com?subject=Free%20Credits%20Request%20-%20TrialRoomStudio&body=Hi%20TrialRoomStudio%20Team%2C%0A%0AI%20would%20like%20to%20request%20free%20credits%20for%20my%20account.%20Here%20are%20my%20details%3A%0A%0AName%3A%20%0AEmail%3A%20%0APhone%20Number%3A%20%0ACompany%20Name%3A%20%0A%0AThank%20you!`}
              className="w-full block text-center bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Click here to get free credits
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5" style={{ fontFamily: 'var(--font-inter)' }}>
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
