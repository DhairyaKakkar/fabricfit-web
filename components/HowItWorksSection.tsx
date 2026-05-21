'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// ─── ScatterArc: scatter → line → circle animation ──────────────────────────
const SCATTER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=80',
  'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80',
];

type ArcPhase = 'scatter' | 'line' | 'circle';

function ScatterArc() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const [phase, setPhase] = useState<ArcPhase>('scatter');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (inView) {
      setPhase('scatter');
      timers.current.push(setTimeout(() => setPhase('line'), 350));
      timers.current.push(setTimeout(() => setPhase('circle'), 1600));
    } else {
      setPhase('scatter');
    }
    return () => timers.current.forEach(clearTimeout);
  }, [inView]);

  const scatterPositions = useMemo(() =>
    SCATTER_IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 480,
      y: (Math.random() - 0.5) * 340,
      rotation: (Math.random() - 0.5) * 120,
    })), []);

  const getTarget = (i: number) => {
    if (phase === 'scatter') return {
      x: scatterPositions[i].x, y: scatterPositions[i].y,
      rotate: scatterPositions[i].rotation, opacity: 0, scale: 0.4,
    };
    if (phase === 'line') {
      const spacing = 66;
      const total = (SCATTER_IMAGES.length - 1) * spacing;
      return { x: i * spacing - total / 2, y: 0, rotate: 0, opacity: 1, scale: 0.85 };
    }
    const angle = (i / SCATTER_IMAGES.length) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * 138, y: Math.sin(rad) * 138, rotate: 0, opacity: 1, scale: 1 };
  };

  return (
    <div ref={ref} className="relative flex items-center justify-center scatter-arc-container" style={{ width: 'min(360px, 80vw)', height: 'min(360px, 80vw)' }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        animate={{ opacity: phase === 'circle' ? 1 : 0, scale: phase === 'circle' ? 1 : 0.85 }}
        transition={{ duration: 0.6 }}
      />
      {SCATTER_IMAGES.map((src, i) => {
        const t = getTarget(i);
        return (
          <motion.div
            key={i}
            animate={{ x: t.x, y: t.y, rotate: t.rotate, scale: t.scale, opacity: t.opacity }}
            transition={{ type: 'spring', stiffness: 42, damping: 16 }}
            style={{ position: 'absolute', width: 54, height: 70, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        );
      })}
      <motion.div
        style={{ position: 'relative', zIndex: 10 }}
        animate={phase === 'circle' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2,
        }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', textAlign: 'center', lineHeight: 1.5 }}>
            Any<br />Photo
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── FlowSection ────────────────────────────────────────────────────────────
interface FlowSectionProps {
  children: React.ReactNode;
  bg?: string;
  'aria-label'?: string;
}

function FlowSection({ children, bg = '#09090b', 'aria-label': ariaLabel }: FlowSectionProps) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className="relative min-h-screen w-full overflow-hidden"
    >
      <div
        data-flow-inner
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-between will-change-transform"
        style={{
          transformOrigin: 'bottom left',
          background: bg,
          padding: '4vw',
          paddingTop: 'clamp(2rem, 8vw, 4rem)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {children}
      </div>
    </section>
  );
}

// ─── FlowArt orchestrator ───────────────────────────────────────────────────
function FlowArt({ children, id }: { children: React.ReactNode; id?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: containerRef, dependencies: [React.Children.count(children), reducedMotion] },
  );

  return (
    <div id={id} ref={containerRef} className="w-full overflow-x-hidden">
      {children}
    </div>
  );
}

// ─── Step header / footer ───────────────────────────────────────────────────
function StepLabel({ num }: { num: '01' | '02' | '03' }) {
  return (
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{num}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          How It Works
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.12)' }}>
        Step {num} / 03
      </span>
    </div>
  );
}

function StepDots({ active }: { active: '01' | '02' | '03' }) {
  return (
    <div className="relative z-10 flex items-center gap-2">
      {(['01', '02', '03'] as const).map((s) => (
        <div
          key={s}
          style={{
            width: s === active ? 28 : 6, height: 6, borderRadius: 3,
            background: s === active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.1)',
            transition: 'width 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─── Mockup: Upload interface ────────────────────────────────────────────────
function UploadMockup() {
  return (
    <div
      style={{
        width: '100%', maxWidth: 460,
        background: '#141414', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}
    >
      {/* Browser chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{
          flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10,
          display: 'flex', alignItems: 'center', paddingLeft: 10,
        }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
            fabricfit.app / tryon
          </span>
        </div>
      </div>

      {/* Upload zone */}
      <div style={{
        border: '1.5px dashed rgba(255,255,255,0.13)', borderRadius: 14,
        padding: '28px 20px', textAlign: 'center', marginBottom: 14,
        background: 'rgba(255,255,255,0.015)',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.22)', marginBottom: 5 }}>
          [ Customer Photo — Placeholder ]
        </p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.1)' }}>
          JPG · PNG · Any phone or device
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{
          padding: '11px 0', background: '#ffffff',
          borderRadius: 10, textAlign: 'center', cursor: 'pointer',
        }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#09090b' }}>
            Upload Photo
          </span>
        </div>
        <div style={{
          padding: '11px 0', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
        }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Take Photo
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: Fabric selector ─────────────────────────────────────────────────
function FabricMockup() {
  const FABRICS = [
    { name: 'Silk', color: '#e2e8f0', price: '₹4,200', active: true },
    { name: 'Cotton', color: '#d1fae5', price: '₹1,800', active: false },
    { name: 'Chiffon', color: '#fce7f3', price: '₹3,100', active: false },
    { name: 'Linen', color: '#f3f4f6', price: '₹2,400', active: false },
    { name: 'Velvet', color: '#ede9fe', price: '₹6,500', active: false },
    { name: 'Satin', color: '#fef9c3', price: '₹3,800', active: false },
  ];

  return (
    <div
      style={{
        width: '100%', maxWidth: 460,
        background: '#141414', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}
    >
      {/* Chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10 }} />
      </div>

      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
        Select Fabric
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {FABRICS.map((fab) => (
          <motion.div
            key={fab.name}
            whileHover={{ scale: 1.03 }}
            style={{
              borderRadius: 12, background: '#1a1a1a', cursor: 'pointer',
              border: fab.active ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid #2a2a2a',
              padding: '10px 8px',
            }}
          >
            <div style={{
              width: '100%', height: 38, borderRadius: 7, background: fab.color,
              marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 6.5, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                [ {fab.name} ]
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: fab.active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)', textAlign: 'center' }}>
              {fab.name}
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>
              {fab.price}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{ padding: '11px 0', background: '#ffffff', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}
      >
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#09090b' }}>
          Generate Try-On →
        </span>
      </motion.div>
    </div>
  );
}

// ─── Mockup: Before / After result ──────────────────────────────────────────
function ResultMockup() {
  return (
    <div
      style={{
        width: '100%', maxWidth: 500,
        background: '#141414', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}
    >
      {/* Chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Before */}
        <div style={{ borderRadius: 14, background: '#1a1a1a', border: '1px solid #252525', overflow: 'hidden' }}>
          <div style={{ padding: '7px 12px', borderBottom: '1px solid #252525' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Before
            </p>
          </div>
          <div style={{
            height: 148, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#161616', gap: 8,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, background: '#2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(255,255,255,0.14)', textAlign: 'center', lineHeight: 1.6 }}>
              [ Customer<br />Photo ]
            </p>
          </div>
        </div>

        {/* After */}
        <div style={{ borderRadius: 14, background: '#1a1a1a', border: '1px solid #252525', overflow: 'hidden' }}>
          <div style={{ padding: '7px 12px', borderBottom: '1px solid #252525', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              After
            </p>
            <motion.div
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
          <div style={{
            height: 148, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#12121e', gap: 8, position: 'relative', overflow: 'hidden',
          }}>
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
              [ AI Result —<br />Styled Look ]
            </p>
            <motion.div
              style={{ width: 30, height: 60, background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)', borderRadius: 8, position: 'relative', zIndex: 1 }}
              animate={{ y: [2, -2, 2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
        <div style={{ padding: '10px 0', background: '#ffffff', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#09090b' }}>
            Share with Customer
          </span>
        </div>
        <div style={{ padding: '10px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Redo</span>
        </div>
      </div>
    </div>
  );
}

// ─── HowItWorksSection ───────────────────────────────────────────────────────
export default function HowItWorksSection() {
  return (
    <FlowArt id="how-it-works">

      {/* Step 01 ─ Upload */}
      <FlowSection aria-label="Step 1: Upload a photo" bg="#09090b">
        <StepLabel num="01" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          {/* Text */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              Upload a photo.
              <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.78em' }}>
                Any device.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 380 }}>
              Staff takes or uploads a customer photo on any device — phone, tablet, or desktop. No special camera, lighting, or setup required.
            </p>
          </div>
          {/* Visual */}
          <div className="flex justify-center md:justify-end">
            <ScatterArc />
          </div>
        </div>

        <StepDots active="01" />
      </FlowSection>

      {/* Step 02 ─ Fabric */}
      <FlowSection aria-label="Step 2: Select fabric and style" bg="#0c0c10">
        <StepLabel num="02" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          {/* Visual first on this step */}
          <div className="flex justify-center md:justify-start">
            <FabricMockup />
          </div>
          {/* Text */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              Pick a fabric.
              <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.78em' }}>
                AI drapes it.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 380 }}>
              Browse your catalog. Select the fabric, outfit, and fit. FabricFit drapes it realistically — shadows, lighting, texture, all automatic.
            </p>
          </div>
        </div>

        <StepDots active="02" />
      </FlowSection>

      {/* Step 03 ─ Result */}
      <FlowSection aria-label="Step 3: Customer sees the look" bg="#0f0f18">
        <StepLabel num="03" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          {/* Text */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              See it in{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' }}>30 seconds.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 380, marginBottom: '2rem' }}>
              The customer sees themselves in the look before a single thread is cut. Confident purchase. Fewer returns. More conversions.
            </p>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ num: '30s', label: 'Try-on time' }, { num: '50+', label: 'Looks / session' }].map((s) => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                    {s.num}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 5 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <div className="flex justify-center md:justify-end">
            <ResultMockup />
          </div>
        </div>

        <StepDots active="03" />
      </FlowSection>

    </FlowArt>
  );
}
