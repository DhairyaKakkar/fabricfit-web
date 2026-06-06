'use client';

import LiquidButton from '@/components/ui/LiquidButton';
import { openTrialModal } from '@/lib/openTrialModal';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919884744296';

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,53,15,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(146,64,14,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Top border glow */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(146,64,14,0.5), rgba(201,168,76,0.6), rgba(146,64,14,0.5), transparent)',
      }} />

      <div className="max-w-2xl mx-auto px-6 md:px-8 text-center relative">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-6" style={{
          fontFamily: 'var(--font-inter)',
          color: 'rgba(201,168,76,0.8)',
          letterSpacing: '0.22em',
          border: '1px solid rgba(201,168,76,0.2)',
          padding: '4px 16px', borderRadius: 999,
        }}>
          Request Access
        </span>

        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.05,
          marginBottom: '0.4rem',
          letterSpacing: '-0.02em',
        }}>
          Your customers deserve
        </h2>
        <p style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.05,
          marginBottom: '2rem',
          letterSpacing: '-0.02em',
        }}>
          to see it first.
        </p>

        <p className="text-sm leading-relaxed mb-10" style={{
          fontFamily: 'var(--font-inter)',
          color: 'rgba(255,255,255,0.45)',
          maxWidth: 440,
          margin: '0 auto 2.5rem',
          lineHeight: 1.8,
        }}>
          No setup. No contract. Book a live WhatsApp demo — we&apos;ll run a try-on with your own fabric photos in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <LiquidButton
            onClick={openTrialModal}
            color="#09090b"
            bg="rgba(255,255,255,0.95)"
            padding="16px 36px"
          >
            Request Access →
          </LiquidButton>
          <LiquidButton
            href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20TrialRoomStudio`}
            target="_blank"
            rel="noopener noreferrer"
            color="#ffffff"
            bg="#25D366"
            padding="16px 36px"
          >
            <WhatsAppIcon />
            Book a Demo
          </LiquidButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {['No contract', 'Works in-store', '2-min setup'].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(201,168,76,0.6)' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs" style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.18)' }}>
          Backed by Nanyang Technological University, Singapore
        </p>
      </div>
    </section>
  );
}
