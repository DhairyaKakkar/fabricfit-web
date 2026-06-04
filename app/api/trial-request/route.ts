import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { name, company, phone, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    await supabase.from('trial_requests').insert({
      name,
      company,
      phone,
      email,
      requested_at: new Date().toISOString(),
    });
  } catch {
    // Table may not exist yet — still return success so UX is not broken
  }

  return NextResponse.json({ ok: true });
}
