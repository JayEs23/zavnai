"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  HeartHandshake,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { LandingNavbar } from "./LandingNavbar";
import { LandingFooter } from "./LandingFooter";
import { CtaSection } from "./CtaSection";
import { WaitlistSection } from "./WaitlistSection";
import { WaitlistModal } from "./WaitlistModal";
import { ENABLE_WAITLIST_MODE } from "@/constants/featureFlags";

const COMPANY = "Vocett Technologies Ltd";
const COMPANY_SHORT = "Vocett";
const COMPANY_URL = "https://vocettt.com.ng";

const pillars = [
  {
    icon: Mic,
    name: "Echo",
    gradient: "from-primary to-teal-600",
    headline: "Reflection that actually lands",
    description:
      "Talk or type with an AI coach that listens for what you avoid—not just what you claim. Echo helps you name friction, patterns, and the gap between your standards and your week.",
    bullets: ["Voice-first or text", "Onboarding & ongoing reflection", "Insights tied to your goals"],
  },
  {
    icon: Brain,
    name: "Doyn",
    gradient: "from-secondary to-emerald-600",
    headline: "From intention to commitments",
    description:
      "Doyn breaks big goals into concrete steps, negotiates realistic wins when life shifts, and keeps you moving when motivation dips—without letting you off the hook by default.",
    bullets: ["Commitment generation", "Check-ins & negotiation", "Execution-focused chat"],
  },
  {
    icon: Users,
    name: "Tribe",
    gradient: "from-accent to-purple-600",
    headline: "Accountability with real humans",
    description:
      "Invite people who matter. Tribe makes it easy to loop in mentors, partners, or peers—with structure so support feels serious, not spammy.",
    bullets: ["Invites & vetting flows", "Visibility you control", "Social proof on progress"],
  },
  {
    icon: TrendingUp,
    name: "Thrive",
    gradient: "from-success to-green-600",
    headline: "Performance without burnout",
    description:
      "Sustainability signals sit next to streaks and scores. Thrive is the reminder that high performance should compound—not collapse.",
    bullets: ["Wellbeing-oriented metrics", "Trends over time", "Balance next to hustle"],
  },
];

const beliefStats = [
  {
    icon: Target,
    label: "Zero-gap philosophy",
    value: "Intent → proof",
    detail: "We care about verified follow-through, not vanity completion rates.",
    gradient: "from-primary to-teal-600",
  },
  {
    icon: Zap,
    label: "Built for speed + depth",
    value: "Voice & AI",
    detail: "Fast capture when you're on the go; depth when you're ready to go honest.",
    gradient: "from-secondary to-emerald-600",
  },
  {
    icon: HeartHandshake,
    label: "Humans in the loop",
    value: "Tribe-ready",
    detail: "Software amplifies relationships—it doesn't replace the people you trust.",
    gradient: "from-accent to-purple-600",
  },
  {
    icon: Sparkles,
    label: "Always improving",
    value: "Shipped weekly",
    detail: "We're early. Your feedback directly shapes what we build next.",
    gradient: "from-success to-green-600",
  },
];

const whyRows = [
  {
    title: "Not another to-do app",
    body: "Lists don't change behavior—accountability, stakes, and honest feedback do. ZAVN is structured around those levers.",
  },
  {
    title: "Not generic AI chat",
    body: "Echo, Doyn, Tribe, and Thrive each have a job. You're not bouncing between random prompts; you're walking a designed loop.",
  },
  {
    title: "Not motivation theater",
    body: "We optimize for consistency you can prove—to yourself and, when you choose, to your tribe.",
  },
];

export function AboutPageContent() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen overflow-x-clip">
      <LandingNavbar />
      <main className="pt-20">
        {/* ── Hero (homepage scale) ───────────────────────────────────── */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-4 bg-white overflow-x-clip">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-0 w-[min(100%,28rem)] h-[min(100%,28rem)] bg-gradient-to-br from-primary/15 via-transparent to-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-[1920px] mx-auto relative z-10 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="space-y-8 text-center lg:text-left"
              >
                <div className="flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Why ZAVN exists
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
                  High performers deserve{" "}
                  <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                    systems
                  </span>{" "}
                  — not another guilt trip
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  ZAVN is the Zero-Gap Action &amp; Verification Network: voice-first reflection,
                  structured execution, real accountability, and sustainability signals—built for
                  students, professionals, and entrepreneurs who already hold a high bar.
                </p>

                <div className="grid sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto lg:mx-0">
                  {[
                    { t: "Prove progress", d: "Verification-minded loop" },
                    { t: "Move faster", d: "Voice + AI where it helps" },
                    { t: "Stay human", d: "Tribe, not isolation" },
                  ].map((x) => (
                    <div
                      key={x.t}
                      className="rounded-xl border border-border/60 bg-slate-50/80 p-4 text-left hover:border-primary/25 transition-colors"
                    >
                      <p className="text-sm font-semibold text-foreground">{x.t}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{x.d}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  {ENABLE_WAITLIST_MODE ? (
                    <button
                      type="button"
                      onClick={() => setWaitlistOpen(true)}
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      Join the waitlist
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      Start free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  <Link
                    href="#pillars"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground rounded-xl font-semibold border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md"
                  >
                    See the four pillars
                  </Link>
                </div>
              </motion.div>

              {/* Right: product story visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.75, ease: "easeOut" }}
                className="hidden lg:flex items-center justify-center relative"
              >
                <div className="relative w-full max-w-lg">
                  <motion.div
                    className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl p-8 border border-border/60"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg">
                        <Bot className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                          Your stack
                        </p>
                        <p className="text-lg font-bold text-foreground">Echo → Doyn → Proof</p>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {[
                        { step: "1", title: "Echo surfaces the real gap", sub: "Reflection & honesty" },
                        { step: "2", title: "Doyn locks the next win", sub: "Commitments you can hit" },
                        { step: "3", title: "Tribe & Thrive hold the line", sub: "People + sustainability" },
                      ].map((row, i) => (
                        <motion.li
                          key={row.step}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }}
                          className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-border/50 shadow-sm"
                        >
                          <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                            {row.step}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{row.title}</p>
                            <p className="text-sm text-muted-foreground">{row.sub}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-4 top-8 max-w-[220px] bg-white rounded-2xl shadow-xl p-4 border border-border/50 z-10"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-semibold text-foreground">Verified streak</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Built for people who track truth, not vibes.</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute -left-6 bottom-12 max-w-[200px] rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-4 shadow-lg z-10"
                  >
                    <p className="text-sm font-bold text-foreground">Students · Pros · Founders</p>
                    <p className="text-xs text-muted-foreground mt-1">One loop. Serious intent.</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Belief strip ───────────────────────────────────────────── */}
        <section className="w-full bg-gradient-to-br from-slate-50 to-white py-16 lg:py-20 border-y border-border/50">
          <div className="max-w-[1920px] mx-auto px-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-sm font-semibold uppercase tracking-wider text-primary mb-10"
            >
              What we optimize for
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {beliefStats.map((s, index) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="text-center p-6 rounded-2xl bg-white border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${s.gradient} mb-4 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{s.value}</p>
                    <p className="text-sm font-semibold text-foreground mb-2">{s.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Problem / tension ───────────────────────────────────────── */}
        <section className="relative section-padding py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-[1920px] mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                The gap isn&apos;t discipline.
                <span className="block mt-2 bg-gradient-to-r from-teal-300 to-primary/90 bg-clip-text text-transparent">
                  It&apos;s visibility, structure, and follow-through.
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                You already know what matters. What&apos;s missing is a system that turns clarity into
                commitments, commitments into evidence, and evidence into momentum—without shaming you
                when you slip. That&apos;s the problem ZAVN is built to solve.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Four pillars (ecosystem-grade) ───────────────────────────── */}
        <section id="pillars" className="section-padding bg-white py-24 lg:py-32 scroll-mt-24">
          <div className="max-w-[1920px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-16 lg:mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">The ZAVN loop</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Four pillars. One coherent journey.
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Each pillar has a clear job. Together they keep you honest, moving, supported, and
                sustainable—whether you&apos;re cramming finals, closing deals, or scaling a company.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {pillars.map((p, index) => {
                const Icon = p.icon;
                return (
                  <motion.article
                    key={p.name}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: index * 0.08, duration: 0.55 }}
                    className="group relative rounded-2xl p-8 lg:p-10 border border-border bg-white hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-[0.06] rounded-2xl transition-opacity duration-300`}
                    />
                    <div className="relative">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${p.gradient} mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{p.name}</h3>
                      <p className="text-sm font-semibold text-primary mb-4">{p.headline}</p>
                      <p className="text-muted-foreground leading-relaxed mb-6">{p.description}</p>
                      <ul className="space-y-2.5">
                        {p.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why ZAVN (differentiators) ─────────────────────────────── */}
        <section className="section-padding py-20 lg:py-28 bg-gradient-to-b from-slate-50/80 to-white border-t border-border/50">
          <div className="max-w-[1920px] mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for people who are already serious
              </h2>
              <p className="text-lg text-muted-foreground">
                If you live in calendars, deadlines, and standards, you need tooling that respects
                your ambition—and doesn&apos;t waste your attention.
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {whyRows.map((row, i) => (
                <motion.div
                  key={row.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="flex gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{row.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{row.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Vocett ─────────────────────────────────────────────────── */}
        <section className="py-16 lg:py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-white to-accent/5 p-8 sm:p-12 lg:p-14 shadow-lg shadow-primary/5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <div className="rounded-2xl bg-white p-5 ring-1 ring-border shadow-md">
                  <Image src="/zavn-icon.png" alt="ZAVN" width={72} height={72} />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                  Operator
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {COMPANY}
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6">
                  ZAVN is developed and operated by {COMPANY_SHORT}—a team focused on behavioral
                  alignment and products that help ambitious people close the gap between intention
                  and action, without sacrificing wellbeing.
                </p>
                <a
                  href={COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
                >
                  {COMPANY_URL.replace(/^https?:\/\//, "")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {ENABLE_WAITLIST_MODE ? <WaitlistSection /> : <CtaSection />}
      </main>
      <LandingFooter />
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
