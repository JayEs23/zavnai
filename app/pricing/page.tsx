"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { ENABLE_WAITLIST_MODE } from "@/constants/featureFlags";
import { WaitlistModal } from "@/components/landing/WaitlistModal";

export default function PricingPage() {
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const tiers = [
    {
      name: "The Intention",
      price: "$0",
      period: "Forever",
      description: "Perfect for trying ZAVN",
      target: "The curious procrastinator",
      icon: Sparkles,
      color: "from-primary to-teal-600",
      features: [
        "1 Active Goal",
        "SMS Nudges",
        "Standard Echo Voice Sessions",
        "Basic Progress Tracking",
        "Email Support",
      ],
      limitations: [
        "No Doyn Voice Intervention",
        "No Vocal Biomarker Analysis",
        "No Tribe Vetting Automation",
      ],
    },
    {
      name: "The Action",
      price: "$29",
      period: "per month",
      description: "For serious goal-achievers",
      target: "The high-achiever/founder",
      icon: Zap,
      color: "from-secondary to-emerald-600",
      popular: true,
      features: [
        "5 Active Goals",
        "Doyn Voice Intervention",
        "Vocal Biomarker Analysis (Thrive)",
        "Priority Echo Sessions",
        "Tribe Verification (up to 3 members)",
        "Advanced Progress Analytics",
        "Email & SMS Support",
        "Stake System Access",
      ],
    },
    {
      name: "The Obsession",
      price: "$89",
      period: "per month",
      description: "Unlimited everything",
      target: "Teams, Athletes, ADHD power-users",
      icon: Crown,
      color: "from-accent to-purple-600",
      features: [
        "Unlimited Active Goals",
        "Priority Doyn Voice Calls",
        "Tribe Vetting Automation",
        "Custom RAG Memory",
        "Unlimited Tribe Members",
        "Advanced Thrive Analytics",
        "Priority Support (24/7)",
        "Team Management Tools",
        "API Access (coming soon)",
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-16">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Pricing
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Choose Your Commitment Level
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ZAVN combines a base subscription with optional performance stakes. Pay for what you use, or stake money on your goals for extra motivation.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.name}
                    className={`relative p-8 rounded-2xl border-2 ${
                      tier.popular
                        ? "border-primary shadow-2xl scale-105"
                        : "border-border shadow-sm"
                    } bg-white`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-teal-600 text-white text-sm font-semibold rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground ml-2">{tier.period}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-6 italic">{tier.target}</p>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                      {tier.limitations?.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2 opacity-50">
                          <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground">✕</span>
                          <span className="text-sm text-muted-foreground line-through">{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    {ENABLE_WAITLIST_MODE ? (
                      <button
                        onClick={() => setWaitlistModalOpen(true)}
                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                          tier.popular
                            ? "bg-gradient-to-r from-primary to-teal-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Join Waitlist
                      </button>
                    ) : (
                      <a
                        href="/signup"
                        className={`block w-full px-6 py-3 rounded-xl font-semibold text-center transition-all ${
                          tier.popular
                            ? "bg-gradient-to-r from-primary to-teal-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Get Started
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Stake System */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                The Performance Stake System
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Put your money where your mouth is. Stake funds on high-stakes goals for extra motivation.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-white border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <h3 className="font-semibold text-foreground mb-2">The Vault</h3>
                  <p className="text-sm text-muted-foreground">
                    Stake money (typically $25-$200) on a high-stakes goal. Funds are held securely.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white border border-border">
                  <div className="text-3xl font-bold text-success mb-2">2</div>
                  <h3 className="font-semibold text-foreground mb-2">Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    If Tribe and Doyn verify completion, your money stays in the &quot;ZAVN Vault&quot; for next month&apos;s subscription.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white border border-border">
                  <div className="text-3xl font-bold text-error mb-2">3</div>
                  <h3 className="font-semibold text-foreground mb-2">The Penalty</h3>
                  <p className="text-sm text-muted-foreground">
                    If you fail, ZAVN takes 20% &quot;Service Fee&quot; (The Vig). The rest is returned or donated to an &quot;anti-charity.&quot;
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  <strong className="text-foreground">The Psychology:</strong> Loss aversion is the strongest human motivator. The fear of losing $50 is more powerful than the promise of progress.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-2">Can I change plans later?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade at any time. Changes take effect immediately, and we&apos;ll prorate your billing.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-2">What happens if I cancel?</h3>
                <p className="text-sm text-muted-foreground">
                  You keep access until the end of your billing period. Your goals and progress data are preserved for 90 days in case you want to return.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-2">How does the stake system work?</h3>
                <p className="text-sm text-muted-foreground">
                  You choose an amount to stake on a specific goal. If you complete it, the money goes toward your next subscription. If you fail, we take a 20% service fee. It&apos;s optional—you can use ZAVN without staking anything.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  The Free tier is always free. For Pro and Max tiers, we offer a 14-day free trial. No credit card required for the trial.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Close the Gap?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with the Free tier and upgrade when you&apos;re ready for Doyn&apos;s proactive intervention and advanced features.
            </p>
            {ENABLE_WAITLIST_MODE ? (
              <button
                onClick={() => setWaitlistModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </main>
      <LandingFooter />
      {ENABLE_WAITLIST_MODE && (
        <WaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
      )}
    </div>
  );
}

