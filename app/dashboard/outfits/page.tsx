import { createClient } from '@/lib/supabase/server';
import OutfitsClient, { type Outfit } from './OutfitsClient';

export default async function OutfitsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: outfits } = await supabase
    .from('outfits')
    .select('id, name, image_url, created_at')
    .eq('outlet_id', outlet!.id)
    .order('created_at', { ascending: false });

  return <OutfitsClient initialOutfits={(outfits ?? []) as Outfit[]} outletId={outlet!.id} />;
}
