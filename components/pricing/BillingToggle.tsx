'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BillingCycle } from './PricingPageClient';

interface Props {
  billing: BillingCycle;
  onChange: (b: BillingCycle) => void;
}

export default function BillingToggle({ billing, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center p-1 rounded-full border border-amber-200 bg-amber-50"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {/* Animated sliding pill */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-amber-800"
          layout
          initial={false}
          style={{
            left: billing === 'monthly' ? 4 : '50%',
            right: billing === 'annual' ? 4 : '50%',
          }}
          animate={{
            left: billing === 'monthly' ? 4 : '50%',
            right: billing === 'annual' ? 4 : '50%',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        />
        <button
          className={`relative z-10 px-7 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
            billing === 'monthly' ? 'text-white' : 'text-amber-800'
          }`}
          onClick={() => onChange('monthly')}
        >
          Monthly
        </button>
        <button
          className={`relative z-10 px-7 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
            billing === 'annual' ? 'text-white' : 'text-amber-800'
          }`}
          onClick={() => onChange('annual')}
        >
          Annual
        </button>
      </div>

      <AnimatePresence>
        {billing === 'annual' && (
          <motion.span
            className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
            style={{ fontFamily: 'var(--font-inter)' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            2 months free — pay for 10, get 12
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
