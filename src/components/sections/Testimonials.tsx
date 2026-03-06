"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Card from "@/components/ui/Card";

export default function Testimonials() {
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
          Authors love crucx.ai
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Hear from authors who turned their ideas into published books and real
          income.
        </motion.p>
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Card className="h-full">
              {/* Quote */}
              <div className="mb-6">
                <svg
                  className="h-8 w-8 text-accent-blue/30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="mt-2 text-text-secondary leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-border-default pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted">
                    {t.role} &middot; {t.books} books published
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
