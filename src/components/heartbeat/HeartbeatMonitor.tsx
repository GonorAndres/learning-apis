"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

type ApiHealth = {
  apiId: string;
  name: string;
  color: string;
  url: string;
  status: "healthy" | "slow" | "down" | "pending";
  latency: number;
  history: number[];
  upCount: number;
  totalCount: number;
};

const APIS = [
  { apiId: "fred", name: "FRED", color: "#3b82f6", url: "/api/proxy/fred?path=/series/observations&series_id=DGS10&observation_start=2024-01-01&frequency=m" },
  { apiId: "banxico", name: "Banxico", color: "#10b981", url: "/api/proxy/banxico?series=SF43718&startDate=2024-01-01&endDate=2024-12-31" },
  { apiId: "worldbank", name: "World Bank", color: "#f59e0b", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.CDRT.IN&date=2023:2023" },
  { apiId: "custom", name: "Your API", color: "#6366f1", url: "/api/mortality?age=45" },
];

const MAX_HISTORY = 20;

export function HeartbeatMonitor() {
  const t = useTranslations("heartbeat");
  const [apis, setApis] = useState<ApiHealth[]>(
    APIS.map((a) => ({ ...a, status: "pending", latency: 0, history: [], upCount: 0, totalCount: 0 }))
  );
  const [isPinging, setIsPinging] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pingAll = useCallback(async () => {
    setIsPinging(true);
    const results = await Promise.all(
      APIS.map(async (api) => {
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(api.url, { signal: controller.signal });
          clearTimeout(timeout);
          const latency = Math.round(performance.now() - start);
          const status: "healthy" | "slow" = latency > 2000 ? "slow" : res.ok ? "healthy" : "slow";
          return { apiId: api.apiId, latency, status, ok: true };
        } catch {
          const latency = Math.round(performance.now() - start);
          return { apiId: api.apiId, latency, status: "down" as const, ok: false };
        }
      })
    );

    setApis((prev) =>
      prev.map((api) => {
        const result = results.find((r) => r.apiId === api.apiId);
        if (!result) return api;
        const history = [...api.history, result.latency].slice(-MAX_HISTORY);
        return {
          ...api,
          status: result.status,
          latency: result.latency,
          history,
          upCount: api.upCount + (result.ok ? 1 : 0),
          totalCount: api.totalCount + 1,
        };
      })
    );
    setIsPinging(false);
  }, []);

  useEffect(() => {
    pingAll();
    intervalRef.current = setInterval(pingAll, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pingAll]);

  const statusColor = (s: string) =>
    s === "healthy" ? "bg-accent-emerald" : s === "slow" ? "bg-accent-amber" : s === "down" ? "bg-red-500" : "bg-muted/30";

  const statusText = (s: string) =>
    s === "healthy" ? t("up") : s === "slow" ? t("slow") : s === "down" ? t("down") : t("pinging");

  return (
    <section id="heartbeat" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-emerald tracking-widest uppercase">
          {t("badge")}
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-emerald flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {apis.map((api) => (
            <div key={api.apiId} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${statusColor(api.status)}`}
                    animate={api.status === "healthy" ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-semibold text-foreground">{api.name}</span>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  api.status === "healthy" ? "bg-accent-emerald/10 text-accent-emerald"
                    : api.status === "slow" ? "bg-accent-amber/10 text-accent-amber"
                    : api.status === "down" ? "bg-red-500/10 text-red-400"
                    : "bg-muted/10 text-muted"
                }`}>
                  {statusText(api.status)}
                </span>
              </div>

              <div className="flex items-end gap-0.5 h-10 mb-3">
                {api.history.map((lat, i) => {
                  const maxH = Math.max(...api.history, 1);
                  const h = Math.max(4, (lat / maxH) * 40);
                  const isLast = i === api.history.length - 1;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-300"
                      style={{
                        height: `${h}px`,
                        backgroundColor: isLast && isPinging ? "var(--muted)" : api.color,
                        opacity: 0.3 + (i / api.history.length) * 0.7,
                      }}
                    />
                  );
                })}
                {api.history.length === 0 && (
                  <div className="flex-1 text-[10px] text-muted flex items-center justify-center">
                    {t("pinging")}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>{t("lastPing")}: {api.latency > 0 ? `${api.latency}ms` : "..."}</span>
                <span>
                  {t("uptime")}: {api.totalCount > 0 ? `${Math.round((api.upCount / api.totalCount) * 100)}%` : "..."}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
