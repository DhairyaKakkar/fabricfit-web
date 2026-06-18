'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PLAN_LABELS: Record<string, string> = {
  payg: 'Pay As You Go',
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

const STRIPE_PRICES_DISPLAY: Record<string, { monthly: string; annual: string }> = {
  starter: { monthly: 'S$40/mo', annual: 'S$400/yr' },
  pro:     { monthly: 'S$72/mo', annual: 'S$720/yr' },
  business:{ monthly: 'S$160/mo', annual: 'S$1,600/yr' },
};

const RAZORPAY_PRICES_DISPLAY: Record<string, { monthly: string; annual: string }> = {
  payg:    { monthly: '₹500', annual: '₹500' },
  starter: { monthly: '₹2,500/mo', annual: '₹25,000/yr' },
  pro:     { monthly: '₹4,500/mo', annual: '₹45,000/yr' },
  business:{ monthly: '₹10,000/mo', annual: '₹1,00,000/yr' },
};

interface Props {
  planId: string;
  billingCycle: 'monthly' | 'annual';
  gateway: 'stripe' | 'razorpay';
  userEmail: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutClient({ planId, billingCycle, gateway, userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const priceDisplay = gateway === 'razorpay'
    ? RAZORPAY_PRICES_DISPLAY[planId]?.[billingCycle]
    : STRIPE_PRICES_DISPLAY[planId]?.[billingCycle];

  async function handlePay() {
    setLoading(true);
    setError('');

    try {
      if (gateway === 'stripe') {
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, billingCycle }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else setError(data.error ?? 'Something went wrong');
      } else {
        const res = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, billingCycle }),
        });
        const data = await res.json();
        if (!res.ok || data.error) { setError(data.error ?? `Error ${res.status}`); return; }

        // Load Razorpay checkout script dynamically
        await new Promise<void>((resolve) => {
          if (window.Razorpay) { resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });

        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'TrialRoomStudio',
          description: `${PLAN_LABELS[planId]} — ${billingCycle}`,
          prefill: { email: userEmail },
          theme: { color: '#09090b' },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            setLoading(true);
            try {
              const verify = await fetch('/api/checkout/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (!verify.ok) {
                const data = await verify.json().catch(() => ({}));
                console.error('[checkout] verify failed', verify.status, data);
                // The payment was charged by Razorpay even if our verification
                // call hiccuped — reassure the user instead of alarming them.
                setError(
                  'Your payment went through, but we hit a snag finalizing your account. Your credits will appear shortly — if they don’t within a few minutes, contact support.',
                );
                setLoading(false);
                return;
              }
              router.push('/dashboard?payment=success');
            } catch (err) {
              console.error('[checkout] verify request error', err);
              setError(
                'Your payment went through, but we hit a snag finalizing your account. Your credits will appear shortly — if they don’t within a few minutes, contact support.',
              );
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
        });
        rzp.open();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="TrialRoomStudio" width={80} height={80} className="h-20 w-auto block" />
          </div>
          <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Complete your subscription
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          {/* Summary */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-4 mb-6">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
              You&apos;re subscribing to
            </p>
            <p className="text-lg font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              {PLAN_LABELS[planId] ?? planId}
            </p>
            <p className="text-sm text-zinc-500 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
              {priceDisplay} · {billingCycle}
            </p>
            <p className="text-xs text-zinc-400 mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
              Payment via {gateway === 'razorpay' ? 'Razorpay (INR)' : 'Stripe (SGD)'}
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
              {error}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-[#09090b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {loading ? 'Redirecting…' : `Pay ${priceDisplay ?? ''}`}
          </button>

          <p className="text-center text-xs text-zinc-400 mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
            Secure payment · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
