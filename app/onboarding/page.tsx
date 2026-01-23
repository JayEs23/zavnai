'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { OnboardingProfile, StructuredOnboardingResponse } from '@/components/onboarding/types';
import { onboardingApi } from '@/services/onboardingApi';
import { responseBuilders } from '@/components/onboarding/utils/responseBuilder';

// Step Components
import { Step1Basics } from '@/components/onboarding/steps/Step1Basics';
import { Step2VoiceIntro } from '@/components/onboarding/steps/Step2VoiceIntro';
import { Step3SmartGoal } from '@/components/onboarding/steps/Step3SmartGoal';
import { Step4Patterns } from '@/components/onboarding/steps/Step4Patterns';
import { Step5Capacity } from '@/components/onboarding/steps/Step5Capacity';
import { Step6Tribe } from '@/components/onboarding/steps/Step6Tribe';
import { Step7VoiceCalibration } from '@/components/onboarding/steps/Step7VoiceCalibration';
import { Step8Verification } from '@/components/onboarding/steps/Step8Verification';
import { Step9GoalDefinition } from '@/components/onboarding/steps/Step9GoalDefinition';
import { Step11Subscription } from '@/components/onboarding/steps/Step11Subscription';
import { Step12Success } from '@/components/onboarding/steps/Step12Success';

// Helper function to parse full name from localStorage
function parseStoredName(): { first: string; middle: string; last: string } {
  if (typeof window === 'undefined') {
    return { first: '', middle: '', last: '' };
  }

  const stored = localStorage.getItem('full_name');
  if (!stored) {
    return { first: '', middle: '', last: '' };
  }

  const parts = stored.trim().split(/\s+/);
  if (parts.length >= 2) {
    return {
      first: parts[0],
      middle: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
      last: parts[parts.length - 1],
    };
  } else if (parts.length === 1) {
    return { first: parts[0], middle: '', last: '' };
  }
  return { first: '', middle: '', last: '' };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initialize name from localStorage if available
  const initialName = parseStoredName();

  // --- Configuration & Feature Flags ---
  const SHOW_SUBSCRIPTION_STEP = true;
  const TOTAL_STEPS = SHOW_SUBSCRIPTION_STEP ? 12 : 11;

  // --- State for all steps ---
  const [profile, setProfile] = useState<OnboardingProfile>({
    firstName: initialName.first,
    middleName: initialName.middle,
    lastName: initialName.last,
    pronouns: '',
    username: '',
    goal: '',
    successCriteria: '',
    targetDate: '2024-12-31',
    patterns: [],
    tribe: [{ name: '', relationship: 'Friend', contact: '' }],
    capacity: {},
    verification: ['echo', 'data'],
    subscriptionSelected: false,
  });

  // Computed full name
  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(' ');

  const nextStep = async () => {
    // Save data to backend before moving to next step
    try {
      if (step === 1) {
        await onboardingApi.updateProfile({
          full_name: fullName,
          first_name: profile.firstName,
          middle_name: profile.middleName || undefined,
          last_name: profile.lastName,
          pronouns: profile.pronouns || undefined,
          username: profile.username.trim() || undefined,
        });
      } else if (step === 3) {
        if (profile.goal.trim()) {
          await onboardingApi.updateProfile({
            primary_goal: profile.goal,
          });
        }
      } else if (step === 4) {
        const structuredResponse = responseBuilders.patterns(profile.patterns);
        await onboardingApi.submitStep(4, { patterns: profile.patterns, structured: structuredResponse });
        await onboardingApi.updateProfile({
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      } else if (step === 5) {
        const structuredResponse = responseBuilders.capacity(profile.capacity);
        await onboardingApi.submitStep(5, { capacity: profile.capacity, structured: structuredResponse });
        await onboardingApi.updateProfile({
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      } else if (step === 6) {
        const structuredResponse = responseBuilders.tribe(profile.tribe);
        await onboardingApi.submitStep(6, { tribe: profile.tribe, structured: structuredResponse });
        await onboardingApi.updateProfile({
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      } else if (step === 9) {
        const structuredResponse = responseBuilders.goalRefinement(
          profile.goal,
          profile.successCriteria,
          profile.targetDate
        );
        await onboardingApi.submitStep(9, {
          goal: profile.goal,
          success_criteria: profile.successCriteria,
          target_date: profile.targetDate
        });
        await onboardingApi.updateProfile({
          primary_goal: profile.goal,
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      } else if (step === 8) {
        const structuredResponse = responseBuilders.verification(profile.verification);
        await onboardingApi.submitStep(8, { verification: profile.verification, structured: structuredResponse });
        await onboardingApi.updateProfile({
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      } else if (step === 10 && !SHOW_SUBSCRIPTION_STEP) {
        // Step 10 without subscription goes to success
      } else if (step === 11 && SHOW_SUBSCRIPTION_STEP) {
        const structuredResponse = responseBuilders.subscription(profile.subscriptionSelected);
        await onboardingApi.submitStep(11, { subscription_selected: profile.subscriptionSelected });
        await onboardingApi.updateProfile({
          baseline_responses: structuredResponse ? { [structuredResponse.stepName]: structuredResponse } : undefined,
        });
      }
    } catch (error) {
      console.error(`Failed to save step ${step} data:`, error);
    }

    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Build all structured responses for final save
      const allResponses: Record<string, StructuredOnboardingResponse> = {};

      const patternsResponse = responseBuilders.patterns(profile.patterns);
      if (patternsResponse) allResponses[patternsResponse.stepName] = patternsResponse;

      const capacityResponse = responseBuilders.capacity(profile.capacity);
      if (capacityResponse) allResponses[capacityResponse.stepName] = capacityResponse;

      const tribeResponse = responseBuilders.tribe(profile.tribe);
      if (tribeResponse) allResponses[tribeResponse.stepName] = tribeResponse;

      const verificationResponse = responseBuilders.verification(profile.verification);
      if (verificationResponse) allResponses[verificationResponse.stepName] = verificationResponse;

      const goalResponse = responseBuilders.goalRefinement(
        profile.goal,
        profile.successCriteria,
        profile.targetDate
      );
      if (goalResponse) allResponses[goalResponse.stepName] = goalResponse;

      if (SHOW_SUBSCRIPTION_STEP) {
        const subscriptionResponse = responseBuilders.subscription(profile.subscriptionSelected);
        if (subscriptionResponse) allResponses[subscriptionResponse.stepName] = subscriptionResponse;
      }

      await onboardingApi.updateProfile({
        baseline_responses: allResponses,
      });

      // Phase 2: Trigger Backend Analysis to generate User Baseline
      await onboardingApi.analyzeBaseline();

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Step configuration
  const stepConfig = {
    stepLabel: {
      1: "Let's get started",
      2: "Welcome to your journey",
      3: "Setting your goal",
      4: "Identifying patterns",
      5: "Reality check",
      6: "Assemble your tribe",
      7: "Voice calibration",
      8: "Verification",
      9: "Goal refinement",
      10: SHOW_SUBSCRIPTION_STEP ? "Subscription" : "Alignment achieved",
      11: SHOW_SUBSCRIPTION_STEP ? "Subscription" : "Alignment achieved",
      12: "Alignment achieved",
    },
    title: {
      1: "Let's start with you",
      2: `Welcome to ZAVN, ${fullName || 'there'}`,
      3: "Let's make it official",
      4: "What looks familiar?",
      5: "Reality Check",
      6: "Assemble Your Tribe",
      7: "Sync Your Voice",
      8: "Choose Your Verification",
      9: "Let's make it official",
      10: SHOW_SUBSCRIPTION_STEP ? "Your 18-Month Journey Starts Here" : "Alignment Achieved",
      11: SHOW_SUBSCRIPTION_STEP ? "Your 18-Month Journey Starts Here" : "Alignment Achieved",
      12: "Alignment Achieved",
    },
    subtitle: {
      1: "How should Echo and Doyn address you?",
      2: "Let's start with a quick introduction to how Echo and Doyn will work with you.",
      3: "Define your goal with clarity",
      4: "Select patterns that have shaped your work life.",
      5: "Paint your weekly rhythm of energy and focus.",
      6: "Nominate your 'Social Mirrors' for an honest look at your journey.",
      7: "Read the text below so Echo can learn your unique tone.",
      8: "Combine internal reflection with objective data.",
      9: "Turn your vague intention into a concrete, measurable goal.",
      10: SHOW_SUBSCRIPTION_STEP ? "Experience full access to ZAVN free for 7 days." : "Your profile baseline is set. We've tailored your ZAVN experience to match your current state.",
      11: SHOW_SUBSCRIPTION_STEP ? "Experience full access to ZAVN free for 7 days." : "Your profile baseline is set. We've tailored your ZAVN experience to match your current state.",
      12: "Your profile baseline is set. We've tailored your ZAVN experience to match your current state.",
    },
  };

  const stepProps = {
    profile,
    setProfile,
    onNext: nextStep,
    onPrev: prevStep,
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Basics {...stepProps} />;
      case 2:
        return <Step2VoiceIntro {...stepProps} />;
      case 3:
        return <Step3SmartGoal {...stepProps} />;
      case 4:
        return <Step4Patterns {...stepProps} />;
      case 5:
        return <Step5Capacity {...stepProps} />;
      case 6:
        return <Step6Tribe {...stepProps} />;
      case 7:
        return <Step7VoiceCalibration {...stepProps} />;
      case 8:
        return <Step8Verification {...stepProps} />;
      case 9:
        return <Step9GoalDefinition {...stepProps} />;
      case 10:
        // Step 10 was duplicate verification - now maps to subscription or success
        return SHOW_SUBSCRIPTION_STEP ? <Step11Subscription {...stepProps} /> : <Step12Success {...stepProps} onNext={handleComplete} loading={loading} />;
      case 11:
        return SHOW_SUBSCRIPTION_STEP ? <Step11Subscription {...stepProps} /> : <Step12Success {...stepProps} onNext={handleComplete} loading={loading} />;
      case 12:
        return <Step12Success {...stepProps} onNext={handleComplete} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingShell
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabel={stepConfig.stepLabel[step as keyof typeof stepConfig.stepLabel] || ''}
      title={stepConfig.title[step as keyof typeof stepConfig.title] || ''}
      subtitle={stepConfig.subtitle[step as keyof typeof stepConfig.subtitle] || ''}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-auto w-full max-w-5xl pb-10"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}
