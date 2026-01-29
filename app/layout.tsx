import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Using system fonts to avoid build-time network dependencies
// This ensures the build works even if Google Fonts is unavailable

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
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-system-sans)",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
