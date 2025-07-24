import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AuthProvider, QueryProvider } from "@mindmark/supabase";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindMark - AI-Enhanced Bookmark Manager",
  description:
    "Bookmark manager designed for cognitive accessibility with AI-powered organization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className={GeistSans.className}>
        <NuqsAdapter>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
