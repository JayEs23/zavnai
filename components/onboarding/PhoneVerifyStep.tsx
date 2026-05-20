'use client';

import React, { useState } from 'react';
import { MdPhone, MdWhatsapp, MdSms, MdCheckCircle } from 'react-icons/md';
import { authApi } from '@/services/authApi';
import { DOYN_PHONE_STATUS } from '@/lib/doynPhoneStatus';

type OtpChannel = 'whatsapp' | 'sms' | 'call';

interface PhoneVerifyStepProps {
  onComplete: (verified: boolean) => void;
  onSkip: () => void;
}

export default function PhoneVerifyStep({ onComplete, onSkip }: PhoneVerifyStepProps) {
  const [selectedChannel, setSelectedChannel] = useState<OtpChannel>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phase, setPhase] = useState<'phone' | 'otp' | 'done'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    const e164 = /^\+[1-9]\d{1,14}$/;
    if (!e164.test(phoneNumber.trim())) {
      setError('Use international format, e.g. +14155552671');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.verifySend(phoneNumber.trim(), selectedChannel);
      if (res.success) {
        setPhase('otp');
      } else {
        setError(res.message || 'Could not send code');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.verifyCheck(phoneNumber.trim(), otpCode, selectedChannel);
      if (res.verified) {
        setPhase('done');
        setTimeout(() => onComplete(true), 600);
      } else {
        setError(res.message || 'Invalid code');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (phase === 'done') {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-12 flex flex-col items-center gap-4 text-center">
        <MdCheckCircle className="text-5xl text-primary" aria-hidden />
        <p className="text-lg font-semibold text-foreground">Phone verified</p>
        <p className="text-sm text-muted-foreground">Doyn voice accountability (beta) is enabled for your account.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-border p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MdPhone className="text-primary" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Verify your phone</h3>
              <p className="text-sm text-muted-foreground">
                Required for Doyn calls and SMS escalation when a commitment is overdue. Email reminders
                work without this step.
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-amber-900">
            <span className="font-semibold">{DOYN_PHONE_STATUS.betaLabel}: </span>
            {DOYN_PHONE_STATUS.settingsVoiceEnabled}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        {phase === 'phone' ? (
          <>
            <div>
              <label className="label" htmlFor="onboarding-phone">
                Mobile number (E.164)
              </label>
              <input
                id="onboarding-phone"
                type="tel"
                className="input-field"
                placeholder="+14155552671"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <p className="text-sm font-medium text-foreground">Send code via</p>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: 'sms' as const, label: 'SMS', icon: MdSms },
                  { id: 'whatsapp' as const, label: 'WhatsApp', icon: MdWhatsapp },
                  { id: 'call' as const, label: 'Voice', icon: MdPhone },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedChannel(id)}
                  className={`py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    selectedChannel === id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30'
                  }`}
                  disabled={isLoading}
                >
                  <Icon size={22} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" className="btn-primary flex-1" disabled={isLoading} onClick={handleSendOtp}>
                {isLoading ? 'Sending…' : 'Send verification code'}
              </button>
              <button type="button" className="btn-secondary flex-1" disabled={isLoading} onClick={() => onSkip()}>
                Skip for now
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Code sent to <span className="font-mono text-foreground">{phoneNumber}</span>
            </p>
            <div>
              <label className="label" htmlFor="onboarding-otp">
                6-digit code
              </label>
              <input
                id="onboarding-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="input-field tracking-widest text-center text-lg"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" className="btn-primary flex-1" disabled={isLoading} onClick={handleVerifyOtp}>
                {isLoading ? 'Verifying…' : 'Verify'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={isLoading}
                onClick={() => {
                  setPhase('phone');
                  setOtpCode('');
                  setError('');
                }}
              >
                Change number
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
