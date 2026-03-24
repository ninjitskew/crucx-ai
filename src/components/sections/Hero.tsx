"use client";

import { motion } from "framer-motion";
import { SITE, HERO_STATS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import GradientMesh from "@/components/ui/GradientMesh";
import { ArrowRightIcon } from "@/components/ui/Icons";

export default function Hero() {
  const words = SITE.tagline.split(" ");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <GradientMesh />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-default bg-white/5 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Now accepting early access applications
          </motion.div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block ${
                  i === words.length - 1
                    ? "bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent"
                    : "text-text-primary"
                }`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.15,
                  ease: "easeOut",
                }}
              >
                {word}
                {i < words.length - 1 && "\u00A0"}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Your virtual publishing house. From raw ideas to published books on
            Amazon KDP, YouTube, TikTok Shop and more — we handle everything,
            you earn royalties.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Button href="#waitlist" size="lg">
              Join the Waitlist
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              See How It Works
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
