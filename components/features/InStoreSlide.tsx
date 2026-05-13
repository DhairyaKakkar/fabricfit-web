'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeatureSlide from './FeatureSlide';
import WorkflowCard from './WorkflowCard';

const HEADLINE_WORDS = ['Walk in', 'a customer.', 'Walk out', 'a sale.'];

const WORKFLOW_STEPS = [
  { icon: '📸', label: 'Upload customer photo', delay: 0.6 },
  { icon: '🧵', label: 'Match fabric & outfit',  delay: 0.75 },
  { icon: '👀', label: 'Preview in seconds',      delay: 0.9 },
  { icon: '✓',  label: 'Customer approves',       delay: 1.05 },
];

// Warm boutique lighting: deep amber-brown gradient
const BG = 'radial-gradient(ellipse at 30% 60%, #3d1a00 0%, #1a0d00 50%, #0a0a0a 100%)';

const ORBS = [
  { size: 400, x: '5%',  y: '20%', opacity: 0.12, duration: 10 },
  { size: 280, x: '70%', y: '60%', opacity: 0.09, duration: 13, color: '#92400e' },
  { size: 180, x: '45%', y: '10%', opacity: 0.07, duration: 8  },
];

export default function InStoreSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <FeatureSlide chapterLabel="01 / In-Store" background={BG} orbs={ORBS} id="in-store">
      <div ref={ref} className="max-w-6xl mx-auto px-8 md:px-16 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: headline + copy */}
        <div>
          <h2
            className="leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#fef9f0',
              fontWeight: 700,
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-sm leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', color: '#d6c4a0' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          >
            Your staff uploads a photo of the customer. FabricFit overlays your store&apos;s outfits — Indian or western, men&apos;s or women&apos;s — in seconds. The customer sees themselves in the look before you stitch a single seam.
          </motion.p>

          {/* Amber divider */}
          <motion.div
            className="mt-8 h-px w-16"
            style={{ background: 'linear-gradient(to right, #d97706, transparent)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
        </div>

        {/* Right: workflow cards */}
        <div className="flex flex-col gap-3 items-start md:items-end">
          {WORKFLOW_STEPS.map((step) => (
            <WorkflowCard key={step.label} {...step} inView={inView} />
          ))}

          {/* Ambient glow behind cards */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 300,
              height: 300,
              right: '5%',
              bottom: '10%',
              background: 'radial-gradient(circle, #d97706 0%, transparent 70%)',
              opacity: 0.06,
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
        </div>
      </div>
    </FeatureSlide>
  );
}
