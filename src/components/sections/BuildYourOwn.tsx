"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

const stepKeys = [
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
] as const;

const stepIcons = [
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
];

export function BuildYourOwn() {
  const t = useTranslations("buildOwn");

  return (
    <section id="build-own" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-mono font-medium text-accent-indigo tracking-widest uppercase">
            {t("badge")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <div className="mt-16 space-y-4">
          {stepKeys.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.08}>
              <div className="flex gap-4 sm:gap-6 rounded-xl border border-border bg-background p-5 sm:p-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
                  {stepIcons[i]}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {t(`${key}Title` as `step1Title`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">
                    {t(`${key}Desc` as `step1Desc`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
