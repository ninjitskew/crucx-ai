"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MARKETPLACE_CATEGORIES, MARKETPLACE_BOOKS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { SearchIcon, StarIcon, StarOutlineIcon, ArrowRightIcon, TagIcon } from "@/components/ui/Icons";

const coverGradients: Record<string, string> = {
  "gradient-1": "from-blue-600 to-indigo-800",
  "gradient-2": "from-emerald-500 to-teal-700",
  "gradient-3": "from-purple-600 to-violet-800",
  "gradient-4": "from-amber-500 to-orange-700",
  "gradient-5": "from-pink-500 to-rose-700",
  "gradient-6": "from-cyan-500 to-blue-700",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.floor(rating) ? (
            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <StarOutlineIcon className="h-3.5 w-3.5 text-amber-400/40" />
          )}
        </span>
      ))}
      <span className="ml-1 text-xs text-text-muted">{rating}</span>
    </div>
  );
}

function BookCard({
  book,
}: {
  book: (typeof MARKETPLACE_BOOKS)[number];
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl border border-border-default bg-bg-card p-4 transition-all duration-300 hover:border-accent-purple/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
    >
      {/* Cover */}
      <div
        className={`relative mb-4 flex h-48 items-end rounded-xl bg-gradient-to-br ${coverGradients[book.cover]} p-4`}
      >
        {book.bestseller && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
            Bestseller
          </span>
        )}
        {book.originalPrice && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            Sale
          </span>
        )}
        <div className="text-sm font-bold text-white/90 drop-shadow-lg">{book.title}</div>
      </div>

      {/* Info */}
      <div>
        <h4 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-text-primary line-clamp-1">
          {book.title}
        </h4>
        <p className="mt-0.5 text-xs text-text-muted">by {book.author}</p>

        <div className="mt-2">
          <StarRating rating={book.rating} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {book.price === 0 ? (
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-green-400">
                Free
              </span>
            ) : (
              <>
                <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-text-primary">
                  ${book.price}
                </span>
                {book.originalPrice && (
                  <span className="text-xs text-text-muted line-through">
                    ${book.originalPrice}
                  </span>
                )}
              </>
            )}
          </div>
          <span className="rounded-full bg-bg-secondary px-2.5 py-1 text-[10px] text-text-muted">
            {book.genre}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketplacePath() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = MARKETPLACE_BOOKS.filter((book) => {
    const matchesCategory =
      activeCategory === "All" || book.genre === activeCategory;
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SectionWrapper id="marketplace" className="bg-bg-secondary/50">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-purple"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Marketplace
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Discover your next{" "}
          <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
            great read
          </span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Browse curated books across genres. From bestsellers to hidden gems — find
          stories that move you.
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div
        className="mx-auto mb-8 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-default bg-bg-card py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
          />
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        className="mb-10 flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/20"
                : "border border-border-default bg-bg-card text-text-secondary hover:border-accent-purple/40 hover:text-text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Bestsellers Banner */}
      <motion.div
        className="mb-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <TagIcon className="h-5 w-5 text-amber-400" />
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-text-primary">
          {activeCategory === "All" ? "Trending Books" : activeCategory}
        </h3>
        <span className="ml-2 text-sm text-text-muted">
          ({filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"})
        </span>
      </motion.div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredBooks.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </AnimatePresence>
      </div>

      {filteredBooks.length === 0 && (
        <div className="py-12 text-center text-text-muted">
          No books found. Try a different search or category.
        </div>
      )}

      {/* Browse All CTA */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Button href="#waitlist" variant="secondary" size="lg">
          Browse All Books
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </SectionWrapper>
  );
}
