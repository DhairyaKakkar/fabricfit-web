'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ─── FlowSection ─────────────────────────────────────────────────────────────
interface FlowSectionProps {
  children: React.ReactNode;
  bg?: string;
  light?: boolean;
  'aria-label'?: string;
}

function FlowSection({ children, bg = '#09090b', light = false, 'aria-label': ariaLabel }: FlowSectionProps) {
  const gridColor = light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.022)';
  return (
    <section data-flow-section aria-label={ariaLabel} className="relative min-h-screen w-full overflow-hidden">
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {children}
      </div>
    </section>
  );
}

// ─── FlowArt orchestrator ─────────────────────────────────────────────────────
function FlowArt({ children, id }: { children: React.ReactNode; id?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];
      const mobile = window.innerWidth < 768;

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0 && !mobile) {
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

        if (i < sections.length - 1 && !mobile) {
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
    { scope: containerRef, dependencies: [React.Children.count(children), reducedMotion, isMobile] },
  );

  return (
    <div id={id} ref={containerRef} className="w-full overflow-x-hidden">
      {children}
    </div>
  );
}

// ─── Step label ───────────────────────────────────────────────────────────────
function StepLabel({ num, light = false }: { num: '01' | '02' | '03'; light?: boolean }) {
  const dot     = light ? 'rgba(0,0,0,0.06)'  : 'rgba(255,255,255,0.05)';
  const border  = light ? 'rgba(0,0,0,0.1)'   : 'rgba(255,255,255,0.1)';
  const numClr  = light ? 'rgba(0,0,0,0.35)'  : 'rgba(255,255,255,0.4)';
  const labelC  = light ? 'rgba(0,0,0,0.22)'  : 'rgba(255,255,255,0.22)';
  const stepC   = light ? 'rgba(0,0,0,0.12)'  : 'rgba(255,255,255,0.12)';

  return (
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: dot, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 700, color: numClr }}>{num}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: labelC, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Features
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 12, fontStyle: 'italic', color: stepC }}>
        Feature {num} / 03
      </span>
    </div>
  );
}

function StepDots({ active, light = false }: { active: '01' | '02' | '03'; light?: boolean }) {
  return (
    <div className="relative z-10 flex items-center gap-2">
      {(['01', '02', '03'] as const).map((s) => (
        <div
          key={s}
          style={{
            width: s === active ? 28 : 6, height: 6, borderRadius: 3,
            background: s === active
              ? (light ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.55)')
              : (light ? 'rgba(0,0,0,0.1)'  : 'rgba(255,255,255,0.1)'),
            transition: 'width 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─── Mockup: In-store Virtual Try-On ─────────────────────────────────────────
function TryOnMockup() {
  return (
    <div style={{ width: '100%', maxWidth: 460, background: '#141414', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
      {/* Chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>trialroomstudio.com / tryon</span>
        </div>
      </div>

      {/* Before / After split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #252525', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer</span>
          <div style={{ width: '100%', height: 88, background: '#212121', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div style={{ background: '#12121e', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.12)', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <motion.div
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>AI Try-On</span>
          </div>
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(91,147,153,0.25) 0%, transparent 70%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <div style={{ width: '100%', height: 88, background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>[ Styled Look ]</span>
          </div>
        </div>
      </div>

      {/* Speed indicator */}
      <div style={{ background: 'rgba(91,147,153,0.08)', border: '1px solid rgba(91,147,153,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B9399', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>Generated in ~3 seconds · Any device</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
        <div style={{ padding: '11px 0', background: '#ffffff', borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#09090b' }}>Share with Customer</span>
        </div>
        <div style={{ padding: '11px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Redo</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: Shopify / WooCommerce embed ──────────────────────────────────────
function EmbedMockup() {
  return (
    <div style={{ width: '100%', maxWidth: 460, background: '#141414', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
      {/* Chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>yourstore.myshopify.com / products / kurta</span>
        </div>
      </div>

      {/* Product page with embedded widget */}
      <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #252525', padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 70, height: 90, background: '#252525', borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, background: '#2a2a2a', borderRadius: 4, marginBottom: 6, width: '65%' }} />
            <div style={{ height: 6, background: '#222', borderRadius: 4, marginBottom: 14, width: '40%' }} />
            {/* Widget */}
            <div style={{ background: '#0f0f0f', border: '1px solid rgba(189,161,69,0.35)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(189,161,69,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(189,161,69,0.9)" strokeWidth="2">
                  <path d="M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(189,161,69,0.85)', fontWeight: 600 }}>Try On Virtually</span>
              <div style={{ marginLeft: 'auto', background: 'rgba(189,161,69,0.12)', borderRadius: 5, padding: '2px 8px' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(189,161,69,0.5)', fontWeight: 600 }}>FREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code snippet */}
      <div style={{ background: '#0d0d0d', borderRadius: 12, padding: '12px 16px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>Installation ·</span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(189,161,69,0.5)' }}>1 line</span>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, lineHeight: 1.8 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>&lt;</span>
          <span style={{ color: '#7dd3fc' }}>script</span>
          <span style={{ color: '#86efac' }}> src</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
          <span style={{ color: '#fbbf24' }}>&quot;https://cdn.trs.io/embed.js&quot;</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>&gt;&lt;/</span>
          <span style={{ color: '#7dd3fc' }}>script</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>&gt;</span>
        </div>
      </div>

      {/* Platform badges */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['Shopify', 'WooCommerce', 'Custom'].map((platform) => (
          <div key={platform} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 0', flex: 1, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mockup: Catalogue generator ─────────────────────────────────────────────
function CatalogueMockup() {
  const ITEMS = [
    { label: 'Kurta',    color: '#fef3c7' },
    { label: 'Sherwani', color: '#ede9fe' },
    { label: 'Anarkali', color: '#fce7f3' },
    { label: 'Saree',    color: '#fdf4ff' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 500, background: '#141414', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
      {/* Chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 5, height: 22, marginLeft: 10, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>My Store Catalogue — 10 Garments</span>
        </div>
      </div>

      {/* Catalogue header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Summer Collection 2025
        </span>
        <div style={{ background: '#ffffff', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, fontWeight: 600, color: '#09090b' }}>Export PDF</span>
        </div>
      </div>

      {/* Garment grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {ITEMS.map((item) => (
          <div key={item.label} style={{ background: '#1a1a1a', borderRadius: 10, border: '1px solid #252525', overflow: 'hidden' }}>
            <div style={{ height: 58, background: item.color, opacity: 0.65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                [ {item.label} ]
              </span>
            </div>
            <div style={{ padding: '6px 8px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <motion.div
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          AI generating · 10 looks ready in ~30 seconds
        </span>
      </div>
    </div>
  );
}

// ─── FeaturesSection ──────────────────────────────────────────────────────────
export default function HowItWorksSection() {
  return (
    <FlowArt id="features">

      {/* Feature 01 — Virtual Try-On for Stores */}
      <FlowSection aria-label="Feature 1: Virtual Try-On for stores" bg="#5B9399">
        <StepLabel num="01" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              Virtual Try-On.
              <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.78em' }}>
                Right in your store.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 380 }}>
              Let customers see any garment on themselves before they buy. Staff generates a realistic try-on in seconds using a phone, tablet, or desktop — no special camera, lighting, or setup required.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <TryOnMockup />
          </div>
        </div>

        <StepDots active="01" />
      </FlowSection>

      {/* Feature 02 — Web Embed */}
      <FlowSection aria-label="Feature 2: Web embed for Shopify and WooCommerce" bg="#BDA145">
        <StepLabel num="02" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          <div className="flex justify-center md:justify-start">
            <EmbedMockup />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              Embed on any storefront.
              <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.78em' }}>
                One line of code.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 380 }}>
              Drop a single snippet into your Shopify or WooCommerce store. Your customers try on garments directly from product pages — zero extra apps, zero friction, zero configuration.
            </p>
          </div>
        </div>

        <StepDots active="02" />
      </FlowSection>

      {/* Feature 03 — Catalogue */}
      <FlowSection aria-label="Feature 3: Create a high-polished catalogue" bg="#f5f4f0" light>
        <StepLabel num="03" light />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ flex: 1 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: 700, color: '#09090b', lineHeight: 1.06, marginBottom: '1.2rem',
            }}>
              Build your catalogue.
              <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(0,0,0,0.22)', fontSize: '0.78em' }}>
                Automatically.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'rgba(0,0,0,0.45)', lineHeight: 1.75, maxWidth: 380 }}>
              Upload your garments once. Our AI instantly creates polished, lookbook-quality imagery of every piece worn on a model — ready to share with customers, print, or export as a PDF catalogue.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <CatalogueMockup />
          </div>
        </div>

        <StepDots active="03" light />
      </FlowSection>

    </FlowArt>
  );
}
