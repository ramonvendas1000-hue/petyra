import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';
const db=new PGlite({extensions:{pgcrypto}});
const id=n=>'00000000-0000-4000-8000-'+String(n).padStart(12,'0');
const q=async(sql,params=[]) => (await db.query(sql,params)).rows;
async function asUser(user,sql,params=[],role='authenticated'){
  await db.exec('set role '+role);
  try {
    await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user ? id(user):'']);
    return await q(sql,params);
  } finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
before(async()=>{
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth,public to anon,authenticated,service_role;
    grant execute on function auth.uid() to anon,authenticated,service_role;
    alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
  `);
  const dir=new URL('../migrations/',import.meta.url);
  const migrations=(await readdir(dir)).filter(x=>x.endsWith('.sql')).sort();
  await db.exec(await readFile(new URL(migrations[0],dir),'utf8'));
  for(const n of [1,2,3,4,5,6,7]){
    await db.query('insert into auth.users values($1)',[id(n)]);
    await db.query('insert into public.profiles(id,full_name) values($1,$2)',[id(n),'Synthetic user '+n]);
  }
  await db.query('insert into public.organizations(id,name,slug,created_by) values($1,$2,$3,$4),($5,$6,$7,$8)',[id(101),'Shop A','shop-a',id(1),id(102),'Shop B','shop-b',id(2)]);
  for(const [org,user,role,active] of [[101,1,'owner',true],[102,2,'owner',true],[101,5,'groomer',true],[101,6,'manager',false],[101,7,'custom',true]]){
    await db.query('insert into public.organization_members(organization_id,user_id,role,active) values($1,$2,$3,$4)',[id(org),id(user),role,active]);
  }
  for(const [org,pet,product,appointment,service,tutor,user] of [[101,201,301,401,501,601,3],[102,202,302,402,502,602,4]]){
    await db.query('insert into public.tutors(id,user_id) values($1,$2)',[id(tutor),id(user)]);
    await db.query('insert into public.pets(id,organization_id,name,notes) values($1,$2,$3,$4)',[id(pet),id(org),'Synthetic pet','Private pet note']);
    await db.query('insert into public.pet_tutors(pet_id,tutor_id) values($1,$2)',[id(pet),id(tutor)]);
    await db.query('insert into public.products(id,organization_id,name,price_cents,cost_cents) values($1,$2,$3,1000,400)',[id(product),id(org),'Synthetic product']);
    await db.query('insert into public.services(id,organization_id,name,price_cents) values($1,$2,$3,10000)',[id(service),id(org),'Bath']);
    await db.query("insert into public.appointments(id,organization_id,pet_id,service_id,starts_at,internal_notes,total_cents) values($1,$2,$3,$4,'2026-10-23T15:00:00Z','Private appointment note',10000)",[id(appointment),id(org),id(pet),id(service)]);
  }
  for(const migration of migrations.slice(1)) await db.exec(await readFile(new URL(migration,dir),'utf8'));
  await db.query("insert into public.products(id,organization_id,name,price_cents,active) values($1,$2,'Inactive',1000,false)",[id(303),id(101)]);
});
after(async()=>{await db.close()});
test('all migrations apply and preserve legacy notes and links',async()=>{
  assert.equal((await q('select internal_notes from public.appointments where id=$1',[id(401)]))[0].internal_notes,'Private appointment note');
  assert.equal((await q('select count(*)::integer as n from public.organization_tutors'))[0].n,2);
});
test('tenant A cannot read B; tutor sees only own pet and appointment',async()=>{
  assert.deepEqual((await asUser(1,'select id from public.pets')).map(x=>x.id),[id(201)]);
  assert.deepEqual((await asUser(2,'select id from public.appointments')).map(x=>x.id),[id(402)]);
  assert.deepEqual((await asUser(3,'select id from public.pets')).map(x=>x.id),[id(201)]);
  assert.deepEqual((await asUser(3,'select id from public.appointments')).map(x=>x.id),[id(401)]);
  assert.deepEqual(await asUser(3,'select id from public.appointments where id=$1',[id(402)]),[]);
});
test('private catalog requires active link and hides inactive products from tutor',async()=>{
  assert.deepEqual((await asUser(3,'select id from public.products')).map(x=>x.id),[id(301)]);
  await db.query('update public.organization_tutors set active=false where tutor_id=$1',[id(601)]);
  assert.deepEqual(await asUser(3,'select id from public.products'),[]);
  await db.query('update public.organization_tutors set active=true where tutor_id=$1',[id(601)]);
});
test('private notes/cost cannot be selected directly; RPC authorizes business per tenant',async()=>{
  for(const sql of ['select internal_notes from public.appointments','select cost_cents from public.products','select notes from public.pets']){
    await assert.rejects(asUser(3,sql),{code:'42501'});
  }
  assert.deepEqual(await asUser(3,'select * from public.read_business_appointment_private($1)',[id(401)]),[]);
  assert.equal((await asUser(1,'select * from public.read_business_appointment_private($1)',[id(401)]))[0].internal_notes,'Private appointment note');
  assert.deepEqual(await asUser(2,'select * from public.read_business_appointment_private($1)',[id(401)]),[]);
  assert.deepEqual(await asUser(5,'select * from public.read_business_product_cost($1)',[id(301)]),[]);
});
test('inactive members and permission overrides are enforced by SQL',async()=>{
  assert.deepEqual(await asUser(6,'select id from public.appointments'),[]);
  assert.equal((await asUser(5,"select public.has_org_permission($1,'appointments.read') as allowed",[id(101)]))[0].allowed,true);
  await db.query('update public.organization_members set permission_overrides=$1 where user_id=$2',[JSON.stringify({'appointments.read':false}),id(5)]);
  assert.deepEqual(await asUser(5,'select id from public.appointments'),[]);
  await db.query("update public.organization_members set custom_permissions='[\"store.read\"]' where user_id=$1",[id(7)]);
  assert.equal((await asUser(7,"select public.has_org_permission($1,'store.read') as allowed",[id(101)]))[0].allowed,true);
});
test('cross-tenant relationships and invalid money are rejected even by privileged writes',async()=>{
  await assert.rejects(db.query("insert into public.appointments(organization_id,pet_id,service_id,starts_at) values($1,$2,$3,now())",[id(101),id(202),id(501)]),{code:'23503'});
  await assert.rejects(db.query("insert into public.appointments(organization_id,pet_id,service_id,starts_at) values($1,$2,$3,now())",[id(101),id(201),id(502)]),{code:'23503'});
  await assert.rejects(db.query("insert into public.orders(organization_id,tutor_id) values($1,$2)",[id(101),id(602)]),{code:'23503'});
  await assert.rejects(db.query('update public.products set stock_quantity=-1 where id=$1',[id(301)]),{code:'23514'});
});
test('service commission and cross-shop order items cannot be persisted',async()=>{
  await db.query('insert into public.orders(id,organization_id,tutor_id) values($1,$2,$3)',[id(701),id(101),id(601)]);
  await assert.rejects(db.query("insert into public.order_items(organization_id,order_id,item_type,service_id,quantity,unit_price_cents,platform_fee_cents) values($1,$2,'service',$3,1,1000,80)",[id(101),id(701),id(501)]),{code:'23514'});
  await assert.rejects(db.query("insert into public.order_items(organization_id,order_id,item_type,product_id,quantity,unit_price_cents) values($1,$2,'product',$3,1,1000)",[id(101),id(701),id(302)]),{code:'23503'});
});
test('new tables fail closed and anonymous requests cannot obtain pets',async()=>{
  const rows=await q("select c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'");
  assert.ok(rows.length>=40); assert.ok(rows.every(x=>x.relrowsecurity));
  for(const table of ['payments','finance_ledger','pet_ids','notification_outbox','push_devices','subscriptions']){
    for(const role of ['anon','authenticated']) await assert.rejects(asUser(3,'select * from public.'+table,[],role),{code:'42501'});
  }
  await assert.rejects(asUser(null,'select id from public.pets',[],'anon'),{code:'42501'});
  await assert.rejects(asUser(3,"insert into public.products(organization_id,name,price_cents) values($1,'Unauthorized',10)",[id(101)]),{code:'42501'});
});
test('ledger is append-only and webhook IDs deduplicate',async()=>{
  await db.query('insert into public.payments(id,organization_id,order_id,provider,kind,amount_cents,idempotency_key) values($1,$2,$3,\'sandbox-contract\',\'full\',1000,\'pay-1\')',[id(801),id(101),id(701)]);
  await db.query("insert into public.finance_ledger(id,organization_id,payment_id,kind,amount_cents,occurred_at,idempotency_key) values($1,$2,$3,'product',1000,now(),'ledger-1')",[id(901),id(101),id(801)]);
  await assert.rejects(db.query('update public.finance_ledger set amount_cents=1 where id=$1',[id(901)]),{code:'55000'});
  await assert.rejects(db.query('delete from public.finance_ledger where id=$1',[id(901)]),{code:'55000'});
  const sql="insert into public.payment_events(provider,provider_event_id,provider_payment_id,signature_verified_at,status) values('sandbox-contract','evt-1','pay-1',now(),'pending')";
  await db.exec(sql); await assert.rejects(db.exec(sql),{code:'23505'});
});
