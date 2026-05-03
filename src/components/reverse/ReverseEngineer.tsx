"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type Challenge = {
  apiId: string;
  apiName: string;
  url: string;
  difficulty: 1 | 2 | 3;
  response: unknown;
};

const CHALLENGES: Omit<Challenge, "response">[] = [
  { apiId: "custom", apiName: "Your API", url: "/api/mortality?age=30", difficulty: 1 },
  { apiId: "custom", apiName: "Your API", url: "/api/mortality?age=70", difficulty: 1 },
  { apiId: "custom", apiName: "Your API", url: "/api/mortality?format=table", difficulty: 2 },
  { apiId: "worldbank", apiName: "World Bank", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.LE00.IN&date=2010:2020", difficulty: 2 },
  { apiId: "worldbank", apiName: "World Bank", url: "/api/proxy/worldbank?country=USA&indicator=NY.GDP.PCAP.CD&date=2015:2023", difficulty: 3 },
  { apiId: "fred", apiName: "FRED", url: "/api/proxy/fred?path=/series/observations&series_id=CPIAUCSL&observation_start=2020-01-01&frequency=a", difficulty: 3 },
];

export function ReverseEngineer() {
  const t = useTranslations("reverse");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [guessUrl, setGuessUrl] = useState("");
  const [guessResult, setGuessResult] = useState<{ match: boolean; response: unknown } | null>(null);
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(0);

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setGuessUrl("");
    setGuessResult(null);
    const pick = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    try {
      const res = await fetch(pick.url);
      const data = await res.json();
      setChallenge({ ...pick, response: data });
    } catch {
      setChallenge(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadChallenge(); }, [loadChallenge]);

  async function checkGuess() {
    if (!guessUrl.trim() || !challenge) return;
    setChecking(true);
    try {
      const url = guessUrl.startsWith("/") ? guessUrl : `/${guessUrl}`;
      const res = await fetch(url);
      const data = await res.json();
      const match = JSON.stringify(data) === JSON.stringify(challenge.response);
      setGuessResult({ match, response: data });
      if (match) setScore((s) => s + challenge.difficulty);
    } catch {
      setGuessResult({ match: false, response: { error: "Failed to fetch. Check your URL." } });
    }
    setChecking(false);
  }

  return (
    <section id="reverse" className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs font-mono font-medium text-accent-amber tracking-widest uppercase">
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
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-amber flex-shrink-0" />
                  {t(`learn${n}` as `learn1`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">{t("exampleTitle")}</h3>
          <p className="text-sm text-muted leading-relaxed">{t("exampleText")}</p>
        </div>

        {challenge && !loading && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted uppercase tracking-wider">{t("challenge")}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-muted">
                  {t("difficulty")}: {"*".repeat(challenge.difficulty)}
                </span>
              </div>
              <span className="text-xs font-mono text-muted">Score: {score}</span>
            </div>

            <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-5 mb-6">
              <p className="text-sm text-foreground/80 mb-3">{t("showResponse")}</p>
              <pre className="text-xs font-mono text-foreground/80 bg-background/50 rounded-lg p-4 max-h-[250px] overflow-auto whitespace-pre-wrap break-words">
                {JSON.stringify(challenge.response, null, 2)}
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="text-xs text-muted uppercase tracking-wider mb-2">{t("yourGuess")}</div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={guessUrl}
                  onChange={(e) => setGuessUrl(e.target.value)}
                  placeholder="/api/mortality?age=45"
                  className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-border bg-background text-foreground placeholder:text-muted/40 focus:outline-none focus:border-muted"
                  onKeyDown={(e) => e.key === "Enter" && checkGuess()}
                />
                <button
                  onClick={checkGuess}
                  disabled={checking || !guessUrl.trim()}
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {checking ? "..." : t("checkGuess")}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {guessResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 rounded-lg border p-4 ${
                      guessResult.match
                        ? "border-accent-emerald/20 bg-accent-emerald/5"
                        : "border-red-500/20 bg-red-500/5"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${guessResult.match ? "text-accent-emerald" : "text-red-400"}`}>
                      {guessResult.match ? t("correct") : t("incorrect")}
                    </div>
                    {!guessResult.match && (
                      <pre className="text-xs font-mono text-foreground/70 max-h-[150px] overflow-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(guessResult.response, null, 2)}
                      </pre>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={loadChallenge}
                className="px-5 py-2 text-sm font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                {t("newChallenge")}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 flex justify-center py-12">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
