export type BusinessPlan = 'essential' | 'pro' | 'premium';
const essential = ['customers','pets','appointments','basic_crm','history','packages','tasks','basic_finance','integrated_app'] as const;
const pro = [...essential, 'opportunities','recurrence','smart_crm','whatsapp','automations','campaigns','metrics'] as const;
const premium = [...pro, 'petstyle_3d','advanced_team','advanced_reports','advanced_automations'] as const;
/** Commercial reference, not a PSP product or an activated subscription. */
export const businessPlans = {
  essential: {monthlyPriceCents: 7990, features: essential, proposedTrialDays: 14, proposedUserLimit: 3},
  pro: {monthlyPriceCents: 14990, features: pro, proposedTrialDays: 30, proposedUserLimit: 8},
  premium: {monthlyPriceCents: 24990, features: premium, proposedTrialDays: 30, proposedFirstPaidMonthDiscountPercent: 50}
} as const;
export const clubProposal = {
  billingEnabled: false,
  candidateMonthlyPricesCents: [990, 1990],
  futurePartnerTierPriceCents: 4990,
  proposedTrialDays: 30,
  freeTutorCore: ['appointments','confirmations','notifications','payments','store','pets'],
} as const;
export const futureCapabilities = {copilot: false, multiBranch: false} as const;
export interface ApprovedBillingOffer {
  id: string;
  approvedAt: string;
  priceCents: number;
  trialDays: number;
  firstPaidMonthDiscountPercent: number;
  renewalDisclosureVersion: string;
}
