'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdPhone } from 'react-icons/md';
import { authApi } from '@/services/authApi';
import { DOYN_PHONE_STATUS } from '@/lib/doynPhoneStatus';

const DISMISS_KEY = 'zavn_phone_banner_dismissed';

/**
 * Shown on dashboard when the user has no verified phone — needed for SMS/voice escalation.
 */
export function PhoneVerifyBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    authApi
      .getCurrentUser()
      .then((u) => setShow(!u.is_verified))
      .catch(() => setShow(false));
  }, []);

  if (!show) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="flex gap-3 items-start">
        <MdPhone className="text-amber-700 shrink-0 mt-0.5" size={22} aria-hidden />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">Verify your phone for Doyn accountability</p>
          <p className="mt-1 text-amber-800/90">
            Email reminders are on. To receive SMS or beta voice calls when a commitment is overdue, verify
            your number first.
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Link
          href="/verify"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
        >
          {DOYN_PHONE_STATUS.verifyCta}
        </Link>
        <button
          type="button"
          className="px-3 py-2 text-sm text-amber-800 hover:underline"
          onClick={() => {
            try {
              sessionStorage.setItem(DISMISS_KEY, '1');
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
