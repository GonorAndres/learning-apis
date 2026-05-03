"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type XrayData = {
  statusLine: { method: string; url: string; status: number; statusText: string; protocol: string };
  headers: Record<string, string>;
  bodyRaw: string;
  bodyParsed: unknown;
  size: number;
  timing: number;
};

const ENDPOINTS = [
  { label: "Mortality (age=45)", url: "/api/mortality?age=45" },
  { label: "Mortality (table)", url: "/api/mortality?format=table" },
  { label: "World Bank (MEX)", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.CDRT.IN&date=2023:2023" },
  { label: "Chaos (200 OK)", url: "/api/chaos" },
];

export function PacketXray() {
  const t = useTranslations("xray");
  const [xray, setXray] = useState<XrayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  async function fireRequest() {
    setLoading(true);
    setXray(null);
    setExpandedLayer(null);
    const url = ENDPOINTS[selectedEndpoint].url;
    const start = performance.now();

    try {
      const res = await fetch(url);
      const bodyRaw = await res.text();
      const timing = Math.round(performance.now() - start);

      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });

      let bodyParsed: unknown;
      try { bodyParsed = JSON.parse(bodyRaw); } catch { bodyParsed = bodyRaw; }

      setXray({
        statusLine: {
          method: "GET",
          url,
          status: res.status,
          statusText: res.statusText,
          protocol: "HTTP/2",
        },
        headers,
        bodyRaw,
        bodyParsed,
        size: bodyRaw.length,
        timing,
      });
    } catch {
      setXray(null);
    }
    setLoading(false);
  }

  const layers = xray ? [
    {
      id: "status",
      label: t("statusLine"),
      color: "border-accent-indigo/30 bg-accent-indigo/5",
      labelColor: "text-accent-indigo",
      content: (
        <div className="font-mono text-sm space-y-1">
          <div><span className="text-accent-blue font-bold">{xray.statusLine.method}</span> {xray.statusLine.url}</div>
          <div><span className="text-muted">Protocol:</span> {xray.statusLine.protocol}</div>
          <div><span className="text-muted">Status:</span> <span className={xray.statusLine.status < 400 ? "text-accent-emerald" : "text-red-400"}>{xray.statusLine.status} {xray.statusLine.statusText}</span></div>
        </div>
      ),
    },
    {
      id: "headers",
      label: t("headers"),
      color: "border-accent-amber/30 bg-accent-amber/5",
      labelColor: "text-accent-amber",
      content: (
        <div className="space-y-1.5">
          {Object.entries(xray.headers).map(([k, v]) => (
            <div key={k} className="flex items-start gap-2 text-xs font-mono">
              <span className="text-accent-amber font-semibold flex-shrink-0">{k}:</span>
              <span className="text-foreground/70 break-all">{v}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "body",
      label: `${t("body")} (${xray.size > 1024 ? `${(xray.size / 1024).toFixed(1)}KB` : `${xray.size}B`})`,
      color: "border-accent-emerald/30 bg-accent-emerald/5",
      labelColor: "text-accent-emerald",
      content: (
        <pre className="text-xs font-mono text-foreground/70 whitespace-pre-wrap break-words max-h-[200px] overflow-auto">
          {xray.bodyRaw.slice(0, 2000)}
          {xray.bodyRaw.length > 2000 && "\n... (truncated)"}
        </pre>
      ),
    },
    {
      id: "parsed",
      label: t("parsed"),
      color: "border-accent-blue/30 bg-accent-blue/5",
      labelColor: "text-accent-blue",
      content: (
        <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words max-h-[200px] overflow-auto">
          {JSON.stringify(xray.bodyParsed, null, 2).slice(0, 2000)}
        </pre>
      ),
    },
  ] : [];

  return (
    <section id="xray" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-indigo tracking-widest uppercase">
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-indigo flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-accent-indigo/20 bg-accent-indigo/5 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t("glossaryTitle")}</h3>
          <div className="space-y-3">
            {([1, 2, 3, 4] as const).map((n) => (
              <p key={n} className="text-sm text-muted leading-relaxed">
                {t(`glossary${n}` as `glossary1`)}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          {ENDPOINTS.map((ep, i) => (
            <button
              key={ep.url}
              onClick={() => setSelectedEndpoint(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                i === selectedEndpoint
                  ? "border-accent-indigo/30 bg-accent-indigo/10 text-accent-indigo"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {ep.label}
            </button>
          ))}
          <button
            onClick={fireRequest}
            disabled={loading}
            className="px-5 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "..." : "X-Ray"}
          </button>
        </div>

        {!xray && !loading && (
          <div className="mt-12 rounded-xl border border-border bg-background p-12 text-center">
            <p className="text-sm text-muted">{t("clickToReveal")}</p>
          </div>
        )}

        {xray && (
          <div className="mt-8 space-y-3">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border overflow-hidden ${layer.color}`}
                style={{ marginLeft: `${i * 16}px` }}
              >
                <button
                  onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                  className="w-full flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${layer.labelColor}`}>
                      {t("layer")} {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{layer.label}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-muted transition-transform ${expandedLayer === layer.id ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedLayer === layer.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">{layer.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
