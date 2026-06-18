import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';

// Credits granted per plan on a successful purchase.
const CREDITS_BY_PLAN: Record<string, number> = {
  payg: 20,
  starter: 200,
  pro: 400,
  business: 1000,
};

interface FulfillArgs {
  userId: string;
  planId: string;
  billingCycle: string;
  /** Razorpay payment id — used as the idempotency key. */
  paymentId: string;
  customerId?: string;
  currency?: string;
}

/**
 * Grant a successful purchase: activate the subscription, add credits, send the
 * welcome email.
 *
 * Idempotent — if this exact payment was already fulfilled (the user's
 * subscription already stores this `paymentId` as its gateway_subscription_id),
 * it does nothing and returns `{ fulfilled: false }`. This makes it safe to call
 * from BOTH the client-side verify route (immediate) and the Razorpay webhook
 * (backup) without ever double-granting credits or sending duplicate emails.
 */
export async function fulfillPurchase({
  userId,
  planId,
  billingCycle,
  paymentId,
  customerId,
  currency = 'INR',
}: FulfillArgs): Promise<{ fulfilled: boolean }> {
  const supabase = createAdminClient();

  // Idempotency guard: has this exact payment already been recorded?
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('gateway_subscription_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.gateway_subscription_id === paymentId) {
    return { fulfilled: false };
  }

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'annual' ? 12 : 1));

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: planId,
      status: 'active',
      billing_cycle: billingCycle,
      gateway: 'razorpay',
      gateway_subscription_id: paymentId,
      gateway_customer_id: customerId,
      currency,
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  const credits = CREDITS_BY_PLAN[planId] ?? 0;
  if (credits > 0) {
    await supabase.from('credits').upsert(
      {
        user_id: userId,
        balance: credits,
        total_allocated: credits,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
  }

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

  return { fulfilled: true };
}
