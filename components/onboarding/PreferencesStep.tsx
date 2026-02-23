'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSchedule, MdPhone, MdEmail, MdNotifications, MdCheckCircle, MdLock } from 'react-icons/md';
import { ExtractedProfile } from '@/services/entityExtraction';

interface PreferencesStepProps {
  extractedProfile: ExtractedProfile;
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  call_window_start: string; // HH:MM format
  call_window_end: string; // HH:MM format
  escalation_preference: 'soft' | 'hard';
  communication_channel: 'call' | 'sms' | 'whatsapp' | 'email';
  echo_vibe: 'challenging' | 'supportive' | 'balanced';
}

export default function PreferencesStep({ extractedProfile, onComplete }: PreferencesStepProps) {
  // Infer defaults from extracted profile (with safe fallbacks)
  const getDefaultCallWindow = () => {
    if (extractedProfile?.energy_peak === 'morning') {
      return { start: '07:00', end: '22:00' };
    } else if (extractedProfile?.energy_peak === 'late_night') {
      return { start: '10:00', end: '23:00' };
    }
    return { start: '09:00', end: '21:00' };
  };

  const defaults = getDefaultCallWindow();
  const vibeScore = extractedProfile?.vibe_score ?? 5;

  const [preferences, setPreferences] = useState<UserPreferences>({
    call_window_start: defaults.start,
    call_window_end: defaults.end,
    escalation_preference: vibeScore >= 7 ? 'hard' : 'soft',
    communication_channel: 'email',
    echo_vibe: 'balanced',
  });

  const handleSubmit = () => {
    onComplete(preferences);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 min-h-full flex items-start">
      <div className="bg-white rounded-2xl shadow-lg border border-border p-8 space-y-8 w-full">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Set Your Preferences</h2>
          <p className="text-muted-foreground">
            Help us personalize your experience by setting up your communication preferences and interaction style.
          </p>
        </div>

        {/* AI Suggestions */}
        {extractedProfile?.energy_peak && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3"
          >
            <MdCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-foreground">
              <strong>Smart suggestion:</strong> We detected you&apos;re most productive in the {' '}
              <span className="font-semibold text-primary">
                {extractedProfile.energy_peak === 'morning' ? 'morning' : 'evening'}
              </span>. 
              We&apos;ve adjusted your availability window to match your peak hours.
            </p>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Call Window */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MdSchedule className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Availability Window</h3>
                <p className="text-sm text-muted-foreground">When can we reach out to you?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-12">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Start Time
                </label>
                <input
                  type="time"
                  value={preferences.call_window_start}
                  onChange={(e) =>
                    setPreferences({ ...preferences, call_window_start: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  End Time
                </label>
                <input
                  type="time"
                  value={preferences.call_window_end}
                  onChange={(e) =>
                    setPreferences({ ...preferences, call_window_end: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Escalation Preference */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MdNotifications className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Accountability Style</h3>
                <p className="text-sm text-muted-foreground">How should we keep you on track?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-12">
              <button
                onClick={() => setPreferences({ ...preferences, escalation_preference: 'soft' })}
                className={`p-5 border-2 rounded-xl transition-all text-left ${
                  preferences.escalation_preference === 'soft'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-white hover:border-primary/30'
                }`}
              >
                <div className="text-base font-semibold text-foreground mb-2">Gentle Nudge</div>
                <div className="text-sm text-muted-foreground">Supportive reminders and reflective questions to guide you.</div>
              </button>
              <button
                onClick={() => setPreferences({ ...preferences, escalation_preference: 'hard' })}
                className={`p-5 border-2 rounded-xl transition-all text-left ${
                  preferences.escalation_preference === 'hard'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-white hover:border-primary/30'
                }`}
              >
                <div className="text-base font-semibold text-foreground mb-2">Direct Accountability</div>
                <div className="text-sm text-muted-foreground">High-stakes reminders with clear consequences.</div>
              </button>
            </div>
          </div>

          {/* Communication Channel */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MdPhone className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Preferred Channel</h3>
                <p className="text-sm text-muted-foreground">How would you like us to notify you about your commitments?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-12">
              {/* Email - free, always available */}
              <button
                onClick={() => setPreferences({ ...preferences, communication_channel: 'email' })}
                className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all ${
                  preferences.communication_channel === 'email'
                    ? 'border-primary bg-gradient-to-br from-primary to-accent text-white shadow-md'
                    : 'border-border bg-white text-foreground hover:border-primary/30'
                }`}
              >
                Email
              </button>

              {/* Premium channels - call, sms, whatsapp */}
              {(['call', 'sms', 'whatsapp'] as const).map((channel) => (
                <div key={channel} className="relative">
                  <button
                    disabled
                    className="w-full py-3 px-4 border-2 border-border rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground cursor-not-allowed capitalize opacity-60"
                  >
                    {channel}
                  </button>
                  <span className="absolute -top-2 -right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                    <MdLock size={10} />
                    PRO
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pl-12">
              📱 Phone calls, SMS, and WhatsApp notifications are available with a Pro subscription. 
              You can enable them anytime in <strong>Settings → Notifications</strong> after verifying your phone number.
            </p>
          </div>

          {/* Echo Vibe */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MdEmail className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Coach Personality</h3>
                <p className="text-sm text-muted-foreground">What tone works best for you?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-12">
              {(['challenging', 'balanced', 'supportive'] as const).map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setPreferences({ ...preferences, echo_vibe: vibe })}
                  className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    preferences.echo_vibe === vibe
                      ? 'border-primary bg-gradient-to-br from-primary to-accent text-white shadow-md'
                      : 'border-border bg-white text-foreground hover:border-primary/30'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
