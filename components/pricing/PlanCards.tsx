'use client';

import { motion } from 'framer-motion';
import { PRICING, type Currency, fmtPrice } from '@/lib/pricing';
import type { BillingCycle } from './PricingPageClient';

const PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    tagline: 'Perfect for small showrooms just getting started.',
    creditsPerMonth: 200,
    storage: '200 fabric items',
    popular: false,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    tagline: 'For growing showrooms that need more try-ons.',
    creditsPerMonth: 400,
    storage: '500 fabric items',
    popular: true,
  },
  {
    id: 'business' as const,
    name: 'Business',
    tagline: 'For high-volume retailers at scale.',
    creditsPerMonth: 1000,
    storage: 'Unlimited',
    popular: false,
  },
];

function PlanCard({ plan, billing, currency, index }: {
  plan: typeof PLANS[number];
  billing: BillingCycle;
  currency: Currency;
  index: number;
}) {
  const pricing = PRICING[currency].plans[plan.id];
  const price = billing === 'annual' ? pricing.effectiveMonthly : pricing.monthly;

  return (
    <motion.div
      className={`relative flex flex-col rounded-2xl p-6 ${
        plan.popular
          ? 'bg-white border-2 border-amber-500 shadow-xl shadow-amber-100/60'
          : 'bg-white border border-zinc-200 shadow-sm'
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-amber-800 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)' }}>
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-amber-900 mb-1 mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
        {plan.name}
      </h3>
      <p className="text-xs text-zinc-400 mb-5 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
        {plan.tagline}
      </p>

      <div className="mb-5">
        {billing === 'annual' && (
          <p className="text-sm text-zinc-400 line-through mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
            {fmtPrice(pricing.monthly, currency)}/mo
          </p>
        )}
        <p className="text-3xl font-extrabold text-amber-900 tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
          {fmtPrice(price, currency)}
        </p>
        <p className="text-xs text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
          {billing === 'annual'
            ? `/month · billed ${fmtPrice(pricing.annual, currency)}/year`
            : '/month · billed monthly'}
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
        <p className="text-sm font-semibold text-amber-800" style={{ fontFamily: 'var(--font-inter)' }}>
          {plan.creditsPerMonth} credits / month
        </p>
        <p className="text-xs text-amber-600/60 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
          Each try-on uses 2–3 credits
        </p>
      </div>

      <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 mb-6">
        <p className="text-sm font-semibold text-zinc-700" style={{ fontFamily: 'var(--font-inter)' }}>
          {plan.storage}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
          Fabric catalogue storage
        </p>
      </div>

      <div className="flex-1" />

      <a
        href={`/signup?plan=${plan.id}`}
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
          plan.popular
            ? 'bg-amber-800 text-white hover:bg-amber-900'
            : 'border border-amber-700 text-amber-800 hover:bg-amber-50'
        }`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Get Started
      </a>
    </motion.div>
  );
}

export default function PlanCards({ billing, currency }: { billing: BillingCycle; currency: Currency }) {
  return (
    <section className="max-w-5xl mx-auto px-4 pb-8">
      {/* Free trial banner */}
      <motion.div
        className="mb-8 rounded-2xl bg-zinc-950 text-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="font-bold text-base" style={{ fontFamily: 'var(--font-playfair)' }}>
            Start free — no card required
          </p>
          <p className="text-sm text-zinc-400 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
            14-day trial · 40 credits included · upgrade anytime
          </p>
        </div>
        <a
          href="/signup"
          className="shrink-0 bg-white text-zinc-950 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors whitespace-nowrap"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Get Free Trial
        </a>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} currency={currency} index={i} />
        ))}
      </div>
    </section>
  );
}
