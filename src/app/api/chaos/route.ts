import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, number[]>();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = parseInt(searchParams.get("code") || "0");
  const delay = parseInt(searchParams.get("delay") || "0");
  const nocors = searchParams.get("nocors") === "true";

  if (delay > 0 && delay <= 10000) {
    await new Promise((r) => setTimeout(r, delay));
  }

  if (nocors) {
    return new Response(
      JSON.stringify({ error: "CORS headers intentionally omitted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (code === 429) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const hits = rateLimitMap.get(ip)?.filter((t) => now - t < 5000) || [];
    hits.push(now);
    rateLimitMap.set(ip, hits);

    if (hits.length > 5) {
      return NextResponse.json(
        { error: "Too Many Requests", retryAfter: 5 },
        { status: 429, headers: { ...corsHeaders, "Retry-After": "5" } }
      );
    }
    return NextResponse.json(
      { message: `${hits.length}/5 requests in window. Send more to trigger 429.` },
      { headers: corsHeaders }
    );
  }

  const responses: Record<number, { error: string; detail: string }> = {
    400: { error: "Bad Request", detail: "The server could not understand the request due to invalid syntax." },
    401: { error: "Unauthorized", detail: "Authentication is required. Include an Authorization header." },
    403: { error: "Forbidden", detail: "You do not have permission to access this resource." },
    404: { error: "Not Found", detail: "The requested resource does not exist on this server." },
    405: { error: "Method Not Allowed", detail: "This endpoint only accepts GET requests." },
    408: { error: "Request Timeout", detail: "The server timed out waiting for the request." },
    418: { error: "I'm a Teapot", detail: "The server refuses to brew coffee because it is a teapot. (RFC 2324)" },
    422: { error: "Unprocessable Entity", detail: "The request was well-formed but contains semantic errors." },
    500: { error: "Internal Server Error", detail: "The server encountered an unexpected condition." },
    503: { error: "Service Unavailable", detail: "The server is temporarily unable to handle the request." },
  };

  if (code && responses[code]) {
    return NextResponse.json(responses[code], { status: code, headers: corsHeaders });
  }

  return NextResponse.json(
    {
      status: "ok",
      message: "Chaos endpoint ready. Use ?code=XXX to trigger specific errors.",
      available: Object.keys(responses).map(Number),
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = parseInt(searchParams.get("code") || "0");

  if (code === 405 || !code) {
    return NextResponse.json(
      { error: "Method Not Allowed", detail: "Use GET, not POST." },
      {
        status: 405,
        headers: {
          Allow: "GET",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  return NextResponse.json(
    { received: "POST", body: await req.text().catch(() => "") },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
