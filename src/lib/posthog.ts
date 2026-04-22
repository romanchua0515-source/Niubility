import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    // Belt-and-suspenders cookie ban. `persistence: "memory"` alone does not
    // stop posthog-js from writing the tiny cross-subdomain identity cookie
    // (ph_*) which was competing with admin_auth for the per-origin cookie
    // quota and producing intermittent 401s in batch imports.
    persistence: "memory",
    disable_cookie: true,
    cross_subdomain_cookie: false,
    disable_session_recording: true,
    loaded: () => {
      initialized = true;
    },
  });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) return;
  posthog.capture(name, props);
}

export { posthog };
