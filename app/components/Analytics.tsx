"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, posthog } from "@/lib/analytics";

/** Fires one $pageview per route change — App Router doesn't do full page
    loads, so PostHog's own capture_pageview:false + this manual capture is
    what gives per-page session duration any data to work with. Needs a
    Suspense boundary: useSearchParams opts the tree into it. */
function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <Suspense fallback={null}>
      <PostHogPageview />
    </Suspense>
  );
}
