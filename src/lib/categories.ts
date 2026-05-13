// Category taxonomy v2 — single source of truth for marketplace navigation.
// Mirrors public.book.primary_category / sub_category / secondary_categories.

export interface CategoryDef {
  name: string;             // display name (and DB value)
  slug: string;             // URL slug
  icon: string;             // emoji shorthand
  tagline: string;          // 1-line description
  subCategories: string[];  // chip filters inside the category page
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: "Fiction & Literature",
    slug: "fiction-and-literature",
    icon: "📚",
    tagline: "Novels, classics & contemporary stories",
    subCategories: ["Literary", "Contemporary", "Historical", "Classics"],
  },
  {
    name: "Mystery & Thriller",
    slug: "mystery-and-thriller",
    icon: "🔍",
    tagline: "Page-turners that keep you guessing",
    subCategories: ["Psychological", "Crime", "Domestic", "Cozy"],
  },
  {
    name: "Romance",
    slug: "romance",
    icon: "💕",
    tagline: "Love stories, contemporary to classic",
    subCategories: ["Contemporary", "Classic"],
  },
  {
    name: "Sci-Fi & Fantasy",
    slug: "sci-fi-and-fantasy",
    icon: "🚀",
    tagline: "Worlds beyond ours",
    subCategories: ["Sci-Fi", "Fantasy", "Dystopian"],
  },
  {
    name: "Self-Mastery & Productivity",
    slug: "self-mastery-and-productivity",
    icon: "🧘",
    tagline: "Habits, mindset & personal growth",
    subCategories: ["Habits", "Productivity", "Spirituality", "Personal Growth"],
  },
  {
    name: "Psychology & Big Ideas",
    slug: "psychology-and-big-ideas",
    icon: "🧠",
    tagline: "Understand how minds and societies work",
    subCategories: ["Behavioral Science", "Sociology", "Brain & Mind"],
  },
  {
    name: "Business & Money",
    slug: "business-and-money",
    icon: "💼",
    tagline: "Building wealth, ventures & strategy",
    subCategories: ["Entrepreneurship", "Personal Finance", "Strategy"],
  },
  {
    name: "Memoir & Biography",
    slug: "memoir-and-biography",
    icon: "📖",
    tagline: "Real lives, told well",
    subCategories: ["Personal Memoir", "Inspirational"],
  },
  {
    name: "Children's Books",
    slug: "childrens-books",
    icon: "🧒",
    tagline: "Stories that spark imagination",
    subCategories: ["Picture Books", "Middle Grade", "Young Reader"],
  },
  {
    name: "Poetry & Shorts",
    slug: "poetry-and-shorts",
    icon: "✍️",
    tagline: "Verse, novellas & quick reads",
    subCategories: ["Poetry", "Novellas & Essays"],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

// Lookup helpers
const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
const byName = new Map(CATEGORIES.map((c) => [c.name, c]));

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return bySlug.get(slug);
}

export function getCategoryByName(name: string): CategoryDef | undefined {
  return byName.get(name);
}

export function slugifyCategory(name: string): string {
  return byName.get(name)?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Sub-category slug → display name. Falls back to the input if not found. */
export function subSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Resolve a sub-category slug back to display name for a given category. */
export function resolveSubName(categorySlug: string, subSlugStr: string): string | null {
  const cat = bySlug.get(categorySlug);
  if (!cat) return null;
  return cat.subCategories.find((s) => subSlug(s) === subSlugStr) ?? null;
}

// Legacy slug map: old marketplace routes that should redirect to new ones.
export const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  "fiction": "fiction-and-literature",
  "self-help": "self-mastery-and-productivity",
  "business": "business-and-money",
  "mystery": "mystery-and-thriller",
  "sci-fi": "sci-fi-and-fantasy",
  "strategy": "business-and-money",
  "poetry": "poetry-and-shorts",
  "non-fiction": "psychology-and-big-ideas",
  "children": "childrens-books",
  "shorts": "poetry-and-shorts",
};
