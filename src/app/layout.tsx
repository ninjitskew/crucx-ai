import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "crucx.ai — Publish. Earn. Repeat.",
  description:
    "Your virtual publishing house. From raw ideas to published books on Amazon KDP, YouTube, TikTok Shop and more. We handle ghostwriting, publishing, and marketplace optimization — you earn royalties.",
  keywords: [
    "self publishing",
    "book publishing",
    "amazon kdp",
    "ghostwriting",
    "royalties",
    "publish a book",
    "content to commerce",
    "crucx",
  ],
  authors: [{ name: "crucx.ai" }],
  openGraph: {
    title: "crucx.ai — Publish. Earn. Repeat.",
    description:
      "Your virtual publishing house. From raw ideas to published books — we handle everything, you earn royalties.",
    url: "https://crucx.ai",
    siteName: "crucx.ai",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "crucx.ai — Publish. Earn. Repeat.",
    description:
      "Your virtual publishing house. From raw ideas to published books — we handle everything, you earn royalties.",
    creator: "@crucxai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
