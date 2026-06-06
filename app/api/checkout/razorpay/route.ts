import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, RAZORPAY_PLANS } from '@/lib/razorpay';
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

  const plan = RAZORPAY_PLANS[planId];
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const amount = billingCycle === 'annual' ? plan.annual : plan.monthly;

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      notes: {
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        email: user.email ?? '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      userEmail: user.email,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    console.error('[razorpay] order creation failed:', message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
