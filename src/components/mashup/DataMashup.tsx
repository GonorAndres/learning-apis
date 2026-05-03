"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type MashupPreset = {
  label: string;
  description: string;
  sources: { name: string; url: string; color: string }[];
  merge: (results: unknown[]) => { data: Record<string, unknown>[]; xKey: string; lines: { key: string; color: string; name: string }[] };
};

const PRESETS: MashupPreset[] = [
  {
    label: "Fed Rate vs USD/MXN",
    description: "How does US monetary policy correlate with the peso exchange rate?",
    sources: [
      { name: "FRED", url: "/api/proxy/fred?path=/series/observations&series_id=FEDFUNDS&observation_start=2020-01-01&frequency=m", color: "#3b82f6" },
      { name: "Banxico", url: "/api/proxy/banxico?series=SF43718&startDate=2020-01-01&endDate=2024-12-31", color: "#10b981" },
    ],
    merge: (results) => {
      const fred = (results[0] as { observations?: { date: string; value: string }[] })?.observations || [];
      const banxico = (results[1] as { bmx?: { series?: { datos?: { fecha: string; dato: string }[] }[] } })?.bmx?.series?.[0]?.datos || [];

      const fredByMonth: Record<string, number> = {};
      fred.forEach((o) => { if (o.value !== ".") fredByMonth[o.date.slice(0, 7)] = parseFloat(o.value); });

      const banxicoByMonth: Record<string, number> = {};
      banxico.forEach((d) => {
        const [, m, y] = d.fecha.split("/");
        const key = `${y}-${m}`;
        banxicoByMonth[key] = parseFloat(d.dato);
      });

      const allMonths = [...new Set([...Object.keys(fredByMonth), ...Object.keys(banxicoByMonth)])].sort();
      const data = allMonths
        .filter((m) => fredByMonth[m] !== undefined && banxicoByMonth[m] !== undefined)
        .map((m) => ({ month: m, fedRate: fredByMonth[m], usdMxn: banxicoByMonth[m] }));

      return { data, xKey: "month", lines: [
        { key: "fedRate", color: "#3b82f6", name: "Fed Rate (%)" },
        { key: "usdMxn", color: "#10b981", name: "USD/MXN" },
      ]};
    },
  },
  {
    label: "Mexico vs USA Life Expectancy + Mortality",
    description: "How do life expectancy and death rate move together?",
    sources: [
      { name: "World Bank (LE)", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.LE00.IN&date=2000:2023", color: "#f59e0b" },
      { name: "World Bank (DR)", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.CDRT.IN&date=2000:2023", color: "#ef4444" },
    ],
    merge: (results) => {
      const le = ((results[0] as unknown[])?.[1] || []) as { date: string; value: number | null }[];
      const dr = ((results[1] as unknown[])?.[1] || []) as { date: string; value: number | null }[];

      const drByYear: Record<string, number> = {};
      dr.forEach((r) => { if (r.value) drByYear[r.date] = r.value; });

      const data = le
        .filter((r) => r.value !== null && drByYear[r.date])
        .map((r) => ({ year: r.date, lifeExp: parseFloat(r.value!.toFixed(1)), deathRate: parseFloat(drByYear[r.date].toFixed(2)) }))
        .reverse();

      return { data, xKey: "year", lines: [
        { key: "lifeExp", color: "#f59e0b", name: "Life Expectancy (yr)" },
        { key: "deathRate", color: "#ef4444", name: "Death Rate (per 1000)" },
      ]};
    },
  },
];

export function DataMashup() {
  const t = useTranslations("mashup");
  const [selected, setSelected] = useState(0);
  const [result, setResult] = useState<ReturnType<MashupPreset["merge"]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  async function runMashup() {
    setLoading(true);
    setResult(null);
    const preset = PRESETS[selected];

    setStep(1);
    const responses = await Promise.all(preset.sources.map((s) => fetch(s.url).then((r) => r.json())));

    setStep(2);
    await new Promise((r) => setTimeout(r, 500));

    setStep(3);
    const merged = preset.merge(responses);

    setStep(4);
    await new Promise((r) => setTimeout(r, 300));

    setResult(merged);
    setLoading(false);
  }

  return (
    <section id="mashup" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-emerald tracking-widest uppercase">
          {t("badge")}
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-4 text-lg text-muted max-w-2xl">{t("subtitle")}</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t("problemTitle")}</h3>
            <p className="text-sm text-muted leading-relaxed">{t("problemText")}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t("whatYouLearn")}</h3>
            <ul className="space-y-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-emerald flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">{t("preset")}</div>
          <div className="flex gap-3 mb-6">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setSelected(i); setResult(null); setStep(0); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${i === selected ? "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald" : "border-border text-muted hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted mb-6">{PRESETS[selected].description}</p>

          {loading && (
            <div className="flex gap-4 mb-6">
              {[t("step1"), t("step2"), t("step3"), t("step4")].map((s, i) => (
                <div key={i} className={`flex items-center gap-1.5 text-xs font-medium ${step > i ? "text-accent-emerald" : step === i ? "text-accent-blue" : "text-muted/40"}`}>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${step > i ? "border-accent-emerald bg-accent-emerald/10" : "border-current"}`}>
                    {step > i ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> : i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          )}

          {!result && !loading && (
            <button onClick={runMashup} className="px-6 py-3 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity">
              {t("runMashup")}
            </button>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-surface p-6">
              <div className="text-xs text-muted mb-4">{result.data.length} merged data points</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey={result.xKey} tick={{ fontSize: 10, fill: "var(--muted)" }} tickLine={false} interval={Math.floor(result.data.length / 5)} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "var(--muted)" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "var(--muted)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {result.lines.map((line, i) => (
                    <Line key={line.key} yAxisId={i === 0 ? "left" : "right"} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={false} name={line.name} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center">
                <button onClick={() => { setResult(null); setStep(0); }} className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground">
                  {t("runMashup")} again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
