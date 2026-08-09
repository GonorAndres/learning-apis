import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as evaluateMock } from "@/app/api/mock/[...path]/route";
import { classifyHealth } from "@/lib/api-health";
import { allowsCrossOrigin } from "@/lib/chaos-catalog";
import { evaluateContract, type MockContract } from "@/lib/mock-registry";
import { jsonEqual, normalizeApiGuess } from "@/lib/reverse-engineering";

const contract: MockContract = {
  method: "POST",
  path: "/api/mock/risk-score",
  description: "Risk score preview",
  params: [
    { name: "age", type: "number", required: true, example: "45" },
    { name: "active", type: "boolean", required: false, example: "true" },
  ],
  responseTemplate: '{"age": {{age}}, "active": {{active}}}',
};

describe("heartbeat health classification", () => {
  it("counts HTTP failures as down regardless of latency", () => {
    expect(classifyHealth(false, 20)).toBe("down");
  });

  it("uses the documented one-second threshold", () => {
    expect(classifyHealth(true, 1_000)).toBe("healthy");
    expect(classifyHealth(true, 1_001)).toBe("slow");
  });
});

describe("CORS response model", () => {
  it("accepts wildcard or matching origins", () => {
    expect(allowsCrossOrigin(new Headers({ "Access-Control-Allow-Origin": "*" }), "https://app.test")).toBe(true);
    expect(allowsCrossOrigin(new Headers({ "Access-Control-Allow-Origin": "https://app.test" }), "https://app.test")).toBe(true);
  });

  it("rejects missing or different origins", () => {
    expect(allowsCrossOrigin(new Headers(), "https://app.test")).toBe(false);
    expect(allowsCrossOrigin(new Headers({ "Access-Control-Allow-Origin": "https://other.test" }), "https://app.test")).toBe(false);
  });
});

describe("stateless contract evaluation", () => {
  it("evaluates GET or POST contracts without registration", () => {
    expect(evaluateContract(contract, { age: "45", active: "true" })).toEqual({
      ok: true,
      body: { age: 45, active: true },
    });
  });

  it("enforces required parameters and parameter types", () => {
    expect(evaluateContract(contract, {})).toEqual({
      ok: false,
      error: "Missing required parameter: age",
    });
    expect(evaluateContract(contract, { age: "unknown" })).toEqual({
      ok: false,
      error: "Parameter must be a number: age",
    });
  });

  it("rejects malformed contracts and invalid JSON templates", () => {
    expect(evaluateContract({ ...contract, path: "/outside/mock" }, { age: "45" })).toEqual({
      ok: false,
      error: "Invalid contract",
    });
    expect(evaluateContract({ ...contract, responseTemplate: "not json" }, { age: "45" })).toEqual({
      ok: false,
      error: "Response template must produce valid JSON",
    });
  });

  it("evaluates the contract and values in one API request", async () => {
    const request = new NextRequest("http://localhost/api/mock/_evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract, values: { age: "52", active: "false" } }),
    });

    const response = await evaluateMock(request, {
      params: Promise.resolve({ path: ["_evaluate"] }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ age: 52, active: false });
  });
});

describe("reverse-engineering guesses", () => {
  it("accepts only same-origin API paths", () => {
    expect(normalizeApiGuess("/api/mortality?age=45", "https://app.test")).toBe(
      "/api/mortality?age=45"
    );
    expect(normalizeApiGuess("//evil.test/api/data", "https://app.test")).toBeNull();
    expect(normalizeApiGuess("/admin", "https://app.test")).toBeNull();
  });

  it("compares JSON objects independently of key order", () => {
    expect(jsonEqual({ age: 45, details: { qx: 0.1, lx: 90 } }, { details: { lx: 90, qx: 0.1 }, age: 45 })).toBe(true);
    expect(jsonEqual([1, 2], [2, 1])).toBe(false);
  });
});
