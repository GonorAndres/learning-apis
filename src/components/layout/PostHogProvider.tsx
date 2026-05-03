"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, type ReactNode } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    posthog.init("phc_DYrSznvPeJuXPHgj2Nw9BIluiGdwkbuSSih3lu6PtmH", {
      api_host: "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });
    setReady(true);
  }, []);

  if (!ready) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
