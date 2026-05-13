'use client';

import { motion } from 'framer-motion';

const ADDONS = [
  {
    icon: '✦',
    name: 'Remove Watermark',
    description:
      'Strip the FabricFit watermark from all future try-on results. Does not apply retroactively to saved results. Cancelling re-applies the watermark from the next try-on.',
    price: 'S$8 / month',
    badge: 'Starter plan only',
  },
  {
    icon: '⚡',
    name: 'Credit Top-Up',
    description:
      'Buy extra credits at the standard PAYG rate when you run out mid-month. Top-up credits never expire — even if you cancel your subscription.',
    price: 'From S$8',
    badge: 'All plans + PAYG',
  },
];

export default function AddOns() {
  return (
    <section className="w-full py-14 px-4 bg-[#fef9f0]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <p
            className="text-xs font-medium text-amber-700 uppercase mb-3"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.15em' }}
          >
            Extras
          </p>
          <h2
            className="text-2xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Add-Ons
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-amber-600 to-amber-400" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {ADDONS.map((addon, i) => (
            <motion.div
              key={addon.name}
              className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.09 }}
            >
              <div className="flex gap-3">
                <span className="text-amber-500 text-xl shrink-0 mt-0.5">{addon.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-amber-900 text-base mb-1.5"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {addon.name}
                  </h3>
                  <p
                    className="text-xs text-gray-400 leading-relaxed mb-4"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {addon.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm font-bold text-amber-800"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {addon.price}
                    </span>
                    <span
                      className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5 whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {addon.badge}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
