import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArrowRight, Mic, Target, Phone, Users, TrendingUp, CheckCircle2, Clock, Zap } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Sign Up & Onboarding",
      description: "Create your account and complete the multimodal handshake",
      icon: Mic,
      color: "from-primary to-teal-600",
      details: [
        "Voice-first Echo discovery session to understand your goals",
        "Entity extraction identifies your focus areas",
        "Doyn parameters setup for commitment negotiation",
        "Tribe vetting process for accountability partners",
        "First contract creation with your initial commitment",
      ],
    },
    {
      number: "02",
      title: "Daily Echo Sessions",
      description: "Start your day with a voice conversation",
      icon: Mic,
      color: "from-primary to-teal-600",
      details: [
        "Speak naturally about your day, goals, and challenges",
        "Echo listens and detects hesitation, energy patterns, and constraints",
        "AI extracts actionable insights from your conversation",
        "RAG memory recalls patterns from previous sessions",
        "Echo negotiates realistic commitments based on actual capacity",
      ],
    },
    {
      number: "03",
      title: "Doyn Negotiates Commitments",
      description: "Turn intentions into concrete, tiny actions",
      icon: Target,
      color: "from-secondary to-emerald-600",
      details: [
        "Based on Echo's insights, Doyn proposes 1-2 tiny commitments",
        "Negotiation happens in real-time during voice calls",
        "Commitments are saved directly to your dashboard",
        "You can renegotiate if circumstances change",
        "Each commitment has a clear deadline and verification method",
      ],
    },
    {
      number: "04",
      title: "Proactive Intervention",
      description: "Doyn calls you when commitments are missed",
      icon: Phone,
      color: "from-secondary to-emerald-600",
      details: [
        "If a deadline passes without proof, escalation begins",
        "Level 1: Email nudge with gentle reminder",
        "Level 2: Phone call during your preferred window",
        "Level 3: Tribe notification if call is ignored",
        "Real-time negotiation during calls to adjust commitments",
      ],
    },
    {
      number: "05",
      title: "Thrive Monitors Sustainability",
      description: "Prevent burnout before it happens",
      icon: TrendingUp,
      color: "from-accent to-purple-600",
      details: [
        "Vocal biomarker analysis detects stress and fatigue",
        "Commitment elasticity tracking (how often you renegotiate)",
        "Sentiment drift analysis over time",
        "Automatic goal blocking when Thrive score drops below 40",
        "Burnout protocol triggers recovery recommendations",
      ],
    },
    {
      number: "06",
      title: "Tribe Verification",
      description: "Social accountability with AI-powered vetting",
      icon: Users,
      color: "from-orange-500 to-red-600",
      details: [
        "Invite accountability partners (mentors, friends, colleagues)",
        "AI vets potential members for reliability and commitment",
        "Tribe members receive notifications via WhatsApp, SMS, or Email",
        "When you complete a commitment, they can vouch for your proof",
        "Weighted verification combines your evidence + Tribe vouching",
      ],
    },
    {
      number: "07",
      title: "Multimodal Proof Submission",
      description: "Verify completion with links, photos, or journal entries",
      icon: CheckCircle2,
      color: "from-success to-green-600",
      details: [
        "Upload GitHub links, photos, screenshots, or journal entries",
        "Gemini verifies authenticity automatically",
        "Tribe members can vouch for your progress",
        "Privacy-aware goal masking for surprise goals",
        "Reliability score increases with verified completions",
      ],
    },
  ];

  const dayInTheLife = [
    {
      time: "08:30 AM",
      title: "Echo Session",
      description: "Morning voice conversation to set the day's intentions",
      agent: "Echo",
      color: "from-primary to-teal-600",
    },
    {
      time: "02:00 PM",
      title: "Privacy-Aware Governance",
      description: "Set a surprise goal that stays hidden from specific Tribe members",
      agent: "Tribe",
      color: "from-orange-500 to-red-600",
    },
    {
      time: "05:15 PM",
      title: "Doyn Escalation",
      description: "Commitment deadline passes, Doyn calls you proactively",
      agent: "Doyn",
      color: "from-secondary to-emerald-600",
    },
    {
      time: "08:00 PM",
      title: "Multimodal Verification",
      description: "Upload proof, Tribe vouches, reliability score increases",
      agent: "Tribe + Doyn",
      color: "from-success to-green-600",
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
              User Journey
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              How ZAVN Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From onboarding to daily use, here&apos;s how ZAVN closes the gap between intention and action.
            </p>
          </div>

          {/* Step-by-Step Process */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">The Complete Journey</h2>
            <div className="space-y-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl font-bold text-muted-foreground/30">{step.number}</span>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                        <ul className="space-y-2 ml-16">
                          {step.details.map((detail, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-8 bg-gradient-to-b from-primary to-secondary md:block hidden" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* A Day in the Life */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">A Day in the Life</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              See how ZAVN works throughout your day, from morning reflection to evening verification.
            </p>
            <div className="space-y-6">
              {dayInTheLife.map((event, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-foreground">{event.time}</span>
                        <span className="px-3 py-1 rounded-full bg-muted text-xs font-semibold text-foreground">
                          {event.agent}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Principles */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-teal-600/5 border border-primary/10">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Voice-First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No typing required. Speak naturally and ZAVN understands your intentions, energy, and constraints.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-emerald-600/5 border border-secondary/10">
                <Phone className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Proactive</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ZAVN doesn&apos;t wait for you to check in. Doyn calls you when commitments are missed.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-purple-600/5 border border-accent/10">
                <CheckCircle2 className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Not just claims—proof. Multimodal verification ensures progress is real, not imagined.
                </p>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What Success Looks Like</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-3">Closure Rate</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  % of Doyn commitments completed within 24 hours
                </p>
                <div className="text-3xl font-bold text-primary">85%+</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-3">Reflection Depth</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Average length and sentiment complexity of Echo sessions
                </p>
                <div className="text-3xl font-bold text-secondary">15+ min</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-3">Friction Reduction</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Time from &quot;Intent&quot; (Voice) to &quot;Contract&quot; (Data)
                </p>
                <div className="text-3xl font-bold text-accent">&lt;2 min</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="font-semibold text-foreground mb-3">Reliability Score</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Long-term trend of goal completion percentage
                </p>
                <div className="text-3xl font-bold text-success">90%+</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join the waitlist to be among the first to experience ZAVN&apos;s proactive behavioral alignment system.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

