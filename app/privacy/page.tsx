import type { ReactNode } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PADDLE_LEGAL } from "@/lib/paddleLegal";
import { ZAVN_LEGAL } from "@/lib/zavnLegal";

const EFFECTIVE_DATE = "March 20, 2026";
const COMPANY = "Vocett Technologies Ltd";
const COMPANY_SHORT = "Vocett";
const COMPANY_URL = "https://vocettt.com.ng";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      <LandingNavbar />
      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>

          <header className="mb-10 pb-8 border-b border-border">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: <time dateTime="2026-03-20">{EFFECTIVE_DATE}</time>
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              This Privacy Policy describes how <strong className="text-foreground">{COMPANY}</strong>{" "}
              (&quot;{COMPANY_SHORT},&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              collects, uses, discloses, and protects information when you use the ZAVN platform
              (the &quot;Service&quot;). {ZAVN_LEGAL.productSummary} We offer the Service
              internationally; our audience includes high-performing individuals—such as students,
              professionals, and entrepreneurs—wherever they are located. By using the Service, you
              agree to this Policy.
              If you do not agree, please do not use the Service.
            </p>
            <aside
              className="mt-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-5 text-sm"
              aria-label="Data controller"
            >
              <p className="font-semibold text-foreground mb-1">Data controller</p>
              <p className="text-muted-foreground">
                {COMPANY} —{" "}
                <a
                  href={COMPANY_URL}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COMPANY_URL.replace(/^https?:\/\//, "")}
                </a>
              </p>
            </aside>
          </header>

          <article className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
            <PrivacySection title="1. Scope">
              <p>
                This Policy applies to personal information processed through our websites, mobile or
                web applications, and related features—including onboarding, goals and stakes, Echo
                sessions, Doyn voice or chat where enabled, Tribe contacts and vetting flows, Thrive
                or wellbeing-related inputs we process, billing when you subscribe, and integrations
                you connect—regardless of where you live or access the Service. It does not apply to
                third-party sites or services that we do not control (except as described for payment
                processors such as Paddle).
              </p>
            </PrivacySection>

            <PrivacySection title="2. Information we collect">
              <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                2.1 You provide directly
              </h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                <li>
                  <strong className="text-foreground">Account data:</strong> name, email, password
                  or authentication tokens (passwords are stored using secure hashing where
                  applicable), profile details, and preferences.
                </li>
                <li>
                  <strong className="text-foreground">Goals & commitments:</strong> objectives,
                  deadlines, notes, stakes, and related content you enter.
                </li>
                <li>
                  <strong className="text-foreground">Onboarding & coaching content:</strong> text
                  you type, voice or audio you submit where enabled, transcripts, and inferred
                  insights used to personalize the Service.
                </li>
                <li>
                  <strong className="text-foreground">Tribe & accountability contacts:</strong> names
                  and contact details (e.g. email or phone) you add so we can send invitations or
                  notifications on your behalf—you must have a lawful basis to provide this
                  information.
                </li>
                <li>
                  <strong className="text-foreground">Support & communications:</strong> messages
                  you send us via forms, email, or in-product channels.
                </li>
                <li>
                  <strong className="text-foreground">Billing references:</strong> when you subscribe
                  through our payment provider, we may receive limited identifiers (such as
                  subscription or customer references) from the processor to tie your payment to your
                  account. <strong className="text-foreground">Card and payment details</strong> for
                  purchases via <strong className="text-foreground">Paddle</strong> are collected
                  and processed by Paddle as described in their{" "}
                  <a
                    href={PADDLE_LEGAL.privacy}
                    className="text-primary underline underline-offset-2 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                  </a>
                  .
                </li>
              </ul>
              <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                2.2 Collected automatically
              </h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                <li>
                  <strong className="text-foreground">Usage & device data:</strong> IP address,
                  approximate location, browser or device type, operating system, pages or screens
                  viewed, timestamps, and diagnostic logs.
                </li>
                <li>
                  <strong className="text-foreground">Cookies & similar technologies:</strong> to
                  keep you signed in, remember preferences, measure performance, and prevent abuse.
                </li>
              </ul>
              <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                2.3 From third parties
              </h3>
              <p>
                If you sign in with a provider (e.g. Google or GitHub) or connect integrations, we
                receive information allowed by that provider&apos;s consent screen, such as email,
                name, and identifiers. We use it as described in this Policy.
              </p>
            </PrivacySection>

            <PrivacySection title="3. How we use information">
              <p>We use information to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-primary">
                <li>Provide, operate, and maintain the Service;</li>
                <li>Authenticate users and secure accounts;</li>
                <li>Personalize goals, reminders, AI-assisted features, and accountability flows;</li>
                <li>Send transactional messages, security alerts, and (where permitted) product updates;</li>
                <li>Analyze usage in aggregated or de-identified form to improve reliability and features;</li>
                <li>Comply with law, enforce our terms, and protect rights, safety, and security;</li>
                <li>Develop and improve models and systems, consistent with your settings and applicable law.</li>
              </ul>
              <p className="mt-3">
                We do <strong className="text-foreground">not</strong> sell your personal information
                as a commodity. We may share data with service providers and as described below.
              </p>
            </PrivacySection>

            <PrivacySection title="4. Legal bases (EEA, UK, and similar regions)">
              <p>
                Where the GDPR or UK GDPR applies, we rely on one or more of:{" "}
                <strong className="text-foreground">contract</strong> (to deliver the Service),{" "}
                <strong className="text-foreground">legitimate interests</strong> (security,
                analytics, product improvement—balanced against your rights),{" "}
                <strong className="text-foreground">consent</strong> (where required, e.g. certain
                cookies or marketing), and <strong className="text-foreground">legal obligation</strong>.
              </p>
            </PrivacySection>

            <PrivacySection title="5. How we share information">
              <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                <li>
                  <strong className="text-foreground">Service providers:</strong> hosting, databases,
                  email, analytics, AI inference, customer support, and security vendors who process
                  data on our instructions.
                </li>
                <li>
                  <strong className="text-foreground">Accountability contacts:</strong> limited
                  information needed to invite or notify people you designate.
                </li>
                <li>
                  <strong className="text-foreground">Legal & safety:</strong> when required by law,
                  legal process, or to protect {COMPANY_SHORT}, users, or the public.
                </li>
                <li>
                  <strong className="text-foreground">Business transfers:</strong> in connection with
                  a merger, acquisition, or sale of assets, subject to appropriate safeguards.
                </li>
                <li>
                  <strong className="text-foreground">Paddle (payments):</strong> when you pay
                  through <strong className="text-foreground">Paddle Checkout</strong>,{" "}
                  <strong className="text-foreground">Paddle.com Market Limited</strong> (or another
                  Paddle entity, depending on your region) acts as{" "}
                  <strong className="text-foreground">merchant of record</strong> and processes
                  payment and billing data under its own terms. See Paddle&apos;s{" "}
                  <a
                    href={PADDLE_LEGAL.privacy}
                    className="text-primary underline underline-offset-2 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href={PADDLE_LEGAL.buyerTerms}
                    className="text-primary underline underline-offset-2 hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buyer Terms
                  </a>
                  . We receive the information needed to provision your subscription (for example
                  subscription status and identifiers), not your full card number.
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="6. Retention">
              <p>
                We retain information for as long as your account is active and as needed to provide
                the Service, comply with legal obligations, resolve disputes, and enforce our
                agreements. When data is no longer needed, we delete or anonymize it in line with our
                internal schedules and applicable law.
              </p>
            </PrivacySection>

            <PrivacySection title="7. Security">
              <p>
                We implement technical and organizational measures designed to protect personal
                information (e.g. access controls, encryption in transit where appropriate, secure
                development practices). No method of transmission or storage is 100% secure; we
                cannot guarantee absolute security.
              </p>
            </PrivacySection>

            <PrivacySection title="8. International transfers">
              <p>
                We and our service providers may process and store information in{" "}
                <strong className="text-foreground">any country</strong> where we or they operate,
                including countries outside your own. Those countries may have data protection laws
                that differ from those where you live.
              </p>
              <p className="mt-3">
                If we transfer personal data from the <strong className="text-foreground">EEA</strong>,{" "}
                <strong className="text-foreground">UK</strong>, or{" "}
                <strong className="text-foreground">Switzerland</strong> to countries not deemed to
                provide an adequate level of protection, we use appropriate safeguards such as the
                EU Commission Standard Contractual Clauses (and the UK International Data Transfer
                Addendum or UK IDTA where relevant), or other lawful transfer mechanisms approved
                under applicable law.
              </p>
            </PrivacySection>

            <PrivacySection title="9. Your rights & choices">
              <p>
                Depending on where you live, you may have rights to{" "}
                <strong className="text-foreground">access</strong>,{" "}
                <strong className="text-foreground">correct</strong>, or{" "}
                <strong className="text-foreground">delete</strong> personal information;{" "}
                <strong className="text-foreground">export</strong> (portability) certain data;{" "}
                <strong className="text-foreground">object to</strong> or{" "}
                <strong className="text-foreground">restrict</strong> certain processing;{" "}
                <strong className="text-foreground">withdraw consent</strong> where processing is
                consent-based; <strong className="text-foreground">opt out</strong> of certain uses
                (e.g. targeted advertising where required by U.S. state law); and{" "}
                <strong className="text-foreground">lodge a complaint</strong> with a data
                protection authority (for example in the EEA or UK).
              </p>
              <p className="mt-3">
                <strong className="text-foreground">EEA/UK.</strong> You may contact your local
                supervisory authority; a list of EEA authorities is available from the European Data
                Protection Board. In the UK, the ICO is{" "}
                <a
                  href="https://ico.org.uk"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ico.org.uk
                </a>
                .
              </p>
              <p className="mt-3">
                <strong className="text-foreground">How to exercise rights.</strong> You can update
                some information in your account settings. For other requests, contact us using the
                details in Section 14. We may need to verify your identity and may decline requests
                where permitted by law (e.g. excessive or unfounded requests).
              </p>
            </PrivacySection>

            <PrivacySection title="10. Cookies & similar technologies">
              <p>
                We use cookies and similar technologies for essential operation (e.g. sessions),
                preferences, analytics, and fraud prevention. You can control cookies through your
                browser settings; disabling some cookies may limit functionality.
              </p>
            </PrivacySection>

            <PrivacySection title="11. Children">
              <p>
                The Service is not directed at children under the age where parental consent is
                required in their jurisdiction. We do not knowingly collect personal information
                from children. If you believe we have, contact us and we will take appropriate steps.
              </p>
            </PrivacySection>

            <PrivacySection title="12. Third-party links">
              <p>
                The Service may link to third-party websites or services. Their privacy practices
                are governed by their own policies; we encourage you to read them.
              </p>
            </PrivacySection>

            <PrivacySection title="13. Changes to this Policy">
              <p>
                We may update this Policy from time to time. We will post the revised version on this
                page and update the effective date. For material changes, we will provide additional
                notice as appropriate (e.g. in-app or email). Continued use after the effective date
                constitutes acceptance where permitted by law.
              </p>
            </PrivacySection>

            <PrivacySection title="14. Contact us">
              <p>
                For privacy requests or questions, contact {COMPANY_SHORT} through{" "}
                <Link
                  href="/contact"
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                >
                  our contact page
                </Link>
                , or visit{" "}
                <a
                  href={COMPANY_URL}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COMPANY_URL.replace(/^https?:\/\//, "")}
                </a>
                .
              </p>
            </PrivacySection>

            <p className="text-xs text-muted-foreground pt-6 border-t border-border">
              This Policy summarizes our practices in plain language and is not legal advice. For
              regulatory specifics in your country, consult applicable law or qualified counsel.
            </p>
          </article>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            See also{" "}
            <Link href="/terms" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Terms of Service
            </Link>
            {" · "}
            <Link href="/refund" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Refund &amp; cancellation
            </Link>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={slug(title)}>
      <h2 id={slug(title)} className="text-lg font-semibold text-foreground mb-3 scroll-mt-28">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function slug(title: string) {
  return title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}
