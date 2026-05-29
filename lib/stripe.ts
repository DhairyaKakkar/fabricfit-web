import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

// Stripe price IDs — create these in your Stripe dashboard and paste here
export const STRIPE_PRICES: Record<string, { monthly: string; annual: string }> = {
  starter: {
    monthly: 'price_1Tbk6aK1j9pWNOxzH8SpOEzF', // S$40/mo
    annual:  'price_1Tbk6xK1j9pWNOxziGCqLjtp', // S$400/yr
  },
  pro: {
    monthly: 'price_1Tbk7XK1j9pWNOxz6nBduUTM', // S$72/mo
    annual:  'price_1Tbk7lK1j9pWNOxzSks5xir9', // S$720/yr
  },
  business: {
    monthly: 'price_1Tbk89K1j9pWNOxzmCn2h3Qm', // S$160/mo
    annual:  'price_1Tbk8RK1j9pWNOxzgIcfrAQi', // S$1600/yr
  },
};
