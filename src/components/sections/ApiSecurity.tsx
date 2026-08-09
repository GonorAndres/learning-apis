"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

export function ApiSecurity() {
  const t = useTranslations("whatIsApi");

  return (
    <section id="security" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-amber">
            {t("securityBadge")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("securityTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t("securityText")}</p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <div className="space-y-6">
              <div className="border-t-2 border-accent-amber pt-5">
                <h3 className="text-sm font-semibold text-foreground">{t("securityWhatTitle")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t("securityWhatText")}</p>
              </div>
              <div className="border-t-2 border-accent-blue pt-5">
                <h3 className="text-sm font-semibold text-foreground">{t("securityWhyTitle")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t("securityWhyText")}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-6">
              <h3 className="text-sm font-semibold text-red-400">{t("securityDangerTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t("securityDangerText")}</p>
              <div className="mt-6 border-t border-red-500/15 pt-5">
                <div className="text-sm font-semibold text-foreground">{t("securityRulesTitle")}</div>
                <ol className="mt-4 space-y-3">
                  {([1, 2, 3, 4, 5] as const).map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="font-mono text-red-400">{item}.</span>
                      {t(`securityRule${item}` as "securityRule1")}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SecurityCode label={t("securityBadLabel")} code={t("securityCodeBad")} tone="bad" />
            <SecurityCode label={t("securityGoodLabel")} code={t("securityCodeGood")} tone="good" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function SecurityCode({ label, code, tone }: { label: string; code: string; tone: "bad" | "good" }) {
  const color = tone === "bad" ? "text-red-400" : "text-accent-emerald";
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className={`border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider ${color}`}>
        {label}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">{code}</pre>
    </div>
  );
}
