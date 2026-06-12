'use client';

import { useRef, useState, useEffect } from 'react';
import { openTrialModal } from '@/lib/openTrialModal';
import { PRICING, Currency, countryToCurrency, fmtPrice } from '@/lib/pricing';
import ExternalPlanCards from './PlanCards';

export type BillingCycle = 'monthly' | 'annual';

/* ─── Currency Selector ──────────────────────────────────────────────────── */
const CURRENCY_ORDER: Currency[] = ['SGD', 'INR', 'AED', 'USD'];

function CountrySelector({ currency, onChange }: { currency: Currency; onChange: (c: Currency) => void }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value as Currency)}
        style={{
          appearance: 'none', background: '#fff', border: '1px solid #e4e4e7',
          borderRadius: 999, padding: '6px 28px 6px 12px',
          fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
          color: '#3f3f46', cursor: 'pointer', outline: 'none',
        }}
      >
        {CURRENCY_ORDER.map((c) => (
          <option key={c} value={c}>{PRICING[c].flag}  {PRICING[c].label}</option>
        ))}
      </select>
      <span style={{ pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa', fontSize: 10 }}>▾</span>
    </div>
  );
}

/* ─── Billing Toggle ─────────────────────────────────────────────────────── */
function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: '#f4f4f5', borderRadius: 999, padding: 4,
      fontFamily: 'var(--font-inter)', gap: 2,
    }}>
      <button
        onClick={() => onChange(false)}
        style={{
          fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '7px 18px',
          borderRadius: 999, border: 'none', transition: 'all 0.18s',
          background: !yearly ? '#ffffff' : 'transparent',
          color: !yearly ? '#09090b' : '#71717a',
          boxShadow: !yearly ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
        }}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(true)}
        style={{
          fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '7px 18px',
          borderRadius: 999, border: 'none', transition: 'all 0.18s',
          display: 'flex', alignItems: 'center', gap: 6,
          background: yearly ? '#09090b' : 'transparent',
          color: yearly ? '#ffffff' : '#71717a',
          boxShadow: yearly ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        Yearly
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
          background: yearly ? 'rgba(255,255,255,0.18)' : '#e4e4e7',
          color: yearly ? '#ffffff' : '#71717a',
        }}>
          2 months free
        </span>
      </button>
    </div>
  );
}

/* ─── Top-Up Packs ───────────────────────────────────────────────────────── */
function TopupPacksSection({ currency }: { currency: Currency }) {
  const c = PRICING[currency];
  const PACKS = [
    { key: 'fifty' as const, credits: 50, tryOns: '~25 try-ons' },
    { key: 'hundred' as const, credits: 100, tryOns: '~50 try-ons' },
    { key: 'twoHundred' as const, credits: 200, tryOns: '~100 try-ons' },
    { key: 'fiveHundred' as const, credits: 500, tryOns: '~250 try-ons' },
  ];

  return (
    <div style={{ padding: '64px 24px', borderTop: '1px solid #f4f4f5' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            Top-Up Anytime
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 700, color: '#09090b', marginBottom: 8 }}>
            Credit Top-Up Packs
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#71717a', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
            Running low mid-month? Add credits instantly — they never expire and work alongside any subscription.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PACKS.map((pack) => (
            <div
              key={pack.key}
              style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                {pack.credits} Credits
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 22, fontWeight: 800, color: '#09090b', marginBottom: 2 }}>
                {fmtPrice(c.topupPacks[pack.key], currency)}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a1a1aa', marginBottom: 14 }}>
                {pack.tryOns} · never expire
              </p>
              <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: 8, padding: '8px 12px', marginBottom: 14, flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#3f3f46' }}>{c.rates.paygStarter} / try-on</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a1a1aa', marginTop: 2 }}>Works on all plans</p>
              </div>
              <button
                onClick={openTrialModal}
                style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: '#09090b', background: 'transparent', border: '1px solid #e4e4e7', borderRadius: 10, padding: '10px 0', cursor: 'pointer', width: '100%' }}
              >
                Request Access
              </button>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a1a1aa', textAlign: 'center', marginTop: 20 }}>
          Top-up credits stack with subscription credits · Never expire · Instant activation
        </p>
      </div>
    </div>
  );
}

/* ─── Good to Know ───────────────────────────────────────────────────────── */
const RULES = [
  { icon: '↻', title: 'Credits reset on billing date', body: 'Your credits reset on the same day you subscribed — not the 1st of the month.' },
  { icon: '✕', title: "Unused credits don't roll over", body: 'Subscription credits expire at reset. Top-up pack credits never expire.' },
  { icon: '★', title: 'Credits on approval', body: 'We review every account and allocate starter credits personally. Reach out to get started.' },
];

function FooterSection() {
  return (
    <div style={{ padding: '64px 24px', background: '#ffffff', borderTop: '1px solid #f4f4f5' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: '#09090b', marginBottom: 8 }}>Good to know</h2>
        <div style={{ width: 32, height: 1, background: '#e4e4e7', margin: '0 auto 36px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
          {RULES.map((rule) => (
            <div key={rule.title} style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 20, textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 18, color: '#d4d4d8', display: 'block', marginBottom: 10 }}>{rule.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#09090b', marginBottom: 6 }}>{rule.title}</h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#71717a', lineHeight: 1.6 }}>{rule.body}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a1a1aa' }}>
          Questions?{' '}
          <a href="https://wa.me/919884744296?text=Hi%2C%20I%20have%20a%20question%20about%20TrialRoomStudio%20pricing" target="_blank" rel="noopener noreferrer" style={{ color: '#71717a', textDecoration: 'underline' }}>Chat with us on WhatsApp</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function PricingPageClient() {
  const [yearly, setYearly] = useState(false);
  const [currency, setCurrency] = useState<Currency>('SGD');

  useEffect(() => {
    const raw = localStorage.getItem('ff_currency');
    if (raw && raw in PRICING) { setCurrency(raw as Currency); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { country_code?: string }) => {
        const c = countryToCurrency(data.country_code ?? '');
        setCurrency(c);
        localStorage.setItem('ff_currency', c);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { controller.abort(); clearTimeout(timer); };
  }, []);

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('ff_currency', c);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Free Trial Banner */}
      <div style={{ background: '#09090b', padding: '14px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
          Not sure yet? Start with <strong style={{ color: '#ffffff' }}>a free demo try-on</strong> — no payment needed.
        </p>
        <button
          onClick={openTrialModal}
          style={{
            fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700,
            color: '#09090b', background: '#ffffff',
            border: 'none', borderRadius: 8, padding: '7px 18px',
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          Request Free Trial →
        </button>
      </div>

      {/* Hero */}
      <div style={{ paddingTop: 80, paddingBottom: 48, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
          Pricing
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: '#09090b', marginBottom: 14, lineHeight: 1.1 }}>
          Simple, transparent pricing
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <BillingToggle yearly={yearly} onChange={setYearly} />
          <div style={{ width: 1, height: 20, background: '#e4e4e7' }} />
          <CountrySelector currency={currency} onChange={handleCurrencyChange} />
        </div>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#a1a1aa', marginTop: 10 }}>
          All prices in {PRICING[currency].label}
        </p>
      </div>

      {/* Plan Cards */}
      <div style={{ paddingBottom: 32 }}>
        <ExternalPlanCards billing={yearly ? 'annual' : 'monthly'} currency={currency} />
      </div>

      {/* Top-Up Packs — temporarily hidden */}
      {/* <TopupPacksSection currency={currency} /> */}

      {/* Enterprise CTA */}
      <div style={{ padding: '64px 24px', borderTop: '1px solid #f4f4f5', background: '#ffffff', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Enterprise</p>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, color: '#09090b', marginBottom: 10 }}>
          Want it curated for your business?
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#71717a', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Custom credits, white-label branding, dedicated onboarding, and priority support.
        </p>
        <a
          href="/contact"
          style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: '#fff', background: '#09090b', borderRadius: 10, padding: '12px 32px', textDecoration: 'none', display: 'inline-block' }}
        >
          Contact Us →
        </a>
      </div>

      <FooterSection />
    </div>
  );
}
