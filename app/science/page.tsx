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
                      Research consistently shows that public commitments significantly increase follow-through (<strong>Cialdini, 2001; Harkin et al., 2016</strong>). ZAVN&apos;s Tribe system creates this accountability while respecting privacy boundaries.
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

          {/* References */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">References</h2>
            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Implementation Intentions & Intention–Action Gap</h3>
                <div className="space-y-3">
                  <p>
                    Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. <em>Advances in Experimental Social Psychology, 38</em>, 69–119.{" "}
                    <a href="https://doi.org/10.1016/S0065-2601(06)38002-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://doi.org/10.1016/S0065-2601(06)38002-1
                    </a>
                  </p>
                  <p>
                    Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. <em>American Psychologist, 54</em>(7), 493–503.{" "}
                    <a href="https://doi.org/10.1037/0003-066X.54.7.493" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://doi.org/10.1037/0003-066X.54.7.493
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Loss Aversion & Prospect Theory</h3>
                <div className="space-y-3">
                  <p>
                    Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. <em>Econometrica, 47</em>(2), 263–291.{" "}
                    <a href="https://doi.org/10.2307/1914185" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://doi.org/10.2307/1914185
                    </a>
                  </p>
                  <p>
                    Tversky, A., & Kahneman, D. (1991). Loss aversion in riskless choice: A reference-dependent model. <em>Quarterly Journal of Economics, 106</em>(4), 1039–1061.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Commitment & Consistency / Social Accountability</h3>
                <div className="space-y-3">
                  <p>
                    Cialdini, R. B. (2001). <em>Influence: Science and practice</em> (4th ed.). Allyn & Bacon.
                  </p>
                  <p>
                    Cialdini, R. B. (2009). <em>Influence: Science and practice</em> (5th ed.). Pearson.
                  </p>
                  <p>
                    Harkin, B., et al. (2016). Does monitoring goal progress promote goal attainment? A meta-analysis. <em>Psychological Bulletin, 142</em>(2), 198–229.{" "}
                    <a href="https://doi.org/10.1037/bul0000025" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://doi.org/10.1037/bul0000025
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Social Identity Theory</h3>
                <div className="space-y-3">
                  <p>
                    Tajfel, H., & Turner, J. C. (1979). An integrative theory of intergroup conflict. In W. G. Austin & S. Worchel (Eds.), <em>The social psychology of intergroup relations</em> (pp. 33–47). Brooks/Cole.
                  </p>
                  <p>
                    Turner, J. C., Hogg, M. A., Oakes, P. J., Reicher, S. D., & Wetherell, M. S. (1987). <em>Rediscovering the social group: A self-categorization theory</em>. Blackwell.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Cognitive Behavioral Therapy & Externalization</h3>
                <div className="space-y-3">
                  <p>
                    Beck, A. T. (1976). <em>Cognitive therapy and the emotional disorders</em>. International Universities Press.
                  </p>
                  <p>
                    Beck, J. S. (2011). <em>Cognitive behavior therapy: Basics and beyond</em> (2nd ed.). Guilford Press.
                  </p>
                  <p>
                    White, M., & Epston, D. (1990). <em>Narrative means to therapeutic ends</em>. Norton.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Job Demands–Resources (JD-R) Theory</h3>
                <div className="space-y-3">
                  <p>
                    Demerouti, E., Bakker, A. B., Nachreiner, F., & Schaufeli, W. B. (2001). The job demands–resources model of burnout. <em>Journal of Applied Psychology, 86</em>(3), 499–512.
                  </p>
                  <p>
                    Bakker, A. B., & Demerouti, E. (2007). The job demands–resources model: State of the art. <em>Journal of Managerial Psychology, 22</em>(3), 309–328.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Vocal Biomarkers & Psychoacoustics</h3>
                <div className="space-y-3">
                  <p>
                    Scherer, K. R. (2003). Vocal communication of emotion: A review of research paradigms. <em>Speech Communication, 40</em>(1–2), 227–256.
                  </p>
                  <p>
                    Low, L. A., et al. (2020). Vocal biomarkers for monitoring stress and emotional health. <em>NPJ Digital Medicine, 3</em>, 52.{" "}
                    <a href="https://doi.org/10.1038/s41746-020-0251-5" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://doi.org/10.1038/s41746-020-0251-5
                    </a>
                  </p>
                  <p>
                    Cummins, N., Scherer, S., Krajewski, J., Schnieder, S., Epps, J., & Quatieri, T. (2015). A review of depression and suicide risk assessment using speech analysis. <em>Speech Communication, 71</em>, 10–49.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Goal Monitoring & Feedback Loops</h3>
                <div className="space-y-3">
                  <p>
                    Carver, C. S., & Scheier, M. F. (1982). Control theory: A useful conceptual framework for personality–social, clinical, and health psychology. <em>Psychological Bulletin, 92</em>(1), 111–135.
                  </p>
                  <p>
                    Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. <em>American Psychologist, 57</em>(9), 705–717.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Tiny Habits / Micro-Commitments</h3>
                <div className="space-y-3">
                  <p>
                    Fogg, B. J. (2019). <em>Tiny habits: The small changes that change everything</em>. Houghton Mifflin Harcourt.
                  </p>
                  <p>
                    Lally, P., van Jaarsveld, C. H., Potts, H. W., & Wardle, J. (2010). How are habits formed? <em>European Journal of Social Psychology, 40</em>(6), 998–1009.
                  </p>
                </div>
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
