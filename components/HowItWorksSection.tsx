'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface FlowSectionProps {
  children: React.ReactNode;
  bg?: string;
  index: number;
  isMobile?: boolean;
  'aria-label'?: string;
}

function FlowSection({ children, bg = '#09090b', index, isMobile = false, 'aria-label': ariaLabel }: FlowSectionProps) {
  // Mobile: one full screen per feature — text on top, image fills the rest.
  if (isMobile) {
    return (
      <section
        aria-label={ariaLabel}
        className="relative w-full flex flex-col"
        style={{ background: bg, padding: '88px 20px 0', minHeight: '100svh', overflow: 'hidden' }}
      >
        {children}
      </section>
    );
  }
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: index + 1, height: '100dvh', overflow: 'hidden' }}>
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

function UseCaseChips({ chips, light = false, isMobile = false }: { chips: { label: string }[]; light?: boolean; isMobile?: boolean }) {
  const dotClr  = light ? 'rgba(0,0,0,0.3)'   : 'rgba(255,255,255,0.3)';
  const textClr = light ? 'rgba(0,0,0,0.65)'  : 'rgba(255,255,255,0.7)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 16, marginTop: isMobile ? 12 : 32 }}>
      {chips.map((c) => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotClr, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? 15 : 20, fontWeight: 500, color: textClr, letterSpacing: '-0.01em' }}>{c.label}</span>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const textStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column',
    gap: isMobile ? '0.75rem' : '1.5rem',
    position: 'relative', zIndex: 2,
    maxWidth: isMobile ? '100%' : '44%',
  };

  const headingSize = isMobile ? '2.4rem' : 'clamp(2.8rem, 4.5vw, 6rem)';
  // Mobile: image bleeds edge-to-edge and grows to fill the rest of the screen
  const imageStyle: React.CSSProperties = isMobile
    ? { position: 'relative', flex: 1, minHeight: 320, margin: '24px -20px 0', zIndex: 1, pointerEvents: 'none' }
    : { position: 'absolute', bottom: 0, right: 0, width: '68%', zIndex: 1, pointerEvents: 'none' };

  const FeatureImg = ({ src, alt }: { src: string; alt: string }) =>
    isMobile ? (
      <Image src={src} alt={alt} fill loading="lazy" style={{ objectFit: 'cover', objectPosition: 'center bottom' }} />
    ) : (
      <Image src={src} alt={alt} width={1400} height={1400} loading="lazy" className="w-full h-auto" style={{ display: 'block', objectFit: 'contain', objectPosition: 'bottom right' }} />
    );

  return (
    <div id="features" className="w-full">

      <FlowSection index={0} isMobile={isMobile} aria-label="Feature 1: Virtual Try-On for stores" bg="#F6F5F0">
        <div style={textStyle}>
          <StepLabel num="01" light />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: headingSize, fontWeight: 700, color: '#09090b', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: isMobile ? '0.5rem' : '1.2rem' }}>
              Virtual Try-On.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '0.8rem' : 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(0,0,0,0.56)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              Right in your store — no setup required.
            </p>
          </div>
          <UseCaseChips isMobile={isMobile} light chips={[
            { label: 'Snap a photo in-store' },
            { label: 'Result in 15–20 seconds' },
            { label: 'Zero alteration guesswork' },
          ]} />
        </div>
        <div style={imageStyle}>
          <FeatureImg src="/features1.png" alt="Virtual try-on in store" />
        </div>
        {!isMobile && <StepDots active="01" light />}
      </FlowSection>

      <FlowSection index={1} isMobile={isMobile} aria-label="Feature 2: Web embed for Shopify and WooCommerce" bg="#111314">
        <div style={textStyle}>
          <StepLabel num="02" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: headingSize, fontWeight: 700, color: '#ffffff', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: isMobile ? '0.5rem' : '1.2rem' }}>
              Embed anywhere.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '0.8rem' : 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              One line of code — Shopify, WooCommerce, any site.
            </p>
          </div>
          <UseCaseChips isMobile={isMobile} chips={[
            { label: 'Add to Shopify in 5 min' },
            { label: 'Any website, any platform' },
            { label: 'Mobile-ready, no app needed' },
          ]} />
        </div>
        <div style={imageStyle}>
          <FeatureImg src="/features2.png" alt="Web embed virtual try-on" />
        </div>
        {!isMobile && <StepDots active="02" />}
      </FlowSection>

      <FlowSection index={2} isMobile={isMobile} aria-label="Feature 3: Create a high-polished catalogue" bg="#F6F5F0">
        <div style={textStyle}>
          <StepLabel num="03" light />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: headingSize, fontWeight: 700, color: '#09090b', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: isMobile ? '0.5rem' : '1.2rem' }}>
              Build your catalogue.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: isMobile ? '0.8rem' : 'clamp(0.85rem, 1.2vw, 1rem)', color: 'rgba(0,0,0,0.56)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
              No shoot. No agency. Export same day.
            </p>
          </div>
          <UseCaseChips isMobile={isMobile} light chips={[
            { label: 'Upload fabric — AI generates the look' },
            { label: 'Catalogue-ready photos, no shoot needed' },
            { label: 'Share directly with clients via WhatsApp' },
          ]} />
        </div>
        <div style={imageStyle}>
          <FeatureImg src="/features3.png" alt="Catalogue builder" />
        </div>
        {!isMobile && <StepDots active="03" light />}
      </FlowSection>

    </div>
  );
}
