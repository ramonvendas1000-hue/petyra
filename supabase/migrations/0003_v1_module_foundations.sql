-- V1 persistence foundations. These tables are NOT functional modules or deployed integrations.
-- No client access until a reviewed endpoint/RPC and its tenant tests are added.
begin;

alter table public.products
  add column category text,
  add column stock_minimum integer not null default 0 check(stock_minimum>=0);
-- Extend the safe catalog projection after adding public catalog fields.
grant select(category,stock_minimum) on public.products to authenticated;
alter table public.pet_styles
  add column schema_version integer not null default 1 check(schema_version>0),
  add column model_asset_id text,
  add column tutor_confirmed_at timestamptz,
  add column tutor_confirmed_by uuid references public.tutors(id);

create table public.customer_crm (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, tutor_id uuid not null,
  stage text not null default 'new_contact' check(stage in ('new_contact','first_booking','active','return_due','overdue','at_risk','inactive','recovered')),
  tags text[] not null default '{}', internal_notes text, expected_return_at timestamptz,
  campaign_consent boolean not null default false,
  unique(organization_id,tutor_id),
  foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  created_at timestamptz not null default now()
);
alter table public.customer_crm enable row level security;
revoke all on public.customer_crm from public, anon, authenticated;
grant all on public.customer_crm to service_role;

create table public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, tutor_id uuid not null, assigned_to uuid,
  title text not null, due_at timestamptz, completed_at timestamptz,
  foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  foreign key(organization_id,assigned_to) references public.organization_members(organization_id,user_id),
  created_at timestamptz not null default now()
);
alter table public.crm_tasks enable row level security;
revoke all on public.crm_tasks from public, anon, authenticated;
grant all on public.crm_tasks to service_role;

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, pet_id uuid not null, service_id uuid not null,
  starts_after timestamptz not null, ends_before timestamptz not null,
  status text not null default 'waiting' check(status in ('waiting','offered','accepted','expired','cancelled')),
  offer_expires_at timestamptz, check(ends_before>starts_after),
  foreign key(organization_id,pet_id) references public.pets(organization_id,id),
  foreign key(organization_id,service_id) references public.services(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.waitlist_entries enable row level security;
revoke all on public.waitlist_entries from public, anon, authenticated;
grant all on public.waitlist_entries to service_role;

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, product_id uuid not null, quantity_delta integer not null check(quantity_delta<>0),
  reason text not null check(reason in ('receipt','sale','return','adjustment')),
  idempotency_key text not null, created_by uuid references public.profiles(id), unique(organization_id,idempotency_key),
  foreign key(organization_id,product_id) references public.products(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.inventory_movements enable row level security;
revoke all on public.inventory_movements from public, anon, authenticated;
grant all on public.inventory_movements to service_role;

create table public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, product_id uuid not null, order_id uuid not null,
  quantity integer not null check(quantity>0), expires_at timestamptz not null,
  status text not null default 'held' check(status in ('held','consumed','released')),
  unique(order_id,product_id),
  foreign key(organization_id,product_id) references public.products(organization_id,id),
  foreign key(organization_id,order_id) references public.orders(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.inventory_reservations enable row level security;
revoke all on public.inventory_reservations from public, anon, authenticated;
grant all on public.inventory_reservations to service_role;

create table public.merchant_payment_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  provider text not null, provider_recipient_id text not null, status text not null check(status in ('pending','verified','restricted')),
  unique(organization_id,provider), unique(provider,provider_recipient_id),
  created_at timestamptz not null default now()
);
alter table public.merchant_payment_accounts enable row level security;
revoke all on public.merchant_payment_accounts from public, anon, authenticated;
grant all on public.merchant_payment_accounts to service_role;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, order_id uuid not null, provider text not null, provider_payment_id text,
  kind text not null check(kind in ('full','deposit','balance')),
  status text not null default 'pending' check(status in ('pending','paid','failed','partially_refunded','refunded')),
  amount_cents integer not null check(amount_cents>=0), platform_fee_cents integer not null default 0,
  gateway_fee_cents integer, currency text not null default 'BRL' check(currency='BRL'),
  idempotency_key text not null, paid_at timestamptz,
  check(platform_fee_cents>=0 and platform_fee_cents<=amount_cents),
  check(gateway_fee_cents is null or gateway_fee_cents>=0),
  unique(organization_id,id), unique(organization_id,idempotency_key), unique(provider,provider_payment_id),
  foreign key(organization_id,order_id) references public.orders(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
revoke all on public.payments from public, anon, authenticated;
grant all on public.payments to service_role;

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null, provider_event_id text not null, provider_payment_id text not null,
  signature_verified_at timestamptz not null, received_at timestamptz not null default now(),
  processed_at timestamptz, status text not null check(status in ('pending','processed','failed')),
  sanitized_payload jsonb not null default '{}', unique(provider,provider_event_id),
  created_at timestamptz not null default now()
);
alter table public.payment_events enable row level security;
revoke all on public.payment_events from public, anon, authenticated;
grant all on public.payment_events to service_role;

create table public.payment_refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, payment_id uuid not null, provider_refund_id text,
  amount_cents integer not null check(amount_cents>0), platform_fee_refund_cents integer not null default 0,
  idempotency_key text not null, status text not null check(status in ('pending','completed','failed')),
  check(platform_fee_refund_cents>=0 and platform_fee_refund_cents<=amount_cents),
  unique(organization_id,idempotency_key),
  foreign key(organization_id,payment_id) references public.payments(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.payment_refunds enable row level security;
revoke all on public.payment_refunds from public, anon, authenticated;
grant all on public.payment_refunds to service_role;

create table public.finance_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, payment_id uuid not null,
  kind text not null check(kind in ('service','product','deposit','platform_fee','gateway_fee','refund','reversal')),
  amount_cents integer not null, occurred_at timestamptz not null, idempotency_key text not null,
  unique(organization_id,idempotency_key),
  foreign key(organization_id,payment_id) references public.payments(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.finance_ledger enable row level security;
revoke all on public.finance_ledger from public, anon, authenticated;
grant all on public.finance_ledger to service_role;

create table public.billing_offers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, audience text not null check(audience in ('business','tutor_club')),
  price_cents integer not null check(price_cents>=0), trial_days integer not null default 0 check(trial_days>=0),
  first_paid_month_discount_percent integer not null default 0 check(first_paid_month_discount_percent between 0 and 100),
  disclosure_version text not null, approved_at timestamptz, provider_price_id text,
  created_at timestamptz not null default now()
);
alter table public.billing_offers enable row level security;
revoke all on public.billing_offers from public, anon, authenticated;
grant all on public.billing_offers to service_role;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id), tutor_id uuid references public.tutors(id),
  billing_offer_id uuid not null references public.billing_offers(id), provider text not null,
  provider_subscription_id text not null, status text not null check(status in ('trialing','active','past_due','cancelled')),
  trial_ends_at timestamptz, next_charge_at timestamptz, cancel_at_period_end boolean not null default false,
  consent_recorded_at timestamptz not null, disclosure_version text not null,
  check((organization_id is not null)::integer+(tutor_id is not null)::integer=1),
  unique(provider,provider_subscription_id),
  created_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from public, anon, authenticated;
grant all on public.subscriptions to service_role;

create table public.service_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id), name text not null,
  price_cents integer not null check(price_cents>=0), service_allowances jsonb not null default '[]',
  active boolean not null default true, unique(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.service_plans enable row level security;
revoke all on public.service_plans from public, anon, authenticated;
grant all on public.service_plans to service_role;

create table public.service_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, tutor_id uuid not null, service_plan_id uuid not null,
  status text not null check(status in ('active','past_due','cancelled')), cycle_ends_at timestamptz not null,
  provider_subscription_id text, unique(organization_id,id),
  foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  foreign key(organization_id,service_plan_id) references public.service_plans(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.service_subscriptions enable row level security;
revoke all on public.service_subscriptions from public, anon, authenticated;
grant all on public.service_subscriptions to service_role;

create table public.service_redemptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, service_subscription_id uuid not null, appointment_id uuid not null,
  cycle_start date not null, idempotency_key text not null, unique(organization_id,idempotency_key),
  unique(service_subscription_id,appointment_id),
  foreign key(organization_id,service_subscription_id) references public.service_subscriptions(organization_id,id),
  foreign key(organization_id,appointment_id) references public.appointments(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.service_redemptions enable row level security;
revoke all on public.service_redemptions from public, anon, authenticated;
grant all on public.service_redemptions to service_role;

create table public.reward_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id), name text not null,
  event_kind text not null, points integer not null check(points>0), active boolean not null default false,
  configuration jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.reward_rules enable row level security;
revoke all on public.reward_rules from public, anon, authenticated;
grant all on public.reward_rules to service_role;

create table public.reward_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, tutor_id uuid not null, points_delta integer not null check(points_delta<>0),
  reason text not null check(reason in ('visit','purchase','referral','review','redemption','reversal')),
  idempotency_key text not null, unique(organization_id,idempotency_key),
  foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  created_at timestamptz not null default now()
);
alter table public.reward_ledger enable row level security;
revoke all on public.reward_ledger from public, anon, authenticated;
grant all on public.reward_ledger to service_role;

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, referrer_tutor_id uuid not null, referred_tutor_id uuid,
  code_hash text not null unique, converted_at timestamptz,
  check(referred_tutor_id is null or referred_tutor_id<>referrer_tutor_id),
  foreign key(organization_id,referrer_tutor_id) references public.organization_tutors(organization_id,tutor_id),
  foreign key(organization_id,referred_tutor_id) references public.organization_tutors(organization_id,tutor_id),
  created_at timestamptz not null default now()
);
alter table public.referrals enable row level security;
revoke all on public.referrals from public, anon, authenticated;
grant all on public.referrals to service_role;

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, appointment_id uuid not null, tutor_id uuid not null,
  rating integer not null check(rating between 1 and 5), comment text,
  unique(appointment_id,tutor_id),
  foreign key(organization_id,appointment_id) references public.appointments(organization_id,id),
  foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
revoke all on public.reviews from public, anon, authenticated;
grant all on public.reviews to service_role;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id), name text not null,
  segment jsonb not null default '{}', channel text not null check(channel in ('push','whatsapp','email')),
  status text not null default 'draft' check(status in ('draft','approved','scheduled','sent','cancelled')),
  approved_by uuid, scheduled_at timestamptz,
  foreign key(organization_id,approved_by) references public.organization_members(organization_id,user_id),
  created_at timestamptz not null default now()
);
alter table public.campaigns enable row level security;
revoke all on public.campaigns from public, anon, authenticated;
grant all on public.campaigns to service_role;

create table public.pet_health_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id), recorded_by uuid references public.profiles(id),
  category text not null check(category in ('vaccine','exam','prescription','medication','weight','allergy')),
  recorded_at timestamptz not null, due_at timestamptz, data jsonb not null default '{}',
  storage_path text, visible_to_tutor boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.pet_health_records enable row level security;
revoke all on public.pet_health_records from public, anon, authenticated;
grant all on public.pet_health_records to service_role;

create table public.pet_ids (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id), token_hash text not null unique,
  enabled boolean not null default false, public_profile jsonb not null default '{}',
  consented_by uuid not null references public.tutors(id), consented_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.pet_ids enable row level security;
revoke all on public.pet_ids from public, anon, authenticated;
grant all on public.pet_ids to service_role;

create table public.pet_id_scans (
  id uuid primary key default gen_random_uuid(),
  pet_id_registration_id uuid not null references public.pet_ids(id),
  scanned_at timestamptz not null default now(), notification_deduplication_key text not null unique,
  created_at timestamptz not null default now()
);
alter table public.pet_id_scans enable row level security;
revoke all on public.pet_id_scans from public, anon, authenticated;
grant all on public.pet_id_scans to service_role;

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id), organization_id uuid references public.organizations(id),
  event_kind text not null, channel text not null check(channel in ('push','whatsapp','email')),
  enabled boolean not null default false, consented_at timestamptz,
  unique nulls not distinct(user_id,organization_id,event_kind,channel),
  created_at timestamptz not null default now()
);
alter table public.notification_preferences enable row level security;
revoke all on public.notification_preferences from public, anon, authenticated;
grant all on public.notification_preferences to service_role;

create table public.push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id), provider text not null,
  token text not null, platform text not null check(platform in ('ios','android','web')),
  active boolean not null default true, last_seen_at timestamptz not null default now(), unique(provider,token),
  created_at timestamptz not null default now()
);
alter table public.push_devices enable row level security;
revoke all on public.push_devices from public, anon, authenticated;
grant all on public.push_devices to service_role;

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id), organization_id uuid references public.organizations(id),
  event_kind text not null, channel text not null check(channel in ('push','whatsapp','email')),
  payload jsonb not null default '{}', deduplication_key text not null unique,
  status text not null default 'pending' check(status in ('pending','processing','sent','retry','failed')),
  attempts integer not null default 0 check(attempts>=0), next_attempt_at timestamptz not null default now(),
  provider_message_id text, last_error_code text,
  created_at timestamptz not null default now()
);
alter table public.notification_outbox enable row level security;
revoke all on public.notification_outbox from public, anon, authenticated;
grant all on public.notification_outbox to service_role;

create table public.staff_targets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, user_id uuid not null, period_start date not null, period_end date not null,
  target_cents integer not null check(target_cents>=0), check(period_end>=period_start),
  foreign key(organization_id,user_id) references public.organization_members(organization_id,user_id),
  created_at timestamptz not null default now()
);
alter table public.staff_targets enable row level security;
revoke all on public.staff_targets from public, anon, authenticated;
grant all on public.staff_targets to service_role;

create table public.commission_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, user_id uuid not null, payment_id uuid not null,
  amount_cents integer not null, rule_snapshot jsonb not null, idempotency_key text not null,
  unique(organization_id,idempotency_key),
  foreign key(organization_id,user_id) references public.organization_members(organization_id,user_id),
  foreign key(organization_id,payment_id) references public.payments(organization_id,id),
  created_at timestamptz not null default now()
);
alter table public.commission_entries enable row level security;
revoke all on public.commission_entries from public, anon, authenticated;
grant all on public.commission_entries to service_role;

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id), actor_id uuid references public.profiles(id),
  action text not null, entity_type text not null, entity_id uuid, correlation_id text not null,
  sanitized_metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.audit_events enable row level security;
revoke all on public.audit_events from public, anon, authenticated;
grant all on public.audit_events to service_role;

-- A cancellation/reversal is a new entry, never an edited ledger history.
create function public.reject_ledger_mutation() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'Append-only ledger: create a compensating entry' using errcode='55000'; end $$;
revoke all on function public.reject_ledger_mutation() from public, anon, authenticated;
create trigger finance_ledger_append_only before update or delete on public.finance_ledger
  for each row execute function public.reject_ledger_mutation();
create trigger reward_ledger_append_only before update or delete on public.reward_ledger
  for each row execute function public.reject_ledger_mutation();

create index notification_outbox_delivery_idx on public.notification_outbox(status,next_attempt_at);
create index reservations_expiry_idx on public.inventory_reservations(expires_at) where status='held';
create index health_pet_recorded_idx on public.pet_health_records(pet_id,recorded_at);
create index finance_org_occurred_idx on public.finance_ledger(organization_id,occurred_at);
create index customer_crm_org_stage_idx on public.customer_crm(organization_id,stage);
commit;
