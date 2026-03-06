"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl border border-border-default bg-bg-card p-6 backdrop-blur-sm transition-all duration-300 ${
        hover
          ? "hover:border-accent-blue/50 hover:bg-bg-card-hover hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          : ""
      } ${className}`}
      whileHover={hover ? { y: -4 } : undefined}
    >
      {children}
    </motion.div>
  );
}
