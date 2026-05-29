'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { BillingCycle } from './PricingPageClient';

type CellValue = string | boolean;

interface Row {
  label: string;
  values: [CellValue, CellValue, CellValue, CellValue];
}

interface Group {
  heading: string;
  rows: Row[];
}

const GROUPS: Group[] = [
  {
    heading: 'Credits & Try-Ons',
    rows: [
      { label: 'Credits', values: ['Packs (no expiry)', '200 / month', '400 / month', '1,000 / month'] },
      { label: 'Fast try-ons (approx)', values: ['Pack-based', '60–80', '120–160', '300–400'] },
      { label: 'Effective rate / try-on', values: ['S$0.40', 'S$0.40', 'S$0.36', 'S$0.32'] },
    ],
  },
  {
    heading: 'Branches & Access',
    rows: [
      { label: 'Branches', values: ['1', '1', 'Up to 3', 'Unlimited'] },
      { label: 'Branch credit allocation', values: [false, false, true, true] },
    ],
  },
  {
    heading: 'Exports & Storage',
    rows: [
      { label: 'Catalogue exports / month', values: ['None', '10', '50', '100'] },
      { label: 'Fabric / outfit storage', values: ['Session only', '200 items', '500 items', 'Unlimited'] },
      { label: 'Try-on history', values: ['15 days', '30 days', '90 days', '1 year'] },
    ],
  },
  {
    heading: 'Appearance',
    rows: [
      { label: 'TrialRoomStudio watermark', values: ['Always on', 'Removable (+S$8/mo)', 'Removed', 'Removed'] },
    ],
  },
  {
    heading: 'Management & Analytics',
    rows: [
      { label: 'Web dashboard', values: [false, false, false, true] },
      { label: 'Analytics', values: [false, false, false, true] },
    ],
  },
  {
    heading: 'Support',
    rows: [
      { label: 'Support tier', values: ['None', 'Email', 'Priority email', 'Dedicated manager'] },
    ],
  },
  {
    heading: 'Billing',
    rows: [
      { label: 'Annual discount', values: ['None', '2 months free', '2 months free', '2 months free'] },
    ],
  },
];

const PLAN_NAMES = ['PAYG', 'Starter', 'Pro', 'Business'];

function Cell({ value, isPro }: { value: CellValue; isPro: boolean }) {
  if (value === true) {
    return (
      <span className={`font-bold ${isPro ? 'text-amber-600' : 'text-amber-500'}`}>✓</span>
    );
  }
  if (value === false) {
    return <span className="text-gray-300">—</span>;
  }
  return (
    <span
      className={`text-xs leading-snug ${isPro ? 'text-amber-900 font-medium' : 'text-gray-500'}`}
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {value}
    </span>
  );
}

export default function ComparisonTable({ billing }: { billing: BillingCycle }) {
  const prices =
    billing === 'annual'
      ? ['From S$8', 'S$34 / mo', 'S$60 / mo', 'S$134 / mo']
      : ['From S$8', 'S$40 / mo', 'S$72 / mo', 'S$160 / mo'];

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: '#fdf3e3' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <p
            className="text-xs font-medium text-amber-700 uppercase mb-3"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.15em' }}
          >
            Compare
          </p>
          <h2
            className="text-2xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Full Feature Comparison
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-amber-600 to-amber-400" />
        </div>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-amber-200/60 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
        >
          <table className="w-full border-collapse bg-white min-w-[620px]">
            {/* Column header */}
            <thead>
              <tr>
                <th
                  className="sticky left-0 z-20 bg-amber-50 border-b border-r border-amber-100 text-left px-5 py-4 text-xs font-semibold text-amber-700 w-44 min-w-[176px]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Feature
                </th>
                {PLAN_NAMES.map((name, i) => (
                  <th
                    key={name}
                    className={`border-b border-amber-100 px-4 py-4 text-center min-w-[110px] ${
                      i === 2 ? 'bg-amber-50' : 'bg-amber-50/50'
                    }`}
                  >
                    <span
                      className={`block text-sm font-bold ${i === 2 ? 'text-amber-900' : 'text-amber-800'}`}
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {name}
                    </span>
                    {i === 2 && (
                      <span
                        className="block text-xs font-normal text-amber-600 mt-0.5"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        Most Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {GROUPS.map((group) => (
                <Fragment key={group.heading}>
                  {/* Group subheader */}
                  <tr>
                    <td
                      colSpan={5}
                      className="sticky left-0 bg-gray-50 border-t border-b border-amber-100/60 px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}
                    >
                      {group.heading}
                    </td>
                  </tr>

                  {/* Feature rows */}
                  {group.rows.map((row, ri) => (
                    <tr
                      key={row.label}
                      className={`border-t border-amber-100/50 transition-colors hover:bg-amber-50/30 ${
                        ri % 2 === 1 ? 'bg-amber-50/10' : ''
                      }`}
                    >
                      <td
                        className="sticky left-0 z-10 bg-white border-r border-amber-100/60 px-5 py-3.5 text-xs text-gray-500"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {row.label}
                      </td>
                      {row.values.map((val, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-3.5 text-center ${ci === 2 ? 'bg-amber-50/30' : ''}`}
                        >
                          <Cell value={val} isPro={ci === 2} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}

              {/* Price row */}
              <tr className="border-t-2 border-amber-200/60">
                <td
                  className="sticky left-0 z-10 bg-amber-50/60 border-r border-amber-100/60 px-5 py-4 text-xs font-semibold text-amber-800"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {billing === 'annual' ? 'Effective / month' : 'Monthly price'}
                </td>
                {prices.map((price, i) => (
                  <td
                    key={i}
                    className={`px-4 py-4 text-center ${i === 2 ? 'bg-amber-50/60' : 'bg-amber-50/30'}`}
                  >
                    <span
                      className={`text-sm font-bold tabular-nums ${i === 2 ? 'text-amber-900' : 'text-gray-700'}`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {price}
                    </span>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr className="border-t border-amber-100/60 bg-white">
                <td className="sticky left-0 z-10 bg-white border-r border-amber-100/60 px-5 py-4" />
                {PLAN_NAMES.map((_, i) => (
                  <td key={i} className={`px-4 py-4 text-center ${i === 2 ? 'bg-amber-50/30' : ''}`}>
                    <a
                      href="#"
                      className={`inline-block px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                        i === 2
                          ? 'bg-amber-800 text-white hover:bg-amber-900'
                          : 'border border-amber-600 text-amber-700 hover:bg-amber-50'
                      }`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Get Started
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {billing === 'annual' && (
          <p
            className="text-center text-xs text-gray-400 mt-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Annual plans billed upfront · 2 months free vs monthly billing
          </p>
        )}
      </div>
    </section>
  );
}
