'use client';

import { motion } from 'framer-motion';
import type { BillingCycle } from './PricingPageClient';

interface Feature {
  label: string;
  value: string;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number | null;
  annual: number | null;
  effectiveMonthly: number | null;
  packStartsAt: string | null;
  credits: string;
  tryOns: string;
  rate: string;
  features: Feature[];
  popular?: boolean;
  payg?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'payg',
    name: 'Pay As You Go',
    tagline: 'No commitment. Buy credits when you need them — they never expire.',
    monthly: null,
    annual: null,
    effectiveMonthly: null,
    packStartsAt: 'S$8',
    credits: 'Packs · credits never expire',
    tryOns: 'Pack-based',
    rate: 'S$0.40 / try-on',
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
    monthly: 40,
    annual: 400,
    effectiveMonthly: 34,
    packStartsAt: null,
    credits: '',
    tryOns: '100 try-ons / month',
    rate: 'S$0.40 / try-on',
    features: [
      { label: 'Branches', value: '1' },
      { label: 'Catalogue exports', value: '10 / month' },
      { label: 'Storage', value: '200 items' },
      { label: 'Try-on history', value: '30 days' },
      { label: 'Watermark', value: 'Removable (+S$8/mo)' },
      { label: 'Support', value: 'Email' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing showrooms managing multiple branches.',
    monthly: 72,
    annual: 720,
    effectiveMonthly: 60,
    packStartsAt: null,
    credits: '',
    tryOns: '200 try-ons / month',
    rate: 'S$0.36 / try-on',
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
    monthly: 160,
    annual: 1600,
    effectiveMonthly: 134,
    packStartsAt: null,
    credits: '',
    tryOns: '500 try-ons / month',
    rate: 'S$0.32 / try-on',
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

function fmt(n: number) {
  return 'S$' + n.toLocaleString('en-US');
}

interface CardProps {
  plan: Plan;
  billing: BillingCycle;
  index: number;
}

function PlanCard({ plan, billing, index }: CardProps) {
  const annual = billing === 'annual' && plan.annual !== null;

  return (
    <motion.div
      className={`relative flex flex-col rounded-2xl p-6 ${
        plan.popular
          ? 'bg-white border-2 border-amber-500 shadow-xl shadow-amber-100/60 ring-1 ring-amber-400/30'
          : 'bg-white border border-amber-200/70 shadow-sm'
      }`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ scale: plan.popular ? 1.02 : 1.015, transition: { duration: 0.2 } }}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="bg-amber-800 text-white text-xs font-semibold px-4 py-1 rounded-full tracking-wide whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Most Popular
          </span>
        </div>
      )}

      {/* Name + tagline */}
      <h3
        className="text-xl font-bold text-amber-900 mb-1 mt-1"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {plan.name}
      </h3>
      <p
        className="text-xs text-gray-400 leading-relaxed mb-5"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {plan.tagline}
      </p>

      {/* Price */}
      <div className="mb-5">
        {plan.payg ? (
          <>
            <p
              className="text-3xl font-extrabold text-amber-900 tabular-nums"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {plan.packStartsAt}
            </p>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              starting pack · credits never expire
            </p>
          </>
        ) : (
          <>
            {annual && (
              <p className="text-sm text-gray-400 line-through mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                {fmt(plan.monthly!)}
              </p>
            )}
            <p
              className="text-3xl font-extrabold text-amber-900 tabular-nums"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {annual ? fmt(plan.effectiveMonthly!) : fmt(plan.monthly!)}
            </p>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              {annual
                ? `/month · billed ${fmt(plan.annual!)} annually`
                : '/month'}
            </p>
          </>
        )}
      </div>

      {/* Try-ons chip */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 mb-5">
        <p className="text-xs font-semibold text-amber-800 leading-snug" style={{ fontFamily: 'var(--font-inter)' }}>
          {plan.tryOns || 'Pack-based'}
        </p>
        <p className="text-xs text-amber-600/70 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
          {plan.rate}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-amber-100 mb-4" />

      {/* Feature list */}
      <ul className="flex-1 flex flex-col gap-2.5 mb-6">
        {plan.features.map((f) => (
          <li
            key={f.label}
            className="flex items-start gap-2 text-xs"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="text-amber-500 font-bold shrink-0 mt-0.5">✓</span>
            <span>
              <span className="text-gray-400">{f.label}: </span>
              <span className="text-gray-600">{f.value}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.payg
          ? `/checkout?plan=${plan.id}&billing=monthly`
          : `/checkout?plan=${plan.id}&billing=${billing}`
        }
        className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
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

export default function PlanCards({ billing }: { billing: BillingCycle }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} index={i} />
        ))}
      </div>

      <p
        className="text-center text-xs text-gray-400 mt-6"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        All plans include a 14-day free trial · 40 credits · no card required
      </p>
    </section>
  );
}
