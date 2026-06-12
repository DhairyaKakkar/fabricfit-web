import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import DemoClient from './DemoClient';

export const metadata: Metadata = {
  title: 'Live Demo — Run a Real AI Try-On with Your Own Fabric',
  description:
    'Upload a fabric photo and see it stitched and draped on a model in 15–20 seconds. Create a free account — your first try-on is free, no credit card.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <DemoClient />
      <Footer />
    </>
  );
}
