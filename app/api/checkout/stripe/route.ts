import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PRICES } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId, billingCycle } = await request.json() as {
    planId: 'starter' | 'pro' | 'business';
    billingCycle: 'monthly' | 'annual';
  };

  const priceId = STRIPE_PRICES[planId]?.[billingCycle];
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan or price not configured' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      plan_id: planId,
      billing_cycle: billingCycle,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
