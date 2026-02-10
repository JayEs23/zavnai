'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-6 py-16 transition-colors duration-300">
      <div className="mx-auto max-w-3xl w-full p-8 bg-card-bg border border-border-subtle rounded-2xl shadow-xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-1">
            Privacy Policy
          </h1>
          <p className="text-base text-muted-foreground mb-6">
            Your privacy is important to us. This privacy policy explains how your information is handled when you use Zero-Gap.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Information We Collect</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>
                <span className="font-medium">Account Information:</span> Your name, email address, and basic profile info to set up and manage your account.
              </li>
              <li>
                <span className="font-medium">Onboarding Data:</span> Audio transcripts and insights you provide during onboarding, including your preferences and social network (tribe) information.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> Details about how and when you use the platform, to improve our services.
              </li>
              <li>
                <span className="font-medium">Third-Party Integrations:</span> Information from services you choose to connect, such as calendar providers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>To provide and personalize your Zero-Gap experience.</li>
              <li>To set up your goals, commitments, and tribe based on onboarding data.</li>
              <li>To secure your account and communicate with you about updates.</li>
              <li>To improve our platform using aggregated, anonymized insights.</li>
              <li>We do <span className="font-bold">not</span> sell your data.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Your Rights & Choices</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>You may delete your data and account at any time from your profile settings.</li>
              <li>You can update preferences or revoke third-party integrations.</li>
              <li>Contact us at <a href="mailto:support@zerogap.app" className="underline">support@zerogap.app</a> with privacy concerns or questions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground">
              We protect your data using secure storage, encryption, and best security practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Policy Changes</h2>
            <p className="text-sm text-muted-foreground">
              We may update our privacy policy from time to time. Significant changes will be communicated to you via the platform.
            </p>
          </section>

          <section>
            <p className="text-xs text-muted-foreground mt-6">
              Effective Date: May 1, 2024
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

