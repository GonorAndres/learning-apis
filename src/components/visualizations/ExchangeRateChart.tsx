"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = { fecha: string; value: number };

export function ExchangeRateChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/banxico?series=SF43718&startDate=2020-01-01&endDate=2024-12-31")
      .then((r) => r.json())
      .then((d) => {
        const datos = d.bmx?.series?.[0]?.datos || [];
        const sampled = datos.filter((_: unknown, i: number) => i % 5 === 0 || i === datos.length - 1);
        const points = sampled.map((o: { fecha: string; dato: string }) => ({
          fecha: o.fecha,
          value: parseFloat(o.dato),
        }));
        setData(points);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartSkeleton />;
  if (data.length === 0) return <ChartEmpty />;

  const minVal = Math.floor(Math.min(...data.map((d) => d.value)) - 1);
  const maxVal = Math.ceil(Math.max(...data.map((d) => d.value)) + 1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          interval={Math.floor(data.length / 3)}
        />
        <YAxis
          domain={[minVal, maxVal]}
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={false}
          unit=" MXN"
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(val: number) => [`$${val.toFixed(4)} MXN`, "USD/MXN"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#emeraldGrad)"
          activeDot={{ r: 4, fill: "#10b981" }}
        />
      </AreaChart>
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
