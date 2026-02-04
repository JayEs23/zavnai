import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/providers/SessionProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZAVN | Close the Gap Between Intention and Action",
  description:
    "A voice-led behavior alignment system. Harness AI-driven behavioral science through natural conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Remove dark class if present
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  // Clear any stored theme preference
                  localStorage.removeItem('theme');
                  localStorage.setItem('theme', 'light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${manrope.variable} antialiased`}
        style={{
          fontFamily: "var(--font-manrope)",
        }}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="theme"
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
