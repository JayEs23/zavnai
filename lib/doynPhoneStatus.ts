/**
 * Product copy for Doyn outbound phone accountability.
 * Keep aligned with docs/DOYN_PHONE_CALL_IMPLEMENTATION_CHECKLIST.md
 */
export const DOYN_PHONE_STATUS = {
  betaLabel: 'Beta',
  settingsBanner:
    'Doyn phone calls are in beta: we can email and text you today when a commitment is overdue. Outbound voice calls need a verified phone number and are rolling out gradually.',
  settingsVoiceEnabled:
    'Allow Doyn accountability calls when a commitment is overdue (beta). Requires a verified phone number.',
  settingsVoiceDisabled:
    'Verify your phone number to enable Doyn voice calls (beta).',
  verifyCta: 'Verify phone number',
  onboardingChannelsNote:
    'Phone, SMS, and WhatsApp are Pro features. Voice calls are in beta—verify your number in Settings after onboarding. Email reminders work today.',
  marketingIntervention:
    'When you miss a deadline, ZAVN escalates with email and SMS today; outbound Doyn phone calls are in beta for verified numbers.',
  marketingNegotiation:
    'Negotiate commitments with Doyn in chat today; live phone negotiation is in beta.',
} as const;
