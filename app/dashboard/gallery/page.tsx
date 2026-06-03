import { createClient } from '@/lib/supabase/server';
import GalleryClient, { type TryOn } from './GalleryClient';

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: tryons } = await supabase
    .from('tryons')
    .select('id, result_url, garment_type, created_at, fabrics(name, color_tag), outfits(name)')
    .eq('outlet_id', outlet!.id)
    .not('result_url', 'is', null)
    .order('created_at', { ascending: false });

  return <GalleryClient initialTryons={(tryons ?? []) as unknown as TryOn[]} />;
}
