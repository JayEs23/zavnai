'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import VoiceOnboardingSession from '@/components/onboarding/VoiceOnboardingSession';
import TribeForm, { TribeMember } from '@/components/onboarding/TribeForm';
import PreferencesStep, { UserPreferences } from '@/components/onboarding/PreferencesStep';
import { onboardingApi } from '@/services/onboardingApi';
import { api } from '@/lib/api';

type OnboardingStep = 'voice' | 'preferences' | 'tribe' | 'completing';

interface ExtractionResponse {
  success: boolean;
  profile?: {
    vibe_score?: number;
    primary_goal?: string;
    core_friction?: string;
    professional_context?: string;
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<OnboardingStep>('voice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data collected during onboarding
  const [transcript, setTranscript] = useState<string>('');
  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [tribeMembers, setTribeMembers] = useState<TribeMember[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Get user ID from session
  const userId = (session?.user as any)?.id || '';

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] mono">
        <div className="text-center space-y-4">
          <div className="size-12 border-2 border-[var(--primary)] border-t-transparent animate-spin mx-auto" />
          <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.3em]">Authenticating_Identity...</p>
        </div>
      </div>
    );
  }

  // Handle voice session completion
  const handleVoiceComplete = async (sessionTranscript: string, insights: any) => {
    setTranscript(sessionTranscript);
    setLoading(true);

    try {
      // Extract entities from transcript (Post-session parsing)
      const res = await api.post<ExtractionResponse>('/api/onboarding/extract-entities', {
        transcript: sessionTranscript,
        user_id: userId,
        insights: insights // Include insights from conversation
      });
      
      if (res.success && res.profile) {
        setExtractedProfile(res.profile);
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
      // 1. Call the new refactored complete endpoint
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
        preferences: preferences
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
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mono"
          >
            [CRITICAL_FAILURE]: {error}
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
            className="w-full max-w-3xl mx-auto p-12 overflow-y-auto custom-scrollbar"
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
            className="w-full max-w-4xl mx-auto p-12 overflow-y-auto custom-scrollbar"
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
            className="w-full flex flex-col items-center justify-center p-20 space-y-12"
          >
            <div className="relative size-48">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-500 blur-[60px]"
              />
              <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-amber-500/10 rounded-full animate-spin [animation-duration:3s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="mono text-[10px] text-amber-500 font-black animate-pulse uppercase tracking-[0.4em]">SYNCING...</span>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter">DEVOPS_INTEGRATION_ACTIVE</h3>
              <p className="mono text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black max-w-md mx-auto">
                Deploying Tribe and Doyn agents to Node_{Math.random().toString(16).substring(2, 6).toUpperCase()}. Calibrating behavioral guardrails.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingShell>
  );
}
