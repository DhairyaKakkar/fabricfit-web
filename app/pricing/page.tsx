import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import PricingPageClient from '@/components/pricing/PricingPageClient';

export const metadata: Metadata = {
  title: 'Pricing — FabricFit',
  description:
    'Simple, transparent pricing for AI-powered virtual try-on. Choose from PAYG, Starter, Pro, or Business plans built for Indian fabric showrooms.',
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <PricingPageClient />
      </main>
    </>
  );
}
