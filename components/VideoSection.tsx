'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';

const WORDS = ['The', 'future', 'of', 'fabric'];

const STAT_PILLS = [
  { value: '30s', label: 'Try-on time' },
  { value: '50+', label: 'Looks/session' },
  { value: '0', label: 'Extra hardware' },
];

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true });
  const [expanded, setExpanded] = useState(false);

  // Trigger expansion shortly after section mounts in view
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setExpanded(true), 250);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ height: '100vh', position: 'relative', backgroundColor: '#faf9f6', overflow: 'hidden' }}
    >
      {/* Ambient blobs */}
      <div className="blob-1" aria-hidden="true" />
      <div className="blob-2" aria-hidden="true" />
      <div className="blob-3" aria-hidden="true" />

      {/* Video card — starts inset, expands to full-bleed on load */}
      <motion.div
        animate={{
          top:          expanded ? 0 : 32,
          left:         expanded ? 0 : 32,
          right:        expanded ? 0 : 32,
          bottom:       expanded ? 0 : 32,
          borderRadius: expanded ? 0 : 24,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', overflow: 'hidden', zIndex: 1 }}
      >
        <video
          src="/videos/hero-video.mp4"
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.38) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* Headline + subtitle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          textAlign: 'center',
          padding: '0 24px',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(48px, 6.5vw, 88px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            margin: 0,
            textShadow: '0 2px 40px rgba(0,0,0,0.45)',
          }}
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(4px)', y: 12 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.09, ease: 'easeOut' }}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
          {/* "retail." in amber gradient */}
          <motion.span
            initial={{ opacity: 0, filter: 'blur(4px)', y: 12 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 + WORDS.length * 0.09, ease: 'easeOut' }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #fcd34d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            retail.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.72)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          TrialRoomStudio · Powered by AI
        </motion.p>
      </div>

      {/* CTA buttons — desktop only */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          justifyContent: 'center',
          gap: 12,
          zIndex: 3,
        }}
      >
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 28px',
            borderRadius: 100,
            backgroundColor: '#25d366',
            color: '#ffffff',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(37,211,102,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>
        <a
          href="#see-it-live"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 28px',
            borderRadius: 100,
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.28)',
            color: '#ffffff',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          See It Live →
        </a>
      </motion.div>

      {/* Stat pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.7 }}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          bottom: 36,
          left: 0,
          right: 0,
          justifyContent: 'center',
          gap: 10,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {STAT_PILLS.map((pill) => (
          <div
            key={pill.value}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '10px 22px',
              borderRadius: 100,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {pill.value}
            </span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {pill.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          x: '-50%',
          zIndex: 3,
          color: 'rgba(255,255,255,0.4)',
          fontSize: 16,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ display: 'block' }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
