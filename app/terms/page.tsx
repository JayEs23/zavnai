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

export default function TermsPage() {
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
            <span className="text-foreground font-medium">Terms of Service</span>
          </nav>

          <header className="mb-10 pb-8 border-b border-border">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: <time dateTime="2026-03-20">{EFFECTIVE_DATE}</time>
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ZAVN
              website, applications, and related services (collectively, the &quot;Service&quot;)
              operated by{" "}
              <strong className="text-foreground">{COMPANY}</strong> (&quot;{COMPANY_SHORT},&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). {ZAVN_LEGAL.productSummary} The
              Service is offered worldwide to adults—including students, professionals, and
              entrepreneurs—who want structured support for high-performance goals. By creating an
              account, accessing, or using the Service, you agree to these Terms. If you do not
              agree, do not use the Service.
            </p>
            <aside
              className="mt-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-5 text-sm"
              aria-label="Operator details"
            >
              <p className="font-semibold text-foreground mb-1">Operator</p>
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
            <LegalSection title="1. The Service">
              <p>
                {ZAVN_LEGAL.productSummary}
              </p>
              <p className="mt-3">
                Features may roll out gradually, vary by platform (web or app), region, or plan, and
                change over time. The Service is for general information and self-improvement only.
                It does not provide medical, mental health, legal, financial, or other professional
                advice. You are solely responsible for decisions you make and actions you take based
                on your use of the Service.
              </p>
            </LegalSection>

            <LegalSection title="2. Eligibility">
              <p>
                You must be at least the age of digital consent in your jurisdiction (typically 16
                or 18) to use the Service. By using the Service, you represent that you meet this
                requirement and have the legal capacity to enter into these Terms. If you use the
                Service on behalf of an organization, you represent that you have authority to bind
                that organization.
              </p>
            </LegalSection>

            <LegalSection title="3. Accounts & security">
              <p>You may need to register an account. You agree to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-primary">
                <li>Provide accurate, current, and complete information;</li>
                <li>Maintain and update your information as needed;</li>
                <li>Keep your login credentials confidential;</li>
                <li>Notify us promptly of any unauthorized access or security breach.</li>
              </ul>
              <p className="mt-3">
                You are responsible for all activity under your account. We may suspend or terminate
                accounts that violate these Terms or pose a risk to the Service or other users.
              </p>
            </LegalSection>

            <LegalSection title="4. Acceptable use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-primary">
                <li>Violate applicable laws or third-party rights;</li>
                <li>
                  Upload or transmit malware, spam, or content that is unlawful, harassing,
                  defamatory, hateful, or sexually exploitative;
                </li>
                <li>
                  Attempt to probe, scan, or test vulnerabilities, or bypass security or access
                  controls;
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble the Service except where prohibited by
                  law;
                </li>
                <li>
                  Use the Service to build a competing product or to scrape or harvest data at scale
                  without our written consent;
                </li>
                <li>
                  Misrepresent your identity, impersonate others, or use the Service to send
                  unsolicited communications to third parties without proper consent and legal
                  basis.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="5. Your content & license to us">
              <p>
                You retain ownership of content you submit (&quot;User Content&quot;), such as text,
                voice inputs, goals, and contact details you add for accountability features. You
                grant {COMPANY_SHORT} a worldwide, non-exclusive, royalty-free license to host,
                store, reproduce, process, display, and create derivative works (such as transcripts
                or AI outputs) as reasonably necessary to provide, secure, and improve the Service,
                including training and tuning our systems where permitted by our Privacy Policy and
                applicable law.
              </p>
              <p className="mt-3">
                You represent that you have all rights and consents needed to submit User Content and
                to grant this license—especially where User Content includes information about other
                people (e.g. tribe or accountability contacts). You are responsible for obtaining their
                consent where required.
              </p>
            </LegalSection>

            <LegalSection title="6. AI outputs & no reliance">
              <p>
                Features that use artificial intelligence may produce inaccurate, incomplete, or
                inappropriate outputs. AI-generated content is not human-reviewed unless we say
                otherwise. You should not rely on AI outputs as a substitute for professional
                judgment. You use AI features at your own risk.
              </p>
            </LegalSection>

            <LegalSection title="7. Fees & payments (including Paddle)">
              <p>
                {ZAVN_LEGAL.paidPlansSummary} Taxes may apply based on your location and the payment
                method. We will describe the offering at checkout or in-product whenever you pay.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">Paddle (merchant of record).</strong> Where we
                offer paid plans through <strong className="text-foreground">Paddle Checkout</strong>
                , your payment is processed by <strong className="text-foreground">Paddle</strong> as
                the <strong className="text-foreground">reseller and merchant of record</strong> for
                that transaction. That means you enter into a contract with Paddle for the payment
                and Paddle&apos;s services, and Paddle collects payment on your behalf. These Terms
                constitute the <strong className="text-foreground">Supplier Agreement</strong> between
                you and {COMPANY_SHORT} for access to and use of the ZAVN product (the
                &quot;Product&quot;), as that term is used in Paddle&apos;s{" "}
                <a
                  href={PADDLE_LEGAL.buyerTerms}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buyer Terms
                </a>
                . You must also comply with Paddle&apos;s Buyer Terms,{" "}
                <a
                  href={PADDLE_LEGAL.refundPolicy}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Refund Policy
                </a>
                , and{" "}
                <a
                  href={PADDLE_LEGAL.privacy}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                when completing a transaction with Paddle.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">Refunds &amp; cancellations.</strong> Payment
                refunds and statutory withdrawal rights for purchases made through Paddle are
                governed by Paddle&apos;s policies and applicable law. A summary of how we describe
                cancellations and refunds is in our{" "}
                <Link href="/refund" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
                  Refund &amp; cancellation policy
                </Link>
                . For other payment methods we may add in the future, we will present the relevant
                terms at checkout.
              </p>
            </LegalSection>

            <LegalSection title="8. Third-party services">
              <p>
                The Service may integrate with third-party providers (e.g. authentication, calendar,
                messaging, analytics, and payment processors such as Paddle when you purchase through
                them). Your use of those services is subject to their terms and privacy policies. We
                are not responsible for third-party services.
              </p>
            </LegalSection>

            <LegalSection title="9. Intellectual property">
              <p>
                The Service, including software, branding, designs, and documentation, is owned by{" "}
                {COMPANY_SHORT} or its licensors. Except for the limited rights expressly granted in
                these Terms, no rights are transferred to you. &quot;ZAVN&quot; and related marks are
                trademarks of {COMPANY_SHORT} or its affiliates.
              </p>
            </LegalSection>

            <LegalSection title="10. Disclaimers">
              <p className="font-medium text-foreground">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT
                WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE
                DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR
                THAT DEFECTS WILL BE CORRECTED.
              </p>
            </LegalSection>

            <LegalSection title="11. Limitation of liability">
              <p className="font-medium text-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL {COMPANY_SHORT},
                ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR SUPPLIERS BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM YOUR USE OF THE
                SERVICE. OUR AGGREGATE LIABILITY FOR CLAIMS RELATING TO THE SERVICE IS LIMITED TO THE
                GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE (12) MONTHS
                BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS (USD $100), EXCEPT WHERE LIABILITY
                CANNOT BE LIMITED BY LAW.
              </p>
            </LegalSection>

            <LegalSection title="12. Indemnification">
              <p>
                You will defend, indemnify, and hold harmless {COMPANY_SHORT} and its affiliates from
                any claims, damages, losses, and expenses (including reasonable legal fees) arising
                out of your User Content, your use of the Service, your violation of these Terms, or
                your violation of third-party rights.
              </p>
            </LegalSection>

            <LegalSection title="13. Suspension & termination">
              <p>
                We may suspend or terminate access to the Service at any time, with or without
                notice, for conduct that we believe violates these Terms or harms the Service or
                others. You may stop using the Service at any time. Provisions that by their nature
                should survive (including ownership, disclaimers, limitation of liability, and
                indemnity) will survive termination.
              </p>
            </LegalSection>

            <LegalSection title="14. Changes to these Terms">
              <p>
                We may modify these Terms from time to time. We will post the updated Terms on this
                page and update the effective date. If changes are material, we will provide
                reasonable notice (e.g. via the Service or email). Continued use after the effective
                date constitutes acceptance. If you do not agree, you must stop using the Service.
              </p>
            </LegalSection>

            <LegalSection title="15. Governing law & disputes">
              <p>
                These Terms are governed by the laws of{" "}
                <strong className="text-foreground">England and Wales</strong>, without regard to
                conflict-of-law principles that would apply another body of law. Subject to the
                paragraph below, you and {COMPANY_SHORT} agree that the courts of{" "}
                <strong className="text-foreground">England and Wales</strong> will have{" "}
                <strong className="text-foreground">non-exclusive</strong> jurisdiction over disputes
                arising out of or relating to these Terms or the Service.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">Mandatory local rights.</strong> Nothing in
                these Terms limits any rights you have under the{" "}
                <strong className="text-foreground">mandatory laws</strong> of your country or
                region of residence (including, where applicable, consumer protection rules that
                determine jurisdiction or governing law for consumers). If you are a consumer in the{" "}
                <strong className="text-foreground">European Economic Area</strong> or the{" "}
                <strong className="text-foreground">United Kingdom</strong>, you may also bring
                claims in the courts of your country of residence where such rights apply.
              </p>
            </LegalSection>

            <LegalSection title="16. General">
              <p>
                These Terms constitute the entire agreement between you and {COMPANY_SHORT} regarding
                the Service and supersede prior understandings. If any provision is unenforceable,
                the remaining provisions remain in effect. Our failure to enforce a provision is not
                a waiver. You may not assign these Terms without our consent; we may assign them in
                connection with a merger or sale of assets.
              </p>
            </LegalSection>

            <LegalSection title="17. Contact">
              <p>
                For questions about these Terms, contact {COMPANY_SHORT} through{" "}
                <Link href="/contact" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
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
            </LegalSection>

            <p className="text-xs text-muted-foreground pt-6 border-t border-border">
              These Terms are provided for informational purposes and do not constitute legal
              advice. {COMPANY_SHORT} encourages you to consult qualified counsel for advice specific
              to your situation.
            </p>
          </article>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            See also{" "}
            <Link href="/privacy" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Privacy Policy
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

function LegalSection({
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
