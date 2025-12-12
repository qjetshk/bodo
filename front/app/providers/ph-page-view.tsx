'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || !pathname) return;

    const queryString = searchParams.toString();
    const url = queryString ? `${window.location.origin}${pathname}?${queryString}` : `${window.location.origin}${pathname}`;

    posthog.capture('$pageview', {
      $current_url: url,
    });
  }, [pathname, searchParams, posthog]);

  return null;
}
