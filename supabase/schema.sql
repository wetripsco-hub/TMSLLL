-- ==============================================================================
-- FreightFlow AI • Full Database Schema Migration
-- Compatible with PostgreSQL 15+ / Supabase
-- ==============================================================================

-- Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  company_name text not null,
  role text not null check (role in ('broker', 'dispatcher', 'admin')),
  phone text,
  avatar_url text,
  status text default 'active' check (status in ('active', 'suspended', 'pending')),
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SHIPPERS (Customers managed by Brokers)
create table if not exists public.shippers (
  id uuid default uuid_generate_v4() primary key,
  broker_id uuid references public.profiles(id) on delete set null,
  name text not null,
  account_number text not null unique,
  contact_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  credit_limit numeric(12, 2) default 50000.00 not null,
  available_credit numeric(12, 2) default 50000.00 not null,
  payment_terms text default 'Net 30' not null,
  credit_status text default 'approved' check (credit_status in ('approved', 'conditional', 'hold', 'revoked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CARRIERS (Motor carriers hired by Brokers or Dispatchers)
create table if not exists public.carriers (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete set null,
  mc_number text not null unique,
  dot_number text not null unique,
  name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  state text not null,
  safety_rating text default 'Satisfactory' check (safety_rating in ('Satisfactory', 'Conditional', 'Unrated')),
  safety_score integer default 95,
  insurance_company text default 'Progressive Commercial',
  insurance_coverage_amount numeric(12, 2) default 1000000.00 not null,
  insurance_expiration date not null,
  factoring_company text,
  preferred boolean default false,
  status text default 'active' check (status in ('active', 'pending_docs', 'suspended')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TRUCKS (Fleet assets managed by Independent Dispatchers)
create table if not exists public.trucks (
  id uuid default uuid_generate_v4() primary key,
  dispatcher_id uuid references public.profiles(id) on delete cascade not null,
  unit_number text not null,
  trailer_number text,
  equipment_type text not null check (equipment_type in ('dry_van', 'reefer', 'flatbed', 'step_deck', 'power_only')),
  make_model text default 'Freightliner Cascadia',
  year integer default 2023,
  vin text,
  plate_number text,
  status text default 'available' check (status in ('available', 'dispatched', 'in_transit', 'maintenance', 'off_duty')),
  current_location jsonb default '{"city": "Dallas", "state": "TX", "lat": 32.7767, "lng": -96.7970}'::jsonb,
  rpm_target numeric(6, 2) default 2.80,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. DRIVERS (Drivers assigned to Trucks by Dispatchers)
create table if not exists public.drivers (
  id uuid default uuid_generate_v4() primary key,
  dispatcher_id uuid references public.profiles(id) on delete cascade not null,
  current_truck_id uuid references public.trucks(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  license_number text not null,
  license_state text default 'TX',
  medical_card_expiry date,
  status text default 'available' check (status in ('available', 'driving', 'sleeper', 'off_duty')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. LOADS (Freight Shipments)
create table if not exists public.loads (
  id uuid default uuid_generate_v4() primary key,
  reference_number text not null unique,
  broker_id uuid references public.profiles(id) on delete set null,
  dispatcher_id uuid references public.profiles(id) on delete set null,
  shipper_id uuid references public.shippers(id) on delete set null,
  carrier_id uuid references public.carriers(id) on delete set null,
  truck_id uuid references public.trucks(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  equipment_type text not null,
  commodity text not null,
  weight numeric(10, 2) not null,
  temperature numeric(5, 1),
  miles integer default 0 not null,
  shipper_rate numeric(10, 2) default 0.00 not null,
  carrier_rate numeric(10, 2) default 0.00 not null,
  margin_amount numeric(10, 2) default 0.00,
  margin_percentage numeric(5, 2) default 0.00,
  dispatcher_fee_rate numeric(4, 2) default 0.08, -- e.g. 8%
  dispatcher_fee_amount numeric(10, 2) default 0.00,
  status text default 'available' check (status in ('available', 'booked', 'dispatched', 'loaded', 'in_transit', 'delivered', 'invoiced', 'paid', 'cancelled')),
  tracking_token text not null unique,
  tracking_active boolean default false,
  rate_con_signed boolean default false,
  rate_con_signer_name text,
  stops jsonb default '[]'::jsonb not null,
  financials jsonb default '{}'::jsonb not null,
  driver_location jsonb,
  documents jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.shippers enable row level security;
alter table public.carriers enable row level security;
alter table public.trucks enable row level security;
alter table public.drivers enable row level security;
alter table public.loads enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Loads Policies (Brokers see their loads; Dispatchers see their assigned loads)
create policy "Brokers can manage their own loads" on public.loads
  for all using (auth.uid() = broker_id);

create policy "Dispatchers can view and manage assigned loads" on public.loads
  for all using (auth.uid() = dispatcher_id or status = 'available');

-- Trucks & Drivers Policies (Dispatchers manage their fleet)
create policy "Dispatchers manage their own trucks" on public.trucks
  for all using (auth.uid() = dispatcher_id);

create policy "Dispatchers manage their own drivers" on public.drivers
  for all using (auth.uid() = dispatcher_id);

-- Shippers Policies (Brokers manage their shippers)
create policy "Brokers manage their shippers" on public.shippers
  for all using (auth.uid() = broker_id);
