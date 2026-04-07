"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdmin } from "@/lib/hooks/useAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin, configured } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (loading || !configured) return;
    if (!user) {
      router.replace("/auth/sign-in/?next=/admin/");
      return;
    }
    if (!isAdmin) {
      router.replace("/auth/sign-in/?next=/admin/");
    }
  }, [loading, user, isAdmin, configured, router]);

  return (
    <>
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!configured ? (
            <div className="rounded-2xl border border-border-default bg-bg-card p-10 text-center">
              <h1 className="text-2xl font-bold text-text-primary">Configure Supabase to use the CMS</h1>
              <p className="mt-3 text-text-secondary">
                Set <code className="text-accent-cyan">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-accent-cyan">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then reload.
              </p>
            </div>
          ) : loading ? (
            <div className="p-10 text-center text-text-muted">Loading admin…</div>
          ) : !isAdmin ? (
            <div className="p-10 text-center text-text-muted">Redirecting…</div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              <AdminSidebar />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
