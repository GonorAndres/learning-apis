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
  Legend,
} from "recharts";

type DataPoint = { year: string; mexico: number | null; usa: number | null };

export function MortalityCurve() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/proxy/worldbank?country=MEX&indicator=SP.DYN.LE00.IN&date=1990:2023").then((r) => r.json()),
      fetch("/api/proxy/worldbank?country=USA&indicator=SP.DYN.LE00.IN&date=1990:2023").then((r) => r.json()),
    ])
      .then(([mexData, usaData]) => {
        const mexRecords = (mexData[1] || []) as { date: string; value: number | null }[];
        const usaRecords = (usaData[1] || []) as { date: string; value: number | null }[];

        const usaMap = new Map(usaRecords.map((r) => [r.date, r.value]));

        const points = mexRecords
          .filter((r) => r.value !== null)
          .map((r) => ({
            year: r.date,
            mexico: r.value ? parseFloat(r.value.toFixed(1)) : null,
            usa: usaMap.get(r.date) ? parseFloat(usaMap.get(r.date)!.toFixed(1)) : null,
          }))
          .reverse();

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
          dataKey="year"
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          interval={Math.floor(data.length / 4)}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(val: number, name: string) => [
            `${val} years`,
            name === "mexico" ? "Mexico" : "USA",
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--muted)" }}
          formatter={(value) => (value === "mexico" ? "Mexico" : "USA")}
        />
        <Line type="monotone" dataKey="mexico" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="usa" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-muted/50 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return <div className="h-[280px] flex items-center justify-center text-xs text-muted">No data available</div>;
}
