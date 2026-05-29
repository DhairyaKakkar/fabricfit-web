import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('x-razorpay-signature')!;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (sig !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createAdminClient();

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const notes = payment.notes ?? {};
    const userId: string = notes.user_id;
    const planId: string = notes.plan_id;
    const billingCycle: string = notes.billing_cycle;

    if (!userId) return NextResponse.json({ ok: true });

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'annual' ? 12 : 1));

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      billing_cycle: billingCycle,
      gateway: 'razorpay',
      gateway_subscription_id: payment.id,
      gateway_customer_id: payment.contact,
      currency: 'INR',
      current_period_end: periodEnd.toISOString(),
    }, { onConflict: 'user_id' });

    const creditsMap: Record<string, number> = { starter: 200, pro: 400, business: 1000 };
    const credits = creditsMap[planId] ?? 0;
    if (credits > 0) {
      await supabase.from('credits').upsert({
        user_id: userId,
        balance: credits,
        total_allocated: credits,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    // Send welcome email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, company_name')
      .eq('id', userId)
      .single();
    if (profile?.email) {
      await sendWelcomeEmail({
        to: profile.email,
        companyName: profile.company_name ?? profile.email,
        planId,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
