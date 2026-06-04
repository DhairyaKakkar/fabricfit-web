-- profiles: extends auth.users with business info
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  email text,
  created_at timestamptz default now()
);

-- subscriptions: one active row per user
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,                   -- 'payg' | 'starter' | 'pro' | 'business'
  status text not null default 'trialing', -- 'trialing' | 'active' | 'past_due' | 'canceled'
  billing_cycle text,                      -- 'monthly' | 'annual'
  gateway text,                            -- 'stripe' | 'razorpay'
  gateway_subscription_id text,
  gateway_customer_id text,
  currency text,                           -- 'SGD' | 'USD' | 'INR'
  current_period_end timestamptz,
  trial_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- credits: current balance per user
create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  balance integer not null default 0,
  total_allocated integer not null default 0,
  updated_at timestamptz default now()
);

-- products: fabric/item catalog per user
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  image_urls text[] default '{}',
  price_sgd numeric(10,2),
  active boolean not null default true,
  created_at timestamptz default now()
);

-- RLS: users can only see and modify their own rows
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.credits enable row level security;
alter table public.products enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own subscription" on public.subscriptions for all using (auth.uid() = user_id);
create policy "own credits" on public.credits for all using (auth.uid() = user_id);
create policy "own products" on public.products for all using (auth.uid() = user_id);

-- trial_requests: captures access requests from the website modal
create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  phone text,
  email text not null,
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  requested_at timestamptz default now()
);

-- only service role can read/write trial_requests (no user auth required to submit)
alter table public.trial_requests enable row level security;
create policy "service role only" on public.trial_requests
  using (false) with check (false);

-- auto-create profile + credits row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  insert into public.credits (user_id, balance, total_allocated)
  values (new.id, 0, 0); -- credits allocated manually after approval

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
