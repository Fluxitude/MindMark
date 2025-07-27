import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AuthProvider, QueryProvider } from "@mindmark/supabase";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";
import { MonitoringProvider } from "@/components/monitoring-provider";
import { SearchProvider } from "../providers/search-provider";
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
        <MonitoringProvider>
          <NuqsAdapter>
            <QueryProvider>
              <AuthProvider>
                <SearchProvider>
                  {/* Temporarily disabled TwentyFirstToolbar due to SSR issues */}
                  {/* <TwentyFirstToolbar
                    config={{
                      plugins: [ReactPlugin],
                    }}
                  /> */}
                  {children}
                </SearchProvider>
              </AuthProvider>
            </QueryProvider>
          </NuqsAdapter>
        </MonitoringProvider>
        <Analytics />
      </body>
    </html>
  );
}
