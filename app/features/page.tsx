import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Mic, Phone, Users, TrendingUp, Shield, Brain, Target, CheckCircle2, Zap, Lock } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      category: "Voice-First Interaction",
      icon: Mic,
      color: "from-primary to-teal-600",
      description: "Traditional apps demand attention. ZAVN only needs your voice.",
      details: [
        "Real-time voice conversations using Gemini Multimodal Live API",
        "Speak naturally—no typing required",
        "Progressive profiling during onboarding",
        "Detects mental models, constraints, and energy patterns",
      ],
    },
    {
      category: "Proactive Intervention",
      icon: Phone,
      color: "from-secondary to-emerald-600",
      description: "Unlike passive calendars, Doyn actually calls you when you slip.",
      details: [
        "Proactive phone calls when commitments are missed",
        "SMS/WhatsApp reminders with escalation ladder",
        "Real-time negotiation during voice calls",
        "Function calling to save commitments directly to database",
      ],
    },
    {
      category: "AI-Powered Vetting",
      icon: Shield,
      color: "from-accent to-purple-600",
      description: "Tribe members are assessed for reliability before joining.",
      details: [
        "AI analyzes response latency and sentiment",
        "Checks commitment clarity",
        "Ensures accountability partners are actually reliable",
        "Quietly rejects uncommitted contacts—no awkward conversations",
      ],
    },
    {
      category: "Multimodal Verification",
      icon: CheckCircle2,
      color: "from-orange-500 to-red-600",
      description: "Accepts photos, links, journal entries, and Tribe feedback.",
      details: [
        "Upload GitHub links, photos, or journal entries as proof",
        "Gemini verifies authenticity automatically",
        "Tribe members can vouch for your progress",
        "Weighted proof system combines user evidence + social vouching",
      ],
    },
    {
      category: "Privacy-Aware Governance",
      icon: Lock,
      color: "from-blue-500 to-indigo-600",
      description: "Automatically masks surprise goals from restricted contacts.",
      details: [
        "Set goals that stay secret from specific Tribe members",
        "Maintains accountability through other contacts",
        "Protects relationship boundaries",
        "Automatic goal masking based on privacy settings",
      ],
    },
    {
      category: "Long-Term Memory",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      description: "RAG system remembers patterns from months ago to prevent recurring failures.",
      details: [
        "Retrieval-Augmented Generation (RAG) queries historical data",
        "Spots recurring failure patterns",
        "Adapts instead of repeating the same mistakes",
        "Progressive learning from your behavior over time",
      ],
    },
  ];

  const agents = [
    {
      name: "Echo",
      role: "The Reflection Agent",
      icon: Brain,
      color: "from-primary to-teal-600",
      description: "The Voice Interface for advanced reflection and awareness",
      capabilities: [
        "Real-time voice conversations",
        "Goal extraction from vague conversations",
        "Cognitive distortion detection",
        "Energy pattern analysis",
        "RAG memory for pattern recognition",
      ],
    },
    {
      name: "Doyn",
      role: "The Execution Agent",
      icon: Target,
      color: "from-secondary to-emerald-600",
      description: "Execution and productivity focus, turning plans into immediate action",
      capabilities: [
        "Negotiates tiny, Zero-Gap commitments",
        "Proactive phone calls when commitments are missed",
        "SMS/WhatsApp reminders with escalation",
        "Real-time negotiation during calls",
        "Function calling to save commitments",
      ],
    },
    {
      name: "Thrive",
      role: "The Sustainability Agent",
      icon: TrendingUp,
      color: "from-accent to-purple-600",
      description: "Wellbeing and sustainable growth, ensuring performance doesn't come at the cost of health",
      capabilities: [
        "Monitors vocal biomarkers for stress and fatigue",
        "Tracks commitment elasticity (renegotiation frequency)",
        "Analyzes sentiment drift over time",
        "Triggers burnout protocol when scores drop",
        "Prevents over-commitment during high-stress periods",
      ],
    },
    {
      name: "Tribe",
      role: "The Social Accountability Agent",
      icon: Users,
      color: "from-orange-500 to-red-600",
      description: "Collective alignment through social verification",
      capabilities: [
        "AI-powered vetting of accountability partners",
        "Multi-channel communication (WhatsApp, SMS, Email)",
        "Verification of proof (screenshots, links, journal entries)",
        "Privacy-aware goal masking",
        "Weighted proof system combining evidence + vouching",
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
              Features
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Everything You Need to Close the Gap
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ZAVN isn&apos;t another productivity app. It&apos;s a proactive behavioral alignment system that fights for your goals.
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What Makes ZAVN Different</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="p-6 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.category}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The Four Agents */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Meet Your AI Agents</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Four specialized AI agents work together to close the gap between intention and action.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {agents.map((agent, idx) => {
                const Icon = agent.icon;
                return (
                  <div key={idx} className={`p-8 rounded-2xl bg-gradient-to-br ${agent.color}/10 border-2 border-transparent hover:border-current transition-all`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{agent.description}</p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">Capabilities:</h4>
                      <ul className="space-y-2">
                        {agent.capabilities.map((capability, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Five Focus Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: "Productivity & Work Habits", icon: Target },
                { name: "Health, Fitness & Wellness", icon: TrendingUp },
                { name: "Financial Health", icon: Shield },
                { name: "Personal Growth & Learning", icon: Brain },
                { name: "Relationships & Community", icon: Users },
              ].map((area, idx) => {
                const Icon = area.icon;
                return (
                  <div key={idx} className="p-6 rounded-xl bg-white border border-border text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{area.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It All Works Together */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How It All Works Together</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-teal-600/5 border border-primary/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Echo Profiles You</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-14">
                  Voice conversations reveal your energy patterns, constraints, and goals. Echo extracts actionable insights and stores them in RAG memory.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-emerald-600/5 border border-secondary/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Doyn Negotiates Commitments</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-14">
                  Based on Echo&apos;s insights, Doyn negotiates tiny, realistic commitments. If you miss one, Doyn calls you proactively.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-purple-600/5 border border-accent/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Thrive Monitors Sustainability</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-14">
                  Thrive analyzes your vocal biomarkers and commitment patterns. If stress levels rise, it blocks new goals to prevent burnout.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-600/5 border border-orange-500/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-500">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Tribe Verifies Progress</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-14">
                  When you complete a commitment, Tribe members can vouch for your proof. Combined verification ensures integrity and builds your reliability score.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Experience ZAVN?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with the Free tier and unlock Doyn&apos;s proactive intervention when you&apos;re ready.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Join the Waitlist
            </a>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

