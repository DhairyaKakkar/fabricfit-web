import Razorpay from 'razorpay';

let _razorpay: Razorpay | null = null;
export function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _razorpay;
}

// INR prices (approx SGD converted — update to your actual INR pricing)
export const RAZORPAY_PLANS: Record<string, { monthly: number; annual: number; planId?: string }> = {
  starter: {
    monthly: 250000, // ₹2500 in paise
    annual:  2500000, // ₹25000 in paise
  },
  pro: {
    monthly: 450000, // ₹4500 in paise
    annual:  4500000, // ₹45000 in paise
  },
  business: {
    monthly: 1000000, // ₹10000 in paise
    annual:  10000000, // ₹100000 in paise
  },
};
