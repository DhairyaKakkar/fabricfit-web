'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const PILOTS = [
  { name: 'Fabrico', location: 'Chennai', tag: 'Live', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', desc: 'Export house. First paying pilot — live now.' },
  { name: 'Jain Exports', location: 'India', tag: 'Live', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', desc: 'Export house. Paying pilot running live.' },
  { name: 'Gaudana', location: '100+ distributors', tag: 'Closing', color: '#d97706', bg: 'rgba(217,119,6,0.08)', desc: 'They came to us. Closing five-figure SGD recurring deal.' },
];

const STATS = [
  { end: 30, suffix: 's', label: 'Try-on time', duration: 800 },
  { end: 50, suffix: '+', label: 'Looks per session', duration: 1000 },
  { end: 3, suffix: '', label: 'Live pilots', duration: 600 },
  { end: 0, suffix: '', label: 'Extra hardware', duration: 400 },
];

function AnimatedNumber({ end, suffix, duration, started }: { end: number; suffix: string; duration: number; started: boolean }) {
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!started || done.current) return;
    if (end === 0) { setVal(0); done.current = true; return; }
    done.current = true;
    const steps = 40;
    const step = end / steps;
    const delay = duration / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, delay);
    return () => clearInterval(t);
  }, [started, end, duration]);

  return <>{val}{suffix}</>;
}

const TICKER = ['Silk · ', 'Cotton · ', 'Chiffon · ', 'Linen · ', 'Georgette · ', 'Velvet · ', 'Satin · ', 'Khadi · ', 'Brocade · ', 'Muslin · '];

export default function TractionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  return (
    <section
      ref={ref}
      className="snap-start relative overflow-hidden flex flex-col"
      style={{ height: '100vh', backgroundColor: '#ffffff' }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(to right, #f59e0b, #92400e, #7c2d12, #92400e, #f59e0b)', backgroundSize: '200% 100%' }} />

      {/* Ticker strip */}
      <div style={{ background: '#1c1917', padding: '10px 0', overflow: 'hidden' }}>
        <motion.div
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', paddingRight: 4 }}>{t}</span>
          ))}
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto px-8 md:px-16 w-full py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.div className="flex items-center gap-3 mb-3" initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4 }}>
              <div style={{ width: 20, height: 2, background: '#f59e0b', borderRadius: 2 }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: 'var(--font-inter)', color: '#92400e', letterSpacing: '0.2em' }}>
                Early Traction
              </span>
            </motion.div>
            <motion.h2
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#1c1917', lineHeight: 1.15 }}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.1 }}
            >
              The market is <span style={{ color: '#92400e', fontStyle: 'italic' }}>pulling us in.</span>
            </motion.h2>
          </div>

          {/* NTU badge */}
          <motion.div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-inter)', flexShrink: 0 }}>NTU</div>
            <div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#1c1917' }}>Nanyang Technological University</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a8a29e' }}>Singapore · Backed &amp; incubated</p>
            </div>
          </motion.div>
        </div>

        {/* Giant stats */}
        <motion.div
          className="grid grid-cols-4 gap-0"
          style={{ borderTop: '1px solid #f5f5f4', borderBottom: '1px solid #f5f5f4' }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ padding: '20px 0', textAlign: 'center', borderRight: i < 3 ? '1px solid #f5f5f4' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 700, color: '#92400e', lineHeight: 1 }}>
                <AnimatedNumber {...stat} started={started} />
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Pilot cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PILOTS.map((pilot, i) => (
            <motion.div
              key={pilot.name}
              style={{ borderRadius: 16, padding: '18px 20px', background: '#fafaf9', border: '1px solid #e7e5e4' }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.4 + i * 0.1, type: 'spring', stiffness: 120 }}
              whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem', fontWeight: 700, color: '#1c1917' }}>{pilot.name}</h3>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-inter)', color: pilot.color, background: pilot.bg, padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>● {pilot.tag}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a8a29e', marginBottom: 6 }}>{pilot.location}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', lineHeight: 1.5 }}>{pilot.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
