"use client";

import { useEffect, useState } from "react";
import {
  CurrencyCode,
  getStoredCurrency,
  loadFxRates,
  setStoredCurrency,
  formatPrice,
} from "@/lib/currency";
import { defaultCurrencyForCountry, getVisitorCountry } from "@/lib/geo";

let cachedRates: Record<string, number> | null = null;

/**
 * Central hook for price rendering.
 * Reads stored currency (or geo-default on first visit), loads FX rates once,
 * and returns a format() that accepts USD/INR pair.
 */
export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<string, number>>(cachedRates ?? {});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // 1) Pick initial currency: stored > geo-default > USD
      const stored = getStoredCurrency();
      if (!mounted) return;
      if (typeof window !== "undefined" && !window.localStorage.getItem("crucx.currency")) {
        const country = await getVisitorCountry();
        const def = defaultCurrencyForCountry(country);
        setStoredCurrency(def);
        if (mounted) setCurrency(def);
      } else {
        setCurrency(stored);
      }

      // 2) Load FX rates if not cached
      if (!cachedRates) {
        cachedRates = await loadFxRates();
      }
      if (mounted) {
        setRates(cachedRates);
        setReady(true);
      }
    })();

    // 3) React to toggle events
    function onChange(e: Event) {
      const detail = (e as CustomEvent<CurrencyCode>).detail;
      if (detail) setCurrency(detail);
    }
    window.addEventListener("crucx:currency", onChange);
    return () => {
      mounted = false;
      window.removeEventListener("crucx:currency", onChange);
    };
  }, []);

  function format(priceUsd?: number | null, priceInr?: number | null) {
    return formatPrice(priceUsd ?? null, priceInr ?? null, currency, rates);
  }

  return { currency, setCurrency: setStoredCurrency, format, ready, rates };
}
