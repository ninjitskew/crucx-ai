"use client";

import { getSupabase } from "@/lib/supabase";

export async function logAudit(params: {
  userId: string | null;
  entity: string;
  entityId: string | null;
  action: string;
  diff?: unknown;
}) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("audit_log").insert({
      user_id: params.userId,
      entity: params.entity,
      entity_id: params.entityId,
      action: params.action,
      diff: params.diff ?? null,
    });
  } catch {
    /* ignore — audit is best-effort */
  }
}
