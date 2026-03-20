import type { FocusAreaId } from '@/constants/focusAreas';

/**
 * Maps UI waitlist-style ids to backend canonical keys (`app.prompts.focus.areas`).
 */
export function toApiFocusAreaKey(id: FocusAreaId | null | undefined): string | undefined {
  if (id == null) return undefined;
  const map: Record<FocusAreaId, string> = {
    productivity: 'productivity',
    health: 'health_fitness',
    financial: 'financial',
    learning: 'personal_growth',
    relationships: 'social_community',
  };
  return map[id];
}
