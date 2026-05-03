"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { InterestRateChart } from "@/components/visualizations/InterestRateChart";
import { ExchangeRateChart } from "@/components/visualizations/ExchangeRateChart";
import { MortalityCurve } from "@/components/visualizations/MortalityCurve";
import { RiskMetricsPanel } from "@/components/visualizations/RiskMetricsPanel";

export function WhyCare() {
  const t = useTranslations("whyCare");

  return (
    <section id="why-care" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-mono font-medium text-accent-amber tracking-widest uppercase">
            {t("badge")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          <ScrollReveal>
            <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
                  {t("interestRates")}
                </div>
                <div className="text-[10px] text-muted font-mono">FRED / FEDFUNDS</div>
              </div>
              <InterestRateChart />
              <p className="mt-3 text-[11px] text-muted">From FRED API (Federal Reserve Economic Data)</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-emerald">
                  {t("exchangeRates")}
                </div>
                <div className="text-[10px] text-muted font-mono">Banxico / SF43718</div>
              </div>
              <ExchangeRateChart />
              <p className="mt-3 text-[11px] text-muted">From Banxico API (Banco de Mexico)</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-amber">
                  {t("mortality")}
                </div>
                <div className="text-[10px] text-muted font-mono">World Bank / SP.DYN.LE00.IN</div>
              </div>
              <MortalityCurve />
              <p className="mt-3 text-[11px] text-muted">From World Bank API (Development Indicators)</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-xl border border-accent-indigo/20 bg-accent-indigo/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-indigo">
                  {t("riskMetrics")}
                </div>
                <div className="text-[10px] text-muted font-mono">Combined APIs</div>
              </div>
              <RiskMetricsPanel />
              <p className="mt-3 text-[11px] text-muted">Combined from FRED, Banxico, and World Bank APIs</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
