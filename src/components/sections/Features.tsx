"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Card from "@/components/ui/Card";
import {
  SparklesIcon,
  GlobeIcon,
  ChartBarIcon,
  MegaphoneIcon,
  LightbulbIcon,
  UserIcon,
} from "@/components/ui/Icons";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  sparkles: SparklesIcon,
  globe: GlobeIcon,
  "chart-bar": ChartBarIcon,
  megaphone: MegaphoneIcon,
  lightbulb: LightbulbIcon,
  user: UserIcon,
};

const gradients = [
  "from-accent-blue to-accent-cyan",
  "from-accent-purple to-accent-pink",
  "from-accent-cyan to-green-400",
  "from-accent-pink to-accent-blue",
  "from-yellow-400 to-accent-blue",
  "from-accent-blue to-accent-purple",
];

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-bg-secondary/50">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-purple"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Features
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Everything you need to publish
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          From ghostwriting to marketplace analytics — one platform to manage your
          entire publishing business.
        </motion.p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = iconMap[feature.icon];
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="group h-full">
                {/* Icon */}
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradients[i]} opacity-80`}
                >
                  {Icon && <Icon className="h-6 w-6 text-white" />}
                </div>

                {/* Content */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
