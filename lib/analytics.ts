"use client";

/**
 * PostHog wiring. Covers: visit counts (autocapture + manual $pageview),
 * session duration per page (capture_pageleave + per-route pageviews),
 * friction signals (session recording + autocapture's built-in $rageclick,
 * heatmaps toggled in the PostHog project dashboard), and time-to-inquiry
 * (a landing timestamp compared against the moment a lead form succeeds).
 *
 * No-ops entirely when NEXT_PUBLIC_POSTHOG_KEY isn't set, so local dev
 * without a key never touches the network.
 */

import posthog from "posthog-js";

const LANDING_KEY = "nbil_landing_ts";

let initialized = false;

/** Called once, from the Analytics provider mounted in the root layout. */
export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // fired manually per route change, see PostHogPageview
    capture_pageleave: true, // required for accurate session-duration-per-page
    autocapture: true, // clicks/inputs + the built-in $rageclick friction signal
    session_recording: {
      // QuoteForm / ProjectForm collect email + phone — those input types
      // are masked in replays regardless of which form they show up in.
      maskInputOptions: { email: true, tel: true },
    },
  });
  initialized = true;
  markLanding();
}

function markLanding() {
  try {
    if (!sessionStorage.getItem(LANDING_KEY)) {
      sessionStorage.setItem(LANDING_KEY, String(Date.now()));
    }
  } catch {
    // sessionStorage can throw in locked-down browser contexts — landing
    // time just goes unmeasured for that visit, nothing else depends on it.
  }
}

function secondsSinceLanding(): number | null {
  try {
    const raw = sessionStorage.getItem(LANDING_KEY);
    return raw ? Math.round((Date.now() - Number(raw)) / 1000) : null;
  } catch {
    return null;
  }
}

/** Fired on successful form submit — the landing-to-inquiry funnel metric. */
export function captureInquirySubmitted(formId: string) {
  if (!initialized) return;
  posthog.capture("inquiry_submitted", {
    form_id: formId,
    seconds_since_landing: secondsSinceLanding(),
  });
}

export { posthog };
