-- SubSentry Database Schema
-- Complete setup for subscription tracking with Gmail OAuth

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
-- Stores Gmail-authenticated user profiles
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- SUBSCRIPTIONS TABLE
-- Stores all recurring subscription data
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  icon text default '📦',
  amount numeric(10, 2) not null,
  currency text default 'USD',
  frequency text not null check (frequency in ('Weekly', 'Monthly', 'Quarterly', 'Yearly')),
  next_billing_date date not null,
  status text default 'active' check (status in ('active', 'due-soon', 'overdue', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- REMINDERS TABLE
-- Stores scheduled reminder notifications
create table public.reminders (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  scheduled_date date not null,
  days_before integer not null default 3,
  notification_method text default 'email' check (notification_method in ('email', 'push', 'both')),
  custom_message text,
  status text default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- SETTINGS TABLE
-- Stores user preferences and configuration
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null unique,
  email_notifications boolean default true,
  push_notifications boolean default true,
  default_reminder_days integer default 3,
  currency text default 'USD',
  theme text default 'light' check (theme in ('light', 'dark', 'auto')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PAYMENT_HISTORY TABLE
-- Optional: Track payment confirmations
create table public.payment_history (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  payment_date date not null,
  status text default 'completed' check (status in ('completed', 'pending', 'failed')),
  notes text,
  created_at timestamp with time zone default now()
);

-- INDEXES for performance
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_subscriptions_next_billing on public.subscriptions(next_billing_date);
create index idx_reminders_user_id on public.reminders(user_id);
create index idx_reminders_status on public.reminders(status);
create index idx_reminders_scheduled_date on public.reminders(scheduled_date);
create index idx_payment_history_user_id on public.payment_history(user_id);

-- TRIGGERS for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on public.users
  for each row execute function update_updated_at_column();

create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function update_updated_at_column();

create trigger update_settings_updated_at before update on public.settings
  for each row execute function update_updated_at_column();

-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reminders enable row level security;
alter table public.settings enable row level security;
alter table public.payment_history enable row level security;

-- RLS POLICIES for users table
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = auth_id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = auth_id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = auth_id);

-- RLS POLICIES for subscriptions table
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (user_id in (select id from public.users where auth_id = auth.uid()));

-- RLS POLICIES for reminders table
create policy "Users can view own reminders"
  on public.reminders for select
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own reminders"
  on public.reminders for insert
  with check (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can update own reminders"
  on public.reminders for update
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can delete own reminders"
  on public.reminders for delete
  using (user_id in (select id from public.users where auth_id = auth.uid()));

-- RLS POLICIES for settings table
create policy "Users can view own settings"
  on public.settings for select
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own settings"
  on public.settings for insert
  with check (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can update own settings"
  on public.settings for update
  using (user_id in (select id from public.users where auth_id = auth.uid()));

-- RLS POLICIES for payment_history table
create policy "Users can view own payment history"
  on public.payment_history for select
  using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own payment history"
  on public.payment_history for insert
  with check (user_id in (select id from public.users where auth_id = auth.uid()));

-- FUNCTION: Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default settings for new user
  insert into public.settings (user_id)
  values ((select id from public.users where auth_id = new.id));
  
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER: Create user profile on auth signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- FUNCTION: Update subscription status based on billing date
create or replace function public.update_subscription_status()
returns void as $$
begin
  -- Mark as overdue if past billing date
  update public.subscriptions
  set status = 'overdue'
  where next_billing_date < current_date
    and status != 'cancelled';
  
  -- Mark as due-soon if within 3 days
  update public.subscriptions
  set status = 'due-soon'
  where next_billing_date between current_date and current_date + interval '3 days'
    and status = 'active';
  
  -- Mark as active if more than 3 days away
  update public.subscriptions
  set status = 'active'
  where next_billing_date > current_date + interval '3 days'
    and status = 'due-soon';
end;
$$ language plpgsql security definer;

-- FUNCTION: Get user statistics
create or replace function public.get_user_stats(p_user_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_monthly', (
      select coalesce(sum(
        case 
          when frequency = 'Weekly' then amount * 4.33
          when frequency = 'Monthly' then amount
          when frequency = 'Quarterly' then amount / 3
          when frequency = 'Yearly' then amount / 12
        end
      ), 0)
      from public.subscriptions
      where user_id = p_user_id and status != 'cancelled'
    ),
    'total_yearly', (
      select coalesce(sum(
        case 
          when frequency = 'Weekly' then amount * 52
          when frequency = 'Monthly' then amount * 12
          when frequency = 'Quarterly' then amount * 4
          when frequency = 'Yearly' then amount
        end
      ), 0)
      from public.subscriptions
      where user_id = p_user_id and status != 'cancelled'
    ),
    'active_count', (
      select count(*) from public.subscriptions
      where user_id = p_user_id and status = 'active'
    ),
    'due_soon_count', (
      select count(*) from public.subscriptions
      where user_id = p_user_id and status = 'due-soon'
    ),
    'overdue_count', (
      select count(*) from public.subscriptions
      where user_id = p_user_id and status = 'overdue'
    )
  ) into result;
  
  return result;
end;
$$ language plpgsql security definer;
