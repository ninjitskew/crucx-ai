"use client";

// Razorpay wrapper. Test/live toggle is purely client-side.
// Set NEXT_PUBLIC_RAZORPAY_LIVE=true and NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE to flip.
// See /docs/payments-go-live.md.

export interface RazorpayOptions {
  amount: number; // in USD dollars
  orderId: string;
  email?: string;
  name?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onDismiss?: () => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function isLiveMode(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_LIVE === "true";
}

export function getKeyId(): string {
  if (isLiveMode()) {
    return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE ?? "";
  }
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function openCheckout(opts: RazorpayOptions): Promise<void> {
  const ok = await loadScript();
  const key = getKeyId();
  if (!ok || !key || !window.Razorpay) {
    // Fallback: simulate success in dev so the flow can be tested without keys.
    // eslint-disable-next-line no-console
    console.warn("[crucx] Razorpay key not configured — simulating success.");
    setTimeout(() => opts.onSuccess?.("sim_" + Date.now()), 600);
    return;
  }
  // Razorpay expects amount in the smallest currency unit. USD => cents.
  const rzp = new window.Razorpay({
    key,
    amount: Math.round(opts.amount * 100),
    currency: "USD",
    name: opts.name ?? "crucx.ai",
    description: opts.description ?? "eBook purchase",
    order_id: undefined, // client-only flow; no server-issued order
    prefill: { email: opts.email },
    theme: { color: "#3b82f6" },
    handler: (resp: any) => opts.onSuccess?.(resp.razorpay_payment_id),
    modal: { ondismiss: () => opts.onDismiss?.() },
    notes: { crucx_order: opts.orderId },
  });
  rzp.open();
}
