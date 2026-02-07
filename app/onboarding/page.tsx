'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';
import TribeForm, { TribeMember } from '@/components/onboarding/TribeForm';
import PreferencesStep, { UserPreferences } from '@/components/onboarding/PreferencesStep';
import { onboardingApi } from '@/services/onboardingApi';
import { api } from '@/lib/api';
import { getAgentMonitor } from '@/lib/opik/agent-monitor';
import { opikTracker } from '@/lib/opik/client-tracker';
import { ExtractedProfile } from '@/services/entityExtraction';

type OnboardingStep = 'voice' | 'preferences' | 'tribe' | 'completing';

interface ExtractionResponse {
  success: boolean;
  profile?: ExtractedProfile;
  validation?: {
    completeness_score: number;
    is_valid: boolean;
    field_scores?: Record<string, number>;
  };
}

interface InsightsData {
  goals?: string[];
  motivation?: string;
  implementation_style?: string;
  blockers?: string[];
  rapport_notes?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<OnboardingStep>('voice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data collected during onboarding
  const [transcript, setTranscript] = useState<string>('');
  const [extractedProfile, setExtractedProfile] = useState<ExtractionResponse['profile'] | null>(null);
  const [tribeMembers, setTribeMembers] = useState<TribeMember[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [voiceInsights, setVoiceInsights] = useState<InsightsData | null>(null);

  // Get user ID from session
  const userId = (session?.user as { id?: string })?.id || '';

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-lg font-semibold text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle voice session completion
  const handleVoiceComplete = async (sessionTranscript: string, insights: InsightsData) => {
    setTranscript(sessionTranscript);
    setVoiceInsights(insights); // Store insights for later use
    setLoading(true);

    try {
      // Extract entities from transcript with Opik validation
      const res = await api.post<ExtractionResponse & { 
        validation?: { 
          completeness_score: number; 
          is_valid: boolean;
          field_scores?: Record<string, number>;
        } 
      }>('/api/onboarding/extract-entities', {
        transcript: sessionTranscript,
        user_id: userId,
        insights: insights // Include insights from conversation
      });
      
      if (res.success && res.profile) {
        setExtractedProfile(res.profile);
        
        // Log quality metrics to Opik
        if (res.validation) {
          const monitor = getAgentMonitor();
          console.log('✓ Echo Extraction Quality:', {
            completeness: `${(res.validation.completeness_score * 100).toFixed(0)}%`,
            valid: res.validation.is_valid,
            fieldScores: res.validation.field_scores
          });
          
          // Track voice onboarding with Opik
          try {
            const traceId = await opikTracker.trackVoiceOnboarding(
              userId,
              sessionTranscript,
              res.profile,
              res.validation
            );
            
            // Submit feedback score if we got a valid trace ID
            if (traceId && traceId !== 'tracking-error') {
              await opikTracker.trackFeedback(
                traceId,
                res.validation.completeness_score >= 0.7 ? 'positive' : 'neutral',
                res.validation.completeness_score * 10,
                `Auto-scored: Completeness ${(res.validation.completeness_score * 100).toFixed(0)}%`
              );
            }
          } catch (trackingErr) {
            console.warn('Failed to track with Opik:', trackingErr);
            // Don't break the flow if tracking fails
          }
        }
      }
      
      setStep('preferences');
    } catch (err) {
      console.error('Extraction failed:', err);
      // Fallback to defaults
      setExtractedProfile({ vibe_score: 5 });
      setStep('preferences');
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences completion
  const handlePreferencesComplete = (userPreferences: UserPreferences) => {
    setPreferences(userPreferences);
        setStep('tribe');
  };

  // Handle tribe form completion
  const handleTribeComplete = async (members: TribeMember[]) => {
    setTribeMembers(members);
    await finalizeOnboarding(members);
  };

  // Final completion handler
  const finalizeOnboarding = async (finalTribeMembers: TribeMember[]) => {
    setStep('completing');
    setLoading(true);
    
    try {
      // 1. Call the new refactored complete endpoint with insights
      await api.post('/api/onboarding/complete', {
        goal: {
          title: extractedProfile?.primary_goal || "My First Goal",
          description: extractedProfile?.core_friction || "",
          category: extractedProfile?.professional_context === 'developer' ? 'work' : 'general'
        },
        tribe_members: finalTribeMembers.map(m => ({
          name: m.name,
          contact: m.contact,
          platform: m.platform,
          relationship: m.relationship
        })),
        preferences: preferences,
        insights: voiceInsights // Pass Echo insights to be stored in Goal.metadata_json
      });

      // 2. Trigger baseline analysis for RAG
      await onboardingApi.analyzeBaseline();

      // 3. Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Finalization failed:', err);
      setError('Failed to save your profile. Please try again.');
      setStep('tribe');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    await finalizeOnboarding(tribeMembers);
  };

  // Step configuration
  const stepConfig = {
    voice: {
      stepLabel: 'Discovery',
      title: 'Meet Echo',
      subtitle: 'Talk to Echo for 2-3 minutes. We\'ll learn your energy patterns and goals.',
    },
    preferences: {
      stepLabel: 'Preferences',
      title: 'Set Your Guardrails',
      subtitle: 'When can we call you? How direct should Echo be?',
    },
    tribe: {
      stepLabel: 'Tribe',
      title: 'Accountability Network',
      subtitle: 'Who will hold you to your promises?',
    },
    completing: {
      stepLabel: 'Finalizing',
      title: 'Locking it in',
      subtitle: 'Setting up your Zero-Gap ecosystem...',
    },
  };

  const currentConfig = stepConfig[step];
  const totalSteps = 3;
  const currentStepNumber = step === 'voice' ? 1 : step === 'preferences' ? 2 : 3;

  return (
    <OnboardingShell
      step={currentStepNumber}
      totalSteps={totalSteps}
      stepLabel={currentConfig.stepLabel}
      title={currentConfig.title}
      subtitle={currentConfig.subtitle}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl shadow-lg"
          >
            {error}
          </motion.div>
        )}

        {step === 'voice' && (
          <motion.div
            key="voice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <VoiceOnboardingSession
              onComplete={handleVoiceComplete}
              onError={(msg) => setError(msg)}
            />
          </motion.div>
        )}

        {step === 'preferences' && extractedProfile && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full overflow-y-auto"
          >
            <PreferencesStep
              extractedProfile={extractedProfile}
              onComplete={handlePreferencesComplete}
            />
          </motion.div>
        )}

        {step === 'tribe' && (
          <motion.div
            key="tribe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full overflow-y-auto"
          >
            <TribeForm
              onComplete={handleTribeComplete}
              onSkip={handleSkip}
            />
          </motion.div>
        )}

        {step === 'completing' && (
          <motion.div
            key="completing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center justify-center p-20 space-y-8 bg-gradient-to-br from-primary/5 to-accent/5"
          >
            <div className="relative w-32 h-32">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-3xl"
              />
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse" />
              <div className="absolute inset-2 border-4 border-accent/20 rounded-full animate-spin [animation-duration:3s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-primary font-bold animate-pulse">Setting up...</span>
              </div>
            </div>
            <div className="text-center space-y-3 max-w-lg">
              <h3 className="text-3xl font-bold text-foreground">Finalizing Your Profile</h3>
              <p className="text-muted-foreground">
                We&apos;re setting up your personalized accountability system and connecting your tribe. This will just take a moment...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingShell>
  );
}
