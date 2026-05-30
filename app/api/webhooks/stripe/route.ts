import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const planId = session.metadata?.plan_id;
    const billingCycle = session.metadata?.billing_cycle;

    if (!userId) return NextResponse.json({ ok: true });

    const subscription = await getStripe().subscriptions.retrieve(session.subscription as string);
    const periodEnd = subscription.items.data[0]?.current_period_end;

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      billing_cycle: billingCycle,
      gateway: 'stripe',
      gateway_subscription_id: subscription.id,
      gateway_customer_id: session.customer as string,
      currency: 'SGD',
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    }, { onConflict: 'user_id' });

    // Add plan credits on top of existing balance (keep trial credits)
    const creditsMap: Record<string, number> = { starter: 200, pro: 400, business: 1000 };
    const newCredits = creditsMap[planId ?? ''] ?? 0;
    if (newCredits > 0) {
      const { data: existing } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', userId)
        .single();
      await supabase.from('credits').upsert({
        user_id: userId,
        balance: (existing?.balance ?? 0) + newCredits,
        total_allocated: newCredits,
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
        planId: planId ?? 'starter',
      }).catch(() => {}); // don't fail the webhook if email fails
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const subRef = invoice.parent?.subscription_details?.subscription;
    const subId = typeof subRef === 'string' ? subRef : subRef?.id;
    if (!subId) return NextResponse.json({ ok: true });

    const subscription = await getStripe().subscriptions.retrieve(subId);
    const userId = subscription.metadata?.user_id;
    const planId = subscription.metadata?.plan_id;

    if (!userId) return NextResponse.json({ ok: true });

    const periodEnd = subscription.items.data[0]?.current_period_end;

    await supabase.from('subscriptions').update({
      status: 'active',
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);

    // Refresh monthly credits
    const creditsMap: Record<string, number> = { starter: 200, pro: 400, business: 1000 };
    const credits = creditsMap[planId ?? ''] ?? 0;
    if (credits > 0) {
      await supabase.from('credits').update({
        balance: credits,
        total_allocated: credits,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.user_id;

    if (!userId) return NextResponse.json({ ok: true });

    await supabase.from('subscriptions').update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);
  }

  return NextResponse.json({ ok: true });
}
