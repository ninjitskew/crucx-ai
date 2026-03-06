"use client";

import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95",
  secondary:
    "border border-border-default text-text-primary hover:border-accent-blue hover:bg-accent-blue/10 active:scale-95",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-white/5 active:scale-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
}
