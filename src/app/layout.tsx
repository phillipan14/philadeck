import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeckForge — AI Presentation Maker",
  description:
    "Create beautiful presentations with AI. Generate stunning slide decks in seconds from a simple prompt. Export to PPTX or PDF.",
  openGraph: {
    title: "DeckForge — AI Presentation Maker",
    description:
      "Create beautiful presentations with AI. Generate stunning slide decks in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
