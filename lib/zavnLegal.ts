/**
 * ZAVN-specific language for legal pages. Keep aligned with product, /pricing,
 * and docs (Echo, Doyn, Tribe, Thrive pillars).
 */
export const ZAVN_LEGAL = {
  /** One paragraph: what ZAVN is for Terms/Privacy intros and "The Service". */
  productSummary: `ZAVN is a behavioral alignment platform that helps you turn intention into action through structured goals, AI-assisted coaching, and accountability. Core experiences include Echo (reflection and guided sessions), Doyn (voice coaching and interventions—availability depends on your plan and region), Tribe (accountability contacts, invitations, and vetting flows you initiate), and Thrive-related wellbeing signals we may surface to encourage sustainable performance.`,

  /** Paid tiers — names may evolve; "as shown on pricing" keeps legal in sync with marketing. */
  paidPlansSummary: `Access may be offered on subscription tiers (for example Free, Pro, and Max). What each tier includes—feature limits, voice minutes, Tribe automation, and similar—is stated on our pricing page and at checkout at the time you purchase.`,

  /** Short line for refund/payment context. */
  whatYouPayFor: `Your payment unlocks the ZAVN subscription entitlements and limits described at purchase for the billing period you selected (for example monthly or annual, as offered).`,
} as const;
