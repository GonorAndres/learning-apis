"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Scenario = {
  label: string;
  description: string;
  url: string;
  extract: (data: unknown) => { x: string; y: number }[];
  xLabel: string;
  yLabel: string;
  unit: string;
  defaultAdjust: number;
};

const SCENARIOS: Scenario[] = [
  {
    label: "Mexico Life Expectancy",
    description: "What if life expectancy were higher or lower?",
    url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.LE00.IN&date=1990:2023",
    extract: (data) => {
      const records = (data as unknown[])?.[1] as { date: string; value: number | null }[] || [];
      return records.filter((r) => r.value !== null).map((r) => ({ x: r.date, y: parseFloat(r.value!.toFixed(1)) })).reverse();
    },
    xLabel: "Year", yLabel: "Life Expectancy", unit: " years", defaultAdjust: 10,
  },
  {
    label: "Mexico Death Rate",
    description: "What if mortality dropped by half?",
    url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.CDRT.IN&date=2000:2023",
    extract: (data) => {
      const records = (data as unknown[])?.[1] as { date: string; value: number | null }[] || [];
      return records.filter((r) => r.value !== null).map((r) => ({ x: r.date, y: parseFloat(r.value!.toFixed(2)) })).reverse();
    },
    xLabel: "Year", yLabel: "Death Rate (per 1000)", unit: "", defaultAdjust: -50,
  },
  {
    label: "Mortality Table (qx)",
    description: "What if mortality rates at every age were different?",
    url: "/api/mortality?format=table",
    extract: (data) => {
      const table = (data as { table?: { age: number; qx: number }[] })?.table || [];
      return table.map((r) => ({ x: String(r.age), y: r.qx }));
    },
    xLabel: "Age", yLabel: "qx (mortality rate)", unit: "", defaultAdjust: -30,
  },
];

export function WhatIfSandbox() {
  const t = useTranslations("whatif");
  const [selected, setSelected] = useState(0);
  const [realData, setRealData] = useState<{ x: string; y: number }[]>([]);
  const [adjustment, setAdjustment] = useState(SCENARIOS[0].defaultAdjust);
  const [loading, setLoading] = useState(true);

  const scenario = SCENARIOS[selected];

  useEffect(() => {
    setLoading(true);
    setAdjustment(SCENARIOS[selected].defaultAdjust);
    fetch(SCENARIOS[selected].url)
      .then((r) => r.json())
      .then((data) => setRealData(SCENARIOS[selected].extract(data)))
      .catch(() => setRealData([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const chartData = realData.map((d) => ({
    x: d.x,
    real: d.y,
    hypothetical: parseFloat((d.y * (1 + adjustment / 100)).toFixed(4)),
  }));

  return (
    <section id="whatif" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-amber tracking-widest uppercase">
          {t("badge")}
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-4 text-lg text-muted max-w-2xl">{t("subtitle")}</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t("problemTitle")}</h3>
            <p className="text-sm text-muted leading-relaxed">{t("problemText")}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t("whatYouLearn")}</h3>
            <ul className="space-y-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-amber flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">{t("scenario")}</div>
          <div className="flex flex-wrap gap-3 mb-6">
            {SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${i === selected ? "border-accent-amber/30 bg-accent-amber/10 text-accent-amber" : "border-border text-muted hover:text-foreground"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted mb-6">{scenario.description}</p>

          <div className="rounded-xl border border-border bg-background p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted uppercase tracking-wider">{t("adjustment")}</span>
              <span className={`text-sm font-mono font-bold ${adjustment >= 0 ? "text-accent-emerald" : "text-red-400"}`}>
                {adjustment >= 0 ? "+" : ""}{adjustment}%
              </span>
            </div>
            <input
              type="range"
              min={-80}
              max={80}
              value={adjustment}
              onChange={(e) => setAdjustment(parseInt(e.target.value))}
              className="w-full accent-accent-amber"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>-80%</span>
              <span>0%</span>
              <span>+80%</span>
            </div>
          </div>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex gap-1">{[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}</div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-background p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--muted)" }} tickLine={false} interval={Math.floor(chartData.length / 5)} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} tickLine={false} axisLine={false} unit={scenario.unit} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="real" stroke="#f59e0b" strokeWidth={2} dot={false} name={t("realData")} />
                  <Line type="monotone" dataKey="hypothetical" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name={`${t("hypothetical")} (${adjustment >= 0 ? "+" : ""}${adjustment}%)`} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
