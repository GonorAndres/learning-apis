"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Step = "idle" | "sending" | "processing" | "responding" | "done";

const sampleRequest = {
  method: "GET",
  url: "/api/fred/series/observations",
  headers: {
    Authorization: "Bearer ****-api-key",
    Accept: "application/json",
  },
};

const sampleResponse = {
  status: "200 OK",
  body: {
    series_id: "DGS10",
    observation_date: "2024-12-01",
    value: "4.18",
    units: "Percent",
  },
};

export function RequestResponseFlow() {
  const t = useTranslations("whatIsApi");
  const [step, setStep] = useState<Step>("idle");

  const run = useCallback(async () => {
    if (step !== "idle" && step !== "done") return;
    setStep("sending");
    await delay(2400);
    setStep("processing");
    await delay(2800);
    setStep("responding");
    await delay(2400);
    setStep("done");
  }, [step]);

  const reset = useCallback(() => setStep("idle"), []);

  const stepIndex =
    step === "idle"
      ? 0
      : step === "sending"
        ? 1
        : step === "processing"
          ? 2
          : 3;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center justify-between px-4 py-8 sm:px-8 sm:py-12">
        <ClientBox label={t("clientLabel")} active={step === "sending" || step === "done"} />

        <div className="flex-1 relative mx-4 sm:mx-8 h-16 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-border" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-border" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--border) 0, var(--border) 6px, transparent 6px, transparent 12px)" }} />

          <AnimatePresence mode="wait">
            {step === "sending" && (
              <Packet key="req" direction="right" color="bg-accent-blue" />
            )}
            {step === "responding" && (
              <Packet key="res" direction="left" color="bg-accent-emerald" />
            )}
          </AnimatePresence>
        </div>

        <ServerBox label={t("serverLabel")} active={step === "processing"} />
      </div>

      <div className="flex justify-center gap-1 sm:gap-2 mb-8">
        {[t("stepRequest"), t("stepProcess"), t("stepResponse")].map(
          (label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                stepIndex > i
                  ? "bg-accent-emerald/10 text-accent-emerald"
                  : stepIndex === i && step !== "idle"
                    ? "bg-accent-blue/10 text-accent-blue"
                    : "bg-surface-elevated text-muted"
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                {stepIndex > i ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              {label}
            </div>
          )
        )}
      </div>

      <AnimatePresence mode="wait">
        {(step === "sending" || step === "done") && (
          <InfoPanel
            key="req-panel"
            side="request"
            items={[
              { label: t("methodLabel"), value: sampleRequest.method },
              { label: t("urlLabel"), value: sampleRequest.url },
              {
                label: t("headersLabel"),
                value: JSON.stringify(sampleRequest.headers, null, 2),
                mono: true,
              },
            ]}
          />
        )}
        {(step === "responding" || step === "done") && (
          <InfoPanel
            key="res-panel"
            side="response"
            items={[
              { label: t("statusLabel"), value: sampleResponse.status },
              {
                label: t("bodyLabel"),
                value: JSON.stringify(sampleResponse.body, null, 2),
                mono: true,
              },
            ]}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-8">
        {step === "idle" || step === "done" ? (
          <button
            onClick={step === "done" ? reset : run}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            {step === "done" ? t("replayButton") : t("sendButton")}
          </button>
        ) : (
          <div className="px-5 py-2.5 text-sm text-muted">
            <LoadingDots />
          </div>
        )}
      </div>
    </div>
  );
}

function ClientBox({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
        active
          ? "border-accent-blue/50 bg-accent-blue/5"
          : "border-border bg-surface"
      }`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      <span className="text-xs font-medium text-foreground whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function ServerBox({ label, active }: { label: string; active: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
        active
          ? "border-accent-emerald/50 bg-accent-emerald/5"
          : "border-border bg-surface"
      }`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
      <span className="text-xs font-medium text-foreground whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  );
}

function Packet({
  direction,
  color,
}: {
  direction: "left" | "right";
  color: string;
}) {
  const isRight = direction === "right";
  return (
    <motion.div
      className={`absolute w-3 h-3 rounded-full ${color} shadow-lg`}
      style={{ [isRight ? "left" : "right"]: 0 }}
      initial={{ x: 0, opacity: 0, scale: 0.5 }}
      animate={{
        x: isRight ? [0, 200] : [0, -200],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
}

function InfoPanel({
  side,
  items,
}: {
  side: "request" | "response";
  items: { label: string; value: string; mono?: boolean }[];
}) {
  const isReq = side === "request";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`rounded-xl border p-4 ${
        isReq
          ? "border-accent-blue/20 bg-accent-blue/5"
          : "border-accent-emerald/20 bg-accent-emerald/5"
      }`}
    >
      <div
        className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
          isReq ? "text-accent-blue" : "text-accent-emerald"
        }`}
      >
        {side}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label}>
            <span className="text-xs text-muted">{item.label}</span>
            <div
              className={`mt-0.5 text-sm text-foreground ${
                item.mono
                  ? "font-mono text-xs bg-background/50 rounded-lg p-2 whitespace-pre"
                  : "font-medium"
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LoadingDots() {
  return (
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
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
