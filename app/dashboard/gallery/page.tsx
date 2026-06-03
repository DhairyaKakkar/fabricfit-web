import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
    .select('id, result_path, garment_type, created_at, fabrics(name, color_tag), outfits(name)')
    .eq('outlet_id', outlet!.id)
    .eq('status', 'success')
    .not('result_path', 'is', null)
    .order('created_at', { ascending: false });

  if (!tryons?.length) {
    return <GalleryClient initialTryons={[]} />;
  }

  // Generate signed URLs server-side (bucket is private)
  const admin = createAdminClient();
  const paths = tryons.map(t => t.result_path as string);
  const { data: signedUrls } = await admin.storage
    .from('tryon_results')
    .createSignedUrls(paths, 3600);

  const urlMap = new Map(signedUrls?.map(s => [s.path, s.signedUrl]) ?? []);

  const resolved = tryons.map(t => ({
    ...t,
    result_url: urlMap.get(t.result_path as string) ?? null,
  }));

  return <GalleryClient initialTryons={resolved as unknown as TryOn[]} />;
}
