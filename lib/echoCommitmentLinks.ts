/**
 * Deep links for Echo + commitment context (voice-first; see zavndocs 16 Phase 2).
 */

export function echoVoiceReflectionHref(commitmentId: string): string {
  const q = new URLSearchParams({ mode: 'reflection', commitmentId });
  return `/echo?${q.toString()}`;
}

export function echoJournalReflectPath(commitmentId: string): string {
  return `/echo/reflect/${commitmentId}`;
}
