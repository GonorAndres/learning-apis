"use client";

import { useState, useEffect } from "react";

const MAIN_SECTIONS = ["hero", "what-is-api", "try-it", "why-care", "build-own"];
const ADVANCED_SECTIONS = ["race", "chaos", "debugger", "heartbeat", "reverse", "xray", "mashup", "whatif", "contract"];

export function useScrollSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const isAdvanced = window.location.pathname.includes("/advanced");
    const sections = isAdvanced ? ADVANCED_SECTIONS : MAIN_SECTIONS;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { threshold: 0.2 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
