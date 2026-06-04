'use client';

'use client';

import { motion } from 'framer-motion';
import { PRICING, type Currency, fmtPrice } from '@/lib/pricing';
import type { BillingCycle } from './PricingPageClient';

interface Feature {
  label: string;
  value: string;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  tryOns: string;
  rateKey: 'paygStarter' | 'pro' | 'business';
  features: Feature[];
  popular?: boolean;
  payg?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'payg',
    name: 'Pay As You Go',
    tagline: 'No commitment. Buy credits when you need them — they never expire.',
    tryOns: 'Pack-based',
    rateKey: 'paygStarter',
    features: [
      { label: 'Branches', value: '1' },
      { label: 'Catalogue exports', value: 'None' },
      { label: 'Storage', value: 'Session only' },
      { label: 'Try-on history', value: '15 days' },
      { label: 'Watermark', value: 'Always on' },
      { label: 'Support', value: 'None' },
    ],
    payg: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small showrooms getting started with virtual try-on.',
    tryOns: '100 try-ons / month',
    rateKey: 'paygStarter',
    features: [
      { label: 'Branches', value: '1' },
      { label: 'Catalogue exports', value: '10 / month' },
      { label: 'Storage', value: '200 items' },
      { label: 'Try-on history', value: '30 days' },
      { label: 'Watermark', value: 'Removable' },
      { label: 'Support', value: 'Email' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing showrooms managing multiple branches.',
    tryOns: '200 try-ons / month',
    rateKey: 'pro',
    features: [
      { label: 'Branches', value: 'Up to 3' },
      { label: 'Catalogue exports', value: '50 / month' },
      { label: 'Storage', value: '500 items' },
      { label: 'Try-on history', value: '90 days' },
      { label: 'Watermark', value: 'Removed' },
      { label: 'Support', value: 'Priority email' },
    ],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For enterprise retailers with unlimited scale and analytics.',
    tryOns: '500 try-ons / month',
    rateKey: 'business',
    features: [
      { label: 'Branches', value: 'Unlimited' },
      { label: 'Catalogue exports', value: '100 / month' },
      { label: 'Storage', value: 'Unlimited' },
      { label: 'Try-on history', value: '1 year' },
      { label: 'Watermark', value: 'Removed' },
      { label: 'Support', value: 'Dedicated manager' },
    ],
  },
];

interface CardProps {
  plan: Plan;
  billing: BillingCycle;
  currency: Currency;
  index: number;
}

function PlanCard({ plan, billing, currency, index }: CardProps) {
  const c = PRICING[currency];
  const annual = billing === 'annual' && !plan.payg;
  const planPricing = !plan.payg ? c.plans[plan.id as keyof typeof c.plans] : null;
  const dark = plan.popular;

  return (
    <motion.div
      className="relative flex flex-col rounded-2xl p-6"
      style={{
        background: dark ? '#09090b' : '#ffffff',
        border: dark ? '1px solid #27272a' : '1px solid #e4e4e7',
        boxShadow: dark
          ? '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)'
          : '0 1px 4px rgba(0,0,0,0.04)',
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ scale: dark ? 1.02 : 1.015, transition: { duration: 0.2 } }}
    >
      {dark && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="bg-white text-zinc-900 text-[11px] font-semibold px-4 py-1 rounded-full shadow-sm tracking-wide whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{
          fontFamily: 'var(--font-inter)',
          letterSpacing: '0.1em',
          color: dark ? '#71717a' : '#a1a1aa',
        }}
      >
        {plan.name}
      </p>

      {/* Price */}
      <div className="mb-4">
        {plan.payg ? (
          <>
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: dark ? '#71717a' : '#a1a1aa',
                }}
              >
                from
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: dark ? '#ffffff' : '#09090b',
                  marginLeft: 2,
                }}
              >
                {fmtPrice(c.packs.small, currency)}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: dark ? '#52525b' : '#a1a1aa',
                marginTop: 4,
              }}
            >
              per credit pack · credits never expire
            </p>
          </>
        ) : (
          <>
            {annual && (
              <p
                className="line-through mb-0.5"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: dark ? '#52525b' : '#a1a1aa',
                }}
              >
                {fmtPrice(planPricing!.monthly, currency)}
              </p>
            )}
            <div className="flex items-baseline gap-0.5">
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: dark ? '#ffffff' : '#09090b',
                }}
              >
                {annual
                  ? fmtPrice(planPricing!.effectiveMonthly, currency)
                  : fmtPrice(planPricing!.monthly, currency)}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: dark ? '#52525b' : '#a1a1aa',
                marginTop: 4,
              }}
            >
              {annual
                ? `/month · billed ${fmtPrice(planPricing!.annual, currency)} / year`
                : '/month · billed monthly'}
            </p>
          </>
        )}
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: dark ? '#71717a' : '#71717a',
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {plan.tagline}
      </p>

      {/* Try-ons chip */}
      <div
        className="rounded-lg px-3 py-2.5 mb-5"
        style={{
          background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e4e4e7'}`,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            fontWeight: 600,
            color: dark ? '#e4e4e7' : '#18181b',
          }}
        >
          {plan.tryOns}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: dark ? '#52525b' : '#71717a',
            marginTop: 2,
          }}
        >
          {c.rates[plan.rateKey]} / try-on
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: dark ? 'rgba(255,255,255,0.07)' : '#f4f4f5',
          marginBottom: 16,
        }}
      />

      {/* Feature list */}
      <ul className="flex-1 flex flex-col gap-2.5 mb-6">
        {plan.features.map((f) => (
          <li
            key={f.label}
            className="flex items-start gap-2 text-xs"
            style={{ fontFamily: 'var(--font-inter)', color: dark ? '#a1a1aa' : '#52525b' }}
          >
            <span
              style={{
                color: dark ? '#ffffff' : '#09090b',
                fontWeight: 700,
                marginTop: 1,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span>
              <span style={{ color: dark ? '#52525b' : '#a1a1aa' }}>{f.label}: </span>
              <span style={{ color: dark ? '#a1a1aa' : '#52525b' }}>{f.value}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={
          plan.payg
            ? `/checkout?plan=payg&billing=monthly`
            : `/checkout?plan=${plan.id}&billing=${billing}`
        }
        className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          fontFamily: 'var(--font-inter)',
          background: dark ? '#ffffff' : 'transparent',
          color: dark ? '#09090b' : '#09090b',
          border: dark ? 'none' : '1px solid #d4d4d8',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          if (!dark) (e.currentTarget as HTMLAnchorElement).style.background = '#f4f4f5';
        }}
        onMouseLeave={(e) => {
          if (!dark) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
        }}
      >
        Get Started
      </a>
    </motion.div>
  );
}

export default function PlanCards({ billing, currency }: { billing: BillingCycle; currency: Currency }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} currency={currency} index={i} />
        ))}
      </div>

      <p
        className="text-center text-xs text-zinc-400 mt-6"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Secure payment via Stripe or Razorpay · Cancel anytime
      </p>
    </section>
  );
}
