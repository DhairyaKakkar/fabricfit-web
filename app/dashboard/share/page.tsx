'use client';

import { useState } from 'react';

export default function SharePage() {
  const phoneAppUrl = process.env.NEXT_PUBLIC_PHONE_APP_URL ?? '#';
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(phoneAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2
        className="text-2xl font-bold text-zinc-900 mb-1"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Share Try-On Link
      </h2>
      <p className="text-sm text-zinc-400 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
        Send this link to your shoppers so they can try on your catalog virtually
      </p>

      <div className="bg-white rounded-2xl border border-zinc-200 p-8 max-w-lg">
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 mb-4">
          <span
            className="flex-1 text-sm text-zinc-600 truncate"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {phoneAppUrl === '#' ? 'App URL not configured yet' : phoneAppUrl}
          </span>
          <button
            onClick={copy}
            disabled={phoneAppUrl === '#'}
            className="shrink-0 text-xs font-semibold text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 disabled:opacity-40 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
          Share via WhatsApp, email, or QR code. Shoppers open the link on their phone — no app download needed.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent('Try on our latest collection virtually: ' + phoneAppUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Share on WhatsApp
          </a>
          <a
            href={`mailto:?subject=Try our clothes virtually&body=Try on our latest collection: ${phoneAppUrl}`}
            className="flex-1 text-center bg-zinc-900 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Share via Email
          </a>
        </div>
      </div>
    </div>
  );
}
