import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Brain, Target, Users, TrendingUp, BookOpen, Lightbulb } from "lucide-react";

export default function SciencePage() {
  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-16">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Behind ZAVN
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              The Science of Behavior Alignment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ZAVN blends behavioral science, coaching psychology, and conversational AI to help you close the gap between intention and action. Built on proven research, not productivity myths.
            </p>
          </div>

          {/* Core Principles */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Four Pillars of Behavior Change</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-teal-600">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Cognitive Reflection (Echo)</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Based on <strong>Externalization Theory</strong> and <strong>Cognitive Behavioral Therapy (CBT)</strong>, Echo sessions externalize your thinking so cognitive distortions and hidden assumptions become visible.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Voice-first processing:</strong> Speaking thoughts aloud activates different neural pathways than writing</li>
                  <li>• <strong>Progressive disclosure:</strong> Natural conversation reveals patterns that questionnaires miss</li>
                  <li>• <strong>RAG memory:</strong> Long-term pattern recognition prevents recurring failure cycles</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-emerald-600/10 border border-secondary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-emerald-600">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Implementation Intentions (Doyn)</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Rooted in <strong>Gollwitzer&apos;s Implementation Intention Theory</strong> and <strong>Loss Aversion</strong> (Kahneman & Tversky), Doyn turns clarified intentions into concrete, low-friction next actions.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Tiny commitments:</strong> 1-2 actions per week reduce cognitive load and increase completion rates</li>
                  <li>• <strong>Proactive intervention:</strong> Phone calls leverage social pressure and commitment consistency</li>
                  <li>• <strong>Micro-wins:</strong> Negotiated reductions maintain momentum when full commitment isn&apos;t possible</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-purple-600/10 border border-accent/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-purple-600">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Sustainable Performance (Thrive)</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Built on <strong>Job Demands-Resources Theory</strong> and <strong>Vocal Biomarker Research</strong>, Thrive guards energy and capacity so execution is sustainable.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Vocal biomarkers:</strong> Pitch and speech rate analysis detect stress and fatigue in real-time</li>
                  <li>• <strong>Commitment elasticity:</strong> Renegotiation frequency signals unsustainable patterns</li>
                  <li>• <strong>Burnout prevention:</strong> Automatic goal blocking protects long-term health</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Social Accountability (Tribe)</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Based on <strong>Social Identity Theory</strong> and <strong>Commitment & Consistency Principle</strong> (Cialdini), Tribe connects progress with the people who matter, creating healthy accountability loops.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>AI-powered vetting:</strong> Ensures accountability partners are reliable and committed</li>
                  <li>• <strong>Weighted verification:</strong> Combines user evidence with social vouching for integrity</li>
                  <li>• <strong>Privacy-aware governance:</strong> Automatic goal masking maintains trust in relationships</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Research Foundations */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Research Foundations</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">The Intention-Action Gap</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Research by <strong>Gollwitzer & Sheeran (2006)</strong> shows that only 50% of intentions translate into actions. ZAVN addresses this through implementation intentions—specific &quot;if-then&quot; plans that create automatic behavioral responses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Loss Aversion & Stakes</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Kahneman & Tversky (1979)</strong> demonstrated that losses loom larger than gains. ZAVN&apos;s stake system leverages this psychological principle—the fear of losing $50 is more motivating than the promise of gaining progress.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Social Accountability</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Studies by <strong>Cialdini (2001)</strong> show that public commitments increase follow-through by 65%. ZAVN&apos;s Tribe system creates this accountability while respecting privacy boundaries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Vocal Biomarkers</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Research in <strong>Psychoacoustics</strong> shows that vocal patterns (pitch, speech rate, jitter) correlate with stress, fatigue, and emotional states. ZAVN&apos;s Thrive agent uses these biomarkers to prevent burnout before it happens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Scientifically */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Science in Action</h2>
            <div className="space-y-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-teal-600/5 border border-primary/10">
                <h3 className="text-xl font-bold text-foreground mb-4">Stateful Conversations & Goal Formation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Under the hood, ZAVN uses <strong>stateful conversation management</strong> to maintain context across sessions. This allows Echo to remember where you are in the process and build on previous insights.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The system uses <strong>RAG (Retrieval-Augmented Generation)</strong> to query months of historical data, spotting patterns like &quot;Every Tuesday you set high goals but fail 80% of them.&quot; This pattern recognition prevents recurring failure cycles.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-emerald-600/5 border border-secondary/10">
                <h3 className="text-xl font-bold text-foreground mb-4">Implementation Intentions & Feedback Loops</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Doyn converts vague goals into specific implementation intentions: &quot;If it&apos;s 5 PM on Friday, then I will upload the GitHub commit link.&quot; This specificity increases completion rates by 2-3x according to research.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The escalation ladder (Email → SMS → Phone Call) creates <strong>progressive commitment pressure</strong>, leveraging the principle that each step increases the psychological cost of backing out.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-purple-600/5 border border-accent/10">
                <h3 className="text-xl font-bold text-foreground mb-4">Multimodal Verification & Integrity</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ZAVN accepts multiple proof types (links, photos, journal entries) and combines them with Tribe vouching in a <strong>weighted verification system</strong>. This prevents self-deception and ensures progress is genuine, not claimed.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The system uses <strong>Gemini&apos;s multimodal capabilities</strong> to verify authenticity—checking that a GitHub link actually contains relevant code, or that a photo matches the commitment description.
                </p>
              </div>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why This Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Not Just Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Most apps record claims. ZAVN verifies actions. The difference between &quot;I did it&quot; and &quot;Prove it&quot; is the difference between intention and reality.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Proactive, Not Passive</h3>
                <p className="text-sm text-muted-foreground">
                  Calendars don&apos;t call you. To-do lists don&apos;t negotiate. ZAVN actively intervenes when you slip, using proven escalation techniques.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Long-Term Memory</h3>
                <p className="text-sm text-muted-foreground">
                  RAG system remembers patterns from months ago. If you always fail on Tuesdays, ZAVN adapts instead of repeating the same mistake.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Privacy-Aware</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic goal masking ensures surprise goals stay secret while maintaining accountability through other Tribe members.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Close the Gap?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ZAVN isn&apos;t built on productivity myths. It&apos;s built on behavioral science, proven research, and real-world results.
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
