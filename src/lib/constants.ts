export const SITE = {
  name: "crucx.ai",
  tagline: "Publish. Earn. Repeat.",
  description:
    "Your virtual publishing house. From raw ideas to published books on Amazon KDP, YouTube, TikTok Shop and more. We handle ghostwriting, publishing, and marketplace optimization — you earn royalties.",
  url: "https://crucx.ai",
};

export const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export const HERO_STATS = [
  { label: "Authors Onboarded", value: 500, suffix: "+" },
  { label: "Books Published", value: 1200, suffix: "+" },
  { label: "Countries Reached", value: 30, suffix: "+" },
  { label: "Turnover", value: 5, prefix: "INR ", suffix: " Mn" },
];

export const STEPS = [
  {
    step: "01",
    title: "Write",
    description:
      "Share your raw ideas, outlines, or drafts. Our AI-assisted ghostwriting team transforms your thoughts into polished manuscripts.",
    icon: "pencil",
  },
  {
    step: "02",
    title: "Publish",
    description:
      "We handle formatting, cover design, and publishing across Amazon KDP, YouTube, TikTok Shop, and more — all under your pen name.",
    icon: "rocket",
  },
  {
    step: "03",
    title: "Earn",
    description:
      "Track your royalties in real-time. Get optimization tips, social promotion, and watch your passive income grow.",
    icon: "chart",
  },
];

export const FEATURES = [
  {
    title: "AI-Powered Ghostwriting",
    description:
      "Transform rough ideas into publish-ready manuscripts with our AI + human editorial pipeline.",
    icon: "sparkles",
  },
  {
    title: "Multi-Marketplace Publishing",
    description:
      "One click to publish across Amazon KDP, YouTube, TikTok Shop, and emerging platforms.",
    icon: "globe",
  },
  {
    title: "Royalty Dashboard",
    description:
      "Real-time earnings tracking, marketplace analytics, and performance insights in one view.",
    icon: "chart-bar",
  },
  {
    title: "Social Promotion Engine",
    description:
      "Leverage our social channels and tools to boost your book's visibility and sales.",
    icon: "megaphone",
  },
  {
    title: "Smart Optimization",
    description:
      "AI-driven tips to improve your marketplace ranking, pricing strategy, and cover appeal.",
    icon: "lightbulb",
  },
  {
    title: "Personal Author Hub",
    description:
      "Your own virtual setup to manage all publications, pen names, and marketplace presence.",
    icon: "user",
  },
];

export interface PricingTier {
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Explore the platform and start your first draft.",
    features: [
      "1 draft project",
      "Basic dashboard",
      "Community access",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: "Perfect for first-time authors ready to publish.",
    features: [
      "1 book / month",
      "Basic editing & formatting",
      "Amazon KDP publishing",
      "Royalty tracking",
      "20% royalty share",
      "Email support",
    ],
    cta: "Start Publishing",
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "For serious authors building a publishing business.",
    features: [
      "3 books / month",
      "AI ghostwriting assist",
      "Multi-marketplace publishing",
      "Advanced analytics",
      "Social promotion tools",
      "15% royalty share",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "White-label publishing for agencies and teams.",
    features: [
      "Unlimited books",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "Team management",
      "10% royalty share",
      "24/7 support",
    ],
    cta: "Contact Us",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Romance Author",
    quote:
      "crucx.ai turned my scattered notes into a bestselling romance novel. The ghostwriting team understood my voice perfectly.",
    avatar: "SM",
    books: 3,
  },
  {
    name: "James Okoro",
    role: "Self-Help Writer",
    quote:
      "I went from zero to 5 published books in 4 months. The royalty dashboard makes it easy to track everything.",
    avatar: "JO",
    books: 5,
  },
  {
    name: "Priya Sharma",
    role: "Children's Book Author",
    quote:
      "Publishing on multiple marketplaces used to be a nightmare. crucx.ai handles it all — I just focus on creating stories.",
    avatar: "PS",
    books: 8,
  },
];

export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Self-Help",
  "Romance",
  "Mystery / Thriller",
  "Science Fiction",
  "Children's Books",
  "Business / Finance",
  "Health & Wellness",
  "Poetry",
  "Other",
];

export const BOOK_PLANS = [
  "1 book",
  "2-3 books",
  "4-6 books",
  "7-12 books",
  "12+ books",
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "https://x.com/crucxai", icon: "twitter" },
  { label: "LinkedIn", href: "https://linkedin.com/company/crucxai", icon: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/crucxai", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com/@crucxai", icon: "youtube" },
];
