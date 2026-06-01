'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── FlowSection ─────────────────────────────────────────────────────────────
// Uses CSS position:sticky for stacking — zero JS DOM manipulation means
// cleanup is trivial and back/forward navigation never corrupts the layout.
interface FlowSectionProps {
  children: React.ReactNode;
  bg?: string;
  index: number;
  'aria-label'?: string;
}

function FlowSection({ children, bg = '#09090b', index, 'aria-label': ariaLabel }: FlowSectionProps) {
  return (
    <div
      data-flow-wrapper
      style={{
        position: 'sticky',
        top: 0,
        zIndex: index + 1,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <section
        aria-label={ariaLabel}
        className="relative w-full h-full flex flex-col justify-between"
        style={{ background: bg, padding: '4vw', paddingTop: 'clamp(2rem, 8vw, 4rem)' }}
      >
        <div
          className="flow-art-container relative flex w-full h-full flex-col justify-between"
          style={{ transformOrigin: 'bottom left' }}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

// ─── FlowArt orchestrator ─────────────────────────────────────────────────────
// GSAP is only used for the rotation tween — no pin:true, no pin spacers,
// no JS-managed positioning. ctx.revert() cleanly removes just the tweens.
function FlowArt({ children, id }: { children: React.ReactNode; id?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(mq.matches);
    onMotion();
    mq.addEventListener('change', onMotion);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      mq.removeEventListener('change', onMotion);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion || isMobile) return;

    ScrollTrigger.getAll().forEach(t => t.kill());

    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>('[data-flow-wrapper]'),
    );

    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper, i) => {
        if (i === 0) return;
        const inner = wrapper.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
        gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });
      });
    }, container);

    let r1: number, r2: number;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, [reducedMotion, isMobile]);

  // No overflow-x-hidden here — that breaks position:sticky on children
  return (
    <div id={id} ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

// ─── Step label ───────────────────────────────────────────────────────────────
function StepLabel({ num, light = false }: { num: '01' | '02' | '03'; light?: boolean }) {
  const dot    = light ? 'rgba(0,0,0,0.06)'  : 'rgba(255,255,255,0.05)';
  const border = light ? 'rgba(0,0,0,0.1)'   : 'rgba(255,255,255,0.1)';
  const numClr = light ? 'rgba(0,0,0,0.35)'  : 'rgba(255,255,255,0.4)';
  const labelC = light ? 'rgba(0,0,0,0.22)'  : 'rgba(255,255,255,0.22)';
  const stepC  = light ? 'rgba(0,0,0,0.12)'  : 'rgba(255,255,255,0.12)';

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
            width: s === active ? 28 : 6,
            height: 6,
            borderRadius: 3,
            background: s === active
              ? (light ? 'rgba(0,0,0,0.4)'   : 'rgba(255,255,255,0.55)')
              : (light ? 'rgba(0,0,0,0.1)'   : 'rgba(255,255,255,0.1)'),
          }}
        />
      ))}
    </div>
  );
}

// ─── FeaturesSection ──────────────────────────────────────────────────────────
export default function HowItWorksSection() {
  return (
    <FlowArt id="features">

      <FlowSection index={0} aria-label="Feature 1: Virtual Try-On for stores" bg="#F6F5F0">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <StepLabel num="01" light />
          <div style={{ maxWidth: 640 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(4rem, 8.5vw, 9.5rem)',
              fontWeight: 700,
              color: '#09090b',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              marginBottom: '1.2rem',
            }}>
              Virtual<br />Try-On.
            </h2>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              color: 'rgba(0,0,0,0.4)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Right in your store — no setup required.
            </p>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' }}>
          <Image src="/features1.png" alt="Virtual try-on in store" width={1400} height={1400} unoptimized
            className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
        </div>

        <StepDots active="01" light />
      </FlowSection>

      <FlowSection index={1} aria-label="Feature 2: Web embed for Shopify and WooCommerce" bg="#111314">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <StepLabel num="02" />
          <div style={{ maxWidth: 640 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(4rem, 8.5vw, 9.5rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              marginBottom: '1.2rem',
            }}>
              Embed<br />anywhere.
            </h2>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              One line of code — Shopify, WooCommerce, any site.
            </p>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' }}>
          <Image src="/features2.png" alt="Web embed virtual try-on" width={1400} height={1400} unoptimized
            className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
        </div>

        <StepDots active="02" />
      </FlowSection>

      <FlowSection index={2} aria-label="Feature 3: Create a high-polished catalogue" bg="#F6F5F0">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <StepLabel num="03" light />
          <div style={{ maxWidth: 640 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(4rem, 8.5vw, 9.5rem)',
              fontWeight: 700,
              color: '#09090b',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              marginBottom: '1.2rem',
            }}>
              Build your<br />catalogue.
            </h2>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              color: 'rgba(0,0,0,0.35)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              No shoot. No agency. Export same day.
            </p>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' }}>
          <Image src="/features3.png" alt="Catalogue builder" width={1400} height={1400} unoptimized
            className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
        </div>

        <StepDots active="03" light />
      </FlowSection>

    </FlowArt>
  );
}
