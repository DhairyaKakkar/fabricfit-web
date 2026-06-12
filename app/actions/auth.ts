'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
  const admin = createAdminClient();
  const businessName = (formData.get('company_name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const planId = (formData.get('plan_id') as string | null)?.trim() || null;
  const next = (formData.get('next') as string | null)?.trim();

  if (!email || !password || !businessName) {
    return { error: 'Please fill in all fields.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  // Create the user pre-confirmed so they get instant access (no email step).
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { company_name: businessName },
  });

  if (createErr) {
    const msg = createErr.message?.toLowerCase() ?? '';
    if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
      return { error: 'An account with this email already exists. Please sign in instead.' };
    }
    return { error: createErr.message || 'Could not create account. Please try again.' };
  }

  const userId = created.user?.id;

  // Create outlet row via admin (bypasses RLS, mirrors phone app structure)
  if (userId) {
    await admin.from('outlets').insert({
      user_id: userId,
      business_name: businessName,
      is_trial: true,
      preview_limit: 100,
    });

    // Grant exactly one free website try-on (2 credits at 'low' quality).
    // All further credits are request-only / paid. The on_auth_user_created
    // trigger seeds the row with balance 0; bump it only while untouched so a
    // re-run can never inflate a balance.
    const WEB_DEMO_TRIAL_CREDITS = 2;
    await admin
      .from('credits')
      .update({ balance: WEB_DEMO_TRIAL_CREDITS, total_allocated: WEB_DEMO_TRIAL_CREDITS })
      .eq('user_id', userId)
      .eq('balance', 0)
      .eq('total_allocated', 0);
  }

  // Sign the user in to set session cookies
  const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signInErr) {
    return { error: 'Account created, but sign-in failed. Please sign in manually.' };
  }

  // If a paid plan was selected, go straight to checkout
  if (planId && ['starter', 'pro', 'business'].includes(planId)) {
    redirect(`/checkout?plan=${planId}&billing=monthly`);
  }

  redirect(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

