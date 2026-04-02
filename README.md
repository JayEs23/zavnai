This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## ZAVN (this repo)

- **Auth**: `/login`, `/signup` — password fields use `components/forms/PasswordField` (show/hide). Sign-up errors map FastAPI `detail` and distinguish network failures. Set **`NEXTAUTH_URL`** to the exact origin you use in the browser (e.g. `http://localhost:3000`); avoid mixing **`localhost` vs `127.0.0.1`** or cookies/session fetches can fail. `lib/next-auth-session.ts` dedupes concurrent `getSession()` calls so parallel API requests don’t hammer `/api/auth/session`.  
- **Onboarding**: `/onboarding` — Echo **voice vs text** entry (`EchoEntryChoice`); text uses `/api/echo/chat` with `mode=onboarding`. Draft resume skips the picker. After extraction, **`GoalReviewStep`** confirms/edits the draft goal (optional Doyn refine) before preferences and tribe. In **Gemini Live** voice mode, **Mute / Unmute** stops sending mic audio and disables the capture track but **does not** end the session or tear down the Live connection.  
- **Goals + Thrive**: `/goals` calls **`GET /api/thrive/can-create-goal`**; when Thrive disallows new goals, creation is blocked with an inline banner and link to **`/thrive`**.  
- **Forgot password**: `/forgot-password` placeholder until the API supports reset.  
- **Marketing**: `/about` — full landing-style page (`components/landing/AboutPageContent.tsx`: hero, belief strip, pillars, Vocett, shared `CtaSection`); footer “About” links here, not `/blog`.  
- **Legal**: `/terms`, `/privacy`, `/refund` — Operator **Vocett Technologies Ltd**; product copy is centralized in `lib/zavnLegal.ts` (Echo, Doyn, Tribe, Thrive, tiers). Paddle links in `lib/paddleLegal.ts`. Have counsel review before production.  
- Specs: `docs/zavndocs/`, narrative flows: `docs/zavnexample/`.

