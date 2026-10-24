/** Architecture contracts, not evidence of implemented screens or persistence adapters. */
export type Id = string;
export type Instant = string;
export interface TenantEntity { id: Id; organizationId: Id; createdAt: Instant }
export interface TrustedActor {
  userId: Id; organizationId: Id; membershipActive: boolean;
  /** Resolve server-side from organization_members; never accept this array from a client. */
  permissions: readonly string[];
}
export function assertTenantPermission(actor: TrustedActor, organizationId: Id, permission: string): void {
  if (!actor.userId || !actor.membershipActive || actor.organizationId !== organizationId || !actor.permissions.includes(permission)) {
    throw new Error('Forbidden');
  }
}
export type CustomerStage = 'new_contact'|'first_booking'|'active'|'return_due'|'overdue'|'at_risk'|'inactive'|'recovered';
export interface CustomerRecord extends TenantEntity {
  tutorId: Id; tags: string[]; stage: CustomerStage; expectedReturnAt?: Instant;
  internalNotes?: string; consentForCampaigns: boolean;
}
export interface CustomerMetrics {
  completedVisits: number; averageFrequencyDays: number | null; averageTicketCents: number;
  lifetimeRevenueCents: number; potentialRevenueCents: number; recoveredRevenueCents: number;
}
export interface CrmTask extends TenantEntity { tutorId: Id; assignedTo: Id; title: string; dueAt: Instant; completedAt?: Instant }
export interface WaitlistEntry extends TenantEntity { petId: Id; serviceId: Id; startsAfter: Instant; endsBefore: Instant; status: 'waiting'|'offered'|'accepted'|'expired' }
export interface AppointmentRequest { organizationId: Id; petId: Id; serviceIds: Id[]; professionalId: Id; startsAt: Instant; idempotencyKey: string }
export interface PetPhoto extends TenantEntity { petId: Id; appointmentId: Id; kind: 'before'|'after'|'general'; storagePath: string; visibleToTutor: boolean }
export type StyleRegion = 'head'|'ears'|'muzzle'|'chest'|'body'|'legs'|'tail';
export interface PetStyle {
  version: 1; modelAssetId: string;
  regions: Partial<Record<StyleRegion, {lengthMm: number; technique: 'clipper'|'scissors'; comb?: string; notes?: string}>>;
  referencePhotoPath?: string; tutorConfirmedAt?: Instant;
}
export interface HealthRecord {
  id: Id; petId: Id; category: 'vaccine'|'exam'|'prescription'|'medication'|'weight'|'allergy';
  recordedAt: Instant; dueAt?: Instant; storagePath?: string; data: Record<string, unknown>;
}
export interface PetIdPublicProfile { petName: string; emergencyContact?: string; message?: string }
/** Token hashes belong in storage; no public lookup by sequential pet ID. */
export interface PetIdRegistration { petId: Id; tokenHash: string; enabled: boolean; publicProfile: PetIdPublicProfile }
export interface InventoryMovement extends TenantEntity { productId: Id; quantityDelta: number; reason: 'receipt'|'sale'|'return'|'adjustment'; referenceId: Id }
export interface InventoryReservation extends TenantEntity { productId: Id; orderId: Id; quantity: number; expiresAt: Instant; status: 'held'|'consumed'|'released' }
export interface RewardEntry extends TenantEntity { tutorId: Id; pointsDelta: number; reason: 'visit'|'purchase'|'referral'|'review'|'redemption'|'reversal'; idempotencyKey: string }
export interface ServiceMembership extends TenantEntity { tutorId: Id; servicePlanId: Id; status: 'active'|'past_due'|'cancelled'; cycleEndsAt: Instant }
export interface Subscription {
  id: Id; ownerType: 'business'|'tutor_club'; organizationId?: Id; tutorId?: Id;
  offerId: Id; providerSubscriptionId: string; status: 'trialing'|'active'|'past_due'|'cancelled';
  trialEndsAt?: Instant; nextChargeAt: Instant; cancelAtPeriodEnd: boolean;
}
export interface LedgerEntry extends TenantEntity {
  paymentId: Id; kind: 'service'|'product'|'deposit'|'platform_fee'|'gateway_fee'|'refund';
  amountCents: number; occurredAt: Instant; idempotencyKey: string;
}
export interface NotificationEvent {
  id: Id; userId: Id; organizationId?: Id;
  kind: 'booking_confirmed'|'booking_reminder'|'journey_changed'|'pet_ready'|'order_ready'|'payment_updated'|'return_due'|'vaccine_due'|'trial_ending'|'renewal_due'|'pet_id_scanned';
  channels: ('push'|'whatsapp'|'email')[]; deduplicationKey: string;
}
export interface EmployeePerformance { userId: Id; organizationId: Id; period: string; appointmentsCompleted: number; commissionCents: number; targetCents: number }
export interface Campaign extends TenantEntity { segment: CustomerStage[]; channel: 'push'|'whatsapp'|'email'; status: 'draft'|'approved'|'scheduled'|'sent'; approvedBy?: Id }
export interface ProductRecommendation { productId: Id; organizationId: Id; reason: string; source: 'rule'|'future_ai' }
