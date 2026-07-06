"use client";

import { useEffect, useState } from "react";
import { NbilLoader } from "@/components/ui/nbil-loader";

/**
 * Shows the NBIL intro loader on first load, then reveals the site.
 * Renders nothing after the intro has finished (persists for the session via
 * the layout, so client-side navigations don't replay it).
 */
export default function IntroGate() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  if (done) return null;

  return <NbilLoader onDone={() => setDone(true)} />;
}
