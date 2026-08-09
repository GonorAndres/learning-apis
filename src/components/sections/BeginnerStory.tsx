"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

const USE_CASES = ["marketing", "hr", "accounting", "finance"] as const;
const USE_CASE_IMAGES = {
  marketing: "/images/api-story/use-marketing.jpg",
  hr: "/images/api-story/use-hr.jpg",
  accounting: "/images/api-story/use-accounting.jpg",
  finance: "/images/api-story/use-finance.jpg",
};

export function BeginnerStory() {
  const t = useTranslations("beginnerStory");

  return (
    <section id="start-here" className="scroll-mt-14 bg-surface px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-blue">
                {t("badge")}
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("title")}
              </h2>
            </div>
            <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>{t("story1")}</p>
              <p>{t("story2")}</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <figure className="mt-12 overflow-hidden rounded-xl border border-border bg-background">
            <Image
              src="/images/api-story/manual-to-api.jpg"
              alt={t("comparisonAlt")}
              width={2752}
              height={1536}
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="h-auto w-full"
            />
            <figcaption className="grid border-t border-border sm:grid-cols-2">
              <div className="p-4 sm:p-5">
                <div className="text-sm font-semibold text-foreground">{t("manualTitle")}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t("manualText")}</p>
              </div>
              <div className="border-t border-border p-4 sm:border-l sm:border-t-0 sm:p-5">
                <div className="text-sm font-semibold text-foreground">{t("connectedTitle")}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t("connectedText")}</p>
              </div>
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <blockquote className="my-16 max-w-5xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            {t("definition")}
            <footer className="mt-5 text-sm font-normal leading-relaxed tracking-normal text-muted sm:text-base">
              {t("formalBridge")}
            </footer>
          </blockquote>
        </ScrollReveal>

        <div className="grid gap-12 border-y border-border py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <div>
              <h3 className="text-2xl font-semibold text-foreground">{t("valueTitle")}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{t("valueIntro")}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {([1, 2, 3, 4, 5] as const).map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-emerald" />
                  {t(`value${item}` as "value1")}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mt-16 max-w-2xl">
            <h3 className="text-2xl font-semibold text-foreground">{t("usesTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("usesIntro")}</p>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {USE_CASES.map((useCase, index) => (
            <ScrollReveal
              key={useCase}
              delay={index * 0.05}
              className={index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"}
            >
              <article className="grid h-full overflow-hidden rounded-xl border border-border bg-background sm:grid-cols-[160px_1fr]">
                <Image
                  src={USE_CASE_IMAGES[useCase]}
                  alt=""
                  width={1024}
                  height={1024}
                  sizes="(max-width: 639px) 100vw, 160px"
                  className="aspect-[16/9] h-full w-full object-cover sm:aspect-auto"
                />
                <div className="p-5">
                  <h4 className="text-sm font-semibold text-foreground">{t(`${useCase}Title`)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(`${useCase}Text`)}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="border-t-2 border-accent-emerald pt-5">
              <h3 className="text-xl font-semibold text-foreground">{t("fitTitle")}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                {([1, 2, 3] as const).map((item) => <li key={item}>{t(`fit${item}` as "fit1")}</li>)}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.06}>
            <div className="border-t-2 border-accent-amber pt-5">
              <h3 className="text-xl font-semibold text-foreground">{t("limitsTitle")}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                {([1, 2, 3, 4] as const).map((item) => <li key={item}>{t(`limit${item}` as "limit1")}</li>)}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mt-16 grid gap-8 rounded-xl bg-foreground p-6 text-background sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="text-2xl font-semibold">{t("teamTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-70">{t("teamText")}</p>
              <p className="mt-5 text-sm leading-relaxed opacity-70">{t("llmText")}</p>
            </div>
            <div>
              <div className="text-sm font-semibold">{t("questionsTitle")}</div>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed opacity-85">
                {([1, 2, 3, 4, 5] as const).map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-mono opacity-50">{item}.</span>
                    {t(`question${item}` as "question1")}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
