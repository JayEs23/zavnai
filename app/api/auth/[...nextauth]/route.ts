import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
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
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
            onboarding_completed: boolean;
          };

          return {
            id: data.user_id,
            email: data.email,
            accessToken: data.access_token,
            onboardingCompleted: data.onboarding_completed,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session as any).accessToken = token.accessToken;
        (session.user as any).id = token.sub;
        (session.user as any).onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };


