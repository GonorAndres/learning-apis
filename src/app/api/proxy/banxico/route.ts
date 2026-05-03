import { NextRequest, NextResponse } from "next/server";
import sampleData from "@/data/samples/banxico-usdmxn.json";

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

  const token = process.env.BANXICO_TOKEN;
  if (!token) {
    return NextResponse.json({ ...sampleData, _sample: true });
  }

  const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${series}/datos/${startDate}/${endDate}?mediaType=json`;

  try {
    const response = await fetch(url, {
      headers: { "Bmx-Token": token },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ...sampleData, _sample: true });
  }
}
