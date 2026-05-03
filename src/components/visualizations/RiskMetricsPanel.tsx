"use client";

import { useEffect, useState } from "react";

type Metrics = {
  fedRate: string;
  fedTrend: "up" | "down" | "flat";
  usdMxn: string;
  fxVolatility: string;
  mexLifeExp: string;
  usaLifeExp: string;
};

export function RiskMetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/proxy/fred?path=/series/observations&series_id=FEDFUNDS&observation_start=2023-01-01&frequency=q").then((r) => r.json()),
      fetch("/api/proxy/banxico?series=SF43718&startDate=2024-01-01&endDate=2024-12-31").then((r) => r.json()),
      fetch("/api/proxy/worldbank?country=MEX&indicator=SP.DYN.LE00.IN&date=2020:2023").then((r) => r.json()),
      fetch("/api/proxy/worldbank?country=USA&indicator=SP.DYN.LE00.IN&date=2020:2023").then((r) => r.json()),
    ])
      .then(([fredData, banxicoData, mexWb, usaWb]) => {
        const obs = (fredData.observations || []).filter((o: { value: string }) => o.value !== ".");
        const lastTwo = obs.slice(-2);
        const fedRate = lastTwo.length > 0 ? parseFloat(lastTwo[lastTwo.length - 1].value).toFixed(2) : "N/A";
        const fedTrend =
          lastTwo.length === 2
            ? parseFloat(lastTwo[1].value) > parseFloat(lastTwo[0].value)
              ? "up"
              : parseFloat(lastTwo[1].value) < parseFloat(lastTwo[0].value)
                ? "down"
                : "flat"
            : "flat";

        const datos = banxicoData.bmx?.series?.[0]?.datos || [];
        const fxValues = datos.map((d: { dato: string }) => parseFloat(d.dato));
        const lastFx = fxValues.length > 0 ? fxValues[fxValues.length - 1].toFixed(2) : "N/A";
        const mean = fxValues.reduce((a: number, b: number) => a + b, 0) / (fxValues.length || 1);
        const variance = fxValues.reduce((s: number, v: number) => s + (v - mean) ** 2, 0) / (fxValues.length || 1);
        const vol = Math.sqrt(variance).toFixed(2);

        const mexRecords = (mexWb[1] || []) as { value: number | null }[];
        const usaRecords = (usaWb[1] || []) as { value: number | null }[];
        const mexLe = mexRecords.find((r) => r.value !== null)?.value?.toFixed(1) || "N/A";
        const usaLe = usaRecords.find((r) => r.value !== null)?.value?.toFixed(1) || "N/A";

        setMetrics({
          fedRate,
          fedTrend: fedTrend as "up" | "down" | "flat",
          usdMxn: lastFx,
          fxVolatility: vol,
          mexLifeExp: mexLe,
          usaLifeExp: usaLe,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-surface-elevated animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-xs text-muted text-center py-8">Unable to load metrics</div>;
  }

  const cards = [
    {
      label: "Fed Funds Rate",
      value: `${metrics.fedRate}%`,
      sub: metrics.fedTrend === "down" ? "Decreasing" : metrics.fedTrend === "up" ? "Increasing" : "Stable",
      color: "text-accent-blue",
      trend: metrics.fedTrend,
    },
    {
      label: "USD/MXN",
      value: `$${metrics.usdMxn}`,
      sub: `Volatility: ${metrics.fxVolatility}`,
      color: "text-accent-emerald",
    },
    {
      label: "Mexico Life Exp.",
      value: `${metrics.mexLifeExp} yr`,
      sub: "Latest available",
      color: "text-accent-amber",
    },
    {
      label: "USA Life Exp.",
      value: `${metrics.usaLifeExp} yr`,
      sub: "Latest available",
      color: "text-accent-indigo",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-border bg-surface-elevated p-4">
          <div className="text-[11px] text-muted uppercase tracking-wider">{card.label}</div>
          <div className={`mt-1 text-xl font-bold ${card.color}`}>{card.value}</div>
          <div className="mt-1 text-[11px] text-muted flex items-center gap-1">
            {card.trend === "down" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-emerald">
                <path d="M18 18L6 6M6 6v12M6 6h12" />
              </svg>
            )}
            {card.trend === "up" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-400">
                <path d="M6 6l12 12M18 18V6M18 18H6" />
              </svg>
            )}
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
