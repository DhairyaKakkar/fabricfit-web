'use client';

import React, { useRef, useState, useEffect, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { PRICING, Currency, countryToCurrency, fmtPrice } from '@/lib/pricing';

export type BillingCycle = 'monthly' | 'annual';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const PLAN_META = [
  {
    id: 'payg' as const,
    name: 'Pay As You Go',
    description: 'No commitment. Buy credits when you need them.',
    credits: 'Pack-based credits',
    tryOns: 'Pack-based',
    popular: false,
    features: [
      '1 branch',
      'Session-only storage',
      '15-day try-on history',
      'TrialRoomStudio watermark',
      'No catalogue exports',
      'No support',
    ],
  },
  {
    id: 'starter' as const,
    name: 'Starter',
    description: 'For small showrooms getting started with virtual try-on.',
    credits: '100 try-ons / month',
    tryOns: '',
    popular: false,
    features: [
      '1 branch',
      '200 items storage',
      '30-day try-on history',
      'Watermark removable',
      '10 catalogue exports / mo',
      'Email support',
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    description: 'For growing showrooms managing multiple branches.',
    credits: '200 try-ons / month',
    tryOns: '',
    popular: true,
    features: [
      'Up to 3 branches',
      '500 items storage',
      '90-day try-on history',
      'No watermark',
      '50 catalogue exports / mo',
      'Priority email support',
    ],
  },
  {
    id: 'business' as const,
    name: 'Business',
    description: 'For enterprise retailers needing unlimited scale.',
    credits: '500 try-ons / month',
    tryOns: '',
    popular: false,
    features: [
      'Unlimited branches',
      'Unlimited storage',
      '1-year try-on history',
      'No watermark',
      '100 catalogue exports / mo',
      'Dedicated account manager',
    ],
  },
];

type PlanId = typeof PLAN_META[number]['id'];

/* ─── Country Selector ───────────────────────────────────────────────────── */
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
        <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 rounded px-1.5 py-0.5">2 months free</span>
      </button>
    </div>
  );
}

/* ─── Plan Card ──────────────────────────────────────────────────────────── */
function PlanCard({ plan, yearly, currency, index }: { plan: typeof PLAN_META[0]; yearly: boolean; currency: Currency; index: number }) {
  const c = PRICING[currency];
  const isPayg = plan.id === 'payg';
  const planPricing = !isPayg ? c.plans[plan.id as Exclude<PlanId, 'payg'>] : null;
  const price = planPricing ? (yearly ? planPricing.effectiveMonthly : planPricing.monthly) : null;
  const packFrom = isPayg ? c.packs.small : null;
  const rate = plan.id === 'pro' ? c.rates.pro : plan.id === 'business' ? c.rates.business : c.rates.paygStarter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex flex-col rounded-2xl p-6"
      style={{
        background: plan.popular ? '#09090b' : '#ffffff',
        border: plan.popular ? '1px solid #27272a' : '1px solid #e4e4e7',
        boxShadow: plan.popular ? '0 8px 32px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-white text-zinc-900 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm" style={{ fontFamily: 'var(--font-inter)' }}>
            Most Popular
          </span>
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: plan.popular ? '#71717a' : '#a1a1aa', fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}>
        {plan.name}
      </p>

      {/* Price */}
      <div className="mb-4">
        {isPayg ? (
          <>
            <div className="flex items-baseline gap-0.5">
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: plan.popular ? '#71717a' : '#a1a1aa' }}>from {c.symbol}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2rem', fontWeight: 700, color: plan.popular ? '#ffffff' : '#09090b', lineHeight: 1, marginLeft: 2 }}>
                <NumberFlow key={currency} value={packFrom!} />
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: plan.popular ? '#52525b' : '#a1a1aa', marginTop: 4 }}>per credit pack · credits never expire</p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-0.5">
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: plan.popular ? '#71717a' : '#a1a1aa' }}>{c.symbol}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2rem', fontWeight: 700, color: plan.popular ? '#ffffff' : '#09090b', lineHeight: 1, marginLeft: 2 }}>
                <NumberFlow key={currency} value={price!} />
              </span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: plan.popular ? '#52525b' : '#a1a1aa', marginLeft: 4 }}>/ mo</span>
            </div>
            {yearly && planPricing && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: plan.popular ? '#52525b' : '#a1a1aa', marginTop: 4 }}>
                billed {fmtPrice(planPricing.annual, currency)} / year
              </p>
            )}
          </>
        )}
      </div>

      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: plan.popular ? '#71717a' : '#71717a', lineHeight: 1.6, marginBottom: 20 }}>
        {plan.description}
      </p>

      {/* Credits chip */}
      <div className="rounded-lg px-3 py-2 mb-5" style={{
        background: plan.popular ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
        border: `1px solid ${plan.popular ? 'rgba(255,255,255,0.08)' : '#e4e4e7'}`,
      }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: plan.popular ? '#e4e4e7' : '#18181b' }}>{plan.credits}</p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#71717a', marginTop: 2 }}>{rate} / try-on</p>
      </div>

      <div style={{ height: 1, background: plan.popular ? 'rgba(255,255,255,0.07)' : '#f4f4f5', marginBottom: 16 }} />

      <ul className="flex-1 flex flex-col gap-2.5 mb-6">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ fontFamily: 'var(--font-inter)', color: plan.popular ? '#a1a1aa' : '#52525b' }}>
            <span style={{ color: plan.popular ? '#ffffff' : '#09090b', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={`/checkout?plan=${plan.id}&billing=${yearly ? 'annual' : 'monthly'}`}
        className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          fontFamily: 'var(--font-inter)',
          cursor: 'pointer',
          background: plan.popular ? '#ffffff' : 'transparent',
          color: plan.popular ? '#09090b' : '#09090b',
          border: plan.popular ? 'none' : '1px solid #d4d4d8',
        }}
        onMouseEnter={e => { if (!plan.popular) (e.currentTarget as HTMLAnchorElement).style.background = '#f4f4f5'; }}
        onMouseLeave={e => { if (!plan.popular) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
      >
        Get started
      </a>
    </motion.div>
  );
}

/* ─── Credit Packs ───────────────────────────────────────────────────────── */
function CreditPacksSection({ currency }: { currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];
  const packs = [
    { name: 'Small', credits: 40, price: c.packs.small, tryOns: '~20 try-ons' },
    { name: 'Standard', credits: 100, price: c.packs.standard, tryOns: '~50 try-ons' },
    { name: 'Large', credits: 250, price: c.packs.large, tryOns: '~125 try-ons' },
  ];

  return (
    <div ref={ref} className="py-20 px-6 border-t border-zinc-100">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>No subscription needed</p>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Credit Packs</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto" style={{ fontFamily: 'var(--font-inter)' }}>
            Buy credits à la carte — they never expire. Subscribers can top up at the same rate.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col items-center text-center"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em' }}>{pack.name}</p>
              <p className="text-3xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{fmtPrice(pack.price, currency)}</p>
              <p className="text-xs text-zinc-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{pack.credits} credits</p>
              <p className="text-xs text-zinc-400 mb-5" style={{ fontFamily: 'var(--font-inter)' }}>{pack.tryOns}</p>
              <a href={`/checkout?plan=payg&pack=${pack.name.toLowerCase()}&billing=monthly`} className="w-full block text-center py-2 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors" style={{ fontFamily: 'var(--font-inter)', cursor: 'pointer' }}>
                Buy pack
              </a>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-400 mt-6" style={{ fontFamily: 'var(--font-inter)' }}>
          15-day history · TrialRoomStudio watermark · no catalogue exports · 1 branch
        </p>
      </div>
    </div>
  );
}

/* ─── Add-Ons ────────────────────────────────────────────────────────────── */
function AddOnsSection({ currency }: { currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];
  const addons = [
    { icon: '✦', name: 'Remove Watermark', desc: 'Strip the TrialRoomStudio watermark from all future try-on results. Starter plan only.', price: c.addons.watermark, badge: 'Starter only' },
    { icon: '⚡', name: 'Credit Top-Up', desc: 'Buy extra credits at the PAYG rate mid-month. Top-up credits never expire.', price: c.addons.topupFrom, badge: 'All plans' },
  ];

  return (
    <div ref={ref} className="py-20 px-6 bg-zinc-50 border-t border-zinc-100">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>Extras</p>
          <h2 className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>Add-Ons</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addons.map((addon, i) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-zinc-200 p-6"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div className="flex gap-3">
                <span className="text-zinc-400 text-lg shrink-0 mt-0.5">{addon.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>{addon.name}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-inter)' }}>{addon.desc}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-900" style={{ fontFamily: 'var(--font-inter)' }}>{addon.price}</span>
                    <span className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-0.5" style={{ fontFamily: 'var(--font-inter)' }}>{addon.badge}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison Table ───────────────────────────────────────────────────── */
function ComparisonSection({ yearly, currency }: { yearly: boolean; currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];

  const tableGroups = [
    { heading: 'Credits & Try-Ons', rows: [
      { label: 'Credits', values: ['Packs (no expiry)', '200 / month', '400 / month', '1,000 / month'] },
      { label: 'Fast try-ons (approx)', values: ['Pack-based', '60–80', '120–160', '300–400'] },
      { label: 'Rate / try-on', values: [c.rates.paygStarter, c.rates.paygStarter, c.rates.pro, c.rates.business] },
    ]},
    { heading: 'Branches & Access', rows: [
      { label: 'Branches', values: ['1', '1', 'Up to 3', 'Unlimited'] },
      { label: 'Branch credit allocation', values: ['—', '—', '✓', '✓'] },
    ]},
    { heading: 'Exports & Storage', rows: [
      { label: 'Catalogue exports / month', values: ['None', '10', '50', '100'] },
      { label: 'Storage', values: ['Session only', '200 items', '500 items', 'Unlimited'] },
      { label: 'Try-on history', values: ['15 days', '30 days', '90 days', '1 year'] },
    ]},
    { heading: 'Appearance', rows: [
      { label: 'Watermark', values: ['Always on', 'Removable', 'Removed', 'Removed'] },
    ]},
    { heading: 'Support', rows: [
      { label: 'Support tier', values: ['None', 'Email', 'Priority email', 'Dedicated'] },
    ]},
  ];

  const fmt = (n: number) => fmtPrice(n, currency);
  const prices = yearly
    ? [c.addons.topupFrom, `${fmt(c.plans.starter.effectiveMonthly)}/mo`, `${fmt(c.plans.pro.effectiveMonthly)}/mo`, `${fmt(c.plans.business.effectiveMonthly)}/mo`]
    : [c.addons.topupFrom, `${fmt(c.plans.starter.monthly)}/mo`, `${fmt(c.plans.pro.monthly)}/mo`, `${fmt(c.plans.business.monthly)}/mo`];

  return (
    <div ref={ref} className="py-20 px-6 border-t border-zinc-100">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>Compare</p>
          <h2 className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>Full Feature Comparison</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-2xl border border-zinc-200"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr className="border-b border-zinc-100" style={{ background: '#fafafa' }}>
                <th className="text-left px-5 py-4 text-xs font-medium text-zinc-400 w-44" style={{ fontFamily: 'var(--font-inter)' }}>Feature</th>
                {['PAYG', 'Starter', 'Pro', 'Business'].map((n, i) => (
                  <th key={n} className="px-4 py-4 text-center min-w-[110px]" style={{ background: i === 2 ? '#09090b' : 'transparent' }}>
                    <span className="block text-sm font-bold" style={{ fontFamily: 'var(--font-playfair)', color: i === 2 ? '#ffffff' : '#18181b' }}>{n}</span>
                    {i === 2 && <span className="block text-[10px] text-zinc-400 font-normal mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Most Popular</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {tableGroups.map((group) => (
                <Fragment key={group.heading}>
                  <tr className="border-t border-zinc-100" style={{ background: '#fafafa' }}>
                    <td colSpan={5} className="px-5 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}>{group.heading}</td>
                  </tr>
                  {group.rows.map((row, ri) => (
                    <tr key={row.label} className="border-t border-zinc-100" style={{ background: ri % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td className="px-5 py-3 text-xs text-zinc-500" style={{ fontFamily: 'var(--font-inter)' }}>{row.label}</td>
                      {row.values.map((val, ci) => (
                        <td key={ci} className="px-4 py-3 text-center text-xs" style={{
                          fontFamily: 'var(--font-inter)',
                          color: ci === 2 ? '#ffffff' : val === '—' || val === 'None' ? '#d4d4d8' : '#3f3f46',
                          fontWeight: ci === 2 ? 600 : 400,
                          background: ci === 2 ? '#09090b' : 'transparent',
                        }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr className="border-t-2 border-zinc-200">
                <td className="px-5 py-4 text-xs font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-inter)', background: '#fafafa' }}>Price</td>
                {prices.map((p, i) => (
                  <td key={i} className="px-4 py-4 text-center text-sm font-bold" style={{
                    fontFamily: 'var(--font-inter)',
                    color: i === 2 ? '#ffffff' : '#09090b',
                    background: i === 2 ? '#09090b' : '#fafafa',
                  }}>{p}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Good to Know ───────────────────────────────────────────────────────── */
const RULES = [
  { icon: '↻', title: 'Credits reset on billing date', body: 'Your credits reset on the same day you subscribed — not the 1st of the month.' },
  { icon: '✕', title: "Unused credits don't roll over", body: 'Subscription credits expire at reset. Top-up pack credits never expire.' },
  { icon: '★', title: '14-day free trial', body: '40 credits, ~20 fast try-ons, no card required. Converts to PAYG or a paid plan at the end.' },
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
            <motion.div key={rule.title}
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
          All plans include a 14-day free trial — 40 credits, no card required.
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
      <div className="px-6 pb-20">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {PLAN_META.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} currency={currency} index={i} />
          ))}
        </div>
      </div>

      <CreditPacksSection currency={currency} />
      <AddOnsSection currency={currency} />
      <ComparisonSection yearly={yearly} currency={currency} />

      {/* Custom / Enterprise CTA */}
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
