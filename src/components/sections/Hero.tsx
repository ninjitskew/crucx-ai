"use client";

import { motion } from "framer-motion";
import { HERO_AUTHOR, HERO_MARKETPLACE } from "@/lib/constants";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import GradientMesh from "@/components/ui/GradientMesh";
import { ArrowRightIcon, BookOpenIcon, UploadIcon } from "@/components/ui/Icons";

function HeroPath({
  data,
  side,
  icon,
  accentFrom,
  accentTo,
}: {
  data: typeof HERO_AUTHOR;
  side: "left" | "right";
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
}) {
  const delay = side === "left" ? 0.3 : 0.5;

  return (
    <motion.div
      className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      {/* Badge */}
      <div
        className={`mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-card/50 px-4 py-2 text-sm backdrop-blur-sm`}
      >
        {icon}
        <span className="text-text-secondary">{data.badge}</span>
      </div>

      {/* Headline */}
      <h2
        className={`font-[family-name:var(--font-space-grotesk)] text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl`}
      >
        <span className={`bg-gradient-to-r ${accentFrom} ${accentTo} bg-clip-text text-transparent`}>
          {data.headline}
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
        {data.subheadline}
      </p>

      {/* CTA */}
      <div className="mt-6">
        <Button href={data.ctaHref} size="lg">
          {data.cta}
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 flex w-full flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-8 lg:justify-start">
        {data.stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary sm:text-3xl">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <div className="mt-1 text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <GradientMesh />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main tagline */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-card/50 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Now accepting early access applications
          </div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            One Platform for{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Authors
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
              Readers
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Publish your books with AI-powered tools or discover your next great read.
            Two paths, one platform.
          </p>
        </motion.div>

        {/* 50/50 Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Author Path */}
          <motion.div
            className="rounded-2xl border border-border-default bg-bg-card/30 p-6 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HeroPath
              data={HERO_AUTHOR}
              side="left"
              icon={<UploadIcon className="h-4 w-4 text-accent-blue" />}
              accentFrom="from-accent-blue"
              accentTo="to-accent-cyan"
            />
          </motion.div>

          {/* Right: Marketplace Path */}
          <motion.div
            className="rounded-2xl border border-border-default bg-bg-card/30 p-6 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <HeroPath
              data={HERO_MARKETPLACE}
              side="right"
              icon={<BookOpenIcon className="h-4 w-4 text-accent-purple" />}
              accentFrom="from-accent-purple"
              accentTo="to-accent-pink"
            />
          </motion.div>
        </div>

      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
