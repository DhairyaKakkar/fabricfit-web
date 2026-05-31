'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { login, loginWithAccessCode } from '@/app/actions/auth';

type Mode = 'email' | 'code';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('email');
  const [emailState, emailAction, emailPending] = useActionState(login, undefined);
  const [codeState, codeAction, codePending] = useActionState(loginWithAccessCode, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="TrialRoomStudio" width={80} height={80} className="h-20 w-auto block" />
          </div>
          <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'email'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'code'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Access Code
            </button>
          </div>

          {mode === 'email' ? (
            <form action={emailAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-zinc-500 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Email
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
              </div>

              {emailState?.error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  {emailState.error}
                </p>
              )}

              <button
                type="submit"
                disabled={emailPending}
                className="w-full bg-[#09090b] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {emailPending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form action={codeAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="access_code"
                  className="text-xs font-medium text-zinc-500 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Access Code
                </label>
                <input
                  id="access_code"
                  name="access_code"
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="e.g. ABC-1234"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition tracking-widest font-mono uppercase"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
                <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                  Find your access code in the TrialRoomStudio app under Settings.
                </p>
              </div>

              {codeState?.error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  {codeState.error}
                </p>
              )}

              <button
                type="submit"
                disabled={codePending}
                className="w-full bg-[#09090b] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {codePending ? 'Verifying…' : 'Sign in with Access Code'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            href="/signup"
            className="w-full max-w-sm block text-center bg-white border border-zinc-200 text-zinc-800 rounded-xl py-2.5 text-sm font-semibold hover:bg-zinc-50 transition-colors shadow-sm"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
