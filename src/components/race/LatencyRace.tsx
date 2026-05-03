"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRace, type RacerResult } from "@/hooks/useRace";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function LatencyRace() {
  const t = useTranslations("race");
  const { racers, raceStatus, history, startRace, reset } = useRace();

  const sortedResults =
    raceStatus === "done"
      ? [...racers]
          .filter((r) => r.result)
          .map((r) => r.result!)
          .sort((a, b) => a.latency - b.latency)
      : [];

  return (
    <section id="race" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-blue tracking-widest uppercase">
          {t("badge")}
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Race tracks */}
        <div className="mt-12 space-y-4">
          {racers.map((racer, i) => (
            <div key={racer.apiId} className="flex items-center gap-4">
              <div className="w-24 sm:w-32 text-sm font-medium text-foreground truncate">
                {racer.name}
              </div>
              <div className="flex-1 relative h-10 rounded-lg bg-surface-elevated border border-border overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ backgroundColor: racer.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${racer.progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
                {racer.status === "done" && racer.result && (
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-mono font-bold text-foreground drop-shadow-sm">
                      {racer.result.latency}ms
                    </span>
                  </div>
                )}
                {racer.status === "done" && sortedResults[0]?.apiId === racer.apiId && (
                  <div className="absolute inset-0 flex items-center pl-3">
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                      {t("winner")}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block w-32 text-[11px] text-muted truncate">
                {racer.server}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          {raceStatus === "idle" && (
            <button
              onClick={startRace}
              className="px-6 py-3 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              {t("startRace")}
            </button>
          )}
          {raceStatus === "racing" && (
            <div className="px-6 py-3 text-sm text-muted">
              <span className="inline-flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </span>
            </div>
          )}
          {raceStatus === "done" && (
            <button
              onClick={() => { reset(); setTimeout(startRace, 100); }}
              className="px-6 py-3 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              {t("runAgain")}
            </button>
          )}
        </div>

        {/* Results table */}
        {raceStatus === "done" && sortedResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 rounded-xl border border-border bg-surface p-6"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-border">
                  <th className="pb-3 pr-4">{t("rank")}</th>
                  <th className="pb-3 pr-4">{t("api")}</th>
                  <th className="pb-3 pr-4">{t("latency")}</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">{t("size")}</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">{t("status")}</th>
                  <th className="pb-3 hidden sm:table-cell">{t("server")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((r, i) => (
                  <tr key={r.apiId} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 font-bold" style={{ color: r.color }}>
                      {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : "4th"}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-foreground">{r.name}</td>
                    <td className="py-2.5 pr-4 font-mono">{r.latency}ms</td>
                    <td className="py-2.5 pr-4 font-mono hidden sm:table-cell">
                      {r.size > 1024 ? `${(r.size / 1024).toFixed(1)}KB` : `${r.size}B`}
                    </td>
                    <td className="py-2.5 pr-4 hidden sm:table-cell">
                      <span className={r.status === 200 ? "text-accent-emerald" : "text-red-400"}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted hidden sm:table-cell">{r.server}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Histogram after 3+ races */}
        {history.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-xl border border-border bg-surface p-6"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              {t("distribution")}
            </div>
            <div className="text-[11px] text-muted mb-4">
              {history.length} {t("raceCount")}
            </div>
            <LatencyHistogram history={history} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function LatencyHistogram({ history }: { history: RacerResult[][] }) {
  const apiMap: Record<string, { name: string; color: string; latencies: number[] }> = {};

  for (const race of history) {
    for (const r of race) {
      if (!apiMap[r.apiId]) {
        apiMap[r.apiId] = { name: r.name, color: r.color, latencies: [] };
      }
      apiMap[r.apiId].latencies.push(r.latency);
    }
  }

  const chartData = Object.values(apiMap).map((a) => {
    const avg = Math.round(a.latencies.reduce((s, v) => s + v, 0) / a.latencies.length);
    const min = Math.min(...a.latencies);
    const max = Math.max(...a.latencies);
    return { name: a.name, avg, min, max, color: a.color };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={false}
          unit="ms"
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(val: number) => [`${val}ms`]}
        />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
