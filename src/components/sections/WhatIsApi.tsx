"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { RequestResponseFlow } from "@/components/animation/RequestResponseFlow";

export function WhatIsApi() {
  const t = useTranslations("whatIsApi");

  const timelineItems = [
    { yearKey: "timeline1year", textKey: "timeline1text" },
    { yearKey: "timeline2year", textKey: "timeline2text" },
    { yearKey: "timeline3year", textKey: "timeline3text" },
    { yearKey: "timeline4year", textKey: "timeline4text" },
    { yearKey: "timeline5year", textKey: "timeline5text" },
  ] as const;

  return (
    <section id="what-is-api" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-mono font-medium text-accent-blue tracking-widest uppercase">
            {t("badge")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        {/* Origin story */}
        <ScrollReveal delay={0.1}>
          <div className="mt-16 max-w-4xl">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
              {t("originTitle")}
            </h3>
            <p className="mt-4 text-base text-muted leading-relaxed">
              {t("originText")}
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <ScrollReveal delay={0.15}>
          <div className="mt-12 max-w-4xl">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-blue mb-6">
              {t("timelineTitle")}
            </h4>
            <div className="relative pl-6 border-l-2 border-border space-y-6">
              {timelineItems.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent-blue/60 border-2 border-background" />
                  <div className="text-xs font-mono font-semibold text-accent-blue">
                    {t(item.yearKey)}
                  </div>
                  <p className="mt-1 text-sm text-muted leading-relaxed">
                    {t(item.textKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Function connection */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 max-w-4xl">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
              {t("functionTitle")}
            </h3>
            <p className="mt-4 text-base text-muted leading-relaxed">
              {t("functionText")}
            </p>
          </div>
        </ScrollReveal>

        {/* Side-by-side code comparison */}
        <ScrollReveal delay={0.15}>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-accent-amber/10 text-xs font-semibold uppercase tracking-wider text-accent-amber">
                {t("functionLocalLabel")}
              </div>
              <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
                {t("functionCodeLocal")}
              </pre>
            </div>
            <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-accent-blue/10 text-xs font-semibold uppercase tracking-wider text-accent-blue">
                {t("functionApiLabel")}
              </div>
              <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
                {t("functionCodeApi")}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive animation */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20">
            <RequestResponseFlow />
          </div>
        </ScrollReveal>

        {/* Request / Processing / Response cards */}
        <ScrollReveal delay={0.1}>
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            {(["request", "process", "response"] as const).map((key, i) => {
              const colors = [
                "border-accent-blue/20 bg-accent-blue/5",
                "border-accent-amber/20 bg-accent-amber/5",
                "border-accent-emerald/20 bg-accent-emerald/5",
              ];
              const textColors = [
                "text-accent-blue",
                "text-accent-amber",
                "text-accent-emerald",
              ];
              const stepKey = `step${key.charAt(0).toUpperCase() + key.slice(1)}` as
                | "stepRequest"
                | "stepProcess"
                | "stepResponse";
              const descKey = `${key}Desc` as
                | "requestDesc"
                | "processDesc"
                | "responseDesc";

              return (
                <div
                  key={key}
                  className={`rounded-xl border p-6 ${colors[i]}`}
                >
                  <div
                    className={`text-xs font-semibold uppercase tracking-wider ${textColors[i]}`}
                  >
                    {t(stepKey)}
                  </div>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                    {t(descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Security: API keys */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 max-w-4xl">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
              {t("securityTitle")}
            </h3>
            <p className="mt-4 text-base text-muted leading-relaxed">
              {t("securityText")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-amber">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("securityWhatTitle")}
                  </h4>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {t("securityWhatText")}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-blue">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("securityWhyTitle")}
                  </h4>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {t("securityWhyText")}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h4 className="text-sm font-semibold text-red-400">
                  {t("securityDangerTitle")}
                </h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {t("securityDangerText")}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Bad vs good code comparison */}
        <ScrollReveal delay={0.15}>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-red-500/10 text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {t("securityBadLabel")}
              </div>
              <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
                {t("securityCodeBad")}
              </pre>
            </div>
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-accent-emerald/10 text-xs font-semibold uppercase tracking-wider text-accent-emerald flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t("securityGoodLabel")}
              </div>
              <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
                {t("securityCodeGood")}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* Security rules */}
        <ScrollReveal delay={0.1}>
          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-emerald mb-4">
              {t("securityRulesTitle")}
            </h4>
            <div className="space-y-2">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <div key={n} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                    {n}
                  </span>
                  <span className="text-muted leading-relaxed">
                    {t(`securityRule${n}` as `securityRule1`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Everyday analogy */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 max-w-2xl mx-auto rounded-xl border border-border bg-surface p-6 sm:p-8">
            <div className="text-sm font-medium text-foreground mb-2">
              {t("analogyTitle")}
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {t("analogyText")}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
