# Currency Selector — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add IP-based country detection and a manual currency dropdown to the pricing page, with locally-set prices in SGD, INR, AED, and USD across all pricing sections.

**Architecture:** A typed `PRICING` record in `lib/pricing.ts` is the single source of truth for all prices across 4 currencies. `PricingPageClient` (the single-file pricing page at `components/pricing/PricingPageClient.tsx`) gains a `currency` state, detects location via `ipapi.co` on mount, caches the result in `localStorage`, and passes `currency` down to inline sub-components: `PlanCard`, `CreditPacksSection`, `AddOnsSection`, and `ComparisonSection`. A new inline `CountrySelector` component renders below `BillingToggle`.

**Tech Stack:** Next.js App Router, TypeScript, `@number-flow/react` (already installed), Framer Motion, `ipapi.co` (no API key, 1,000 req/day free), `localStorage`.

---

## Task 1: Create `lib/pricing.ts`

**Files:**
- Create: `lib/pricing.ts`

**Step 1: Write the file**

```typescript
export type Currency = 'SGD' | 'INR' | 'AED' | 'USD';

export interface PlanPricing {
  monthly: number;
  annual: number;
  effectiveMonthly: number;
}

export interface CurrencyConfig {
  symbol: string;
  flag: string;
  label: string;
  plans: {
    starter: PlanPricing;
    pro: PlanPricing;
    business: PlanPricing;
  };
  packs: {
    small: number;
    standard: number;
    large: number;
  };
  rates: {
    paygStarter: string;
    pro: string;
    business: string;
  };
  addons: {
    watermark: string;
    topupFrom: string;
  };
}

export const PRICING: Record<Currency, CurrencyConfig> = {
  SGD: {
    symbol: 'S$',
    flag: '🇸🇬',
    label: 'SGD',
    plans: {
      starter: { monthly: 40, annual: 400, effectiveMonthly: 34 },
      pro: { monthly: 72, annual: 720, effectiveMonthly: 60 },
      business: { monthly: 160, annual: 1600, effectiveMonthly: 134 },
    },
    packs: { small: 8, standard: 20, large: 50 },
    rates: { paygStarter: 'S$0.40', pro: 'S$0.36', business: 'S$0.32' },
    addons: { watermark: 'S$8 / month', topupFrom: 'From S$8' },
  },
  INR: {
    symbol: '₹',
    flag: '🇮🇳',
    label: 'INR',
    plans: {
      starter: { monthly: 2500, annual: 25000, effectiveMonthly: 2083 },
      pro: { monthly: 4500, annual: 45000, effectiveMonthly: 3750 },
      business: { monthly: 10000, annual: 100000, effectiveMonthly: 8333 },
    },
    packs: { small: 500, standard: 1250, large: 3125 },
    rates: { paygStarter: '₹25', pro: '₹22.50', business: '₹20' },
    addons: { watermark: '₹499 / month', topupFrom: 'From ₹500' },
  },
  AED: {
    symbol: 'AED',
    flag: '🇦🇪',
    label: 'AED',
    plans: {
      starter: { monthly: 109, annual: 1090, effectiveMonthly: 91 },
      pro: { monthly: 192, annual: 1920, effectiveMonthly: 160 },
      business: { monthly: 425, annual: 4250, effectiveMonthly: 354 },
    },
    packs: { small: 22, standard: 55, large: 139 },
    rates: { paygStarter: 'AED 1.10', pro: 'AED 0.96', business: 'AED 0.85' },
    addons: { watermark: 'AED 22 / month', topupFrom: 'From AED 22' },
  },
  USD: {
    symbol: '$',
    flag: '🇺🇸',
    label: 'USD',
    plans: {
      starter: { monthly: 29, annual: 290, effectiveMonthly: 24 },
      pro: { monthly: 52, annual: 520, effectiveMonthly: 43 },
      business: { monthly: 115, annual: 1150, effectiveMonthly: 96 },
    },
    packs: { small: 6, standard: 15, large: 38 },
    rates: { paygStarter: '$0.30', pro: '$0.26', business: '$0.23' },
    addons: { watermark: '$6 / month', topupFrom: 'From $6' },
  },
};

/** country_code → Currency (defaults to USD for unlisted countries) */
export function countryToCurrency(code: string): Currency {
  const MAP: Record<string, Currency> = { SG: 'SGD', IN: 'INR', AE: 'AED' };
  return MAP[code] ?? 'USD';
}

/** Format a number with the correct currency prefix, no decimals */
export function fmtPrice(amount: number, currency: Currency): string {
  const n = amount.toLocaleString('en-US');
  if (currency === 'AED') return `AED ${n}`;
  return `${PRICING[currency].symbol}${n}`;
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd /Users/visheshjain/Desktop/fabricfit-web && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors from `lib/pricing.ts`.

**Step 3: Commit**

```bash
git add lib/pricing.ts
git commit -m "feat: add multi-currency pricing data for SGD, INR, AED, USD"
```

---

## Task 2: Add `CountrySelector` component and currency state to `PricingPageClient`

**Files:**
- Modify: `components/pricing/PricingPageClient.tsx`

**Context:** The file currently has `const [yearly, setYearly] = useState(false)` as the only state. The `BillingToggle` is rendered inside a `<motion.div>` near the bottom of the hero text block (around line 567). The "All prices in SGD" note is at line ~582.

**Step 1: Add imports and types at the top of the file**

After the existing imports (line 5, after `import NumberFlow from '@number-flow/react'`), add:

```typescript
import { PRICING, Currency, countryToCurrency, fmtPrice } from '@/lib/pricing';
```

**Step 2: Add `CountrySelector` inline component** (add before the `/* ─── Toggle ─────` comment, around line 152)

```typescript
/* ─── Country Selector ───────────────────────────────────────────────────── */
const CURRENCY_ORDER: Currency[] = ['SGD', 'INR', 'AED', 'USD'];

function CountrySelector({ currency, onChange }: { currency: Currency; onChange: (c: Currency) => void }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value as Currency)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 100,
          padding: '7px 32px 7px 14px',
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          fontWeight: 500,
          color: '#d97706',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {CURRENCY_ORDER.map((c) => (
          <option key={c} value={c} style={{ background: '#1a1a1a', color: '#fef9f0' }}>
            {PRICING[c].flag}  {PRICING[c].label}
          </option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#d97706', fontSize: 10, pointerEvents: 'none' }}>
        ▾
      </span>
    </div>
  );
}
```

**Step 3: Add `currency` state and geolocation `useEffect` inside `PricingPageClient`**

Inside the `export default function PricingPageClient()` body, after `const [yearly, setYearly] = useState(false);`, add:

```typescript
const [currency, setCurrency] = useState<Currency>('SGD');

useEffect(() => {
  const cached = localStorage.getItem('ff_currency') as Currency | null;
  if (cached && PRICING[cached]) {
    setCurrency(cached);
    return;
  }
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
}, []);

const handleCurrencyChange = (c: Currency) => {
  setCurrency(c);
  localStorage.setItem('ff_currency', c);
};
```

**Step 4: Add `CountrySelector` below `BillingToggle` in the hero section**

Find the motion.div wrapping `<BillingToggle />` (around line 567):

```tsx
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}>
  <BillingToggle yearly={yearly} onChange={setYearly} />
</motion.div>
```

Replace with:

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.65 }}
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
>
  <BillingToggle yearly={yearly} onChange={setYearly} />
  <CountrySelector currency={currency} onChange={handleCurrencyChange} />
</motion.div>
```

**Step 5: Update the bottom "All prices in SGD" note**

Find (around line 582):
```tsx
<p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e' }}>
  All prices in SGD · 40 free credits on signup · no card required
</p>
```

Replace with:
```tsx
<p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e' }}>
  All prices in {PRICING[currency].label} · 40 free credits on signup · no card required
</p>
```

**Step 6: Pass `currency` to all section components**

Find the section renders at the bottom of the main return (around line 585):
```tsx
<CreditPacksSection />
<AddOnsSection />
<ComparisonSection yearly={yearly} />
```

Replace with:
```tsx
<CreditPacksSection currency={currency} />
<AddOnsSection currency={currency} />
<ComparisonSection yearly={yearly} currency={currency} />
```

**Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -40
```
Expected: errors about `currency` prop not accepted yet by the section components (will fix in Tasks 3–5). Zero new errors from Task 2's additions.

**Step 8: Commit**

```bash
git add components/pricing/PricingPageClient.tsx
git commit -m "feat: add currency state, geolocation detection, and CountrySelector to pricing page"
```

---

## Task 3: Update `PlanCard` to use currency-aware pricing

**Files:**
- Modify: `components/pricing/PricingPageClient.tsx` (the `PLANS` constant and `PlanCard` component)

**Context:** `PLANS` is defined at the top of the file (lines 10–91) with hardcoded SGD prices (`monthly`, `yearly`, `packFrom`, `rate`). `PlanCard` renders at line ~191 and references `plan.monthly`, `plan.yearly`, `plan.packFrom`, `plan.rate`.

**Step 1: Replace `PLANS` with `PLAN_META` (no prices)**

Replace the entire `const PLANS = [...]` block with:

```typescript
const PLAN_META = [
  {
    id: 'payg' as const,
    name: 'Pay As You Go',
    description: 'No commitment. Buy credits when you need them — they never expire.',
    credits: 'Pack-based credits',
    tryOns: 'Pack-based',
    popular: false,
    features: [
      'Branches: 1',
      'Session-only storage',
      'Try-on history: 15 days',
      'Watermark: always on',
      'No catalogue exports',
      'No support',
    ],
  },
  {
    id: 'starter' as const,
    name: 'Starter',
    description: 'For small showrooms getting started with virtual try-on.',
    credits: '200 credits / month',
    tryOns: '60–80 try-ons',
    popular: false,
    features: [
      'Branches: 1',
      '200 items storage',
      'Try-on history: 30 days',
      'Watermark removable',
      '10 catalogue exports / mo',
      'Email support',
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    description: 'For growing showrooms managing multiple branches.',
    credits: '400 credits / month',
    tryOns: '120–160 try-ons',
    popular: true,
    features: [
      'Branches: up to 3',
      '500 items storage',
      'Try-on history: 90 days',
      'Watermark removed',
      '50 catalogue exports / mo',
      'Priority email support',
    ],
  },
  {
    id: 'business' as const,
    name: 'Business',
    description: 'For enterprise retailers with unlimited scale and analytics.',
    credits: '1,000 credits / month',
    tryOns: '300–400 try-ons',
    popular: false,
    features: [
      'Branches: unlimited',
      'Unlimited storage',
      'Try-on history: 1 year',
      'Watermark removed',
      '100 catalogue exports / mo',
      'Dedicated manager',
    ],
  },
];

type PlanId = typeof PLAN_META[number]['id'];
```

**Step 2: Rewrite `PlanCard` to accept `currency` and derive prices**

Replace the `PlanCard` function signature and price-rendering block:

```typescript
function PlanCard({ plan, yearly, currency, index }: { plan: typeof PLAN_META[0]; yearly: boolean; currency: Currency; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const c = PRICING[currency];
  const isPayg = plan.id === 'payg';
  const planPricing = !isPayg ? c.plans[plan.id as Exclude<PlanId, 'payg'>] : null;
  const price = planPricing ? (yearly ? planPricing.effectiveMonthly : planPricing.monthly) : null;
  const packFrom = isPayg ? c.packs.small : null;
  const rate = plan.id === 'pro' ? c.rates.pro : plan.id === 'business' ? c.rates.business : c.rates.paygStarter;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        background: plan.popular
          ? 'linear-gradient(135deg, #1c1208 0%, #2d1a08 50%, #1c1208 100%)'
          : 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        border: plan.popular ? '1.5px solid rgba(217,119,6,0.5)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: plan.popular ? '0 0 60px rgba(217,119,6,0.15), 0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {plan.popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <span style={{ background: 'linear-gradient(to right, #92400e, #d97706)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap', fontFamily: 'var(--font-inter)', letterSpacing: '0.06em' }}>
            MOST POPULAR
          </span>
        </div>
      )}

      <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', fontWeight: 700, color: plan.popular ? '#fef3c7' : '#e7e5e4', marginBottom: 6 }}>
        {plan.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', lineHeight: 1.6, marginBottom: 20 }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        {isPayg ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', marginRight: 2 }}>from {c.symbol}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2.2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                <NumberFlow key={currency} value={packFrom!} />
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 4 }}>per credit pack · never expire</p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', marginRight: 2 }}>{c.symbol}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '2.2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                <NumberFlow key={currency} value={price!} />
              </span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', marginLeft: 4 }}>/{yearly ? 'mo' : 'month'}</span>
            </div>
            {yearly && planPricing && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 4 }}>
                billed {fmtPrice(planPricing.annual, currency)} annually
              </p>
            )}
          </>
        )}
      </div>

      {/* Credits chip */}
      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>{plan.credits}</p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#92400e', marginTop: 2 }}>{plan.tryOns} · {rate} / try-on</p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }} />

      {/* Features */}
      <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 12, color: '#a8a29e' }}>
            <span style={{ color: '#d97706', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <motion.a
        href="#"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 0',
          borderRadius: 12,
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          background: plan.popular ? 'linear-gradient(to top, #92400e, #d97706)' : 'transparent',
          color: plan.popular ? '#fff' : '#d97706',
          border: plan.popular ? 'none' : '1px solid rgba(217,119,6,0.4)',
          boxShadow: plan.popular ? '0 4px 20px rgba(217,119,6,0.3)' : 'none',
          cursor: 'none',
        }}
      >
        Get Started →
      </motion.a>
    </motion.div>
  );
}
```

**Step 3: Update the cards render loop** (in main `PricingPageClient` return, around line 573)

Find:
```tsx
{PLANS.map((plan, i) => (
  <PlanCard key={plan.id} plan={plan} yearly={yearly} index={i} />
))}
```

Replace with:
```tsx
{PLAN_META.map((plan, i) => (
  <PlanCard key={plan.id} plan={plan} yearly={yearly} currency={currency} index={i} />
))}
```

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

**Step 5: Commit**

```bash
git add components/pricing/PricingPageClient.tsx
git commit -m "feat: make plan cards currency-aware"
```

---

## Task 4: Update `CreditPacksSection` to use currency-aware pricing

**Files:**
- Modify: `components/pricing/PricingPageClient.tsx` (the `PACKS` constant and `CreditPacksSection` component)

**Context:** `PACKS` is defined at line ~308 with hardcoded SGD prices. `CreditPacksSection` renders at line ~314 and shows `S${pack.price}` hardcoded.

**Step 1: Remove the `PACKS` constant**

Delete the entire `const PACKS = [...]` block (lines ~308–312).

**Step 2: Update `CreditPacksSection` to accept `currency` and derive prices**

Change the function signature and pack data:

```typescript
function CreditPacksSection({ currency }: { currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];
  const packs = [
    { name: 'Small', credits: 40, price: c.packs.small, tryOns: '~20 fast try-ons' },
    { name: 'Standard', credits: 100, price: c.packs.standard, tryOns: '~50 fast try-ons' },
    { name: 'Large', credits: 250, price: c.packs.large, tryOns: '~125 fast try-ons' },
  ];

  return (
    <div ref={ref} style={{ background: '#111', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>No Subscription Needed</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Credit Packs</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto 12px', borderRadius: 2 }} />
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#78716c', maxWidth: 480, margin: '0 auto' }}>
            Buy credits à la carte. They never expire. Subscribers can also top up at the same rate when they run low.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 680, margin: '0 auto' }}>
          {packs.map((pack, i) => (
            <motion.div key={pack.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(245,158,11,0.1)' }}
              style={{ background: '#1a1a1a', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{pack.name}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '2rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                {fmtPrice(pack.price, currency)}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#57534e', marginTop: 4 }}>{pack.credits} credits</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#78716c', marginTop: 2, marginBottom: 16 }}>{pack.tryOns}</p>
              <motion.a href="#" whileHover={{ scale: 1.03 }} style={{ display: 'block', padding: '10px 0', borderRadius: 10, border: '1px solid rgba(217,119,6,0.35)', color: '#d97706', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Buy Pack
              </motion.a>
            </motion.div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', marginTop: 24 }}>
          Pack credits never expire · 15-day history · FabricFit watermark · no catalogue exports
        </p>
      </div>
    </div>
  );
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

**Step 4: Commit**

```bash
git add components/pricing/PricingPageClient.tsx
git commit -m "feat: make credit packs section currency-aware"
```

---

## Task 5: Update `AddOnsSection` to use currency-aware pricing

**Files:**
- Modify: `components/pricing/PricingPageClient.tsx` (the `ADDONS` constant and `AddOnsSection` component)

**Context:** `ADDONS` is defined at line ~356 with hardcoded `'S$8 / month'` and `'From S$8'` price strings.

**Step 1: Remove the `ADDONS` constant**

Delete the entire `const ADDONS = [...]` block.

**Step 2: Update `AddOnsSection` to accept `currency` and derive prices**

```typescript
function AddOnsSection({ currency }: { currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];
  const addons = [
    { icon: '✦', name: 'Remove Watermark', desc: 'Strip the FabricFit watermark from all future try-on results. Starter plan only.', price: c.addons.watermark, badge: 'Starter only' },
    { icon: '⚡', name: 'Credit Top-Up', desc: 'Buy extra credits at PAYG rate mid-month. Top-up credits never expire.', price: c.addons.topupFrom, badge: 'All plans' },
  ];

  return (
    <div ref={ref} style={{ background: '#0d0d0d', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Extras</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Add-Ons</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {addons.map((addon, i) => (
            <motion.div key={addon.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: 20, flexShrink: 0, marginTop: 2 }}>{addon.icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, color: '#fef9f0', marginBottom: 6 }}>{addon.name}</h3>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', lineHeight: 1.6, marginBottom: 14 }}>{addon.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>{addon.price}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#57534e', background: '#222', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '3px 10px' }}>{addon.badge}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

**Step 4: Commit**

```bash
git add components/pricing/PricingPageClient.tsx
git commit -m "feat: make add-ons section currency-aware"
```

---

## Task 6: Update `ComparisonSection` to use currency-aware pricing

**Files:**
- Modify: `components/pricing/PricingPageClient.tsx` (the `TABLE_GROUPS` constant and `ComparisonSection` component)

**Context:** `TABLE_GROUPS` has hardcoded `'S$0.40'` rates at line ~404. `ComparisonSection` has hardcoded price arrays at line ~426.

**Step 1: Delete the `TABLE_GROUPS` constant**

Remove the entire `const TABLE_GROUPS = [...]` block.

**Step 2: Rewrite `ComparisonSection` to accept `currency`**

```typescript
function ComparisonSection({ yearly, currency }: { yearly: boolean; currency: Currency }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const c = PRICING[currency];

  const tableGroups = [
    { heading: 'Credits & Try-Ons', rows: [
      { label: 'Credits', values: ['Packs (no expiry)', '200 / month', '400 / month', '1,000 / month'] },
      { label: 'Fast try-ons (approx)', values: ['Pack-based', '60–80', '120–160', '300–400'] },
      { label: 'Effective rate / try-on', values: [c.rates.paygStarter, c.rates.paygStarter, c.rates.pro, c.rates.business] },
    ]},
    { heading: 'Branches & Access', rows: [
      { label: 'Branches', values: ['1', '1', 'Up to 3', 'Unlimited'] },
      { label: 'Branch credit allocation', values: ['—', '—', '✓', '✓'] },
    ]},
    { heading: 'Exports & Storage', rows: [
      { label: 'Catalogue exports / month', values: ['None', '10', '50', '100'] },
      { label: 'Storage', values: ['Session only', '200 items', '500 items', 'Unlimited'] },
      { label: 'Try-on history', values: ['15 days', '30 days', '90 days', '1 year'] },
    ]},
    { heading: 'Appearance', rows: [
      { label: 'Watermark', values: ['Always on', 'Removable', 'Removed', 'Removed'] },
    ]},
    { heading: 'Support', rows: [
      { label: 'Support tier', values: ['None', 'Email', 'Priority email', 'Dedicated manager'] },
    ]},
  ];

  const fmt = (n: number) => fmtPrice(n, currency);
  const prices = yearly
    ? [c.addons.topupFrom, `${fmt(c.plans.starter.effectiveMonthly)}/mo`, `${fmt(c.plans.pro.effectiveMonthly)}/mo`, `${fmt(c.plans.business.effectiveMonthly)}/mo`]
    : [c.addons.topupFrom, `${fmt(c.plans.starter.monthly)}/mo`, `${fmt(c.plans.pro.monthly)}/mo`, `${fmt(c.plans.business.monthly)}/mo`];

  return (
    <div ref={ref} style={{ background: '#111', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#d97706', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Compare</span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fef9f0', marginTop: 8, marginBottom: 8 }}>Full Feature Comparison</h2>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #f59e0b, #92400e)', margin: '0 auto', borderRadius: 2 }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c', fontWeight: 500, minWidth: 160 }}>Feature</th>
                {['PAYG', 'Starter', 'Pro', 'Business'].map((n, i) => (
                  <th key={n} style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'var(--font-playfair)', fontSize: 14, fontWeight: 700, color: i === 2 ? '#f59e0b' : '#e7e5e4', minWidth: 110 }}>
                    {n}{i === 2 && <span style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: 10, color: '#d97706', fontWeight: 400, fontStyle: 'normal', marginTop: 2 }}>Popular</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableGroups.map((group) => (
                <>
                  <tr key={group.heading} style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td colSpan={5} style={{ padding: '8px 20px', fontFamily: 'var(--font-inter)', fontSize: 10, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{group.heading}</td>
                  </tr>
                  {group.rows.map((row, ri) => (
                    <tr key={row.label} style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: ri % 2 === 0 ? '#111' : '#0f0f0f' }}>
                      <td style={{ padding: '12px 20px', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#78716c' }}>{row.label}</td>
                      {row.values.map((val, ci) => (
                        <td key={ci} style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 12, color: ci === 2 ? '#f59e0b' : val === '—' || val === 'None' ? '#3a3a3a' : '#a8a29e', fontWeight: ci === 2 ? 600 : 400 }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
              <tr style={{ borderTop: '2px solid rgba(245,158,11,0.2)', background: '#1a1a1a' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#d97706', fontWeight: 600 }}>Price</td>
                {prices.map((p, i) => (
                  <td key={i} style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, color: i === 2 ? '#f59e0b' : '#a8a29e' }}>{p}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add components/pricing/PricingPageClient.tsx
git commit -m "feat: make comparison table currency-aware"
```

---

## Task 7: Full build verification

**Step 1: Run production build**

```bash
npm run build 2>&1 | tail -30
```
Expected: exits with code 0, no TypeScript or React errors.

**Step 2: Spot-check in dev**

```bash
npm run dev
```

Open `http://localhost:3000/pricing` and verify:
- Country selector appears below the billing toggle
- Switching to INR shows ₹2,500 / ₹4,500 / ₹10,000 on plan cards
- Switching to AED shows AED 109 / AED 192 / AED 425
- Switching to USD shows $29 / $52 / $115
- Credit packs update accordingly
- Add-on prices update
- Comparison table rates update
- Billing toggle still works (monthly ↔ annual) independently of currency
- The "All prices in X" note at the bottom updates

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: add currency selector with IP geolocation to pricing page"
```
