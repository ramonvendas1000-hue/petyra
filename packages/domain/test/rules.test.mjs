import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quoteCheckout, businessPlans, clubProposal, futureCapabilities, canAdvanceJourney, assertTenantPermission} from '../src/index.ts';
import {canWithMembership} from '../../shared/src/permissions.ts';
const line = (id, kind, price, quantity=1) => ({id, kind, organizationId:'shop-a', quantity, unitPriceCents:price});
test('mixed cart: 8% products, 0% services, service deposit and full product payment', () => {
  const q=quoteCheckout({organizationId:'shop-a',channel:'tutor_app',serviceDepositPercent:20,lines:[line('bath','service',10000),line('food','product',5000,3)]});
  assert.equal(q.totalCents,25000); assert.equal(q.dueNowCents,17000); assert.equal(q.remainingCents,8000);
  assert.equal(q.platformFeeCents,1200); assert.equal(q.merchantGrossCents,15800);
  assert.equal(q.lines[0].platformFeeCents,0); assert.equal(q.gatewayFeeCents,null);
});
test('counter sales and service-only recurring purchases have zero platform commission',()=>{
  for(const channel of ['counter','tutor_app']) assert.equal(quoteCheckout({organizationId:'shop-a',channel,lines:[line('club','service',30000)]}).platformFeeCents,0);
  assert.equal(quoteCheckout({organizationId:'shop-a',channel:'counter',lines:[line('p','product',10000)]}).platformFeeCents,0);
});
test('discounted merchandise and integer rounding preserve money conservation',()=>{
  const q=quoteCheckout({organizationId:'shop-a',channel:'tutor_app',lines:[{...line('p','product',101),discountCents:1}]});
  assert.equal(q.platformFeeCents,8); assert.equal(q.merchantGrossCents+q.platformFeeCents,q.dueNowCents);
  for(let price=0;price<1000;price++){
    const x=quoteCheckout({organizationId:'shop-a',channel:'tutor_app',serviceDepositPercent:30,lines:[line('s','service',price),line('p','product',price)]});
    assert.equal(x.dueNowCents+x.remainingCents,x.totalCents);
    assert.equal(x.merchantGrossCents+x.platformFeeCents,x.dueNowCents);
  }
});
test('reject tenant mixing, malformed amounts, duplicate lines, invalid channels and overflow',()=>{
  const base={organizationId:'shop-a',channel:'tutor_app',lines:[line('p','product',100)]};
  for(const field of [
    {lines:[{...line('x','product',1),organizationId:'shop-b'}]},
    {lines:[line('p','product',-1)]},{lines:[line('p','product',NaN)]},
    {lines:[line('p','product',1,0)]},{lines:[line('p','product',1,1.2)]},
    {lines:[line('p','product',Number.MAX_SAFE_INTEGER,2)]},
    {lines:[{...line('p','product',100),discountCents:101}]},
    {lines:[line('p','product',1),line('p','service',2)]},
    {lines:[]},{serviceDepositPercent:101},{serviceDepositPercent:-1},{channel:'unknown'}
  ]) assert.throws(()=>quoteCheckout({...base,...field}));
});
test('access requires server-resolved active membership, matching tenant and permission',()=>{
  const actor={userId:'u1',organizationId:'shop-a',membershipActive:true,permissions:['store.read']};
  assert.doesNotThrow(()=>assertTenantPermission(actor,'shop-a','store.read'));
  assert.throws(()=>assertTenantPermission(actor,'shop-b','store.read'));
  assert.throws(()=>assertTenantPermission(actor,'shop-a','team.manage'));
  assert.throws(()=>assertTenantPermission({...actor,membershipActive:false},'shop-a','store.read'));
});
test('plans are cumulative; candidate offers and future AI do not activate billing',()=>{
  for(const f of businessPlans.essential.features) assert.ok(businessPlans.pro.features.includes(f));
  for(const f of businessPlans.pro.features) assert.ok(businessPlans.premium.features.includes(f));
  assert.deepEqual(Object.values(businessPlans).map(x=>x.monthlyPriceCents),[7990,14990,24990]);
  assert.equal(clubProposal.billingEnabled,false);assert.equal(futureCapabilities.copilot,false);
});
test('journey does not reopen completed or cancelled appointments',()=>{
  assert.ok(canAdvanceJourney('scheduled','checked_in'));
  assert.ok(canAdvanceJourney('drying','finishing'));
  assert.equal(canAdvanceJourney('completed','scheduled'),false);
  assert.equal(canAdvanceJourney('cancelled','checked_in'),false);
  assert.equal(canAdvanceJourney('scheduled','completed'),false);
});
test('UI permission projection honors deny, explicit grants, tenant and inactive membership',()=>{
  const member={organizationId:'a',active:true,role:'groomer',customPermissions:['store.read'],permissionOverrides:{'appointments.read':false}};
  assert.equal(canWithMembership(member,'a','store.read'),true);
  assert.equal(canWithMembership(member,'a','appointments.read'),false);
  assert.equal(canWithMembership(member,'b','store.read'),false);
  assert.equal(canWithMembership({...member,active:false},'a','store.read'),false);
});
