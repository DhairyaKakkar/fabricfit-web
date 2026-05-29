# Currency Selector — Design Doc

**Date:** 2026-05-20  
**Status:** Approved

---

## 1. Goal

Add a country/currency selector to the pricing page that auto-detects the user's location on load and displays locally-priced plans, credit packs, and add-ons. Users can override the detected country manually.

---

## 2. Supported Currencies

| Country | Currency | Symbol | Detection (country_code) |
|---|---|---|---|
| Singapore | SGD | S$ | SG (default fallback) |
| India | INR | ₹ | IN |
| UAE | AED | AED | AE |
| USA + rest of world | USD | $ | US + all others |

---

## 3. Prices Per Currency

### Subscription Plans

| Plan | SGD/mo | INR/mo | USD/mo | AED/mo |
|---|---|---|---|---|
| Starter | S$40 | ₹2,500 | $29 | AED 109 |
| Pro | S$72 | ₹4,500 | $52 | AED 192 |
| Business | S$160 | ₹10,000 | $115 | AED 425 |

**Annual (2 months free — effective per month):**

| Plan | SGD | INR | USD | AED |
|---|---|---|---|---|
| Starter | S$34 | ₹2,083 | $24 | AED 91 |
| Pro | S$60 | ₹3,750 | $43 | AED 160 |
| Business | S$134 | ₹8,333 | $96 | AED 354 |

**Annual total (billed upfront):**

| Plan | SGD | INR | USD | AED |
|---|---|---|---|---|
| Starter | S$400 | ₹25,000 | $290 | AED 1,090 |
| Pro | S$720 | ₹45,000 | $520 | AED 1,920 |
| Business | S$1,600 | ₹1,00,000 | $1,150 | AED 4,250 |

### Credit Packs (PAYG)

| Pack | SGD | INR | USD | AED |
|---|---|---|---|---|
| Small (40 credits) | S$8 | ₹500 | $6 | AED 22 |
| Standard (100 credits) | S$20 | ₹1,250 | $15 | AED 55 |
| Large (250 credits) | S$50 | ₹3,125 | $38 | AED 139 |

### Effective per-try-on rates

| Plan | SGD | INR | USD | AED |
|---|---|---|---|---|
| PAYG / Starter | S$0.40 | ₹25 | $0.30 | AED 1.10 |
| Pro | S$0.36 | ₹22.50 | $0.26 | AED 0.96 |
| Business | S$0.32 | ₹20 | $0.23 | AED 0.85 |

### Add-Ons

| Add-On | SGD | INR | USD | AED |
|---|---|---|---|---|
| Remove Watermark (Starter) | S$8/mo | ₹499/mo | $6/mo | AED 22/mo |
| Credit Top-Up (from) | From S$8 | From ₹500 | From $6 | From AED 22 |

---

## 4. Architecture

### State ownership
`PricingPageClient` owns both `billing: BillingCycle` and `currency: Currency`. Both are passed as props to all sub-components.

### Geolocation (IP-based)
- On mount: `fetch('https://ipapi.co/json/')` → `country_code` field
- Map `IN → INR`, `SG → SGD`, `AE → AED`, all others → `USD`
- Write result to `localStorage('ff_currency')` to avoid repeat API calls on refresh
- Read `localStorage` first; only call API if no cached value
- Fallback to `SGD` on network error or unsupported country

### Manual override
- `CountrySelector` dropdown lets user change currency
- Selection persists to `localStorage`

### Data file
All price data lives in `lib/pricing.ts` as a typed constant. No prices hardcoded in components.

---

## 5. Components

### New: `lib/pricing.ts`
Exports `PRICING: Record<Currency, CurrencyConfig>` and `formatPrice(amount, currency)`.

### New: `components/pricing/CountrySelector.tsx`
Flag emoji + currency code selector (e.g. `🇸🇬 SGD`). Compact dropdown, positioned next to `BillingToggle` in a `flex` row.

### Modified: `PricingPageClient.tsx`
- Add `currency` state
- Add geolocation `useEffect` on mount
- Pass `currency` to all sub-components
- Render `CountrySelector` next to `BillingToggle`

### Modified: `PlanCards.tsx`
Accept `currency` prop; read plan prices from `PRICING[currency]`.

### Modified: `CreditPacks.tsx`
Accept `currency` prop; read pack prices from `PRICING[currency]`.

### Modified: `AddOns.tsx`
Accept `currency` prop; read add-on prices from `PRICING[currency]`.

### Modified: `ComparisonTable.tsx`
Accept `currency` prop; read prices and rates from `PRICING[currency]`.

---

## 6. UX Details

- Selector shows: `🇸🇬 SGD · 🇮🇳 INR · 🇦🇪 AED · 🇺🇸 USD`
- Detecting state: selector shows a subtle loading spinner until IP lookup resolves (max 2s timeout, then fallback to SGD)
- All price changes are instant (no animation needed — currency swap is a deliberate user action)
- INR prices are formatted without decimal (e.g. `₹2,500`) using `toLocaleString('en-IN')`
- AED prices are formatted as `AED 109` (prefix, no decimal)
- SGD/USD formatted as `S$40` / `$29`

---

## 7. Files Summary

| File | Action |
|---|---|
| `lib/pricing.ts` | Create |
| `components/pricing/CountrySelector.tsx` | Create |
| `components/pricing/PricingPageClient.tsx` | Modify |
| `components/pricing/PlanCards.tsx` | Modify |
| `components/pricing/CreditPacks.tsx` | Modify |
| `components/pricing/AddOns.tsx` | Modify |
| `components/pricing/ComparisonTable.tsx` | Modify |
