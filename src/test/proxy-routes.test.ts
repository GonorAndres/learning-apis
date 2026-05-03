import { describe, it, expect, vi, beforeEach } from "vitest";
import fredSample from "@/data/samples/fred-dgs10.json";
import banxicoSample from "@/data/samples/banxico-usdmxn.json";
import worldbankSample from "@/data/samples/worldbank-mortality-mex.json";

const mockNextRequest = (params: Record<string, string>) => {
  const url = new URL("http://localhost:3000/api/proxy/test");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return { nextUrl: url } as any;
};

describe("FRED proxy route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("rejects disallowed paths to prevent SSRF", async () => {
    vi.stubEnv("FRED_API_KEY", "test-key");
    const { GET } = await import("@/app/api/proxy/fred/route");
    const res = await GET(mockNextRequest({ path: "/admin/delete" }));
    expect(res.status).toBe(400);
  });

  it("injects api_key and file_type into upstream request", async () => {
    vi.stubEnv("FRED_API_KEY", "my-real-key");
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(fredSample),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("@/app/api/proxy/fred/route");
    await GET(mockNextRequest({ series_id: "DGS10", path: "/series/observations" }));

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("api_key=my-real-key");
    expect(calledUrl).toContain("file_type=json");
    expect(calledUrl).not.toContain("path=");
  });
});

describe("Banxico proxy route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("rejects path traversal in series param", async () => {
    vi.stubEnv("BANXICO_TOKEN", "test-token");
    const { GET } = await import("@/app/api/proxy/banxico/route");
    const res = await GET(mockNextRequest({ series: "../../etc/passwd" }));
    expect(res.status).toBe(400);
  });

  it("sends Bmx-Token header and requests JSON format", async () => {
    vi.stubEnv("BANXICO_TOKEN", "bmx-token-123");
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(banxicoSample),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("@/app/api/proxy/banxico/route");
    await GET(
      mockNextRequest({ series: "SF43718", startDate: "2023-01-01", endDate: "2024-12-31" })
    );

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    const fetchOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect(calledUrl).toContain("mediaType=json");
    expect((fetchOptions.headers as Record<string, string>)["Bmx-Token"]).toBe("bmx-token-123");
  });
});

describe("World Bank proxy route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("rejects invalid country codes", async () => {
    const { GET } = await import("@/app/api/proxy/worldbank/route");
    const res = await GET(mockNextRequest({ country: "../hack", indicator: "SP.DYN.CDRT.IN" }));
    expect(res.status).toBe(400);
  });

  it("constructs correct World Bank URL with JSON format", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(worldbankSample),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("@/app/api/proxy/worldbank/route");
    await GET(
      mockNextRequest({ country: "MEX", indicator: "SP.DYN.CDRT.IN", date: "2000:2023" })
    );

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/country/MEX/indicator/SP.DYN.CDRT.IN");
    expect(calledUrl).toContain("format=json");
  });
});

describe("FRED data extraction", () => {
  it("contains observations array with date-value pairs", () => {
    expect(fredSample.observations).toBeDefined();
    expect(fredSample.observations.length).toBeGreaterThan(0);
    expect(fredSample.observations[0]).toHaveProperty("date");
    expect(fredSample.observations[0]).toHaveProperty("value");
  });

  it("values are numeric strings representing percentages", () => {
    for (const obs of fredSample.observations) {
      const val = parseFloat(obs.value);
      expect(val).not.toBeNaN();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(20);
    }
  });

  it("can extract the yield curve trend (COVID crash to rate hike)", () => {
    const obs = fredSample.observations;
    const covid2020 = obs.find((o) => o.date === "2020-04-01");
    const peak2023 = obs.find((o) => o.date === "2023-10-01");
    const latest = obs[obs.length - 1];

    expect(parseFloat(covid2020!.value)).toBeLessThan(1);
    expect(parseFloat(peak2023!.value)).toBeGreaterThan(4);
    expect(parseFloat(latest.value)).toBeGreaterThan(3);
  });

  it("can compute average yield per year", () => {
    const byYear: Record<string, number[]> = {};
    for (const obs of fredSample.observations) {
      const year = obs.date.slice(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(parseFloat(obs.value));
    }

    const avgByYear = Object.entries(byYear).map(([year, vals]) => ({
      year,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
    }));

    expect(avgByYear.length).toBeGreaterThanOrEqual(4);
    const avg2020 = avgByYear.find((y) => y.year === "2020");
    const avg2024 = avgByYear.find((y) => y.year === "2024");
    expect(avg2020!.avg).toBeLessThan(avg2024!.avg);
  });
});

describe("Banxico data extraction", () => {
  const series = banxicoSample.bmx.series[0];
  const datos = series.datos;

  it("contains series with title and datos array", () => {
    expect(series.idSerie).toBe("SF43718");
    expect(series.titulo).toContain("Tipo de cambio");
    expect(datos.length).toBeGreaterThan(0);
  });

  it("datos have fecha and dato fields", () => {
    for (const d of datos) {
      expect(d).toHaveProperty("fecha");
      expect(d).toHaveProperty("dato");
      expect(parseFloat(d.dato)).toBeGreaterThan(10);
    }
  });

  it("can detect MXN depreciation trend in 2024", () => {
    const datos2024 = datos.filter((d) => d.fecha.includes("/2024"));
    const first = parseFloat(datos2024[0].dato);
    const last = parseFloat(datos2024[datos2024.length - 1].dato);
    expect(last).toBeGreaterThan(first);
  });

  it("can find min and max exchange rate", () => {
    const values = datos.map((d) => parseFloat(d.dato));
    const min = Math.min(...values);
    const max = Math.max(...values);

    expect(min).toBeGreaterThan(15);
    expect(max).toBeLessThan(22);
    expect(max - min).toBeGreaterThan(2);
  });

  it("can compute volatility (std dev) of exchange rate", () => {
    const values = datos.map((d) => parseFloat(d.dato));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    expect(stdDev).toBeGreaterThan(0.5);
    expect(stdDev).toBeLessThan(5);
  });
});

describe("World Bank data extraction", () => {
  const metadata = worldbankSample[0] as { page: number; total: number };
  const records = worldbankSample[1] as {
    indicator: { id: string; value: string };
    country: { id: string; value: string };
    date: string;
    value: number | null;
  }[];

  it("response has metadata and records arrays", () => {
    expect(metadata.page).toBe(1);
    expect(metadata.total).toBeGreaterThan(0);
    expect(records.length).toBeGreaterThan(0);
  });

  it("records contain indicator, country, date, and value", () => {
    for (const r of records) {
      expect(r.indicator.id).toBe("SP.DYN.CDRT.IN");
      expect(r.country.value).toBe("Mexico");
      expect(r.date).toMatch(/^\d{4}$/);
    }
  });

  it("can detect COVID mortality spike in 2020-2021", () => {
    const pre = records.find((r) => r.date === "2019");
    const peak = records.find((r) => r.date === "2021");
    const post = records.find((r) => r.date === "2023");

    expect(peak!.value).toBeGreaterThan(pre!.value!);
    expect(peak!.value! - pre!.value!).toBeGreaterThan(2);
    expect(post!.value).toBeLessThan(peak!.value!);
  });

  it("can compute mortality trend over decades", () => {
    const y2000 = records.find((r) => r.date === "2000");
    const y2010 = records.find((r) => r.date === "2010");
    const y2019 = records.find((r) => r.date === "2019");

    expect(y2000!.value).toBeLessThan(y2010!.value!);
    expect(y2019!.value).toBeGreaterThan(y2000!.value!);
  });

  it("can filter out null values and sort chronologically", () => {
    const valid = records.filter((r) => r.value !== null);
    const sorted = [...valid].sort((a, b) => parseInt(a.date) - parseInt(b.date));

    expect(valid.length).toBe(records.length);
    expect(parseInt(sorted[0].date)).toBeLessThan(parseInt(sorted[sorted.length - 1].date));
  });
});
