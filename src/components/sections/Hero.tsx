"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useTheme } from "@/components/layout/ThemeProvider";

export function Hero() {
  const t = useTranslations("hero");
  const { theme } = useTheme();

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center justify-center px-4"
    >
      {theme === "light" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-indigo/5 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
        </motion.div>

        <motion.p
          className="mt-4 text-xl sm:text-2xl text-muted font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.p
          className="mt-6 text-base text-muted/80 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
        >
          <a
            href="#what-is-api"
            className="inline-flex items-center gap-2 mt-10 px-6 py-3 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            {t("cta")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </motion.div>

      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-muted/50" />
        </div>
      </motion.div>
    </section>
  );
}
