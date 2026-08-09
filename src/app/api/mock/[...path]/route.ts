import { NextRequest, NextResponse } from "next/server";
import { evaluateContract } from "@/lib/mock-registry";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET() {
  return NextResponse.json(
    { error: "Mock contracts are evaluated as previews and are not persisted" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  if (path.length !== 1 || path[0] !== "_evaluate") {
    return NextResponse.json(
      { error: "Use /api/mock/_evaluate to preview a contract" },
      { status: 404 }
    );
  }

  try {
    const input: unknown = await req.json();
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return NextResponse.json({ error: "Invalid evaluation request" }, { status: 400 });
    }

    const { contract, values } = input as Record<string, unknown>;
    const result = evaluateContract(contract, values);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.body);
  } catch {
    return NextResponse.json({ error: "Invalid evaluation request" }, { status: 400 });
  }
}
