"use client";

import { useEffect } from "react";
import { trackBookView } from "@/lib/analytics";
import { getVisitorCountry } from "@/lib/geo";

export default function BookViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const country = await getVisitorCountry();
      if (cancelled) return;
      trackBookView({ slug, country }).catch(() => {});
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return null;
}
