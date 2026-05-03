"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CHAOS_CATALOG, type ChaosChallenge } from "@/lib/chaos-catalog";

const STORAGE_KEY = "chaos-unlocked";

function loadUnlocked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveUnlocked(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function ChaosPlayground() {
  const t = useTranslations("chaos");
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<ChaosChallenge | null>(null);
  const [result, setResult] = useState<{ status: number | string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(loadUnlocked());
  }, []);

  const attemptChallenge = useCallback(async (challenge: ChaosChallenge) => {
    setLoading(true);
    setResult(null);

    try {
      if (challenge.method === "RAPID") {
        const promises = Array.from({ length: 8 }, () =>
          fetch(challenge.url).then(async (r) => ({ status: r.status, body: await r.text() }))
        );
        const results = await Promise.all(promises);
        const failed = results.find((r) => r.status === 429);
        if (failed) {
          setResult({ status: 429, body: failed.body });
          unlock(challenge.code);
        } else {
          setResult({ status: results[results.length - 1].status, body: results[results.length - 1].body });
        }
      } else if (challenge.method === "TIMEOUT") {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000);
        try {
          const res = await fetch(challenge.url, { signal: controller.signal });
          clearTimeout(timeout);
          setResult({ status: res.status, body: await res.text() });
        } catch {
          clearTimeout(timeout);
          setResult({ status: "TIMEOUT", body: "AbortError: The request was aborted because it exceeded the timeout." });
          unlock(challenge.code);
        }
      } else if (challenge.method === "CORS") {
        try {
          const res = await fetch(challenge.url);
          setResult({ status: res.status, body: await res.text() });
        } catch {
          setResult({ status: "CORS", body: "TypeError: Failed to fetch. The browser blocked this request because the server did not include CORS headers." });
          unlock(challenge.code);
        }
      } else if (challenge.method === "POST") {
        const res = await fetch(challenge.url, { method: "POST" });
        const body = await res.text();
        setResult({ status: res.status, body });
        if (res.status === 405) unlock(challenge.code);
      } else {
        const res = await fetch(challenge.url);
        const body = await res.text();
        setResult({ status: res.status, body });
        if (res.status >= 400) unlock(challenge.code);
      }
    } catch (err) {
      setResult({ status: "ERROR", body: String(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  function unlock(code: string) {
    setUnlocked((prev) => {
      const next = new Set(prev);
      if (!next.has(code)) {
        next.add(code);
        saveUnlocked(next);
        setJustUnlocked(code);
        setTimeout(() => setJustUnlocked(null), 2000);
      }
      return next;
    });
  }

  const isError = result && (typeof result.status === "string" || (typeof result.status === "number" && result.status >= 400));

  return (
    <section id="chaos" className="py-16 sm:py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-red-400 tracking-widest uppercase">
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-sm font-medium text-foreground">
          {unlocked.size}/{CHAOS_CATALOG.length} {t("collected")}
        </div>
        <div className="mt-1 w-full max-w-xs h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-emerald transition-all duration-500"
            style={{ width: `${(unlocked.size / CHAOS_CATALOG.length) * 100}%` }}
          />
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CHAOS_CATALOG.map((ch) => {
            const isUnlocked = unlocked.has(ch.code);
            const isJust = justUnlocked === ch.code;
            const isSelected = selected?.code === ch.code;

            return (
              <motion.button
                key={ch.code}
                onClick={() => { setSelected(ch); setResult(null); }}
                className={`relative p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-foreground/30 bg-surface-elevated ring-1 ring-foreground/20"
                    : isUnlocked
                      ? "border-border bg-surface-elevated hover:border-foreground/20"
                      : "border-border/50 bg-background opacity-60 hover:opacity-80"
                } ${isJust ? "ring-2 ring-accent-emerald" : ""}`}
                animate={isJust ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className={`text-lg font-bold font-mono ${isUnlocked ? "" : "text-muted/40"}`} style={isUnlocked ? { color: ch.color } : {}}>
                  {ch.code}
                </div>
                <div className={`text-[10px] mt-1 ${isUnlocked ? "text-foreground/70" : "text-muted/30"}`}>
                  {ch.name}
                </div>
                {isUnlocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-emerald flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 rounded-xl border border-border bg-background p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-muted uppercase tracking-wider">{t("challenge")}</span>
                  <h3 className="text-lg font-bold text-foreground">
                    {selected.code} {selected.name}
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-surface-elevated text-muted">
                  {"*".repeat(selected.difficulty)}
                </span>
              </div>

              <div className="rounded-lg bg-surface-elevated border border-border p-4 mb-4">
                <div className="text-xs text-muted uppercase tracking-wider mb-1">{t("hint")}</div>
                <p className="text-sm text-foreground/80">{selected.hint}</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <code className="flex-1 text-xs font-mono text-muted bg-background rounded-lg px-3 py-2 border border-border overflow-x-auto">
                  {selected.method === "RAPID" ? "GET" : selected.method === "TIMEOUT" ? "GET" : selected.method === "CORS" ? "GET" : selected.method}{" "}
                  {selected.url}
                </code>
                <button
                  onClick={() => attemptChallenge(selected)}
                  disabled={loading}
                  className={`px-5 py-2 text-sm font-medium rounded-lg flex-shrink-0 transition-opacity ${
                    loading ? "bg-muted/20 text-muted" : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {loading ? "..." : t("tryIt")}
                </button>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-4 ${
                    isError
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-accent-emerald/20 bg-accent-emerald/5"
                  }`}
                >
                  <div className={`text-xs font-mono font-bold mb-2 ${isError ? "text-red-400" : "text-accent-emerald"}`}>
                    Status: {result.status}
                  </div>
                  <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words max-h-40 overflow-auto">
                    {(() => {
                      try { return JSON.stringify(JSON.parse(result.body), null, 2); }
                      catch { return result.body; }
                    })()}
                  </pre>
                </motion.div>
              )}

              {unlocked.has(selected.code) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 grid sm:grid-cols-2 gap-4"
                >
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">{t("cause")}</div>
                    <p className="text-sm text-foreground/80">{selected.cause}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">{t("fix")}</div>
                    <p className="text-sm text-foreground/80">{selected.fix}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
