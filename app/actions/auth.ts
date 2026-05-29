'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  redirect('/dashboard');
}

export async function signup(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  const businessName = formData.get('company_name') as string;

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
    });
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
