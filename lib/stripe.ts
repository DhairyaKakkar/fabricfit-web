import Stripe from 'stripe';

let _stripe: Stripe | null = null;
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    });
  }
  return _stripe;
}

// Price IDs are read from env vars so test and live switch automatically with
// the key (test prices are invisible to a live key and vice-versa). The
// fallbacks are the existing TEST-mode price IDs, so local dev keeps working
// with no extra config. For production/live, set these in Vercel:
//   STRIPE_PRICE_STARTER_MONTHLY,  STRIPE_PRICE_STARTER_ANNUAL,
//   STRIPE_PRICE_PRO_MONTHLY,      STRIPE_PRICE_PRO_ANNUAL,
//   STRIPE_PRICE_BUSINESS_MONTHLY, STRIPE_PRICE_BUSINESS_ANNUAL
export const STRIPE_PRICES: Record<string, { monthly: string; annual: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? 'price_1Tbk6aK1j9pWNOxzH8SpOEzF', // S$40/mo
    annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL  ?? 'price_1Tbk6xK1j9pWNOxziGCqLjtp', // S$400/yr
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? 'price_1Tbk7XK1j9pWNOxz6nBduUTM', // S$72/mo
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL  ?? 'price_1Tbk7lK1j9pWNOxzSks5xir9', // S$720/yr
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? 'price_1Tbk89K1j9pWNOxzmCn2h3Qm', // S$160/mo
    annual:  process.env.STRIPE_PRICE_BUSINESS_ANNUAL  ?? 'price_1Tbk8RK1j9pWNOxzgIcfrAQi', // S$1600/yr
  },
};
