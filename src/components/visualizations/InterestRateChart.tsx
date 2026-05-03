"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type DataPoint = { date: string; value: number };

export function InterestRateChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/fred?path=/series/observations&series_id=FEDFUNDS&observation_start=2000-01-01&frequency=q")
      .then((r) => r.json())
      .then((d) => {
        const points = (d.observations || [])
          .filter((o: { value: string }) => o.value !== ".")
          .map((o: { date: string; value: string }) => ({
            date: o.date.slice(0, 7),
            value: parseFloat(o.value),
          }));
        setData(points);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartSkeleton />;
  if (data.length === 0) return <ChartEmpty />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          interval={Math.floor(data.length / 4)}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={false}
          unit="%"
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(val: number) => [`${val.toFixed(2)}%`, "Rate"]}
        />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#3b82f6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-muted/50 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="h-[280px] flex items-center justify-center text-xs text-muted">
      No data available
    </div>
  );
}
