"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useCallHistory, type CallRecord } from "@/hooks/useCallHistory";
import { Differ, Viewer } from "json-diff-kit";
import "json-diff-kit/dist/viewer.css";

const differ = new Differ({ detectCircular: false, arrayDiffMethod: "lcs" });

export function TimeTravel() {
  const t = useTranslations("debugger");
  const { records, selectedId, compareId, select, setCompare, hydrate } = useCallHistory();

  useEffect(() => { hydrate(); }, [hydrate]);

  const selected = records.find((r) => r.id === selectedId) || null;
  const compared = records.find((r) => r.id === compareId) || null;
  const isComparing = selected && compared;

  return (
    <section id="debugger" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-indigo tracking-widest uppercase">
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-indigo flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="mt-16 rounded-xl border border-border bg-surface p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-indigo">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-sm text-muted">{t("emptyState")}</p>
          </div>
        ) : (
          <>
            <div className="mt-4 text-sm text-muted">
              {records.length} {t("callsRecorded")}
            </div>

            {/* Timeline strip */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {records.map((record) => {
                const isSelected = record.id === selectedId;
                const isCompared = record.id === compareId;
                return (
                  <button
                    key={record.id}
                    onClick={() => {
                      if (selectedId && selectedId !== record.id && !compareId) {
                        setCompare(record.id);
                      } else {
                        select(record.id);
                      }
                    }}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-foreground/30 bg-surface-elevated"
                        : isCompared
                          ? "border-accent-indigo/50 bg-accent-indigo/10"
                          : "border-border/50 bg-surface hover:border-border"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: record.color }}
                    />
                    <span className="text-[10px] font-mono text-muted">
                      {record.apiName}
                    </span>
                    <span className="text-[9px] text-muted/60">
                      {record.latency}ms
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail / Diff panel */}
            <AnimatePresence mode="wait">
              {isComparing ? (
                <motion.div
                  key="diff"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-xl border border-border bg-surface overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-indigo">
                      {t("diffView")}
                    </span>
                    <button
                      onClick={() => setCompare(null)}
                      className="text-xs text-muted hover:text-foreground"
                    >
                      Close diff
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border text-xs">
                    <div className="bg-surface p-3">
                      <CallSummary record={selected} />
                    </div>
                    <div className="bg-surface p-3">
                      <CallSummary record={compared} />
                    </div>
                  </div>
                  <div className="p-4 overflow-auto max-h-[400px] [&_.json-diff-viewer]:!bg-transparent [&_.json-diff-viewer_td]:!border-border/30 [&_.json-diff-viewer_td]:!text-foreground/80 [&_.json-diff-viewer]:!text-xs">
                    <DiffPanel left={selected.responseBody} right={compared.responseBody} />
                  </div>
                </motion.div>
              ) : selected ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-xl border border-border bg-surface p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <CallSummary record={selected} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          select(selected.id);
                          setCompare(null);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                      >
                        {t("compare")}
                      </button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-2">{t("request")}</div>
                      <div className="rounded-lg bg-background border border-border p-3">
                        <div className="text-xs font-mono">
                          <span className="text-accent-blue font-bold">GET</span>{" "}
                          <span className="text-foreground/80 break-all">{selected.url}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-2">{t("response")}</div>
                      <div className="rounded-lg bg-background border border-border p-3 max-h-[300px] overflow-auto">
                        <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words">
                          {JSON.stringify(selected.responseBody, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}

function CallSummary({ record }: { record: CallRecord }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: record.color }} />
      <div>
        <div className="text-sm font-medium text-foreground">{record.apiName}</div>
        <div className="text-[11px] text-muted font-mono">
          {record.status} | {record.latency}ms | {record.responseSize > 1024 ? `${(record.responseSize / 1024).toFixed(1)}KB` : `${record.responseSize}B`}
        </div>
      </div>
    </div>
  );
}

function DiffPanel({ left, right }: { left: unknown; right: unknown }) {
  try {
    const diff = differ.diff(left, right);
    return <Viewer diff={diff} indent={2} lineNumbers />;
  } catch {
    return (
      <div className="text-xs text-muted">Unable to compute diff</div>
    );
  }
}
