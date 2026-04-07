export const SITE = {
  name: "crucx.ai",
  tagline: "Create. Discover. Publish.",
  description:
    "The content-to-commerce platform for authors and readers. Publish your books with AI-powered tools or discover your next favorite read in our marketplace.",
  url: "https://crucx.ai",
};

export const NAV_LINKS = [
  { label: "Marketplace", href: "/books/" },
  { label: "Authors", href: "/authors/" },
  { label: "Pricing", href: "/pricing/" },
];

// ===== HERO SECTION (50/50 Split) =====

export interface HeroStat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export const HERO_AUTHOR = {
  badge: "For Authors & Creators",
  headline: "Publish Your Book",
  subheadline:
    "From raw ideas to published books. AI-powered ghostwriting, formatting, and multi-marketplace publishing — you earn royalties.",
  cta: "Start Publishing",
  ctaHref: "#for-authors",
  stats: [
    { label: "Authors", value: 500, suffix: "+" },
    { label: "Books Published", value: 1200, suffix: "+" },
    { label: "Worth Books Sold", value: 5, prefix: "INR ", suffix: " Mn" },
  ] as HeroStat[],
};

export const HERO_MARKETPLACE = {
  badge: "For Readers & Buyers",
  headline: "Discover Great Reads",
  subheadline:
    "Explore curated books across genres. From bestsellers to hidden gems — find your next favorite read at the best prices.",
  cta: "Browse Marketplace",
  ctaHref: "/books/page/1/",
  stats: [
    { label: "Books Available", value: 5000, suffix: "+" },
    { label: "Categories", value: 30, suffix: "+" },
  ] as HeroStat[],
};

export const HERO_STATS = [
  { label: "Authors Onboarded", value: 500, suffix: "+" },
  { label: "Books Published", value: 1200, suffix: "+" },
  { label: "Countries Reached", value: 30, suffix: "+" },
  { label: "Turnover", value: 5, prefix: "INR ", suffix: " Mn" },
];

// ===== CREATOR PATH =====

export const CREATOR_STEPS = [
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

export const CREATOR_FEATURES = [
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
];

export const CREATOR_DASHBOARD_STATS = [
  { label: "Total Earnings", value: "$12,450", trend: "+24%", icon: "chart" },
  { label: "Books Published", value: "8", trend: "+2", icon: "book" },
  { label: "Monthly Readers", value: "3.2K", trend: "+18%", icon: "user" },
  { label: "Avg. Rating", value: "4.7", trend: "+0.3", icon: "star" },
];

// ===== MARKETPLACE PATH =====

export const MARKETPLACE_CATEGORIES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Self-Help",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Business",
  "Children's",
  "Poetry",
];

export const MARKETPLACE_BOOKS = [
  {
    title: "The Midnight Library",
    author: "Sarah Mitchell",
    genre: "Fiction",
    price: 12.99,
    originalPrice: 16.99,
    rating: 4.8,
    reviews: 342,
    cover: "gradient-1",
    bestseller: true,
  },
  {
    title: "Atomic Habits for Creators",
    author: "James Okoro",
    genre: "Self-Help",
    price: 9.99,
    rating: 4.9,
    reviews: 891,
    cover: "gradient-2",
    bestseller: true,
  },
  {
    title: "The Dragon's Promise",
    author: "Priya Sharma",
    genre: "Fiction",
    price: 14.99,
    rating: 4.6,
    reviews: 156,
    cover: "gradient-3",
    bestseller: false,
  },
  {
    title: "Digital Nomad Finance",
    author: "Alex Chen",
    genre: "Business",
    price: 11.99,
    originalPrice: 19.99,
    rating: 4.5,
    reviews: 234,
    cover: "gradient-4",
    bestseller: false,
  },
  {
    title: "Whispers in the Rain",
    author: "Maya Rodriguez",
    genre: "Romance",
    price: 8.99,
    rating: 4.7,
    reviews: 567,
    cover: "gradient-5",
    bestseller: true,
  },
  {
    title: "The AI Playbook",
    author: "David Park",
    genre: "Business",
    price: 0,
    rating: 4.4,
    reviews: 128,
    cover: "gradient-6",
    bestseller: false,
  },
];

// ===== PRICING =====

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

// ===== TESTIMONIALS (dual-path) =====

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Romance Author",
    quote:
      "crucx.ai turned my scattered notes into a bestselling romance novel. The ghostwriting team understood my voice perfectly.",
    avatar: "SM",
    type: "author" as const,
    metric: "3 books published",
  },
  {
    name: "Rohit Menon",
    role: "Avid Reader",
    quote:
      "I discovered my favorite self-help book on crucx.ai that I couldn't find anywhere else. The recommendations are spot-on.",
    avatar: "RM",
    type: "reader" as const,
    metric: "47 books purchased",
  },
  {
    name: "James Okoro",
    role: "Self-Help Writer",
    quote:
      "I went from zero to 5 published books in 4 months. The royalty dashboard makes it easy to track everything.",
    avatar: "JO",
    type: "author" as const,
    metric: "5 books published",
  },
  {
    name: "Ananya Desai",
    role: "Book Club Organizer",
    quote:
      "Our book club finds all our monthly picks on crucx.ai. The genre filters and ratings make choosing so easy.",
    avatar: "AD",
    type: "reader" as const,
    metric: "12 books monthly",
  },
  {
    name: "Priya Sharma",
    role: "Children's Book Author",
    quote:
      "Publishing on multiple marketplaces used to be a nightmare. crucx.ai handles it all — I just focus on creating stories.",
    avatar: "PS",
    type: "author" as const,
    metric: "8 books published",
  },
  {
    name: "Kevin Tran",
    role: "Student",
    quote:
      "The free books section is incredible. Found textbook alternatives and indie authors I never would have discovered otherwise.",
    avatar: "KT",
    type: "reader" as const,
    metric: "30+ free books",
  },
];

// ===== WAITLIST =====

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

// ===== FOOTER =====

export const FOOTER_LINKS = {
  product: [
    { label: "For Authors", href: "#for-authors" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQ", href: "#" },
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
