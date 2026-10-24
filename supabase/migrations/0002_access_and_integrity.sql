-- Additive hardening. 0001 is retained unchanged. Apply in a transaction.
-- No production connection is configured by this repository.
begin;

alter table public.organization_members add column permission_overrides jsonb not null default '{}'::jsonb
  check (jsonb_typeof(permission_overrides) = 'object');

create or replace function public.has_org_permission(org_id uuid, required_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((
    select case
      when m.role = 'owner' then true
      when m.permission_overrides ? required_permission then m.permission_overrides -> required_permission = 'true'::jsonb
      when m.custom_permissions ? required_permission then true
      when m.role = 'manager' then required_permission = any(array[
        'dashboard.view','appointments.read','appointments.write','clients.read','clients.write',
        'pets.read','pets.write','photos.write','petstyle.read','petstyle.write','store.read',
        'store.write','finance.read','finance.write','reports.read'])
      when m.role = 'reception' then required_permission = any(array[
        'dashboard.view','appointments.read','appointments.write','clients.read','clients.write',
        'pets.read','pets.write','store.read','finance.read'])
      when m.role = 'groomer' then required_permission = any(array[
        'appointments.read','pets.read','photos.write','petstyle.read','petstyle.write'])
      when m.role = 'veterinarian' then required_permission = any(array[
        'appointments.read','pets.read','pets.write','photos.write'])
      else false end
    from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid() and m.active
  ), false)
$$;
revoke all on function public.has_org_permission(uuid,text) from public, anon;
grant execute on function public.has_org_permission(uuid,text) to authenticated, service_role;

create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.organization_members m where m.organization_id=org_id and m.user_id=auth.uid() and m.active)
$$;
create or replace function public.is_pet_tutor(pet uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.pet_tutors pt join public.tutors t on t.id=pt.tutor_id
    where pt.pet_id=pet and t.user_id=auth.uid())
$$;
revoke all on function public.is_org_member(uuid), public.is_pet_tutor(uuid) from public, anon;
grant execute on function public.is_org_member(uuid), public.is_pet_tutor(uuid) to authenticated, service_role;

create table public.organization_tutors (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  active boolean not null default true,
  linked_at timestamptz not null default now(),
  primary key (organization_id,tutor_id)
);
insert into public.organization_tutors(organization_id,tutor_id)
select distinct p.organization_id, pt.tutor_id from public.pets p
join public.pet_tutors pt on pt.pet_id=p.id where p.organization_id is not null
on conflict do nothing;
alter table public.organization_tutors enable row level security;
revoke all on public.organization_tutors from anon, authenticated;
grant select on public.organization_tutors to authenticated;
grant all on public.organization_tutors to service_role;
create policy "business client links" on public.organization_tutors for select to authenticated
using(public.has_org_permission(organization_id,'clients.read'));
create policy "own active business links" on public.organization_tutors for select to authenticated
using(active and exists(select 1 from public.tutors t where t.id=tutor_id and t.user_id=auth.uid()));

drop policy "business pets read" on public.pets;
create policy "business pets read" on public.pets for select to authenticated
using(public.has_org_permission(organization_id,'pets.read'));
drop policy "business appointments read" on public.appointments;
create policy "business appointments read" on public.appointments for select to authenticated
using(public.has_org_permission(organization_id,'appointments.read'));
drop policy "business photos read" on public.pet_photos;
create policy "business photos read" on public.pet_photos for select to authenticated
using(public.has_org_permission(organization_id,'pets.read'));
drop policy "business products read" on public.products;
create policy "business products read" on public.products for select to authenticated
using(public.has_org_permission(organization_id,'store.read'));
drop policy "linked tutor products read" on public.products;
create policy "linked tutor active products read" on public.products for select to authenticated
using(active and exists(
  select 1 from public.organization_tutors ot join public.tutors t on t.id=ot.tutor_id
  where ot.organization_id=products.organization_id and ot.active and t.user_id=auth.uid()
));

-- RLS filters rows, not columns. Direct clients must select these safe columns explicitly.
-- Values in existing private columns are preserved. Authorized Business access uses RPC below.
revoke select on public.appointments, public.products, public.pets from public, anon, authenticated;
grant select (id,organization_id,pet_id,service_id,assigned_to,starts_at,ends_at,stage,deposit_cents,total_cents,tutor_notes,created_at)
  on public.appointments to authenticated;
grant select (id,organization_id,name,description,sku,price_cents,stock_quantity,active,image_url,created_at)
  on public.products to authenticated;
grant select (id,organization_id,name,species,breed,birth_date,sex,weight_kg,microchip,created_at)
  on public.pets to authenticated;

create function public.read_business_appointment_private(target_id uuid)
returns table(id uuid, internal_notes text) language sql stable security definer set search_path = '' as $$
  select a.id,a.internal_notes from public.appointments a
  where a.id=target_id and public.has_org_permission(a.organization_id,'appointments.read')
$$;
create function public.read_business_product_cost(target_id uuid)
returns table(id uuid, cost_cents integer) language sql stable security definer set search_path = '' as $$
  select p.id,p.cost_cents from public.products p
  where p.id=target_id and public.has_org_permission(p.organization_id,'finance.read')
$$;
create function public.read_business_pet_notes(target_id uuid)
returns table(id uuid, notes text) language sql stable security definer set search_path = '' as $$
  select p.id,p.notes from public.pets p
  where p.id=target_id and public.has_org_permission(p.organization_id,'pets.read')
$$;
revoke all on function public.read_business_appointment_private(uuid), public.read_business_product_cost(uuid),
  public.read_business_pet_notes(uuid) from public, anon;
grant execute on function public.read_business_appointment_private(uuid), public.read_business_product_cost(uuid),
  public.read_business_pet_notes(uuid) to authenticated, service_role;

-- Cross-tenant referential integrity. Invalid legacy rows cause rollback, never deletion.
alter table public.pets add constraint pets_org_id_unique unique(organization_id,id);
alter table public.services add constraint services_org_id_unique unique(organization_id,id);
alter table public.products add constraint products_org_id_unique unique(organization_id,id);
alter table public.appointments add constraint appointments_org_id_unique unique(organization_id,id);
alter table public.orders add constraint orders_org_id_unique unique(organization_id,id);
alter table public.appointments
  add constraint appointment_pet_same_org foreign key(organization_id,pet_id) references public.pets(organization_id,id),
  add constraint appointment_service_same_org foreign key(organization_id,service_id) references public.services(organization_id,id),
  add constraint appointment_staff_same_org foreign key(organization_id,assigned_to) references public.organization_members(organization_id,user_id),
  add constraint appointment_valid_money check(total_cents>=0 and deposit_cents>=0 and deposit_cents<=total_cents),
  add constraint appointment_valid_time check(ends_at is null or ends_at>starts_at);
alter table public.pet_photos
  add constraint photo_pet_same_org foreign key(organization_id,pet_id) references public.pets(organization_id,id),
  add constraint photo_appointment_same_org foreign key(organization_id,appointment_id) references public.appointments(organization_id,id);
alter table public.pet_styles
  add constraint style_pet_same_org foreign key(organization_id,pet_id) references public.pets(organization_id,id),
  add constraint style_appointment_same_org foreign key(organization_id,appointment_id) references public.appointments(organization_id,id);
alter table public.orders
  add constraint order_appointment_same_org foreign key(organization_id,appointment_id) references public.appointments(organization_id,id),
  add constraint order_tutor_same_org foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  add constraint order_valid_money check(subtotal_cents>=0 and total_cents>=0 and platform_fee_cents>=0 and platform_fee_cents<=total_cents);
alter table public.order_items
  add column organization_id uuid;
update public.order_items i set organization_id=o.organization_id from public.orders o where o.id=i.order_id;
alter table public.order_items alter column organization_id set not null;
alter table public.order_items
  add constraint item_order_same_org foreign key(organization_id,order_id) references public.orders(organization_id,id),
  add constraint item_product_same_org foreign key(organization_id,product_id) references public.products(organization_id,id),
  add constraint item_service_same_org foreign key(organization_id,service_id) references public.services(organization_id,id),
  add constraint item_exactly_one_kind check(
    (item_type='product' and product_id is not null and service_id is null) or
    (item_type='service' and service_id is not null and product_id is null)),
  add constraint item_valid_money check(quantity>0 and unit_price_cents>=0 and platform_fee_cents>=0
    and platform_fee_cents::bigint<=quantity::bigint*unit_price_cents::bigint),
  add constraint no_service_platform_fee check(item_type<>'service' or platform_fee_cents=0);
alter table public.products
  add constraint product_nonnegative_money check(price_cents>=0 and (cost_cents is null or cost_cents>=0)),
  add constraint product_nonnegative_stock check(stock_quantity>=0);
alter table public.services add constraint service_valid_price_duration check(price_cents>=0 and duration_minutes>0);
alter table public.crm_opportunities
  add constraint opportunity_tutor_same_org foreign key(organization_id,tutor_id) references public.organization_tutors(organization_id,tutor_id),
  add constraint opportunity_pet_same_org foreign key(organization_id,pet_id) references public.pets(organization_id,id);

create index appointments_org_starts_idx on public.appointments(organization_id,starts_at);
create index pet_tutors_tutor_idx on public.pet_tutors(tutor_id);
create index org_members_user_active_idx on public.organization_members(user_id,organization_id) where active;
create index orders_org_created_idx on public.orders(organization_id,created_at);
create index photos_pet_created_idx on public.pet_photos(pet_id,created_at);

commit;
