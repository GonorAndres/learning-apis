import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const country = searchParams.get("country") || "MEX";
  const indicator = searchParams.get("indicator") || "SP.DYN.CDRT.IN";
  const date = searchParams.get("date") || "2000:2023";

  if (!/^[A-Z]{2,3}$/i.test(country)) {
    return NextResponse.json(
      { error: "Invalid country code" },
      { status: 400 }
    );
  }

  if (!/^[A-Z0-9.]+$/i.test(indicator)) {
    return NextResponse.json(
      { error: "Invalid indicator code" },
      { status: 400 }
    );
  }

  const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?date=${date}&format=json&per_page=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from World Bank API" },
      { status: 502 }
    );
  }
}
