"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useScrollSection } from "@/hooks/useScrollSection";

const mainLinks = [
  { id: "what-is-api", key: "concept", color: "text-accent-blue" },
  { id: "try-it", key: "playground", color: "text-accent-emerald" },
  { id: "why-care", key: "analysis", color: "text-accent-amber" },
  { id: "build-own", key: "build", color: "text-accent-indigo" },
];

const advancedLinks = [
  { id: "race", key: "labRace", color: "text-accent-blue" },
  { id: "chaos", key: "labChaos", color: "text-red-400" },
  { id: "debugger", key: "labDebug", color: "text-accent-indigo" },
  { id: "heartbeat", key: "labHealth", color: "text-accent-emerald" },
  { id: "reverse", key: "labReverse", color: "text-accent-amber" },
  { id: "xray", key: "labXray", color: "text-accent-indigo" },
  { id: "mashup", key: "labMashup", color: "text-accent-emerald" },
  { id: "whatif", key: "labWhatif", color: "text-accent-amber" },
  { id: "contract", key: "labContract", color: "text-accent-blue" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const { theme, toggle } = useTheme();
  const active = useScrollSection();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLocale = pathname.startsWith("/es") ? "es" : "en";
  const isAdvanced = pathname.includes("/advanced");
  const navLinks = isAdvanced ? advancedLinks : mainLinks;

  function switchLocale() {
    const targetLocale = currentLocale === "en" ? "es" : "en";
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
    router.push(newPath);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
        <a
          href={`/${currentLocale}`}
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          APIs
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const label = t(link.key as "concept");
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  active === link.id
                    ? `${link.color} font-medium bg-surface-elevated`
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={switchLocale}
            className="px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground rounded-md border border-border/50 hover:border-border transition-colors"
          >
            {t("switchLocale")}
          </button>
          <button
            onClick={toggle}
            className="p-2 text-muted hover:text-foreground rounded-md border border-border/50 hover:border-border transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground rounded-md border border-border/50 hover:border-border transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
        <div className="md:hidden fixed inset-0 top-14 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
        <div className="md:hidden relative z-50 border-t border-border/50 bg-background backdrop-blur-xl">
          <div className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => {
              const label = t(link.key as "concept");
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded-md transition-colors ${
                    active === link.id
                      ? `${link.color} font-medium bg-surface-elevated`
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
        </>
      )}
    </nav>
  );
}
