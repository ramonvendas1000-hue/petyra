-- Petyra foundation: multi-tenant business + tutor model
create extension if not exists "pgcrypto";

create type public.business_role as enum ('owner','manager','reception','groomer','veterinarian','custom');
create type public.appointment_stage as enum ('scheduled','checked_in','bathing','drying','grooming','finishing','ready','completed','cancelled');
create type public.photo_kind as enum ('before','after','general');
create type public.order_status as enum ('draft','pending_payment','paid','preparing','ready','completed','cancelled','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  brand_color text default '#6D4DFF',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.business_role not null default 'custom',
  custom_permissions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);

create table public.tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  club_status text not null default 'free',
  created_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null,
  species text not null default 'dog',
  breed text,
  birth_date date,
  sex text,
  weight_kg numeric(6,2),
  microchip text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.pet_tutors (
  pet_id uuid not null references public.pets(id) on delete cascade,
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  is_primary boolean not null default false,
  primary key(pet_id,tutor_id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  price_cents integer not null default 0,
  duration_minutes integer not null default 60,
  active boolean not null default true
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  service_id uuid references public.services(id),
  assigned_to uuid references public.profiles(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  stage public.appointment_stage not null default 'scheduled',
  deposit_cents integer not null default 0,
  total_cents integer not null default 0,
  tutor_notes text,
  internal_notes text,
  created_at timestamptz not null default now()
);

create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  stage public.appointment_stage not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  kind public.photo_kind not null default 'general',
  storage_path text not null,
  visible_to_tutor boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.pet_documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text not null,
  category text not null,
  storage_path text not null,
  expires_at date,
  visible_to_tutor boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.pet_styles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  title text not null,
  style_data jsonb not null default '{}'::jsonb,
  reference_photo_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  sku text,
  price_cents integer not null,
  cost_cents integer,
  stock_quantity integer not null default 0,
  active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tutor_id uuid references public.tutors(id),
  appointment_id uuid references public.appointments(id) on delete set null,
  status public.order_status not null default 'draft',
  subtotal_cents integer not null default 0,
  platform_fee_cents integer not null default 0,
  total_cents integer not null default 0,
  pickup_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  service_id uuid references public.services(id),
  item_type text not null check(item_type in ('product','service')),
  quantity integer not null default 1,
  unit_price_cents integer not null,
  platform_fee_cents integer not null default 0
);

create table public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tutor_id uuid references public.tutors(id),
  pet_id uuid references public.pets(id),
  kind text not null,
  title text not null,
  estimated_value_cents integer not null default 0,
  status text not null default 'open',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  body text not null,
  channel text not null default 'push',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Helper functions
create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.organization_members m where m.organization_id = org_id and m.user_id = auth.uid() and m.active = true)
$$;

create or replace function public.is_pet_tutor(pet uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.pet_tutors pt
    join public.tutors t on t.id = pt.tutor_id
    where pt.pet_id = pet and t.user_id = auth.uid()
  )
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.tutors enable row level security;
alter table public.pets enable row level security;
alter table public.pet_tutors enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_events enable row level security;
alter table public.pet_photos enable row level security;
alter table public.pet_documents enable row level security;
alter table public.pet_styles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.crm_opportunities enable row level security;
alter table public.notifications enable row level security;

create policy "profile self read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profile self update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "org members read org" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "members read same org" on public.organization_members for select to authenticated using (public.is_org_member(organization_id));

create policy "tutor self read" on public.tutors for select to authenticated using (user_id = auth.uid());
create policy "business pets read" on public.pets for select to authenticated using (organization_id is not null and public.is_org_member(organization_id));
create policy "tutor own pets read" on public.pets for select to authenticated using (public.is_pet_tutor(id));

create policy "business appointments read" on public.appointments for select to authenticated using (public.is_org_member(organization_id));
create policy "tutor appointments read" on public.appointments for select to authenticated using (public.is_pet_tutor(pet_id));

create policy "business photos read" on public.pet_photos for select to authenticated using (public.is_org_member(organization_id));
create policy "tutor visible photos read" on public.pet_photos for select to authenticated using (visible_to_tutor and public.is_pet_tutor(pet_id));

create policy "business products read" on public.products for select to authenticated using (public.is_org_member(organization_id));
create policy "linked tutor products read" on public.products for select to authenticated using (
  exists(select 1 from public.pets p where p.organization_id = products.organization_id and public.is_pet_tutor(p.id))
);

create policy "notifications self read" on public.notifications for select to authenticated using (user_id = auth.uid());
