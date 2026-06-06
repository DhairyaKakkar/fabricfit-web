'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message };

  // Return to the page that sent the user to login (e.g. checkout), if safe
  const next = (formData.get('next') as string | null)?.trim();
  redirect(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
}

export async function signup(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  const businessName = formData.get('company_name') as string;
  const planId = (formData.get('plan_id') as string | null)?.trim() || null;

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: { data: { company_name: businessName } },
  });

  if (error) return { error: error.message };

  // Create outlet row (mirrors phone app structure)
  if (data.user) {
    await supabase.from('outlets').insert({
      user_id: data.user.id,
      business_name: businessName,
      is_trial: true,
      preview_limit: 100,
      access_code: generateAccessCode(),
    });
  }

  // If a paid plan was selected, go straight to checkout
  if (planId && ['starter', 'pro', 'business'].includes(planId)) {
    redirect(`/checkout?plan=${planId}&billing=monthly`);
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function loginWithAccessCode(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const code = (formData.get('access_code') as string)?.trim().toUpperCase();
  if (!code) return { error: 'Please enter your access code' };

  const adminClient = createAdminClient();
  const supabase = await createClient();

  // Look up by outlets.access_code first, then fall back to trial_codes
  let userId: string | null = null;

  const { data: outletByCode } = await adminClient
    .from('outlets')
    .select('user_id')
    .eq('access_code', code)
    .maybeSingle();

  if (outletByCode) {
    userId = outletByCode.user_id;
  } else {
    const { data: trialCode } = await adminClient
      .from('trial_codes')
      .select('outlet_id')
      .eq('code', code)
      .maybeSingle();

    if (trialCode) {
      const { data: outlet } = await adminClient
        .from('outlets')
        .select('user_id')
        .eq('id', trialCode.outlet_id)
        .maybeSingle();
      if (outlet) userId = outlet.user_id;
    }
  }

  if (!userId) {
    return { error: 'Invalid access code. Please check and try again.' };
  }

  // Get user email via admin API
  const { data: { user }, error: userError } = await adminClient.auth.admin.getUserById(userId);

  if (userError || !user?.email) {
    return { error: 'Account not found. Please contact support.' };
  }

  // Generate a one-time magic link token
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
  });

  if (linkError || !linkData.properties?.hashed_token) {
    return { error: 'Login failed. Please try again.' };
  }

  // Verify the token server-side to set session cookies
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email',
  });

  if (verifyError) {
    return { error: 'Login failed. Please try again.' };
  }

  redirect('/dashboard');
}
