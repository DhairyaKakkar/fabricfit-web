'use client';

import { motion } from 'framer-motion';

const RULES = [
  {
    icon: '↻',
    title: 'Credits reset on billing date',
    body: 'Not the 1st of the month. Your credits reset on the same day you subscribed — every month.',
  },
  {
    icon: '✕',
    title: "Unused credits don't roll over",
    body: 'Monthly subscription credits expire at reset. Top-up pack credits never expire, even for subscribers.',
  },
  {
    icon: '★',
    title: 'Free demo try-on',
    body: 'Every new account includes one free try-on, no card required. Need more to evaluate? Request trial credits and we’ll set you up.',
  },
];

export default function PricingFooter() {
  return (
    <section className="w-full py-16 px-4 bg-[#fef9f0]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2
            className="text-xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Good to know
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-amber-600 to-amber-400" />
        </div>

        {/* Rule cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {RULES.map((rule, i) => (
            <motion.div
              key={rule.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-amber-50/60 border border-amber-100"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <span className="text-2xl text-amber-500 mb-3 select-none">{rule.icon}</span>
              <h3
                className="text-sm font-semibold text-amber-900 mb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {rule.title}
              </h3>
              <p
                className="text-xs text-gray-400 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {rule.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p
            className="text-xs text-gray-400"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Questions about pricing?{' '}
            <a
              href="#"
              className="text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              Chat with us on WhatsApp
            </a>
            {' '}· Payments via Razorpay — UPI, cards, net banking, EMI supported
          </p>
        </div>
      </div>
    </section>
  );
}
