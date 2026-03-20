'use client';

import React from 'react';
import { MdMic, MdKeyboard } from 'react-icons/md';
import { FOCUS_AREAS, type FocusAreaId } from '@/constants/focusAreas';

type Props = {
  onChooseVoice: () => void;
  onChooseText: () => void;
  disabled?: boolean;
  /** Selected primary focus (canonical UI id); optional — Echo uses `general` if unset */
  focusAreaId?: FocusAreaId | null;
  onFocusChange?: (id: FocusAreaId | null) => void;
};

/**
 * First beat of Echo onboarding: pick primary focus (zavndocs 15), then voice vs text (zavnexample ch.3).
 */
export function EchoEntryChoice({
  onChooseVoice,
  onChooseText,
  disabled,
  focusAreaId = null,
  onFocusChange,
}: Props) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6 sm:py-10">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-foreground sm:text-2xl">How do you want to meet Echo?</h3>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Voice feels like a real conversation; text is better in quiet spaces or if you prefer typing.
          You get the same onboarding either way — switch later if you need to.
        </p>
      </div>

      {onFocusChange && (
        <div className="space-y-3">
          <p className="text-center text-sm font-medium text-foreground">
            What matters most for you right now?{' '}
            <span className="font-normal text-muted-foreground">(optional — helps Echo tune the conversation)</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {FOCUS_AREAS.map((area) => {
              const selected = focusAreaId === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onFocusChange(selected ? null : area.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    selected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white/90 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  } disabled:opacity-50`}
                >
                  <span className="mr-1" aria-hidden>
                    {area.icon}
                  </span>
                  {area.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onChooseVoice}
          className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-white/90 p-8 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
            <MdMic size={32} aria-hidden />
          </div>
          <div>
            <span className="block text-lg font-semibold text-foreground">Voice</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              2–3 minutes with your microphone
            </span>
          </div>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onChooseText}
          className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-white/90 p-8 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 text-white shadow-lg">
            <MdKeyboard size={32} aria-hidden />
          </div>
          <div>
            <span className="block text-lg font-semibold text-foreground">Text</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Chat only — no microphone
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
