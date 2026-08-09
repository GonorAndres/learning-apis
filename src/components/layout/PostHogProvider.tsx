"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

let initialized = false;

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    posthog.init("phc_DYrSznvPeJuXPHgj2Nw9BIluiGdwkbuSSih3lu6PtmH", {
      api_host: "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
