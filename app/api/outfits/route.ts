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
    .from('outfits')
    .select('*')
    .eq('outlet_id', outletId)
    .order('created_at', { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const outletId = await getOutletId(supabase, user.id);
  if (!outletId) return NextResponse.json({ error: 'No outlet found' }, { status: 400 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('outfits')
    .insert({ ...body, outlet_id: outletId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const outletId = await getOutletId(supabase, user.id);
  const { id } = await request.json();
  await supabase.from('outfits').delete().eq('id', id).eq('outlet_id', outletId ?? '');
  return NextResponse.json({ ok: true });
}
