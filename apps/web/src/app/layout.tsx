import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MindMark - Marketing Site",
  description:
    "Discover MindMark - the AI-enhanced bookmark manager designed for cognitive accessibility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
