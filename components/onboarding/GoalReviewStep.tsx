'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdAutoAwesome, MdGpsFixed, MdEditNote } from 'react-icons/md';
import type { ExtractedProfile } from '@/services/entityExtraction';
import { agentApi } from '@/services/agentApi';

export interface GoalReviewStepProps {
  profile: ExtractedProfile;
  onChange: (next: ExtractedProfile) => void;
  onContinue: () => void;
  onBack: () => void;
}

/**
 * US-O4b: User confirms or edits the crystallized goal before onboarding completes.
 * Persisted values flow into `POST /api/onboarding/complete` via parent state.
 */
export default function GoalReviewStep({
  profile,
  onChange,
  onContinue,
  onBack,
}: GoalReviewStepProps) {
  const [refining, setRefining] = useState(false);

  const primary = profile.primary_goal?.trim() ?? '';
  const friction = profile.core_friction?.trim() ?? '';

  const refineWithDoyn = async () => {
    if (!primary) return;
    setRefining(true);
    try {
      const res = await agentApi.refineGoal({
        goal: primary,
        successCriteria: friction || undefined,
      });
      onChange({
        ...profile,
        primary_goal: res.refined_goal,
        core_friction: res.refined_success_criteria || profile.core_friction,
      });
    } catch (e) {
      console.error(e);
      alert('Could not refine the goal. You can still edit the text directly.');
    } finally {
      setRefining(false);
    }
  };

  const canContinue = primary.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 min-h-full flex items-start">
      <div className="bg-white dark:bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8 w-full">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Confirm your goal</h2>
          <p className="text-muted-foreground">
            Echo and extraction proposed a draft goal. Edit it so what we save matches what you
            intend — you are not stuck with model wording alone.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <MdGpsFixed className="text-primary" size={18} />
              Goal title
            </label>
            <textarea
              value={profile.primary_goal ?? ''}
              onChange={(e) => onChange({ ...profile, primary_goal: e.target.value })}
              placeholder="A specific, concrete goal you are committing to"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <MdEditNote className="text-primary" size={18} />
              Context / friction (optional)
            </label>
            <textarea
              value={profile.core_friction ?? ''}
              onChange={(e) => onChange({ ...profile, core_friction: e.target.value })}
              placeholder="What usually gets in the way — helps Doyn and Echo support you"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              Want a tighter SMART-style phrasing? Ask Doyn — you stay in control of the final text.
            </p>
            <button
              type="button"
              onClick={() => void refineWithDoyn()}
              disabled={refining || !primary}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-primary/30 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              <MdAutoAwesome className={refining ? 'animate-spin' : ''} size={20} />
              {refining ? 'Refining…' : 'Refine with Doyn'}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Back to Echo
          </button>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
