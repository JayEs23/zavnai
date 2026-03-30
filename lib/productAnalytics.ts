/**
 * Privacy-conscious product events (zavndocs 16 §11).
 * No free-text PII; commitment IDs are for correlation only (authenticated user).
 * Server logs structured lines for aggregation / dashboards (see 08-observability).
 */

const FLOW_START_KEY = 'zavn_pa_flow_start_ms';

function flowStartMs(): number {
  if (typeof window === 'undefined') return Date.now();
  let v = sessionStorage.getItem(FLOW_START_KEY);
  if (!v) {
    v = String(Date.now());
    sessionStorage.setItem(FLOW_START_KEY, v);
  }
  return parseInt(v, 10);
}

/** Call once when user lands on dashboard or commitments (starts “time to first outcome” clock). */
export function ensureCommitmentFlowStarted(): void {
  flowStartMs();
}

export type ProductAnalyticsPayload = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * Fire-and-forget POST to `/api/analytics/product`. Safe to call from click handlers.
 */
export function trackProductEvent(
  event: string,
  payload?: ProductAnalyticsPayload
): void {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_PRODUCT_ANALYTICS === 'false') return;

  const sessionMs = Date.now() - flowStartMs();
  const body = {
    event,
    ts: Date.now(),
    sessionMs,
    payload: payload ?? {},
  };

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[product-analytics]', body);
  }

  void fetch('/api/analytics/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

/** Minutes since flow started (for outcome events). */
export function minutesSinceFlowStart(): number {
  return (Date.now() - flowStartMs()) / 60_000;
}

export function trackCommitmentOutcomeSaved(
  commitmentId: string,
  source: 'verify' | 'outcome_form' | 'voice_reflection'
): void {
  trackProductEvent('commitment.outcome_saved', {
    commitmentId,
    source,
    minutesSinceFlowStart: Math.round(minutesSinceFlowStart() * 100) / 100,
  });
}

export function trackModalAbandoned(
  modal: 'verify' | 'outcome' | 'status_sheet',
  commitmentId: string
): void {
  trackProductEvent('commitment.modal_abandon', { modal, commitmentId });
}
