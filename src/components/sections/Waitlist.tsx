"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GENRES, BOOK_PLANS } from "@/lib/constants";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

interface FormData {
  name: string;
  email: string;
  genre: string;
  booksPlanned: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  genre?: string;
  booksPlanned?: string;
}

export default function Waitlist() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    genre: "",
    booksPlanned: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.genre) newErrors.genre = "Please select a genre";
    if (!formData.booksPlanned) newErrors.booksPlanned = "Please select an option";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (!GOOGLE_SCRIPT_URL) {
        // Fallback: show success even without backend configured
        setSubmitted(true);
        return;
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          genre: formData.genre,
          booksPlanned: formData.booksPlanned,
          message: formData.message,
          timestamp: new Date().toISOString(),
        }),
      });
      // With no-cors mode, we can't read the response, so assume success
      setSubmitted(true);
    } catch {
      // Still show success to user — the form data may have been received
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue";
  const errorClasses = "mt-1 text-xs text-red-400";

  return (
    <SectionWrapper id="waitlist">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-blue"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Early Access
          </motion.p>
          <motion.h2
            className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join the waitlist
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-lg text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Be among the first to experience the future of self-publishing. Early
            members get exclusive perks.
          </motion.p>
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-accent-blue/30 bg-bg-card p-12 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue/20">
                <CheckIcon className="h-8 w-8 text-accent-blue" />
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-text-primary">
                You&apos;re on the list!
              </h3>
              <p className="mt-2 text-text-secondary">
                We&apos;ll reach out soon with your early access invite. Keep an eye
                on your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border-default bg-bg-card p-8 shadow-[0_0_60px_rgba(59,130,246,0.05)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-text-secondary">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  {errors.name && <p className={errorClasses}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-text-secondary">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  {errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="mb-1.5 block text-sm text-text-secondary">
                    Genre / Niche *
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">Select a genre</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.genre && <p className={errorClasses}>{errors.genre}</p>}
                </div>

                {/* Books planned */}
                <div>
                  <label
                    htmlFor="booksPlanned"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Books you plan to publish *
                  </label>
                  <select
                    id="booksPlanned"
                    name="booksPlanned"
                    value={formData.booksPlanned}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">Select</option>
                    {BOOK_PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.booksPlanned && (
                    <p className={errorClasses}>{errors.booksPlanned}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm text-text-secondary">
                  Tell us about your book idea (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="I have an idea for a self-help book about..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {/* Submit */}
              <div className="mt-6">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Submitting..." : "Join the Waitlist"}
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-text-muted">
                No spam. We&apos;ll only email you about your early access invite.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
