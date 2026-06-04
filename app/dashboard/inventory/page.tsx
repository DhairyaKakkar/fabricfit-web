import { createClient } from '@/lib/supabase/server';
import InventoryClient, { type Fabric } from './InventoryClient';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: fabrics } = await supabase
    .from('fabrics')
    .select('id, name, color_tag, fabric_type, image_url, created_at, fabric_garments(id, garment_type, status, image_path)')
    .eq('outlet_id', outlet!.id)
    .order('created_at', { ascending: false });

  return <InventoryClient initialFabrics={(fabrics ?? []) as Fabric[]} outletId={outlet!.id} />;
}
