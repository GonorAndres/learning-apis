import { NextRequest, NextResponse } from "next/server";
import sampleData from "@/data/samples/fred-dgs10.json";

const ALLOWED_PATHS = ["/series/observations", "/series"];
const RESERVED_PARAMS = new Set(["api_key", "file_type", "path"]);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "/series/observations";

  if (!ALLOWED_PATHS.includes(path)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 400 });
  }

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    const seriesId = searchParams.get("series_id") || "DGS10";
    if (path === "/series/observations" && seriesId === "DGS10") {
      return NextResponse.json({ ...sampleData, _sample: true });
    }

    return NextResponse.json(
      { error: "Live FRED credentials are required for this request" },
      { status: 503 }
    );
  }

  const params = new URLSearchParams();
  params.set("api_key", apiKey);
  params.set("file_type", "json");

  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_PARAMS.has(key)) {
      params.set(key, value);
    }
  }

  const url = `https://api.stlouisfed.org/fred${path}?${params.toString()}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from FRED API" },
      { status: 502 }
    );
  }
}
