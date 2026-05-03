"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LatencyRace } from "@/components/race/LatencyRace";
import { ChaosPlayground } from "@/components/chaos/ChaosPlayground";
import { TimeTravel } from "@/components/debugger/TimeTravel";
import { HeartbeatMonitor } from "@/components/heartbeat/HeartbeatMonitor";
import { ReverseEngineer } from "@/components/reverse/ReverseEngineer";
import { PacketXray } from "@/components/xray/PacketXray";
import { DataMashup } from "@/components/mashup/DataMashup";
import { WhatIfSandbox } from "@/components/whatif/WhatIfSandbox";
import { ContractDesigner } from "@/components/contract/ContractDesigner";

export default function AdvancedPage() {
  const t = useTranslations("advanced");
  const pathname = usePathname();
  const locale = pathname.startsWith("/es") ? "es" : "en";

  useEffect(() => {
    document.title = locale === "es"
      ? "Labs Avanzados | APIs Under the Hood"
      : "Advanced Labs | APIs Under the Hood";
  }, [locale]);

  return (
    <>
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-6"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {t("back")}
            </a>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-indigo">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {t("title")}
                </h1>
                <p className="text-sm text-muted">{t("subtitle")}</p>
              </div>
            </div>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-4xl">
              {t("intro")}
            </p>
          </motion.div>
        </div>
      </section>

      <LatencyRace />
      <ChaosPlayground />
      <TimeTravel />
      <HeartbeatMonitor />
      <ReverseEngineer />
      <PacketXray />
      <DataMashup />
      <WhatIfSandbox />
      <ContractDesigner />
    </>
  );
}
