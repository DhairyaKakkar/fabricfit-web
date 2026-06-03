import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import CataloguesClient, { type Catalogue } from './CataloguesClient';

export default async function CataloguesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: catalogues } = await supabase
    .from('catalogues')
    .select('id, name, description, created_at, catalogue_items(id, position, tryon_id, tryons(id, result_path, garment_type, status, purged_at))')
    .eq('outlet_id', outlet!.id)
    .order('created_at', { ascending: false });

  if (!catalogues?.length) {
    return <CataloguesClient initialCatalogues={[]} />;
  }

  // Collect all result_paths from catalogue items
  const paths: string[] = [];
  for (const cat of catalogues) {
    for (const item of cat.catalogue_items ?? []) {
      const tryon = Array.isArray(item.tryons) ? item.tryons[0] : item.tryons;
      if (tryon?.result_path && !tryon.purged_at) paths.push(tryon.result_path);
    }
  }

  let urlMap = new Map<string, string>();
  if (paths.length > 0) {
    const admin = createAdminClient();
    const { data: signedUrls } = await admin.storage
      .from('tryon_results')
      .createSignedUrls(paths, 3600);
    urlMap = new Map(signedUrls?.filter(s => s.path && s.signedUrl).map(s => [s.path!, s.signedUrl!]) ?? []);
  }

  // Inject result_url into each tryon
  const resolved = catalogues.map(cat => ({
    ...cat,
    catalogue_items: (cat.catalogue_items ?? []).map(item => {
      const tryon = Array.isArray(item.tryons) ? item.tryons[0] : item.tryons;
      return {
        ...item,
        tryons: tryon ? { ...tryon, result_url: urlMap.get(tryon.result_path) ?? null } : tryon,
      };
    }),
  }));

  return <CataloguesClient initialCatalogues={resolved as unknown as Catalogue[]} />;
}
