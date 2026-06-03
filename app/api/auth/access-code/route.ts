import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : null;

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: outlet, error: outletError } = await admin
    .from('outlets')
    .select('user_id')
    .eq('access_code', code)
    .single();

  if (outletError || !outlet) {
    return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
  }

  const { data: { user }, error: userError } = await admin.auth.admin.getUserById(outlet.user_id);
  if (userError || !user?.email) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
  });

  if (linkError || !linkData.properties?.hashed_token) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }

  // Use a plain in-memory client (no cookies) so we can extract raw tokens
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email',
  });

  if (verifyError || !sessionData.session) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }

  return NextResponse.json({
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    expires_at: sessionData.session.expires_at,
    user: {
      id: sessionData.session.user.id,
      email: sessionData.session.user.email,
    },
  });
}
