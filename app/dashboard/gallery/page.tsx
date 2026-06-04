import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import GalleryClient, { type TryOn } from './GalleryClient';

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <GalleryClient initialTryons={[]} />;

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!outlet) return <GalleryClient initialTryons={[]} />;

  const { data: tryons } = await supabase
    .from('tryons')
    .select('id, result_path, garment_type, created_at, fabrics(name, color_tag), outfits(name)')
    .eq('outlet_id', outlet.id)
    .eq('status', 'success')
    .not('result_path', 'is', null)
    .order('created_at', { ascending: false });

  if (!tryons?.length) return <GalleryClient initialTryons={[]} />;

  // Generate signed URLs — guard against storage errors
  const urlMap = new Map<string, string>();
  try {
    const admin = createAdminClient();
    const paths = tryons.map(t => t.result_path as string);
    const { data: signedUrls } = await admin.storage
      .from('tryon_results')
      .createSignedUrls(paths, 3600);

    for (const s of signedUrls ?? []) {
      if (s.path && s.signedUrl) urlMap.set(s.path, s.signedUrl);
    }
  } catch {
    // Signed URL generation failed — images won't show but page won't crash
  }

  const resolved = tryons.map(t => ({
    ...t,
    result_url: urlMap.get(t.result_path as string) ?? null,
  }));

  return <GalleryClient initialTryons={resolved as unknown as TryOn[]} />;
}
