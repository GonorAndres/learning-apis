"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { RequestResponseFlow } from "@/components/animation/RequestResponseFlow";

export function WhatIsApi() {
  const t = useTranslations("whatIsApi");
  const timelineItems = [1, 2, 3, 4, 5] as const;

  return (
    <section id="what-is-api" className="scroll-mt-14 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-blue">
            {t("badge")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t("subtitle")}</p>
          <div className="mt-6 max-w-3xl rounded-lg bg-accent-amber/10 p-4 text-sm leading-relaxed text-foreground/80">
            {t("verifyNote")}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="mt-12">
            <RequestResponseFlow />
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {(["request", "process", "response"] as const).map((key, index) => (
            <ScrollReveal key={key} delay={index * 0.06}>
              <div className="border-t border-border pt-5">
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-blue">
                  {t(`step${key.charAt(0).toUpperCase() + key.slice(1)}` as "stepRequest")}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`${key}Desc` as "requestDesc")}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-16 grid gap-8 border-y border-border py-10 lg:grid-cols-[0.7fr_1.3fr]">
            <h3 className="text-xl font-semibold text-foreground">{t("analogyTitle")}</h3>
            <p className="text-base leading-relaxed text-muted">{t("analogyText")}</p>
          </div>
        </ScrollReveal>

        <div className="mt-10 space-y-3">
          <ScrollReveal>
            <details className="group rounded-xl border border-border bg-surface">
              <summary className="cursor-pointer list-none p-5 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue">
                <span className="flex items-center justify-between gap-4">
                  {t("functionTitle")}
                  <span className="text-lg font-normal text-muted group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <div className="border-t border-border p-5">
                <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
                  <p>{t("functionTextReframed")}</p>
                  <p>{t("functionText")}</p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <CodeBlock label={t("functionLocalLabel")} code={t("functionCodeLocal")} />
                  <CodeBlock label={t("functionApiLabel")} code={t("functionCodeApi")} />
                </div>
              </div>
            </details>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <details className="group rounded-xl border border-border bg-surface">
              <summary className="cursor-pointer list-none p-5 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue">
                <span className="flex items-center justify-between gap-4">
                  {t("timelineTitle")}
                  <span className="text-lg font-normal text-muted group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <div className="border-t border-border p-5">
                <div className="max-w-3xl">
                  <h3 className="text-sm font-semibold text-foreground">{t("originTitle")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t("originText")}</p>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-5">
                  {timelineItems.map((item) => (
                    <div key={item}>
                      <div className="font-mono text-xs font-semibold text-accent-blue">
                        {t(`timeline${item}year` as "timeline1year")}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        {t(`timeline${item}text` as "timeline1text")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">{code}</pre>
    </div>
  );
}
