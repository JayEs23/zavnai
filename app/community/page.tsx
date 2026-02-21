import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Users, Shield, MessageSquare, CheckCircle2, Heart, Lock } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 py-16">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Social Accountability
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              The Tribe: Your Accountability Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ZAVN&apos;s Tribe system connects your progress with the people who matter. Not just social features—real accountability that works.
            </p>
          </div>

          {/* What is Tribe */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">What is Tribe?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tribe is ZAVN&apos;s social accountability layer. It&apos;s not a social network—it&apos;s a <strong>verification system</strong> that connects your goals with trusted accountability partners.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Research shows that public commitments increase follow-through by 65%. Tribe makes this work while respecting your privacy and ensuring your partners are actually reliable.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>AI-powered vetting ensures quality</span>
                </div>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Tribe Agent</h3>
                    <p className="text-sm text-muted-foreground">The Social Accountability Agent</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The Auditor. Ensures high-integrity accountability networks through AI-powered vetting, multi-channel communication, and weighted proof verification.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How Tribe Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Invite Your Tribe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add accountability partners—mentors, friends, family, or colleagues. ZAVN supports WhatsApp, SMS, and Email communication.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-emerald-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">AI Vetting</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Before activation, Tribe members are assessed for reliability. The AI checks response latency, sentiment, and commitment clarity.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Verification & Vouching</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When you complete a commitment, Tribe members can vouch for your proof. Combined with your evidence, this creates a weighted verification score.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Tribe Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-teal-600/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">AI-Powered Vetting</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Potential Tribe members are assessed for reliability before activation. The AI checks response time, enthusiasm, and commitment clarity to ensure you&apos;re working with people who will actually hold you accountable.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-emerald-600/5 border border-secondary/10">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                  <h3 className="text-lg font-semibold text-foreground">Multi-Channel Communication</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tribe members receive notifications via WhatsApp, SMS, or Email—whichever they prefer. No need for everyone to download the app.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-purple-600/5 border border-accent/10">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Weighted Proof System</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your proof (link, photo, journal entry) gets +20% progress. A verified Tribe member vouching adds +80%. Combined verification ensures integrity.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-600/5 border border-orange-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-foreground">Privacy-Aware Governance</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Setting a surprise goal? ZAVN automatically masks it from restricted Tribe members (like your spouse) while maintaining accountability through other contacts.
                </p>
              </div>
            </div>
          </div>

          {/* Vetting Process */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Vetting Process</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Invited</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-12">
                  You add a contact. ZAVN sends them a &quot;Role Brief&quot; explaining what accountability means and asking if they can commit to high-integrity feedback.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-secondary">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Assessing</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-12">
                  When they reply, the AI analyzes their response. Does it sound enthusiastic? Committed? Or hesitant and burdened? Response latency and sentiment are evaluated.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Verified</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-12">
                  If they pass vetting, they&apos;re locked in as a Tribe member. You get notified. They can now vouch for your commitments and provide accountability.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-error">✕</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Rejected</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-12">
                  If they sound uncommitted or too busy, they&apos;re quietly rejected. You&apos;re notified, and their contact data is deleted. No awkward conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Who Benefits from Tribe?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Individuals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add a mentor, friend, or family member who will actually check in. The vetting ensures they&apos;re committed, not just saying yes to be polite.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <Users className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Teams</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Coding bootcamps, sales teams, fitness groups. Create accountability networks where members vouch for each other&apos;s progress.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
                <Shield className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">High-Stakes Goals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When you&apos;ve staked money on a goal, Tribe verification adds an extra layer of integrity. Multiple vouches = higher reliability score.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Build Your Tribe</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Accountability works when it&apos;s real. Tribe ensures your partners are committed, not just connected.
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

