import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "crucx.ai — Create. Discover. Publish.",
  description:
    "The content-to-commerce platform for authors and readers. Publish your books with AI-powered tools or discover your next favorite read in our marketplace.",
  keywords: [
    "self publishing",
    "book publishing",
    "book marketplace",
    "amazon kdp",
    "ghostwriting",
    "buy books online",
    "ebooks",
    "content to commerce",
    "crucx",
  ],
  authors: [{ name: "crucx.ai" }],
  openGraph: {
    title: "crucx.ai — Create. Discover. Publish.",
    description:
      "The content-to-commerce platform for authors and readers. Publish or discover books on crucx.ai.",
    url: "https://crucx.ai",
    siteName: "crucx.ai",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "crucx.ai — Create. Discover. Publish.",
    description:
      "The content-to-commerce platform for authors and readers. Publish or discover books on crucx.ai.",
    creator: "@crucxai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// FOUC prevention: reads theme from localStorage before paint
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('crucx-theme');
    if (t === 'light') document.documentElement.classList.add('light');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
