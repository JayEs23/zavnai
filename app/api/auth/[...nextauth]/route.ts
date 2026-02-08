import NextAuth, { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    accessToken?: string;
    id?: string;
    onboardingCompleted?: boolean;
  }
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      onboardingCompleted?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
    onboardingCompleted?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get API URL and ensure no trailing slash
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

          const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = (await res.json()) as {
            access_token: string;
            user_id: string;
            email: string;
            full_name?: string;
            onboarding_completed: boolean;
          };

          return {
            id: data.user_id,
            email: data.email,
            name: data.full_name || undefined,
            accessToken: data.access_token,
            onboardingCompleted: data.onboarding_completed,
          };
        } catch {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google/GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Validate required data
          if (!user.email) {
            console.error("OAuth error: User email is missing");
            return false;
          }

          if (!account.providerAccountId) {
            console.error("OAuth error: Provider account ID is missing");
            return false;
          }

          // Get API URL and ensure no trailing slash
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

          // Send OAuth data to backend
          const providerData = {
            email: user.email,
            provider_id: account.providerAccountId,
            name: user.name || (profile as { name?: string })?.name || null,
            picture: user.image || (profile as { picture?: string })?.picture || null,
          };

          const backendUrl = `${apiUrl}/api/auth/${account.provider}`;
          console.log(`[OAuth] Calling backend: ${backendUrl}`);
          console.log(`[OAuth] Provider data:`, { ...providerData, picture: providerData.picture ? "[URL]" : null });

          const res = await fetch(
            backendUrl,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(providerData),
            }
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`[OAuth] Backend error (${res.status}):`, errorText);
            return false;
          }

          const data = (await res.json()) as {
            access_token: string;
            user_id: string;
            email: string;
            full_name?: string;
            onboarding_completed: boolean;
          };

          console.log(`[OAuth] Success: User ${data.user_id} authenticated`);

          // Store backend token in user object
          user.accessToken = data.access_token;
          user.id = data.user_id;
          // Prefer the name from backend (saved full_name), fallback to OAuth provider name
          if (data.full_name) user.name = data.full_name;
          user.onboardingCompleted = data.onboarding_completed;

          return true;
        } catch (error) {
          console.error("[OAuth] Sign-in error:", error);
          if (error instanceof Error) {
            console.error("[OAuth] Error details:", error.message, error.stack);
          }
          return false;
        }
      }

      // For credentials, user already has accessToken
      return true;
    },
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.onboardingCompleted = user.onboardingCompleted;
        token.id = user.id;
        token.sub = user.id; // Ensure sub matches user.id for backend consistency
      }
      // Handle session update triggers (e.g., after onboarding completes)
      if (trigger === 'update' && updateData) {
        if (typeof updateData.onboardingCompleted === 'boolean') {
          token.onboardingCompleted = updateData.onboardingCompleted;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.accessToken = token.accessToken;
        session.user.id = (token.id || token.sub) as string;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Custom error page
  },
  secret: process.env.JWT_SECRET_KEY || process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug in dev
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


