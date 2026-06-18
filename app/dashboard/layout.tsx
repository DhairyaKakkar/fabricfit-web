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
    <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: 'var(--font-inter)' }}>
      <DashboardNav
        businessName={outlet?.business_name ?? user.email ?? 'My Account'}
        isTrial={outlet?.is_trial ?? true}
        outletId={outlet?.id ?? null}
      />
      <main className="lg:pl-56 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
