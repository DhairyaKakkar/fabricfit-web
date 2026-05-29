import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from './DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: outlet } = await supabase
    .from('outlets')
    .select('id, business_name, owner_name, is_trial, preview_limit')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ fontFamily: 'var(--font-inter)' }}>
      <DashboardNav
        businessName={outlet?.business_name ?? user.email ?? 'My Account'}
        isTrial={outlet?.is_trial ?? true}
        outletId={outlet?.id ?? null}
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
