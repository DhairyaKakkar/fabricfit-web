import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import { createAdminClient } from '@/lib/supabase/admin';
import DemoClient, { type ModelPose } from './DemoClient';

export const metadata: Metadata = {
  title: 'Live Demo — Run a Real AI Try-On with Your Own Fabric',
  description:
    'Upload a fabric photo and see it stitched and draped on a model in 15–20 seconds. Create a free account — your first try-on is free, no credit card.',
  alternates: { canonical: '/demo' },
};

export default async function DemoPage() {
  // Fetch model poses server-side (admin client) so anonymous visitors can use
  // the demo workspace without us loosening RLS on model_poses. The pose images
  // live in a public storage bucket, so they render for signed-out users too.
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('model_poses')
    .select('id, name, gender, image_path, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  const initialPoses = (data ?? []) as ModelPose[];

  return (
    <>
      <Navbar />
      <DemoClient initialPoses={initialPoses} />
      <Footer />
    </>
  );
}
