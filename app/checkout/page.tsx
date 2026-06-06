import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getGateway } from '@/lib/geo';
import CheckoutClient from './CheckoutClient';

interface SearchParams {
  plan?: string;
  billing?: string;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { plan = 'starter', billing = 'monthly' } = await searchParams;

  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}&billing=${billing}`)}`);
  const headersList = await headers();
  const gateway = getGateway(headersList);

  return (
    <CheckoutClient
      planId={plan}
      billingCycle={billing as 'monthly' | 'annual'}
      gateway={gateway}
      userEmail={user.email ?? ''}
    />
  );
}
