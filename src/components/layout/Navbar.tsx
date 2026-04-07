"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { MenuIcon, XMarkIcon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AuthModal from "@/components/ui/AuthModal";
import CartDrawer from "@/components/marketplace/CartDrawer";
import { useCart } from "@/lib/stores/cart";
import { useUser } from "@/lib/hooks/useUser";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { getSupabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const { user, signedIn } = useUser();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setUserMenu(false);
    window.location.href = "/";
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-border-default bg-bg-primary/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={36} />
            <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-text-primary">
              crucx<span className="text-accent-blue">.ai</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            {signedIn && (
              <Link href="/reader/library/" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                My Library
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin/" className="rounded-md border border-accent-blue/40 bg-accent-blue/10 px-2.5 py-1 text-sm font-medium text-accent-blue transition-colors hover:bg-accent-blue/20">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/search/" aria-label="Search" className="rounded-lg p-2 text-text-secondary hover:text-text-primary">
              {/* search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </Link>
            <button onClick={openDrawer} aria-label="Cart" className="relative rounded-lg p-2 text-text-secondary hover:text-text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6 4 2H1" /></svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            {signedIn ? (
              <div className="relative">
                <button onClick={() => setUserMenu((v) => !v)} className="rounded-lg border border-border-default px-3 py-1.5 text-sm text-text-primary hover:border-accent-blue">
                  {user?.email?.split("@")[0] ?? "Account"}
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border-default bg-bg-card py-2 shadow-xl">
                    {isAdmin && (
                      <Link href="/admin/" className="block px-4 py-2 text-sm font-medium text-accent-blue hover:bg-bg-secondary">Admin CMS</Link>
                    )}
                    <Link href="/reader/library/" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary">My Library</Link>
                    <Link href="/reader/wishlist/" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary">Wishlist</Link>
                    <Link href="/reader/orders/" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary">Orders</Link>
                    <Link href="/reader/settings/" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary">Settings</Link>
                    <button onClick={signOut} className="block w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-secondary hover:text-accent-pink">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/auth/sign-in/")}>
                  Sign in
                </Button>
                <Button href="/auth/sign-up/" size="sm">Get Started</Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button onClick={openDrawer} aria-label="Cart" className="relative text-text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6 4 2H1" /></svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            <button
              className="text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center gap-6 pt-24">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl text-text-secondary transition-colors hover:text-text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/search/" onClick={() => setMobileOpen(false)} className="text-2xl text-text-secondary">Search</Link>
              {signedIn ? (
                <>
                  <Link href="/reader/library/" onClick={() => setMobileOpen(false)} className="text-2xl text-text-secondary">My Library</Link>
                  {isAdmin && (
                    <Link href="/admin/" onClick={() => setMobileOpen(false)} className="text-2xl font-medium text-accent-blue">Admin CMS</Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); signOut(); }} className="text-2xl text-text-secondary">Sign out</button>
                </>
              ) : (
                <Link href="/auth/sign-in/" onClick={() => setMobileOpen(false)} className="text-2xl text-text-secondary">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
