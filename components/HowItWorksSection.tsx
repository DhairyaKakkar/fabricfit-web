'use client';

import React from 'react';
import Image from 'next/image';

interface FlowSectionProps {
  children: React.ReactNode;
  bg?: string;
  index: number;
  'aria-label'?: string;
}

function FlowSection({ children, bg = '#09090b', index, 'aria-label': ariaLabel }: FlowSectionProps) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: index + 1, height: '100vh', overflow: 'hidden' }}>
      <section
        aria-label={ariaLabel}
        className="relative w-full h-full flex flex-col justify-between"
        style={{ background: bg, padding: '4vw', paddingTop: 'clamp(2rem, 8vw, 4rem)' }}
      >
        {children}
      </section>
    </div>
  );
}

function StepLabel({ num, light = false }: { num: '01' | '02' | '03'; light?: boolean }) {
  const bg      = light ? '#09090b'           : '#ffffff';
  const numClr  = light ? '#ffffff'           : '#09090b';
  const labelC  = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)';
  const lineC   = light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
  return (
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: light ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 800, color: numClr }}>{num}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 700,
          color: labelC, letterSpacing: '0.22em', textTransform: 'uppercase',
        }}>Features</span>
        <span style={{ width: 32, height: 1, background: lineC, display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 500, color: labelC, letterSpacing: '0.08em' }}>{num} / 03</span>
      </div>
    </div>
  );
}

function UseCaseChips({ chips, light = false }: { chips: { label: string }[]; light?: boolean }) {
  const dotClr  = light ? 'rgba(0,0,0,0.3)'   : 'rgba(255,255,255,0.3)';
  const textClr = light ? 'rgba(0,0,0,0.65)'  : 'rgba(255,255,255,0.7)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
      {chips.map((c) => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: dotClr, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: textClr, letterSpacing: '0.01em' }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function StepDots({ active, light = false }: { active: '01' | '02' | '03'; light?: boolean }) {
  return (
    <div className="relative z-10 flex items-center gap-2">
      {(['01', '02', '03'] as const).map((s) => (
        <div key={s} style={{
          width: s === active ? 28 : 6, height: 6, borderRadius: 3,
          background: s === active
            ? (light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.55)')
            : (light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'),
        }} />
      ))}
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <div id="features" className="w-full">

      <FlowSection index={0} aria-label="Feature 1: Virtual Try-On for stores" bg="#F6F5F0">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2, maxWidth: '32%' }}>
          <StepLabel num="01" light />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(4rem, 8.5vw, 9.5rem)', fontWeight: 700, color: '#09090b', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
              Virtual<br />Try-On.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              Right in your store — no setup required.
            </p>
          </div>
          <UseCaseChips light chips={[
            { label: 'Snap a photo in-store' },
            { label: 'Result in 90 seconds' },
            { label: 'Zero alteration guesswork' },
          ]} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' }}>
          <Image src="/features1.png" alt="Virtual try-on in store" width={1400} height={1400} loading="lazy" className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
        </div>
        <StepDots active="01" light />
      </FlowSection>

      <FlowSection index={1} aria-label="Feature 2: Web embed for Shopify and WooCommerce" bg="#111314">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2, maxWidth: '32%' }}>
          <StepLabel num="02" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(4rem, 8.5vw, 9.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
              Embed<br />anywhere.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              One line of code — Shopify, WooCommerce, any site.
            </p>
          </div>
          <UseCaseChips chips={[
            { label: 'Add to Shopify in 5 min' },
            { label: 'Any website, any platform' },
            { label: 'Mobile-ready, no app needed' },
          ]} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' }}>
          <Image src="/features2.png" alt="Web embed virtual try-on" width={1400} height={1400} loading="lazy" className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
        </div>
        <StepDots active="02" />
      </FlowSection>

      <FlowSection index={2} aria-label="Feature 3: Create a high-polished catalogue" bg="#F6F5F0">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2, maxWidth: '32%' }}>
          <StepLabel num="03" light />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(4rem, 8.5vw, 9.5rem)', fontWeight: 700, color: '#09090b', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
              Build your<br />catalogue.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              No shoot. No agency. Export same day.
            </p>
          </div>
          <UseCaseChips light chips={[
            { label: 'Upload fabrics once, use forever' },
            { label: 'Export polished look-book photos' },
            { label: 'Share via WhatsApp instantly' },
          ]} />
        </div>
        <StepDots active="03" light />
      </FlowSection>

    </div>
  );
}
