import type { Id, Instant, NotificationEvent, PetStyle, TrustedActor } from './contracts.ts';
import type { quoteCheckout } from './commerce.ts';
export type CheckoutQuote = ReturnType<typeof quoteCheckout>;
export interface VerifiedPaymentEvent {
  provider: string; eventId: string; providerPaymentId: string;
  status: 'pending'|'paid'|'failed'|'partially_refunded'|'refunded';
  amountCents: number; currency: 'BRL'; occurredAt: Instant;
}
export interface PaymentProvider {
  /** Merchant must have completed PSP onboarding/KYC; never invent a recipient ID. */
  createCheckout(input: {quote: CheckoutQuote; merchantRecipientId: string; idempotencyKey: string}): Promise<{providerPaymentId: string; checkoutUrl: string}>;
  /** Verify authenticity against raw bytes before parsing or applying any state change. */
  verifyWebhook(rawBody: Uint8Array, signature: string): Promise<VerifiedPaymentEvent>;
  refund(input: {providerPaymentId: string; amountCents: number; platformFeeRefundCents: number; idempotencyKey: string}): Promise<{providerRefundId: string}>;
}
export interface NotificationProvider { send(event: NotificationEvent): Promise<{providerMessageId: string}> }
export interface PrivateMediaStorage {
  authorizeUpload(actor: TrustedActor, input: {petId: Id; kind: 'photo'|'document'; mimeType: string; sizeBytes: number}): Promise<{objectPath: string; uploadUrl: string; expiresAt: Instant}>;
  authorizeDownload(userId: Id, objectPath: string): Promise<{url: string; expiresAt: Instant}>;
}
export interface PetStyleRenderer { loadModel(assetId: string): Promise<void>; apply(style: PetStyle): Promise<void>; dispose(): void }
export interface RealtimeSync { subscribe(organizationId: Id, onInvalidation: (entity: string, id: Id, version: number) => void): () => void }
/** No implementations registered: integrations must fail closed until configured. */
export class IntegrationNotConfigured extends Error {
  constructor(integration: string) { super(integration + ' is not configured'); this.name = 'IntegrationNotConfigured'; }
}
