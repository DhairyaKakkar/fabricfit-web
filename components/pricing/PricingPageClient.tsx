'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import NumberFlow from '@number-flow/react';

export type BillingCycle = 'monthly' | 'annual';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'payg',
    name: 'Pay As You Go',
    description: 'No commitment. Buy credits when you need them — they never expire.',
    monthly: null as number | null,
    yearly: null as number | null,
    packFrom: 8,
    credits: 'Pack-based credits',
    tryOns: 'Pack-based',
    rate: 'S$0.40 / try-on',
    popular: false,
    features: [
      'Branches: 1',
      'Session-only storage',
      'Try-on history: 15 days',
      'Watermark: always on',
      'No catalogue exports',
      'No support',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small showrooms getting started with virtual try-on.',
    monthly: 40,
    yearly: 34,
    packFrom: null,
    credits: '200 credits / month',
    tryOns: '60–80 try-ons',
    rate: 'S$0.40 / try-on',
    popular: false,
    features: [
      'Branches: 1',
      '200 items storage',
      'Try-on history: 30 days',
      'Watermark removable',
      '10 catalogue exports / mo',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing showrooms managing multiple branches.',
    monthly: 72,
    yearly: 60,
    packFrom: null,
    credits: '400 credits / month',
    tryOns: '120–160 try-ons',
    rate: 'S$0.36 / try-on',
    popular: true,
    features: [
      'Branches: up to 3',
      '500 items storage',
      'Try-on history: 90 days',
      'Watermark removed',
      '50 catalogue exports / mo',
      'Priority email support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For enterprise retailers with unlimited scale and analytics.',
    monthly: 160,
    yearly: 134,
    packFrom: null,
    credits: '1,000 credits / month',
    tryOns: '300–400 try-ons',
    rate: 'S$0.32 / try-on',
    popular: false,
    features: [
      'Branches: unlimited',
      'Unlimited storage',
      'Try-on history: 1 year',
      'Watermark removed',
      '100 catalogue exports / mo',
      'Dedicated manager',
    ],
  },
];

/* ─── Sparkles ───────────────────────────────────────────────────────────── */
function Sparkles() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        size: 1 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#f59e0b',
          }}
          initial={{ bottom: '-5%', opacity: 0 }}
          animate={{ bottom: '105%', opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ─── VerticalCutReveal ──────────────────────────────────────────────────── */
function VerticalCutReveal({ children }: { children: string }) {
  const words = children.split(' ');
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-2">
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 40, delay: i * 0.12 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-center">
      <div className="relative flex w-fit rounded-full border border-amber-800/40 bg-neutral-900 p-1">
        {['Monthly', 'Yearly'].map((label, i) => {
          const active = yearly ? i === 1 : i === 0;
          return (
            <button
              key={label}
              onClick={() => onChange(i === 1)}
              className="relative z-10 h-10 rounded-full px-6 text-sm font-medium transition-colors"
              style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)' }}
            >
              {active && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(to top, #92400e, #d97706)', boxShadow: '0 0 20px rgba(217,119,6,0.4)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {label}
                {label === 'Yearly' && (
                  <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
                    -15%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Plan card ──────────────────────────────────────────────────────────── */
function PlanCard({ plan, yearly, index }: { plan: typeof PLANS[0]; yearly: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const price = yearly ? plan.yearly : plan.monthly;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        background: plan.popular
          ? 'linear-gradient(135deg, #1c1208 0%, #2d1a08 50%, #1c1208 100%)'
          : 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        border: plan.popular ? '1.5px solid rgba(217,119,6,0.5)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: plan.popular ? '0 0 60px rgba(217,119,6,0.15), 0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {plan.popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <span style={{ background: 'linear-gradient(to right, #92400e, #d97706)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em' }}>
            MOST POPULAR
          </span>
        </div>
      )}

      <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', fontWeight: 700, color: plan.popular ? '#fef3c7' : '#e7e5e4', marginBottom: 6 }}>
        {plan.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', lineHeight: 1.6, marginBottom: 20 }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        {plan.packFrom !== null ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', marginRight: 2 }}>from S$</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2.2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                <NumberFlow value={plan.packFrom} />
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 4 }}>per credit pack · never expire</p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', marginRight: 2 }}>S$</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2.2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                <NumberFlow value={price!} />
              </span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', marginLeft: 4 }}>/{yearly ? 'mo' : 'month'}</span>
            </div>
            {yearly && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 4 }}>
                billed S${plan.yearly! * 12} annually
              </p>
            )}
          </>
        )}
      </div>

      {/* Credits chip */}
      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>{plan.credits}</p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#92400e', marginTop: 2 }}>{plan.tryOns} · {plan.rate}</p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }} />

      {/* Features */}
      <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 12, color: '#a8a29e' }}>
            <span style={{ color: '#d97706', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <motion.a
        href="#"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 0',
          borderRadius: 12,
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          background: plan.popular
            ? 'linear-gradient(to top, #92400e, #d97706)'
            : 'transparent',
          color: plan.popular ? '#fff' : '#d97706',
          border: plan.popular ? 'none' : '1px solid rgba(217,119,6,0.4)',
          boxShadow: plan.popular ? '0 4px 20px rgba(217,119,6,0.3)' : 'none',
          cursor: 'none',
        }}
      >
        Get Started →
      </motion.a>
    </motion.div>
  );
}

/* ─── Credit Packs ───────────────────────────────────────────────────────── */
const PACKS = [
  { name: 'Small', credits: 40, price: 8, tryOns: '~20 fast try-ons' },
  { name: 'Standard', credits: 100, price: 20, tryOns: '~50 fast try-ons' },
  { name: 'Large', credits: 250, price: 50, tryOns: '~125 fast try-ons' },
];

function CreditPacksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ background: '#111', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>No Subscription Needed</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Credit Packs</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto 12px', borderRadius: 2 }} />
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', maxWidth: 480, margin: '0 auto' }}>
            Buy credits à la carte. They never expire. Subscribers can also top up at the same rate when they run low.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 680, margin: '0 auto' }}>
          {PACKS.map((pack, i) => (
            <motion.div key={pack.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(245,158,11,0.1)' }}
              style={{ background: '#1a1a1a', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{pack.name}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>S${pack.price}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', marginTop: 4 }}>{pack.credits} credits</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#78716c', marginTop: 2, marginBottom: 16 }}>{pack.tryOns}</p>
              <motion.a href="#" whileHover={{ scale: 1.03 }} style={{ display: 'block', padding: '10px 0', borderRadius: 10, border: '1px solid rgba(217,119,6,0.35)', color: '#d97706', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Buy Pack
              </motion.a>
            </motion.div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 24 }}>
          Pack credits never expire · 15-day history · FabricFit watermark · no catalogue exports
        </p>
      </div>
    </div>
  );
}

/* ─── Add-Ons ────────────────────────────────────────────────────────────── */
const ADDONS = [
  { icon: '✦', name: 'Remove Watermark', desc: 'Strip the FabricFit watermark from all future try-on results. Starter plan only.', price: 'S$8 / month', badge: 'Starter only' },
  { icon: '⚡', name: 'Credit Top-Up', desc: 'Buy extra credits at PAYG rate mid-month. Top-up credits never expire.', price: 'From S$8', badge: 'All plans' },
];

function AddOnsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ background: '#0d0d0d', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Extras</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Add-Ons</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {ADDONS.map((addon, i) => (
            <motion.div key={addon.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: 20, flexShrink: 0, marginTop: 2 }}>{addon.icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, color: '#fef9f0', marginBottom: 6 }}>{addon.name}</h3>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', lineHeight: 1.6, marginBottom: 14 }}>{addon.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>{addon.price}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', background: '#222', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '3px 10px' }}>{addon.badge}</span>
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
const TABLE_GROUPS = [
  { heading: 'Credits & Try-Ons', rows: [
    { label: 'Credits', values: ['Packs (no expiry)', '200 / month', '400 / month', '1,000 / month'] },
    { label: 'Fast try-ons (approx)', values: ['Pack-based', '60–80', '120–160', '300–400'] },
    { label: 'Effective rate / try-on', values: ['S$0.40', 'S$0.40', 'S$0.36', 'S$0.32'] },
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
    { label: 'Support tier', values: ['None', 'Email', 'Priority email', 'Dedicated manager'] },
  ]},
];

function ComparisonSection({ yearly }: { yearly: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const prices = yearly
    ? ['From S$8', 'S$34/mo', 'S$60/mo', 'S$134/mo']
    : ['From S$8', 'S$40/mo', 'S$72/mo', 'S$160/mo'];

  return (
    <div ref={ref} style={{ background: '#111', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Compare</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Full Feature Comparison</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto', borderRadius: 2 }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', fontWeight: 500, minWidth: 160 }}>Feature</th>
                {['PAYG', 'Starter', 'Pro', 'Business'].map((n, i) => (
                  <th key={n} style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 700, color: i === 2 ? '#f59e0b' : '#e7e5e4', minWidth: 110 }}>
                    {n}{i === 2 && <span style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: 10, color: '#d97706', fontWeight: 400, fontStyle: 'normal', marginTop: 2 }}>Popular</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_GROUPS.map((group) => (
                <>
                  <tr key={group.heading} style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td colSpan={5} style={{ padding: '8px 20px', fontFamily: 'var(--font-inter)', fontSize: 10, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{group.heading}</td>
                  </tr>
                  {group.rows.map((row, ri) => (
                    <tr key={row.label} style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: ri % 2 === 0 ? '#111' : '#0f0f0f' }}>
                      <td style={{ padding: '12px 20px', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c' }}>{row.label}</td>
                      {row.values.map((val, ci) => (
                        <td key={ci} style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 12, color: ci === 2 ? '#f59e0b' : val === '—' || val === 'None' ? '#3a3a3a' : '#a8a29e', fontWeight: ci === 2 ? 600 : 400 }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
              <tr style={{ borderTop: '2px solid rgba(245,158,11,0.2)', background: '#1a1a1a' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#d97706', fontWeight: 600 }}>Price</td>
                {prices.map((p, i) => (
                  <td key={i} style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, color: i === 2 ? '#f59e0b' : '#a8a29e' }}>{p}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
const RULES = [
  { icon: '↻', title: 'Credits reset on billing date', body: 'Not the 1st of the month. Your credits reset on the same day you subscribed — every month.' },
  { icon: '✕', title: "Unused credits don't roll over", body: 'Subscription credits expire at reset. Top-up pack credits never expire, even for subscribers.' },
  { icon: '★', title: '14-day free trial', body: '40 credits, ~20 fast try-ons, no card required. Converts to PAYG or a paid plan at the end.' },
];

function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ background: '#0a0a0a', padding: '80px 24px 60px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#fef9f0', marginBottom: 8 }}>Good to know</h2>
        <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto 40px', borderRadius: 2 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          {RULES.map((rule, i) => (
            <motion.div key={rule.title}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '24px 20px' }}
            >
              <span style={{ fontSize: 22, color: '#f59e0b', display: 'block', marginBottom: 10 }}>{rule.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: '#fef9f0', marginBottom: 8 }}>{rule.title}</h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', lineHeight: 1.6 }}>{rule.body}</p>
            </motion.div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#3a3a3a' }}>
          Questions?{' '}
          <a href="#" style={{ color: '#d97706', textDecoration: 'underline' }}>Chat with us on WhatsApp</a>
          {' '}· Payments via Razorpay — UPI, cards, net banking, EMI supported
        </p>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function PricingPageClient() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* Top sparkle area */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45vh', maskImage: 'radial-gradient(50% 50% at 50% 0%, white, transparent)' }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 70px',
        }} />
        <Sparkles />
      </div>

      {/* Amber glow ring */}
      <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vh', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '160px solid rgba(146,64,14,0.08)', filter: 'blur(60px)' }} />
      </div>

      {/* Hero text */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: 120, paddingBottom: 48, maxWidth: 680, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}
        >
          Pricing
        </motion.span>

        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#fef9f0', lineHeight: 1.15, marginBottom: 16 }}>
          <VerticalCutReveal>Plans that work for your showroom</VerticalCutReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: '#78716c', lineHeight: 1.7, marginBottom: 32 }}
        >
          Trusted by fabric showrooms across India &amp; Singapore. All plans include a 14-day free trial — no card required.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}>
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </motion.div>
      </div>

      {/* Cards */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} yearly={yearly} index={i} />
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 60, position: 'relative', zIndex: 10 }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e' }}>
          All prices in SGD · 40 free credits on signup · no card required
        </p>
      </div>

      <CreditPacksSection />
      <AddOnsSection />
      <ComparisonSection yearly={yearly} />
      <FooterSection />
    </div>
  );
}
