import { NextRequest, NextResponse } from "next/server";
import { getContract, generateResponse, registerContract } from "@/lib/mock-registry";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fullPath = `/api/mock/${path.join("/")}`;

  if (path[0] === "_register") {
    return NextResponse.json({ error: "Use POST to register" }, { status: 405 });
  }

  const contract = getContract("GET", fullPath);
  if (!contract) {
    return NextResponse.json(
      { error: "No contract registered for this endpoint", path: fullPath },
      { status: 404 }
    );
  }

  const queryParams: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => {
    queryParams[k] = v;
  });

  for (const p of contract.params) {
    if (p.required && !queryParams[p.name]) {
      return NextResponse.json(
        { error: `Missing required parameter: ${p.name}` },
        { status: 400 }
      );
    }
  }

  const body = generateResponse(contract, queryParams);

  try {
    const parsed = JSON.parse(body);
    return NextResponse.json(parsed);
  } catch {
    return new Response(body, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (path[0] === "_register") {
    try {
      const contract = await req.json();
      registerContract(contract);
      return NextResponse.json({ registered: true, path: contract.path });
    } catch {
      return NextResponse.json({ error: "Invalid contract" }, { status: 400 });
    }
  }

  const fullPath = `/api/mock/${path.join("/")}`;
  const contract = getContract("POST", fullPath);
  if (!contract) {
    return NextResponse.json({ error: "No contract registered", path: fullPath }, { status: 404 });
  }

  const queryParams: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => {
    queryParams[k] = v;
  });

  const body = generateResponse(contract, queryParams);
  try {
    return NextResponse.json(JSON.parse(body));
  } catch {
    return new Response(body, { headers: { "Content-Type": "application/json" } });
  }
}
