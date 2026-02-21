/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { calendarApi } from '@/services/calendarApi';
import { MdCheckCircle, MdError } from 'react-icons/md';

function IntegrationsCallbackApp() {  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your calendar...');


  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => router.push('/integrations'), 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Invalid callback parameters');
        setTimeout(() => router.push('/integrations'), 3000);
        return;
      }

      // Determine provider from state (state should contain provider info)
      const stateData = JSON.parse(atob(state));
      const provider = stateData.provider as 'google' | 'outlook';

      // Complete OAuth flow
      if (provider === 'google') {
        await calendarApi.connectGoogleCalendar(code, state);
      } else if (provider === 'outlook') {
        await calendarApi.connectOutlookCalendar(code, state);
      }

      setStatus('success');
      setMessage(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar connected successfully!`);
      
      // Redirect to integrations page after 2 seconds
      setTimeout(() => router.push('/integrations'), 2000);
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to connect calendar');
      setTimeout(() => router.push('/integrations'), 3000);
    }
  };

  useEffect(() => {
    // Don't call async directly in effect; define inner async and call
    const run = async () => {
      await handleCallback();
    };
    run();

  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card-bg border border-border-subtle rounded-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{message}</h2>
            <p className="text-muted-foreground">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdCheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Success!</h2>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting to integrations...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdError className="text-red-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connection Failed</h2>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
export default function IntegrationsCallbackPage() {
  return (
    <Suspense>
      <IntegrationsCallbackApp />
    </Suspense>
  );
}

