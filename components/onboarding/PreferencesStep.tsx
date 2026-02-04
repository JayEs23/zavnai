'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSchedule, MdPhone, MdEmail, MdNotifications } from 'react-icons/md';
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
  // Infer defaults from extracted profile
  const getDefaultCallWindow = () => {
    if (extractedProfile.energy_peak === 'morning') {
      return { start: '07:00', end: '22:00' };
    } else if (extractedProfile.energy_peak === 'late_night') {
      return { start: '10:00', end: '23:00' };
    }
    return { start: '09:00', end: '21:00' };
  };

  const defaults = getDefaultCallWindow();

  const [preferences, setPreferences] = useState<UserPreferences>({
    call_window_start: defaults.start,
    call_window_end: defaults.end,
    escalation_preference: extractedProfile.vibe_score >= 7 ? 'hard' : 'soft',
    communication_channel: 'call',
    echo_vibe: 'balanced',
  });

  const handleSubmit = () => {
    onComplete(preferences);
  };

  return (
    <div className="w-full space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <h2 className="text-3xl font-black text-zinc-100 uppercase tracking-tighter leading-none">System Calibration</h2>
        </div>
        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em] ml-5 leading-relaxed">
          Establishing intervention parameters and agent personality profiles.
        </p>
      </div>

      {/* AI Suggestions */}
      {extractedProfile.energy_peak && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/5 border border-amber-500/20 p-6 relative overflow-hidden"
        >
          <div className="scan-line opacity-10" />
          <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] leading-relaxed relative z-10">
            <span className="opacity-50">[ANALYSIS_COMPLETE]:</span> We detected a {' '}
            <span className="text-zinc-100 underline decoration-amber-500/30 underline-offset-4">{extractedProfile.energy_peak === 'morning' ? 'circadian peak in AM hours' : 'circadian peak in PM hours'}</span>. 
            Operational window auto-calibrated to match peak cognitive capacity.
          </p>
        </motion.div>
      )}

      <div className="space-y-12">
        {/* Call Window */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MdSchedule className="text-zinc-700" size={16} />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Operational_Window</h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">
                Start_Time
              </label>
              <input
                type="time"
                value={preferences.call_window_start}
                onChange={(e) =>
                  setPreferences({ ...preferences, call_window_start: e.target.value })
                }
                className="w-full px-6 py-4 bg-[#09090b] border border-zinc-800 text-amber-500 focus:outline-none focus:border-amber-500 transition-all font-mono text-xs tracking-widest"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">
                End_Time
              </label>
              <input
                type="time"
                value={preferences.call_window_end}
                onChange={(e) =>
                  setPreferences({ ...preferences, call_window_end: e.target.value })
                }
                className="w-full px-6 py-4 bg-[#09090b] border border-zinc-800 text-amber-500 focus:outline-none focus:border-amber-500 transition-all font-mono text-xs tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Escalation Preference */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MdNotifications className="text-zinc-700" size={16} />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Intervention_Protocol</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setPreferences({ ...preferences, escalation_preference: 'soft' })}
              className={`p-6 border transition-all duration-500 text-left group relative overflow-hidden ${
                preferences.escalation_preference === 'soft'
                  ? 'bg-amber-500/5 border-amber-500 text-amber-500'
                  : 'bg-[#09090b] border-zinc-900 text-zinc-600 hover:border-amber-500/30'
              }`}
            >
              <div className="scan-line opacity-5" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Soft_Mirror</div>
              <div className="text-[9px] uppercase font-bold opacity-40 leading-relaxed">Socratic reflection and behavior nudging.</div>
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, escalation_preference: 'hard' })}
              className={`p-6 border transition-all duration-500 text-left group relative overflow-hidden ${
                preferences.escalation_preference === 'hard'
                  ? 'bg-amber-500/5 border-amber-500 text-amber-500'
                  : 'bg-[#09090b] border-zinc-900 text-zinc-600 hover:border-amber-500/30'
              }`}
            >
              <div className="scan-line opacity-5" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Hard_Lock</div>
              <div className="text-[9px] uppercase font-bold opacity-40 leading-relaxed">Direct accountability and high-stakes enforcement.</div>
            </button>
          </div>
        </div>

        {/* Communication Channel */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MdPhone className="text-zinc-700" size={16} />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Comm_Channel</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['call', 'sms', 'whatsapp', 'email'] as const).map((channel) => (
              <button
                key={channel}
                onClick={() => setPreferences({ ...preferences, communication_channel: channel })}
                className={`py-4 border text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  preferences.communication_channel === channel
                    ? 'bg-amber-500 text-[#09090b] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#09090b] border-zinc-900 text-zinc-600 hover:border-amber-500/30'
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Echo Vibe */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MdEmail className="text-zinc-700" size={16} />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Zephyr_Personality</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(['challenging', 'balanced', 'supportive'] as const).map((vibe) => (
              <button
                key={vibe}
                onClick={() => setPreferences({ ...preferences, echo_vibe: vibe })}
                className={`py-4 border text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  preferences.echo_vibe === vibe
                    ? 'bg-amber-500 text-[#09090b] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#09090b] border-zinc-900 text-zinc-600 hover:border-amber-500/30'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-12">
        <button
          onClick={handleSubmit}
          className="group relative w-full py-6 bg-transparent border border-amber-500/20 overflow-hidden hover:border-amber-500 transition-all duration-700"
        >
          <div className="scan-line opacity-20" />
          <span className="relative z-10 mono text-amber-500 font-black tracking-[0.4em] uppercase text-xs group-hover:text-zinc-100 transition-colors">
            COMMIT_CONFIGURATION
          </span>
          <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </button>
      </div>
    </div>
  );
}
