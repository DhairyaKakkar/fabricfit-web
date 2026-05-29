import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getOutletId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from('outlets').select('id').eq('user_id', userId).single();
  return data?.id ?? null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const outletId = await getOutletId(supabase, user.id);
  if (!outletId) return NextResponse.json([]);

  const { data } = await supabase
    .from('tryons')
    .select('*, fabrics(name, color_tag), outfits(name)')
    .eq('outlet_id', outletId)
    .eq('status', 'success')
    .is('purged_at', null)
    .order('created_at', { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const outletId = await getOutletId(supabase, user.id);
  const { id } = await request.json();

  await supabase
    .from('tryons')
    .update({ purged_at: new Date().toISOString(), purge_reason: 'manual_delete' })
    .eq('id', id)
    .eq('outlet_id', outletId ?? '');

  return NextResponse.json({ ok: true });
}
