"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRICING_TIERS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <SectionWrapper id="pricing">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.p
          className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-cyan"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pricing
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Simple, transparent pricing
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Start free, upgrade when you&apos;re ready. No hidden fees.
        </motion.p>

        {/* Toggle */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span
            className={`text-sm ${!yearly ? "text-text-primary" : "text-text-muted"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              yearly ? "bg-accent-blue" : "bg-border-default"
            }`}
            aria-label="Toggle yearly pricing"
          >
            <motion.div
              className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white"
              animate={{ x: yearly ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span
            className={`text-sm ${yearly ? "text-text-primary" : "text-text-muted"}`}
          >
            Yearly{" "}
            <span className="rounded-full bg-accent-blue/20 px-2 py-0.5 text-xs text-accent-blue">
              Save 20%
            </span>
          </span>
        </motion.div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_TIERS.map((tier, i) => {
          const price = yearly ? tier.yearlyPrice : tier.monthlyPrice;
          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                tier.popular
                  ? "border-accent-blue bg-bg-card shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                  : "border-border-default bg-bg-card hover:border-accent-blue/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </div>
              )}

              <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-text-primary">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">{tier.description}</p>

              {/* Price */}
              <div className="mt-6 mb-6">
                {price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary">
                      ${price}
                    </span>
                    <span className="text-sm text-text-muted">
                      /{yearly ? "mo (billed yearly)" : "mo"}
                    </span>
                  </div>
                ) : (
                  <div className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary">
                    Custom
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                href="#waitlist"
                variant={tier.popular ? "primary" : "secondary"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
