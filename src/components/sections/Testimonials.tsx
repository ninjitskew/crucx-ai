"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Card from "@/components/ui/Card";

export default function Testimonials() {
  const authorTestimonials = TESTIMONIALS.filter((t) => t.type === "author");
  const readerTestimonials = TESTIMONIALS.filter((t) => t.type === "reader");

  return (
    <SectionWrapper id="testimonials" className="bg-bg-secondary/50">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-pink"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Testimonials
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Loved by{" "}
          <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
            authors
          </span>{" "}
          &{" "}
          <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
            readers
          </span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Hear from the creators who publish with us and the readers who discover
          their next favorite books.
        </motion.p>
      </div>

      {/* Testimonials grid - alternating author/reader */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...authorTestimonials, ...readerTestimonials]
          .sort((a, b) => {
            // Interleave author and reader testimonials
            const aIdx = a.type === "author" ? authorTestimonials.indexOf(a) * 2 : readerTestimonials.indexOf(a) * 2 + 1;
            const bIdx = b.type === "author" ? authorTestimonials.indexOf(b) * 2 : readerTestimonials.indexOf(b) * 2 + 1;
            return aIdx - bIdx;
          })
          .map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="h-full">
              {/* Type badge */}
              <div className="mb-4">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    t.type === "author"
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "bg-accent-purple/10 text-accent-purple"
                  }`}
                >
                  {t.type === "author" ? "Author" : "Reader"}
                </span>
              </div>

              {/* Quote */}
              <div className="mb-6">
                <svg
                  className="h-8 w-8 text-accent-blue/30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="mt-2 leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-border-default pt-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                    t.type === "author"
                      ? "bg-gradient-to-br from-accent-blue to-accent-cyan"
                      : "bg-gradient-to-br from-accent-purple to-accent-pink"
                  }`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted">
                    {t.role} &middot; {t.metric}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
