"use client";

import { useRef } from "react";
import BookCard from "./BookCard";
import type { Book, Author } from "@/lib/types";

interface Props {
  title: string;
  subtitle?: string;
  books: Book[];
  authors?: Author[];
}

export default function BookCarousel({ title, subtitle, books, authors }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  function scroll(dir: number) {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }
  if (!books.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="rounded-full border border-border-default px-3 py-1 text-text-secondary hover:border-accent-blue hover:text-accent-blue">‹</button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="rounded-full border border-border-default px-3 py-1 text-text-secondary hover:border-accent-blue hover:text-accent-blue">›</button>
        </div>
      </div>
      <div ref={scroller} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {books.map((b) => {
          const a = authors?.find((x) => x.slug === b.authorSlug);
          return (
            <div key={b.slug} className="w-[220px] flex-shrink-0 snap-start">
              <BookCard book={b} authorName={a?.name} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
