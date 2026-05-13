'use client';

import { motion } from 'framer-motion';

const PACKS = [
  { name: 'Small', credits: 40, price: 500, tryOns: '~20 fast try-ons' },
  { name: 'Standard', credits: 100, price: 1250, tryOns: '~50 fast try-ons' },
  { name: 'Large', credits: 250, price: 3125, tryOns: '~125 fast try-ons' },
];

const LIMITATIONS = [
  'Try-ons only — no catalogue exports',
  '15-day try-on history',
  'FabricFit watermark on all results',
  '1 branch · no fabric library',
];

export default function CreditPacks() {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: '#fdf3e3' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <p
            className="text-xs font-medium text-amber-700 uppercase mb-3"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.15em' }}
          >
            No Subscription Needed
          </p>
          <h2
            className="text-2xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Credit Packs
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-amber-600 to-amber-400 mb-4" />
          <p
            className="text-sm text-gray-500 max-w-md"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Buy credits à la carte. They never expire. Subscribers can also top up at the same rate when they run low mid-month.
          </p>
        </div>

        {/* Pack cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.name}
              className="bg-white rounded-2xl border border-amber-200/60 p-6 flex flex-col items-center text-center shadow-sm"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
            >
              <p
                className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em' }}
              >
                {pack.name}
              </p>
              <p
                className="text-3xl font-extrabold text-amber-900 mb-1 tabular-nums"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                ₹{pack.price.toLocaleString('en-IN')}
              </p>
              <p
                className="text-xs text-gray-400 mb-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {pack.credits} credits
              </p>
              <p
                className="text-xs text-amber-700/60 mb-5"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {pack.tryOns}
              </p>
              <a
                href="#"
                className="w-full block text-center py-2 rounded-xl text-sm font-semibold border border-amber-700 text-amber-800 hover:bg-amber-50 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Buy Pack
              </a>
            </motion.div>
          ))}
        </div>

        {/* Limitations */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LIMITATIONS.map((item) => (
            <span
              key={item}
              className="text-xs text-gray-400 flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span className="text-gray-300 text-xs">·</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
