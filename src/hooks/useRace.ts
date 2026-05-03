"use client";

import { useState, useCallback, useRef } from "react";
import { useCallHistory } from "./useCallHistory";

export type RacerResult = {
  apiId: string;
  name: string;
  color: string;
  latency: number;
  status: number;
  size: number;
  server: string;
};

type RacerState = {
  apiId: string;
  name: string;
  color: string;
  server: string;
  url: string;
  status: "waiting" | "racing" | "done";
  progress: number;
  result: RacerResult | null;
};

const RACERS = [
  { apiId: "fred", name: "FRED", color: "#3b82f6", server: "St. Louis, US", url: "/api/proxy/fred?path=/series/observations&series_id=DGS10&observation_start=2024-01-01&frequency=m" },
  { apiId: "banxico", name: "Banxico", color: "#10b981", server: "Mexico City, MX", url: "/api/proxy/banxico?series=SF43718&startDate=2024-01-01&endDate=2024-12-31" },
  { apiId: "worldbank", name: "World Bank", color: "#f59e0b", server: "Washington DC, US", url: "/api/proxy/worldbank?country=MEX&indicator=SP.DYN.CDRT.IN&date=2020:2023" },
  { apiId: "custom", name: "Your API", color: "#6366f1", server: "localhost", url: "/api/mortality?age=45" },
];

export function useRace() {
  const [racers, setRacers] = useState<RacerState[]>(
    RACERS.map((r) => ({ ...r, status: "waiting", progress: 0, result: null }))
  );
  const [raceStatus, setRaceStatus] = useState<"idle" | "racing" | "done">("idle");
  const [history, setHistory] = useState<RacerResult[][]>([]);
  const animFrames = useRef<number[]>([]);
  const addRecord = useCallHistory((s) => s.addRecord);

  const startRace = useCallback(async () => {
    setRaceStatus("racing");
    setRacers(RACERS.map((r) => ({ ...r, status: "racing", progress: 0, result: null })));

    const startTimes = RACERS.map(() => performance.now());

    // Start fake progress animations
    const progressValues = RACERS.map(() => 0);
    animFrames.current.forEach(cancelAnimationFrame);
    animFrames.current = [];

    RACERS.forEach((_, i) => {
      const animate = () => {
        const elapsed = performance.now() - startTimes[i];
        const fakeProgress = 92 * (1 - Math.exp(-elapsed / 1200));
        if (progressValues[i] < 100) {
          progressValues[i] = fakeProgress;
          setRacers((prev) => {
            const next = [...prev];
            if (next[i].status === "racing") {
              next[i] = { ...next[i], progress: fakeProgress };
            }
            return next;
          });
          animFrames.current[i] = requestAnimationFrame(animate);
        }
      };
      animFrames.current[i] = requestAnimationFrame(animate);
    });

    const results: RacerResult[] = [];

    const promises = RACERS.map(async (racer, i) => {
      try {
        const start = performance.now();
        const res = await fetch(racer.url);
        const body = await res.text();
        const latency = Math.round(performance.now() - start);

        cancelAnimationFrame(animFrames.current[i]);

        const result: RacerResult = {
          apiId: racer.apiId,
          name: racer.name,
          color: racer.color,
          latency,
          status: res.status,
          size: body.length,
          server: racer.server,
        };

        results.push(result);

        addRecord({
          apiId: racer.apiId,
          apiName: racer.name,
          color: racer.color,
          method: "GET",
          url: racer.url,
          status: res.status,
          latency,
          responseBody: JSON.parse(body),
          responseSize: body.length,
        });

        setRacers((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "done", progress: 100, result };
          return next;
        });
      } catch {
        cancelAnimationFrame(animFrames.current[i]);
        const latency = Math.round(performance.now() - startTimes[i]);
        const result: RacerResult = {
          apiId: racer.apiId,
          name: racer.name,
          color: racer.color,
          latency,
          status: 0,
          size: 0,
          server: racer.server,
        };
        results.push(result);
        setRacers((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "done", progress: 100, result };
          return next;
        });
      }
    });

    await Promise.all(promises);
    setRaceStatus("done");
    setHistory((prev) => [...prev, results.sort((a, b) => a.latency - b.latency)]);
  }, []);

  const reset = useCallback(() => {
    animFrames.current.forEach(cancelAnimationFrame);
    setRacers(RACERS.map((r) => ({ ...r, status: "waiting", progress: 0, result: null })));
    setRaceStatus("idle");
  }, []);

  return { racers, raceStatus, history, startRace, reset };
}
