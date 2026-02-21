/**
 * Entity Extraction Service
 * Extracts structured user profile data from onboarding transcript
 */

import { api } from '@/lib/api';

export interface ExtractedProfile {
  occupation?: string;
  energy_peak?: 'morning' | 'afternoon' | 'evening' | 'late_night';
  core_friction?: string;
  support_contact?: string;
  vibe_score: number; // 1-10 readiness to change
  primary_goal?: string;
  goal_specificity?: 'vague' | 'moderate' | 'specific';
  stress_markers?: string[];
  professional_context?: string;
}

export interface EntityExtractionResponse {
  success: boolean;
  profile: ExtractedProfile;
  message?: string;
}

/**
 * Send transcript to backend for entity extraction
 */
export async function extractEntities(
  transcript: string,
  userId: string
): Promise<ExtractedProfile> {
  try {
    const response = await api.post<EntityExtractionResponse>(
      '/api/onboarding/extract-entities',
      {
        transcript,
        user_id: userId,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to extract entities');
    }

    return response.profile;
  } catch (error) {
    console.error('Entity extraction error:', error);
    throw error;
  }
}

/**
 * Update user profile with extracted data
 */
export async function updateProfileFromExtraction(
  userId: string,
  profile: ExtractedProfile
): Promise<void> {
  try {
    await api.post('/api/onboarding/update-profile', {
      user_id: userId,
      profile_data: profile,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

