"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="px-4 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-14 lg:gap-y-5">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          className="max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end"
        >
          <h1 className="text-5xl font-bold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          className="order-2 overflow-hidden rounded-xl border border-border bg-[#f3f1ec] lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <Image
            src="/images/api-story/hero-report.jpg"
            alt={t("imageAlt")}
            width={2400}
            height={1792}
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="h-auto w-full"
          />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.08, ease: "easeOut" }}
          className="order-3 max-w-xl lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <p className="mt-6 text-xl leading-snug text-foreground/85 sm:text-2xl">
            {t("lead")}
          </p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
            {t("bridge")}
          </p>
          <a
            href="#start-here"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
          >
            {t("cta")}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
