"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type Param = { name: string; type: string; required: boolean; example: string };

type Contract = {
  method: string;
  path: string;
  description: string;
  params: Param[];
  responseTemplate: string;
};

const DEFAULT_CONTRACT: Contract = {
  method: "GET",
  path: "/api/mock/risk-score",
  description: "Calculate a risk score based on age and coverage amount",
  params: [
    { name: "age", type: "number", required: true, example: "45" },
    { name: "coverage", type: "number", required: false, example: "500000" },
  ],
  responseTemplate: '{\n  "age": {{age}},\n  "coverage": {{coverage}},\n  "riskScore": 0.73,\n  "category": "moderate"\n}',
};

export function ContractDesigner() {
  const t = useTranslations("contract");
  const [contract, setContract] = useState<Contract>(DEFAULT_CONTRACT);
  const [testResult, setTestResult] = useState<{ status: number; body: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [registered, setRegistered] = useState(false);

  function addParam() {
    setContract((c) => ({
      ...c,
      params: [...c.params, { name: "", type: "string", required: false, example: "" }],
    }));
  }

  function updateParam(i: number, field: keyof Param, value: string | boolean) {
    setContract((c) => {
      const params = [...c.params];
      params[i] = { ...params[i], [field]: value };
      return { ...c, params };
    });
  }

  function removeParam(i: number) {
    setContract((c) => ({ ...c, params: c.params.filter((_, idx) => idx !== i) }));
  }

  async function registerAndTest() {
    setTesting(true);
    setTestResult(null);

    try {
      await fetch("/api/mock/_register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contract),
      });
      setRegistered(true);

      const params = new URLSearchParams();
      contract.params.forEach((p) => {
        if (p.example) params.set(p.name, p.example);
      });

      const url = `${contract.path}?${params.toString()}`;
      const res = await fetch(url);
      const body = await res.text();
      setTestResult({ status: res.status, body });
    } catch {
      setTestResult({ status: 0, body: "Failed to register or test the endpoint." });
    }
    setTesting(false);
  }

  return (
    <section id="contract" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-blue tracking-widest uppercase">
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {/* Design panel */}
          <div className="rounded-xl border border-border bg-surface p-6 space-y-5">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider">{t("method")}</label>
              <select value={contract.method} onChange={(e) => setContract((c) => ({ ...c, method: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none">
                <option>GET</option><option>POST</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider">{t("path")}</label>
              <input value={contract.path} onChange={(e) => setContract((c) => ({ ...c, path: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted uppercase tracking-wider">{t("params")}</label>
                <button onClick={addParam} className="text-xs text-accent-blue hover:text-accent-blue/80">{t("addParam")}</button>
              </div>
              <div className="mt-2 space-y-2">
                {contract.params.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={p.name} onChange={(e) => updateParam(i, "name", e.target.value)} placeholder="name"
                      className="flex-1 px-2 py-1.5 text-xs font-mono rounded border border-border bg-background text-foreground focus:outline-none" />
                    <select value={p.type} onChange={(e) => updateParam(i, "type", e.target.value)}
                      className="px-2 py-1.5 text-xs font-mono rounded border border-border bg-background text-foreground focus:outline-none">
                      <option>string</option><option>number</option><option>boolean</option>
                    </select>
                    <input value={p.example} onChange={(e) => updateParam(i, "example", e.target.value)} placeholder="example"
                      className="w-20 px-2 py-1.5 text-xs font-mono rounded border border-border bg-background text-foreground focus:outline-none" />
                    <label className="flex items-center gap-1 text-[10px] text-muted">
                      <input type="checkbox" checked={p.required} onChange={(e) => updateParam(i, "required", e.target.checked)} />
                      req
                    </label>
                    <button onClick={() => removeParam(i)} className="text-xs text-red-400 hover:text-red-300">x</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wider">{t("responseSchema")}</label>
              <textarea value={contract.responseTemplate} onChange={(e) => setContract((c) => ({ ...c, responseTemplate: e.target.value }))} rows={6}
                className="mt-1 w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none resize-none" />
              <p className="mt-1 text-[10px] text-muted">{'Use {{param_name}} to echo parameters in the response.'}</p>
            </div>

            <button onClick={registerAndTest} disabled={testing}
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40">
              {testing ? "..." : t("testEndpoint")}
            </button>
          </div>

          {/* Result panel */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="text-xs text-muted uppercase tracking-wider mb-4">
              {registered ? "Live endpoint" : "Preview"}
            </div>

            <div className="rounded-lg bg-background border border-border p-3 mb-4">
              <div className="text-xs font-mono">
                <span className="text-accent-blue font-bold">{contract.method}</span>{" "}
                <span className="text-foreground/80">{contract.path}</span>
              </div>
              <div className="mt-2 space-y-1">
                {contract.params.map((p) => (
                  <div key={p.name} className="text-[11px] font-mono text-muted">
                    <span className="text-foreground/70">{p.name}</span>
                    <span className="text-muted/50"> : {p.type}</span>
                    {p.required && <span className="text-red-400 ml-1">required</span>}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {testResult && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`rounded-lg border p-4 ${testResult.status === 200 ? "border-accent-emerald/20 bg-accent-emerald/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <div className={`text-xs font-mono font-bold mb-2 ${testResult.status === 200 ? "text-accent-emerald" : "text-red-400"}`}>
                    Status: {testResult.status}
                  </div>
                  <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words max-h-[250px] overflow-auto">
                    {(() => { try { return JSON.stringify(JSON.parse(testResult.body), null, 2); } catch { return testResult.body; } })()}
                  </pre>
                </motion.div>
              )}
              {!testResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[200px] flex items-center justify-center text-xs text-muted">
                  Design your API and click test to see the result
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
