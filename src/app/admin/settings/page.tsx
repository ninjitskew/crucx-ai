"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";

type AdminRow = { id: string; email: string | null; role: string | null; created_at?: string };

export default function AdminSettingsPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function load() {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    const { data, error } = await sb
      .from("app_user")
      .select("id,email,role,created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (!error && data) setAdmins(data as AdminRow[]);
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const target = email.trim().toLowerCase();
    // Find user by email in app_user table (populated on first sign-in)
    const { data: user, error: findErr } = await sb
      .from("app_user")
      .select("id,email,role")
      .ilike("email", target)
      .maybeSingle();
    if (findErr) {
      setMsg({ kind: "err", text: findErr.message });
      setBusy(false);
      return;
    }
    if (!user) {
      setMsg({
        kind: "err",
        text: `No account found for ${target}. Ask them to sign up first, then add them here.`,
      });
      setBusy(false);
      return;
    }
    if (user.role === "admin") {
      setMsg({ kind: "err", text: `${target} is already an admin.` });
      setBusy(false);
      return;
    }
    const { error: updErr } = await sb
      .from("app_user")
      .update({ role: "admin" })
      .eq("id", user.id);
    if (updErr) {
      setMsg({ kind: "err", text: updErr.message });
      setBusy(false);
      return;
    }
    setMsg({ kind: "ok", text: `${target} promoted to admin.` });
    setEmail("");
    setBusy(false);
    load();
  }

  async function revoke(id: string, targetEmail: string | null) {
    if (!confirm(`Revoke admin access for ${targetEmail}?`)) return;
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const { error } = await sb.from("app_user").update({ role: "reader" }).eq("id", id);
    if (error) {
      setMsg({ kind: "err", text: error.message });
    } else {
      setMsg({ kind: "ok", text: `${targetEmail} admin access revoked.` });
      load();
    }
    setBusy(false);
  }

  if (adminLoading) {
    return <div className="text-sm text-text-muted">Loading…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage admin access and site configuration.
        </p>
      </div>

      <section className="rounded-2xl border border-border-default bg-bg-card p-6">
        <h2 className="text-lg font-semibold text-text-primary">Admin users</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Admins can access the CMS and moderate content. Users must sign up at least once before
          they can be promoted.
        </p>

        <form onSubmit={addAdmin} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="flex-1 rounded-xl border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Working…" : "Add admin"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
              msg.kind === "ok"
                ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
                : "border-accent-pink/30 bg-accent-pink/10 text-accent-pink"
            }`}
          >
            {msg.text}
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-border-default">
          <table className="w-full text-sm">
            <thead className="bg-bg-secondary text-left text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-text-muted">
                    Loading…
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-text-muted">
                    No admins yet.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a.id} className="border-t border-border-default">
                    <td className="px-4 py-3 text-text-primary">{a.email ?? "—"}</td>
                    <td className="px-4 py-3 text-accent-blue">admin</td>
                    <td className="px-4 py-3 text-right">
                      {a.email?.toLowerCase() === "alcubis@gmail.com" ? (
                        <span className="text-xs text-text-muted">primary owner</span>
                      ) : (
                        <button
                          onClick={() => revoke(a.id, a.email)}
                          disabled={busy}
                          className="text-xs text-accent-pink hover:underline disabled:opacity-50"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-border-default bg-bg-card p-6 text-sm text-text-muted">
        More settings (site metadata, feature flags, payouts) coming soon.
      </section>
    </div>
  );
}
