'use client';

import { useState } from 'react';
import PricingHero from './PricingHero';
import BillingToggle from './BillingToggle';
import PlanCards from './PlanCards';
import CreditPacks from './CreditPacks';
import AddOns from './AddOns';
import ComparisonTable from './ComparisonTable';
import PricingFooter from './PricingFooter';

export type BillingCycle = 'monthly' | 'annual';

export default function PricingPageClient() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <div className="bg-[#fef9f0] min-h-screen">
      <PricingHero />
      <div className="flex justify-center pb-10">
        <BillingToggle billing={billing} onChange={setBilling} />
      </div>
      <PlanCards billing={billing} />
      <CreditPacks />
      <AddOns />
      <ComparisonTable billing={billing} />
      <PricingFooter />
    </div>
  );
}
