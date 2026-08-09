import { NextRequest, NextResponse } from "next/server";
import sampleData from "@/data/samples/banxico-usdmxn.json";

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function filterSample(startDate: string, endDate: string) {
  const datos = sampleData.bmx.series[0].datos.filter(({ fecha }) => {
    const [day, month, year] = fecha.split("/");
    const date = `${year}-${month}-${day}`;
    return date >= startDate && date <= endDate;
  });

  return {
    ...sampleData,
    bmx: {
      ...sampleData.bmx,
      series: [{ ...sampleData.bmx.series[0], datos }],
    },
    _sample: true,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const series = searchParams.get("series") || "SF43718";
  const startDate = searchParams.get("startDate") || "2020-01-01";
  const endDate = searchParams.get("endDate") || "2024-12-31";

  if (!/^[A-Z0-9,]+$/i.test(series)) {
    return NextResponse.json(
      { error: "Invalid series format" },
      { status: 400 }
    );
  }

  if (!isValidDate(startDate) || !isValidDate(endDate) || startDate > endDate) {
    return NextResponse.json(
      { error: "Invalid date range" },
      { status: 400 }
    );
  }

  const token = process.env.BANXICO_TOKEN;
  if (!token) {
    if (series === "SF43718") {
      return NextResponse.json(filterSample(startDate, endDate));
    }

    return NextResponse.json(
      { error: "Live Banxico credentials are required for this series" },
      { status: 503 }
    );
  }

  const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${series}/datos/${startDate}/${endDate}?mediaType=json`;

  try {
    const response = await fetch(url, {
      headers: { "Bmx-Token": token },
      signal: AbortSignal.timeout(10_000),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from Banxico API" },
      { status: 502 }
    );
  }
}
