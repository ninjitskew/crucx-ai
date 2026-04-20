"use client";

import { useEffect, useState } from "react";
import { getVisitorCountry } from "@/lib/geo";
import { pickStoreUrl, withAffiliateTag } from "@/lib/amazon";
import { trackOutboundClick } from "@/lib/analytics";

interface Props {
  slug: string;
  amazonInUrl: string | null;
  amazonComUrl: string | null;
}

export default function OutRedirect({ slug, amazonInUrl, amazonComUrl }: Props) {
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const country = await getVisitorCountry();
      if (cancelled) return;

      const picked = pickStoreUrl(
        { amazon_in_url: amazonInUrl, amazon_com_url: amazonComUrl },
        country
      );
      if (!picked) {
        setManualUrl(null);
        return;
      }
      const finalUrl = withAffiliateTag(picked.url);

      // Fire-and-forget event; don't block the redirect on it.
      trackOutboundClick({ slug, store: picked.store, country }).catch(() => {});

      setManualUrl(finalUrl);
      // Small delay so the tracking beacon has a chance to send.
      setTimeout(() => {
        window.location.replace(finalUrl);
      }, 300);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, amazonInUrl, amazonComUrl]);

  return (
    <div className="mt-6 text-xs text-text-muted">
      Didn&apos;t redirect?{" "}
      {manualUrl ? (
        <a href={manualUrl} className="text-accent-blue hover:underline">
          Click here
        </a>
      ) : (
        <span>No Amazon listing available for this book.</span>
      )}
    </div>
  );
}
