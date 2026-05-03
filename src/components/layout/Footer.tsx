"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border/50 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span className="font-medium text-foreground">{t("author")}</span>
          <span className="hidden sm:inline">|</span>
          <span>{t("description")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{t("source")}</span>
        </div>
      </div>
    </footer>
  );
}
