"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthTab = "signin" | "signup";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setErrors({});
    setSuccess(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchTab = (newTab: AuthTab) => {
    setTab(newTab);
    setErrors({});
    setSuccess(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (tab === "signup" && !name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSuccess(true);
  };

  const inputClasses =
    "w-full rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue";
  const errorClasses = "mt-1 text-xs text-red-400";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-border-default bg-bg-card shadow-2xl shadow-accent-blue/5"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary">
                  Welcome to crucx.ai
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {tab === "signin"
                    ? "Sign in to your account"
                    : "Create your free account"}
                </p>
              </div>

              {/* Tabs */}
              <div className="relative mb-6 flex rounded-xl bg-bg-secondary p-1">
                <motion.div
                  className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple"
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{
                    left: tab === "signin" ? "4px" : "50%",
                    width: "calc(50% - 4px)",
                  }}
                />
                <button
                  onClick={() => switchTab("signin")}
                  className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    tab === "signin" ? "text-white" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchTab("signup")}
                  className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    tab === "signup" ? "text-white" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue/20">
                      <CheckIcon className="h-8 w-8 text-accent-blue" />
                    </div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-text-primary">
                      {tab === "signin" ? "Welcome back!" : "Account created!"}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {tab === "signin"
                        ? "You've been signed in successfully."
                        : "Your account is ready. We'll notify you when we launch."}
                    </p>
                    <div className="mt-6">
                      <Button onClick={handleClose} size="sm" variant="secondary">
                        Close
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key={tab}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: tab === "signin" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Name field (sign up only) */}
                    {tab === "signup" && (
                      <div>
                        <label htmlFor="auth-name" className="mb-1.5 block text-sm text-text-secondary">
                          Full Name
                        </label>
                        <input
                          id="auth-name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          className={inputClasses}
                        />
                        {errors.name && <p className={errorClasses}>{errors.name}</p>}
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label htmlFor="auth-email" className="mb-1.5 block text-sm text-text-secondary">
                        Email Address
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={inputClasses}
                      />
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="auth-password" className="mb-1.5 block text-sm text-text-secondary">
                        Password
                      </label>
                      <input
                        id="auth-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        className={inputClasses}
                      />
                      {errors.password && <p className={errorClasses}>{errors.password}</p>}
                    </div>

                    {/* Forgot password link (sign in only) */}
                    {tab === "signin" && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-xs text-accent-blue transition-colors hover:text-accent-purple"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading
                        ? "Please wait..."
                        : tab === "signin"
                          ? "Sign In"
                          : "Create Account"}
                    </Button>

                    {/* Switch prompt */}
                    <p className="text-center text-xs text-text-muted">
                      {tab === "signin" ? (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={() => switchTab("signup")}
                            className="text-accent-blue transition-colors hover:text-accent-purple"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => switchTab("signin")}
                            className="text-accent-blue transition-colors hover:text-accent-purple"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
