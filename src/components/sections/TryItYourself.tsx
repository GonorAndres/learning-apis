"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { ApiPlayground } from "@/components/playground/ApiPlayground";

export function TryItYourself() {
  const t = useTranslations("tryIt");

  return (
    <section id="try-it" className="scroll-mt-14 py-16 sm:py-20 px-4 bg-surface">
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

        <ScrollReveal delay={0.08}>
          <div className="mt-10 grid gap-6 border-y border-border py-8 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-emerald">
                {t("firstPathLabel")}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{t("firstPathTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t("firstPathText")}</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {([1, 2, 3] as const).map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  <span className="mb-2 block font-mono text-xs text-accent-emerald">0{item}</span>
                  {t(`firstPathStep${item}` as "firstPathStep1")}
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <ApiPlayground />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
