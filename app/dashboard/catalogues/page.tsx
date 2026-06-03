import { createClient } from '@/lib/supabase/server';
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
    .select('id, name, description, created_at, catalogue_items(id, position, tryon_id, tryons(id, result_url, garment_type, status, purged_at))')
    .eq('outlet_id', outlet!.id)
    .order('created_at', { ascending: false });

  return <CataloguesClient initialCatalogues={(catalogues ?? []) as unknown as Catalogue[]} />;
}
