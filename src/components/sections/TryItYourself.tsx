"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { ApiPlayground } from "@/components/playground/ApiPlayground";

export function TryItYourself() {
  const t = useTranslations("tryIt");

  return (
    <section id="try-it" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-mono font-medium text-accent-emerald tracking-widest uppercase">
            {t("badge")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-16">
            <ApiPlayground />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
