"use client";
import { useEffect } from "react";

export default function Redirect({ orderId }: { orderId: string }) {
  useEffect(() => {
    if (orderId && orderId !== "placeholder") {
      window.location.replace(`/checkout/success/?id=${orderId}`);
    } else {
      window.location.replace(`/checkout/success/`);
    }
  }, [orderId]);
  return null;
}
