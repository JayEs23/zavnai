import type { ReactNode } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PADDLE_LEGAL } from "@/lib/paddleLegal";
import { ZAVN_LEGAL } from "@/lib/zavnLegal";

const EFFECTIVE_DATE = "April 2, 2026";
const COMPANY = "Vocett Technologies Ltd";
const COMPANY_SHORT = "Vocett";
const COMPANY_URL = "https://vocettt.com.ng";

export default function RefundPage() {
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
            <span className="text-foreground font-medium">Refund &amp; cancellation</span>
          </nav>

          <header className="mb-10 pb-8 border-b border-border">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Refund &amp; cancellation policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: <time dateTime="2026-04-02">{EFFECTIVE_DATE}</time>
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              This policy explains how cancellations and payment-related refunds work when you pay
              for a ZAVN subscription (Pro, Max, or other paid tier names we show at checkout) through{" "}
              <strong className="text-foreground">Paddle</strong> as the merchant of record.{" "}
              {ZAVN_LEGAL.whatYouPayFor} This page supplements our{" "}
              <Link href="/terms" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
                Terms of Service
              </Link>
              . Nothing here limits your <strong className="text-foreground">mandatory statutory
              rights</strong> under the laws that apply to you.
            </p>
            <aside
              className="mt-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-5 text-sm"
              aria-label="Merchant of record"
            >
              <p className="font-semibold text-foreground mb-1">Payments &amp; Paddle</p>
              <p className="text-muted-foreground">
                For purchases completed through Paddle Checkout,{" "}
                <strong className="text-foreground">Paddle</strong> is the seller of record for the
                payment. Your contract for payment and Paddle&apos;s services is governed by
                Paddle&apos;s{" "}
                <a
                  href={PADDLE_LEGAL.buyerTerms}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buyer Terms
                </a>
                ,{" "}
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
                </a>
                . {COMPANY_SHORT} supplies access to ZAVN—Echo, Doyn, Tribe, and related
                features per your plan—under those Terms.
              </p>
            </aside>
          </header>

          <article className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
            <RefundSection title="1. Cancelling a subscription">
              <p>
                You may cancel a recurring ZAVN subscription in accordance with the controls we make
                available in the Service (for example, account or billing settings) and with
                Paddle&apos;s processes described in the{" "}
                <a
                  href={PADDLE_LEGAL.buyerTerms}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paddle Buyer Terms
                </a>
                . Cancellation stops future renewals; it does not always entitle you to a refund for
                the current or prior billing periods unless required by law or expressly stated in
                Paddle&apos;s policies.
              </p>
            </RefundSection>

            <RefundSection title="2. Payment refunds">
              <p>
                Requests relating to <strong className="text-foreground">payment processing,
                charges, invoices, and refunds of money paid</strong> are handled by{" "}
                <strong className="text-foreground">Paddle</strong> under their{" "}
                <a
                  href={PADDLE_LEGAL.refundPolicy}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Refund Policy
                </a>{" "}
                and applicable law. Buyers may use Paddle&apos;s support channels (including{" "}
                <a
                  href="https://paddle.net/"
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  paddle.net
                </a>
                ) as described in Paddle&apos;s documentation.
              </p>
            </RefundSection>

            <RefundSection title="3. Product access after refund">
              <p>
                If a refund of subscription fees is issued for a period you already paid for,
                access to paid features for that period may end when the refund is processed, as
                described in Paddle&apos;s terms.
              </p>
            </RefundSection>

            <RefundSection title="4. Statutory rights">
              <p>
                If you are a consumer, you may have <strong className="text-foreground">withdrawal,
                cooling-off, or other rights</strong> depending on your country (for example in the
                EEA, UK, or elsewhere). Those rights are determined by applicable law and by
                Paddle&apos;s role as reseller; see Paddle&apos;s{" "}
                <a
                  href={PADDLE_LEGAL.refundPolicy}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Refund Policy
                </a>{" "}
                and Buyer Terms for how they apply to digital services and subscriptions.
              </p>
            </RefundSection>

            <RefundSection title="5. Contact">
              <p>
                For questions about <strong className="text-foreground">ZAVN features or your
                account</strong>, contact {COMPANY_SHORT} via{" "}
                <Link href="/contact" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
                  our contact page
                </Link>{" "}
                or{" "}
                <a
                  href={COMPANY_URL}
                  className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COMPANY_URL.replace(/^https?:\/\//, "")}
                </a>
                . For <strong className="text-foreground">payment or refund status</strong> on
                Paddle transactions, use Paddle&apos;s buyer support as linked above.
              </p>
            </RefundSection>

            <p className="text-xs text-muted-foreground pt-6 border-t border-border">
              This page is provided for transparency and is not legal advice. Have qualified counsel
              review your Paddle setup and policies before going live.
            </p>
          </article>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            See also{" "}
            <Link href="/terms" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Terms of Service
            </Link>
            {" · "}
            <Link href="/privacy" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

function RefundSection({
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
