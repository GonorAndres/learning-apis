"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { API_REGISTRY } from "@/lib/api-registry";
import { useApiCall } from "@/hooks/useApiCall";

const ENUM_LABELS: Record<string, string> = {
  d: "Daily",
  w: "Weekly",
  m: "Monthly",
  q: "Quarterly",
  a: "Annual",
  single: "Single age",
  table: "Full table",
};

const colorMap: Record<string, { tab: string; active: string; border: string }> = {
  blue: {
    tab: "text-accent-blue",
    active: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
    border: "border-accent-blue/20",
  },
  emerald: {
    tab: "text-accent-emerald",
    active: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30",
    border: "border-accent-emerald/20",
  },
  amber: {
    tab: "text-accent-amber",
    active: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
    border: "border-accent-amber/20",
  },
  indigo: {
    tab: "text-accent-indigo",
    active: "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/30",
    border: "border-accent-indigo/20",
  },
};

export function ApiPlayground() {
  const t = useTranslations("tryIt");
  const [selectedApi, setSelectedApi] = useState(0);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [responseTab, setResponseTab] = useState<"raw" | "formatted">("formatted");
  const { status, data, error, latency, execute } = useApiCall();

  const api = API_REGISTRY[selectedApi];
  const endpoint = api.endpoints[0];
  const colors = colorMap[api.color];

  const builtUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (api.id === "fred") {
      params.set("path", endpoint.path);
    }
    endpoint.params.forEach((p) => {
      const val = paramValues[p.name] || p.default;
      if (val) params.set(p.name, val);
    });
    return `${api.proxyPath}?${params.toString()}`;
  }, [api, endpoint, paramValues]);

  function handleSend() {
    execute(builtUrl);
  }

  function handleApiChange(index: number) {
    setSelectedApi(index);
    setParamValues({});
  }

  return (
    <div className="space-y-6">
      {/* API selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {API_REGISTRY.map((a, i) => {
          const c = colorMap[a.color];
          const isActive = i === selectedApi;
          return (
            <button
              key={a.id}
              onClick={() => handleApiChange(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isActive
                  ? c.active
                  : "border-border text-muted hover:text-foreground hover:border-border"
              }`}
            >
              <span className="font-semibold">{a.name}</span>
              <span className="hidden sm:inline text-xs opacity-70 ml-2">
                {a.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick fill presets */}
      {api.quickFills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            {t("quickFill")}
          </span>
          {api.quickFills.map((qf) => (
            <button
              key={qf.label}
              onClick={() => setParamValues(qf.values)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:border-current ${colors.border} ${colors.tab}`}
              title={qf.description}
            >
              {qf.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: params + request preview */}
        <div className="space-y-4">
          {/* Parameters */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
              {t("parameters")}
            </h4>
            <div className="space-y-3">
              {endpoint.params.map((param) => (
                <div key={param.name}>
                  <label className="flex items-center gap-1.5 text-xs text-muted mb-1">
                    <span className="font-mono font-medium text-foreground">
                      {param.name}
                    </span>
                    {param.required && (
                      <span className="text-red-400 text-[10px]">required</span>
                    )}
                  </label>
                  {param.type === "enum" && param.values ? (
                    <select
                      value={paramValues[param.name] || param.default || ""}
                      onChange={(e) =>
                        setParamValues((prev) => ({
                          ...prev,
                          [param.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-muted"
                    >
                      {param.values.map((v) => (
                        <option key={v} value={v}>
                          {ENUM_LABELS[v] || v}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={param.default || param.description}
                      value={paramValues[param.name] || ""}
                      onChange={(e) =>
                        setParamValues((prev) => ({
                          ...prev,
                          [param.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:border-muted"
                    />
                  )}
                  <p className="mt-1 text-[11px] text-muted/60">{param.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSend}
              disabled={status === "loading"}
              className={`mt-5 w-full py-2.5 text-sm font-medium rounded-lg transition-opacity ${
                status === "loading"
                  ? "bg-muted/20 text-muted cursor-wait"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {status === "loading" ? t("sending") : t("send")}
            </button>
          </div>

          {/* Request preview */}
          <div className={`rounded-xl border ${colors.border} bg-surface overflow-hidden`}>
            <div className="px-4 py-2.5 border-b border-border/50 text-xs font-semibold uppercase tracking-wider text-muted">
              {t("requestPreview")}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-mono font-bold ${colors.tab}`}>GET</span>
                <span className="font-mono text-xs text-foreground/80 break-all">
                  {decodeURIComponent(builtUrl)}
                </span>
              </div>
              {api.baseUrl.startsWith("http") && (
                <div className="text-[11px] text-muted/60">
                  Real endpoint: <span className="font-mono text-muted/80">{api.baseUrl}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: response */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t("response")}
              </span>
              {latency !== null && (
                <span className="text-[11px] font-mono text-muted/60">
                  {t("responseTime")}: {latency}ms
                </span>
              )}
            </div>
            {data && (
              <div className="flex gap-1">
                {(["formatted", "raw"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setResponseTab(tab)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      responseTab === tab
                        ? "bg-surface-elevated text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {tab === "raw" ? t("rawJson") : t("formatted")}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[300px] p-4 overflow-auto">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent-emerald/10 flex items-center justify-center mx-auto mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-emerald">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <p className="text-xs text-muted">{t("noResponse")}</p>
                  </div>
                </motion.div>
              )}

              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {status === "success" && data && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {responseTab === "raw" ? (
                    <pre className="text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  ) : (
                    <FormattedResponse apiId={api.id} data={data} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormattedResponse({ apiId, data }: { apiId: string; data: unknown }) {
  if (apiId === "fred") {
    return <FredFormatted data={data} />;
  }
  if (apiId === "banxico") {
    return <BanxicoFormatted data={data} />;
  }
  if (apiId === "worldbank") {
    return <WorldBankFormatted data={data} />;
  }
  if (apiId === "custom") {
    return <CustomFormatted data={data} />;
  }
  return (
    <pre className="text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function FredFormatted({ data }: { data: unknown }) {
  const d = data as { observations?: { date: string; value: string }[] };
  const obs = d.observations;
  if (!obs || !Array.isArray(obs)) {
    return <FallbackJson data={data} />;
  }

  const recent = obs.slice(-20);
  return (
    <div>
      <div className="text-xs text-muted mb-3">
        {obs.length} observations (showing last {recent.length})
      </div>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="pb-2 pr-4">Date</th>
            <th className="pb-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((o, i) => (
            <tr key={i} className="border-b border-border/30">
              <td className="py-1.5 pr-4 text-foreground/70">{o.date}</td>
              <td className="py-1.5 text-foreground font-medium">{o.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BanxicoFormatted({ data }: { data: unknown }) {
  const d = data as { bmx?: { series?: { datos?: { fecha: string; dato: string }[] }[] } };
  const datos = d.bmx?.series?.[0]?.datos;
  if (!datos || !Array.isArray(datos)) {
    return <FallbackJson data={data} />;
  }

  const recent = datos.slice(-20);
  return (
    <div>
      <div className="text-xs text-muted mb-3">
        {datos.length} data points (showing last {recent.length})
      </div>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="pb-2 pr-4">Fecha</th>
            <th className="pb-2">Dato</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((o, i) => (
            <tr key={i} className="border-b border-border/30">
              <td className="py-1.5 pr-4 text-foreground/70">{o.fecha}</td>
              <td className="py-1.5 text-foreground font-medium">{o.dato}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorldBankFormatted({ data }: { data: unknown }) {
  const arr = data as unknown[];
  if (!Array.isArray(arr) || arr.length < 2) {
    return <FallbackJson data={data} />;
  }

  const records = arr[1] as { date: string; value: number | null; country?: { value: string } }[];
  if (!Array.isArray(records)) {
    return <FallbackJson data={data} />;
  }

  const valid = records.filter((r) => r.value !== null).reverse();
  return (
    <div>
      <div className="text-xs text-muted mb-3">
        {valid.length} data points
        {valid[0]?.country?.value && ` | ${valid[0].country.value}`}
      </div>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="pb-2 pr-4">Year</th>
            <th className="pb-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {valid.map((r, i) => (
            <tr key={i} className="border-b border-border/30">
              <td className="py-1.5 pr-4 text-foreground/70">{r.date}</td>
              <td className="py-1.5 text-foreground font-medium">
                {r.value?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomFormatted({ data }: { data: unknown }) {
  const d = data as {
    age?: number;
    qx?: number;
    lx?: number;
    ex?: number;
    source?: string;
    description?: string;
    table?: { age: number; qx: number; lx: number; ex: number }[];
    error?: string;
    usage?: { single: string; table: string; description: string };
  };

  if (d.error && d.usage) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-4">
          <div className="text-xs font-semibold text-accent-amber uppercase tracking-wider mb-2">API Usage</div>
          <div className="space-y-2 text-xs text-foreground/80">
            <p>{d.usage.description}</p>
            <div className="font-mono bg-background/50 rounded p-2 space-y-1">
              <div><span className="text-accent-blue">GET</span> {d.usage.single}</div>
              <div><span className="text-accent-blue">GET</span> {d.usage.table}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (d.table) {
    return (
      <div>
        <div className="text-xs text-muted mb-1">{d.source}</div>
        <div className="text-xs text-muted mb-3">{d.description}</div>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pb-2 pr-3">Age</th>
              <th className="pb-2 pr-3">qx</th>
              <th className="pb-2 pr-3">lx</th>
              <th className="pb-2">ex</th>
            </tr>
          </thead>
          <tbody>
            {d.table.map((row) => (
              <tr key={row.age} className="border-b border-border/30">
                <td className="py-1.5 pr-3 text-foreground font-medium">{row.age}</td>
                <td className="py-1.5 pr-3 text-foreground/70">{row.qx.toFixed(5)}</td>
                <td className="py-1.5 pr-3 text-foreground/70">{row.lx.toLocaleString()}</td>
                <td className="py-1.5 text-foreground/70">{row.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (d.age !== undefined) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-muted">{d.source}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface-elevated p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider">Age</div>
            <div className="mt-1 text-2xl font-bold text-accent-indigo">{d.age}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider">Mortality Rate (qx)</div>
            <div className="mt-1 text-2xl font-bold text-accent-indigo">{d.qx?.toFixed(5)}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider">Survivors (lx)</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{d.lx?.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider">Life Expectancy (ex)</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{d.ex} yr</div>
          </div>
        </div>
        <div className="text-[11px] text-muted">{d.description}</div>
      </div>
    );
  }

  return <FallbackJson data={data} />;
}

function FallbackJson({ data }: { data: unknown }) {
  return (
    <pre className="text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
