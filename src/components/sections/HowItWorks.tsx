"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Card from "@/components/ui/Card";
import { PencilIcon, RocketIcon, ChartIcon } from "@/components/ui/Icons";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  pencil: PencilIcon,
  rocket: RocketIcon,
  chart: ChartIcon,
};

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-blue"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Three steps to your first book
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          We&apos;ve simplified the entire publishing journey. Share your ideas, and
          we handle the rest.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Connecting line (desktop) */}
        <div className="absolute top-1/2 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent md:block" />

        {STEPS.map((step, i) => {
          const Icon = iconMap[step.icon];
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <Card className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-1 text-xs font-bold text-white">
                  Step {step.step}
                </div>

                {/* Icon */}
                <div className="mx-auto mt-4 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                  {Icon && <Icon className="h-8 w-8" />}
                </div>

                {/* Content */}
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
    </SectionWrapper>
  );
}
