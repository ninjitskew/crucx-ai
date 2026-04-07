"use client";

import { motion } from "framer-motion";
import { CREATOR_STEPS, CREATOR_FEATURES, CREATOR_DASHBOARD_STATS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  PencilIcon,
  RocketIcon,
  ChartIcon,
  SparklesIcon,
  GlobeIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

const stepIcons: Record<string, React.FC<{ className?: string }>> = {
  pencil: PencilIcon,
  rocket: RocketIcon,
  chart: ChartIcon,
};

const featureIcons: Record<string, React.FC<{ className?: string }>> = {
  sparkles: SparklesIcon,
  globe: GlobeIcon,
  "chart-bar": ChartBarIcon,
};

const featureGradients = [
  "from-accent-blue to-accent-cyan",
  "from-accent-purple to-accent-pink",
  "from-accent-cyan to-green-400",
];

export default function CreatorPath() {
  return (
    <SectionWrapper id="for-authors">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-blue"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          For Authors & Creators
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Your publishing journey,{" "}
          <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
            simplified
          </span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Share your ideas, and we handle the rest — from ghostwriting to
          multi-marketplace publishing and royalty tracking.
        </motion.p>
      </div>

      {/* 3-Step Flow */}
      <div className="relative mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Connecting line (desktop) */}
        <div className="absolute top-1/2 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent md:block" />

        {CREATOR_STEPS.map((step, i) => {
          const Icon = stepIcons[step.icon];
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <Card className="relative text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-1 text-xs font-bold text-white">
                  Step {step.step}
                </div>
                <div className="mx-auto mt-4 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                  {Icon && <Icon className="h-8 w-8" />}
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Features + Dashboard Preview */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Features */}
        <div className="space-y-6">
          <motion.h3
            className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful tools for authors
          </motion.h3>
          {CREATOR_FEATURES.map((feature, i) => {
            const Icon = featureIcons[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${featureGradients[i]} opacity-80`}
                  >
                    {Icon && <Icon className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-text-primary">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Dashboard Preview */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Spacer to align dashboard top with the first feature card on the left */}
          <h3
            aria-hidden="true"
            className="invisible mb-6 hidden font-[family-name:var(--font-space-grotesk)] text-2xl font-bold lg:block"
          >
            .
          </h3>
          <div className="rounded-2xl border border-border-default bg-bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-text-primary">
                Author Dashboard
              </h4>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                Live Preview
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CREATOR_DASHBOARD_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border-default bg-bg-secondary p-4"
                >
                  <div className="mb-2 text-xs text-text-muted">{stat.label}</div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary">
                      {stat.value}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <TrendingUpIcon className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini publishing status */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border-default bg-bg-secondary px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-text-primary">The Midnight Library</div>
                  <div className="text-xs text-text-muted">Last edited 2h ago</div>
                </div>
                <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
                  Published
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border-default bg-bg-secondary px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-text-primary">Atomic Habits for Creators</div>
                  <div className="text-xs text-text-muted">Last edited 5h ago</div>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-400">
                  In Review
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button href="#waitlist" variant="secondary">
              Start Publishing Today
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
