import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getGateway } from '@/lib/geo';
import CheckoutClient from './CheckoutClient';

interface SearchParams {
  plan?: string;
  billing?: string;
  currency?: string;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { plan = 'starter', billing = 'monthly', currency } = await searchParams;

  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}&billing=${billing}${currency ? `&currency=${currency}` : ''}`)}`);

  // Explicit currency overrides geo-detection: INR → Razorpay, everything else → Stripe
  const gateway = currency
    ? (currency === 'INR' ? 'razorpay' : 'stripe') as 'razorpay' | 'stripe'
    : getGateway(await headers());

  return (
    <CheckoutClient
      planId={plan}
      billingCycle={billing as 'monthly' | 'annual'}
      gateway={gateway}
      userEmail={user.email ?? ''}
    />
  );
}
