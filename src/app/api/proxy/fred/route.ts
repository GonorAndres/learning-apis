import { NextRequest, NextResponse } from "next/server";
import sampleData from "@/data/samples/fred-dgs10.json";

const ALLOWED_PATHS = ["/series/observations", "/series"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "/series/observations";

  if (!ALLOWED_PATHS.includes(path)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 400 });
  }

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ...sampleData, _sample: true });
  }

  const params = new URLSearchParams();
  params.set("api_key", apiKey);
  params.set("file_type", "json");

  for (const [key, value] of searchParams.entries()) {
    if (key !== "path") {
      params.set(key, value);
    }
  }

  const url = `https://api.stlouisfed.org/fred${path}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ...sampleData, _sample: true });
  }
}
