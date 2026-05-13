'use client';

import { motion } from 'framer-motion';

const FABRIC_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 10 L10 0 M-2 2 L2-2 M18 22 L22 18' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M10 20 L20 10 M-2 18 L2 22 M18-2 L22 2' stroke='%2392400e' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`;

export default function PricingHero() {
  return (
    <div className="relative pt-20 pb-10 flex flex-col items-center text-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: FABRIC_TEXTURE, opacity: 0.04 }}
      />

      <motion.p
        className="text-xs font-medium text-amber-700 uppercase mb-4"
        style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.15em' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        Pricing
      </motion.p>

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-amber-900 leading-tight"
        style={{ fontFamily: 'var(--font-playfair)' }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        Simple, transparent pricing
      </motion.h1>

      <motion.div
        className="w-16 h-px bg-gradient-to-r from-amber-600 to-amber-400 my-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        style={{ transformOrigin: 'center' }}
      />

      <motion.p
        className="text-sm text-gray-500 max-w-lg"
        style={{ fontFamily: 'var(--font-inter)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.24 }}
      >
        Start free, pay as you grow. Every plan includes AI-powered virtual try-on built for Indian fabric showrooms. Credits top up monthly — no lock-in.
      </motion.p>
    </div>
  );
}
