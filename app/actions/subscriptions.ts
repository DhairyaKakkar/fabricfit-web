'use server';

import { createClient } from '@/lib/supabase/server';

export async function redeemCoupon(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string; creditsAdded?: number; newBalance?: number }> {
  const code = (formData.get('coupon_code') as string)?.trim().toUpperCase();
  if (!code) return { error: 'Please enter a coupon code.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to redeem a coupon.' };

  const { data, error } = await supabase.rpc('redeem_coupon', { p_code: code });

  if (error) {
    return { error: error.message || 'Invalid or expired coupon code.' };
  }

  const result = data as { credits_added: number; new_balance: number };
  return {
    success: `${result.credits_added} credits added! Your new balance is ${result.new_balance}.`,
    creditsAdded: result.credits_added,
    newBalance: result.new_balance,
  };
}
