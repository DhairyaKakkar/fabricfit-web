'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { openTrialModal } from '@/lib/openTrialModal';
import { PRICING, Currency, countryToCurrency, fmtPrice } from '@/lib/pricing';
import ExternalPlanCards from './PlanCards';

export type BillingCycle = 'monthly' | 'annual';

/* ─── Currency Selector ──────────────────────────────────────────────────── */
const CURRENCY_ORDER: Currency[] = ['SGD', 'INR', 'AED', 'USD'];

function CountrySelector({ currency, onChange }: { currency: Currency; onChange: (c: Currency) => void }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="appearance-none bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-700 cursor-pointer outline-none hover:border-zinc-300 transition-colors"
        style={{ padding: '6px 28px 6px 12px', fontFamily: 'var(--font-inter)' }}
      >
        {CURRENCY_ORDER.map((c) => (
          <option key={c} value={c}>
            {PRICING[c].flag}  {PRICING[c].label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
    </div>
  );
}

/* ─── Billing Toggle ─────────────────────────────────────────────────────── */
function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-inter)' }}>
      <button
        onClick={() => onChange(false)}
        className={`text-sm transition-colors ${!yearly ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(!yearly)}
        role="switch"
        aria-checked={yearly}
        aria-label="Toggle between monthly and yearly billing"
        className="relative w-10 h-5 rounded-full transition-colors duration-200"
        style={{ background: yearly ? '#09090b' : '#e4e4e7' }}
      >
        <motion.span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: yearly ? '1.375rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </button>
      <button
        onClick={() => onChange(true)}
        className={`text-sm transition-colors flex items-center gap-1.5 ${yearly ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
      >
        Yearly
        {yearly && (
          <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 rounded px-1.5 py-0.5">2 months free</span>
        )}
      </button>
    </div>
  );
}

/* ─── Top-Up Packs ───────────────────────────────────────────────────────── */
function TopupPacksSection({ currency }: { currency: Currency }) {
  const c = PRICING[currency];

  const PACKS = [
    { key: 'fifty' as const, credits: 50, tryOns: '~25 try-ons' },
    { key: 'hundred' as const, credits: 100, tryOns: '~50 try-ons' },
    { key: 'twoHundred' as const, credits: 200, tryOns: '~100 try-ons' },
    { key: 'fiveHundred' as const, credits: 500, tryOns: '~250 try-ons' },
  ];

  return (
    <div className="py-20 px-6 border-t border-zinc-100">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>
            Top-Up Anytime
          </p>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Credit Top-Up Packs
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto" style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
            Running low mid-month? Add credits instantly — they never expire and work alongside any subscription.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="relative flex flex-col rounded-2xl p-5 bg-white border border-zinc-200"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em' }}>
                {pack.credits} Credits
              </p>
              <div className="mb-4">
                <p className="text-2xl font-extrabold text-zinc-900 tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                  {fmtPrice(c.topupPacks[pack.key], currency)}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                  {pack.tryOns} · never expire
                </p>
              </div>
              <div className="rounded-lg px-3 py-2 mb-4 flex-1" style={{ background: '#f4f4f5', border: '1px solid #e4e4e7' }}>
                <p className="text-xs font-semibold text-zinc-700" style={{ fontFamily: 'var(--font-inter)' }}>
                  {c.rates.paygStarter} / try-on
                </p>
                <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                  Works on all plans
                </p>
              </div>
              <button
                onClick={openTrialModal}
                className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-800 hover:bg-zinc-50 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-inter)', cursor: 'pointer' }}
              >
                Request Access
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6" style={{ fontFamily: 'var(--font-inter)' }}>
          Top-up credits stack with subscription credits · Never expire · Instant activation
        </p>
      </div>
    </div>
  );
}

/* ─── Good to Know ───────────────────────────────────────────────────────── */
const RULES = [
  { icon: '↻', title: 'Credits reset on billing date', body: 'Your credits reset on the same day you subscribed — not the 1st of the month.' },
  { icon: '✕', title: "Unused credits don't roll over", body: 'Subscription credits expire at reset. Top-up pack credits never expire.' },
  { icon: '★', title: 'Credits on approval', body: 'We review every account and allocate starter credits personally. Reach out to get started.' },
];

function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="py-20 px-6 bg-zinc-50 border-t border-zinc-100">
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="text-xl font-bold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Good to know</h2>
        <div className="w-8 h-px bg-zinc-200 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {RULES.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-white rounded-xl border border-zinc-200 p-5 text-left"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <span className="text-xl text-zinc-300 block mb-3">{rule.icon}</span>
              <h3 className="text-xs font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>{rule.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{rule.body}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>
          Questions?{' '}
          <a href="https://wa.me/919884744296?text=Hi%2C%20I%20have%20a%20question%20about%20TrialRoomStudio%20pricing" target="_blank" rel="noopener noreferrer" className="underline text-zinc-500 hover:text-zinc-700 transition-colors">Chat with us on WhatsApp</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function PricingPageClient() {
  const [yearly, setYearly] = useState(false);
  const [currency, setCurrency] = useState<Currency>('SGD');

  useEffect(() => {
    const raw = localStorage.getItem('ff_currency');
    if (raw && raw in PRICING) {
      setCurrency(raw as Currency);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { country_code?: string }) => {
        const c = countryToCurrency(data.country_code ?? '');
        setCurrency(c);
        localStorage.setItem('ff_currency', c);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('ff_currency', c);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="pt-28 pb-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4"
          style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}
        >
          Pricing
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="text-sm text-zinc-500 max-w-md mx-auto mb-10"
          style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}
        >
          Pay per month or save with yearly. Switch or cancel anytime.
        </motion.p>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <BillingToggle yearly={yearly} onChange={setYearly} />
          <div className="w-px h-5 bg-zinc-200 hidden sm:block" />
          <CountrySelector currency={currency} onChange={handleCurrencyChange} />
        </motion.div>

        <p className="text-xs text-zinc-400 mt-3" style={{ fontFamily: 'var(--font-inter)' }}>
          All prices in {PRICING[currency].label}
        </p>
      </div>

      {/* Plan Cards */}
      <div className="pb-8">
        <ExternalPlanCards billing={yearly ? 'annual' : 'monthly'} currency={currency} />
      </div>

      {/* Top-Up Packs */}
      <TopupPacksSection currency={currency} />

      {/* Enterprise CTA */}
      <div className="py-16 px-6 border-t border-zinc-100 text-center" style={{ background: '#fafafa' }}>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>Enterprise</p>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Want it curated for your business?
        </h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6" style={{ fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
          Custom credits, white-label branding, dedicated onboarding, and priority support. Talk to us and we&apos;ll build a plan around your showroom.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Contact Us →
        </a>
      </div>

      <FooterSection />
    </div>
  );
}
