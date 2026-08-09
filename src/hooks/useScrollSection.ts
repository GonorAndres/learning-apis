"use client";

import { useEffect, useState } from "react";
import { ADVANCED_SECTION_IDS, MAIN_SECTION_IDS } from "@/lib/navigation";

export function useScrollSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const isAdvanced = window.location.pathname.includes("/advanced");
    const sections = isAdvanced ? ADVANCED_SECTION_IDS : MAIN_SECTION_IDS;
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio));
        const visible = [...ratios.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((left, right) => right[1] - left[1]);
        if (visible[0]) setActive(visible[0][0]);
      },
      { threshold: [0, 0.2, 0.4, 0.6] }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
