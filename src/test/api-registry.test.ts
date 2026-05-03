import { describe, it, expect } from "vitest";
import { API_REGISTRY } from "@/lib/api-registry";

describe("API Registry", () => {
  it("contains four API definitions", () => {
    expect(API_REGISTRY).toHaveLength(4);
  });

  it("has unique IDs", () => {
    const ids = API_REGISTRY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(API_REGISTRY.map((a) => [a.id, a]))("%s has required fields", (_id, api) => {
    expect(api.name).toBeTruthy();
    expect(api.description).toBeTruthy();
    expect(api.proxyPath).toMatch(/^\/api\//);
    expect(api.endpoints.length).toBeGreaterThan(0);
    expect(api.quickFills.length).toBeGreaterThan(0);
  });

  it.each(API_REGISTRY.map((a) => [a.id, a]))("%s endpoints have valid params", (_id, api) => {
    for (const ep of api.endpoints) {
      expect(typeof ep.path).toBe("string");
      expect(ep.params.length).toBeGreaterThan(0);
      for (const p of ep.params) {
        expect(p.name).toBeTruthy();
        expect(["string", "date", "enum"]).toContain(p.type);
        expect(typeof p.required).toBe("boolean");
        expect(p.description).toBeTruthy();
        if (p.type === "enum") {
          expect(p.values).toBeDefined();
          expect(p.values!.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it.each(API_REGISTRY.map((a) => [a.id, a]))(
    "%s quick fills reference valid param names",
    (_id, api) => {
      const paramNames = api.endpoints[0].params.map((p) => p.name);
      for (const qf of api.quickFills) {
        expect(qf.label).toBeTruthy();
        expect(qf.description).toBeTruthy();
        for (const key of Object.keys(qf.values)) {
          expect(paramNames).toContain(key);
        }
      }
    }
  );

  it("FRED has series_id as required param", () => {
    const fred = API_REGISTRY.find((a) => a.id === "fred")!;
    const seriesParam = fred.endpoints[0].params.find((p) => p.name === "series_id");
    expect(seriesParam).toBeDefined();
    expect(seriesParam!.required).toBe(true);
    expect(seriesParam!.default).toBe("DGS10");
  });

  it("Banxico has all dates as required", () => {
    const banxico = API_REGISTRY.find((a) => a.id === "banxico")!;
    const dateParams = banxico.endpoints[0].params.filter(
      (p) => p.name === "startDate" || p.name === "endDate"
    );
    expect(dateParams).toHaveLength(2);
    dateParams.forEach((p) => expect(p.required).toBe(true));
  });

  it("World Bank defaults to Mexico", () => {
    const wb = API_REGISTRY.find((a) => a.id === "worldbank")!;
    const countryParam = wb.endpoints[0].params.find((p) => p.name === "country");
    expect(countryParam!.default).toBe("MEX");
  });

  it("Custom API serves mortality table at /api/mortality", () => {
    const custom = API_REGISTRY.find((a) => a.id === "custom")!;
    expect(custom.name).toBe("Your API");
    expect(custom.proxyPath).toBe("/api/mortality");
    expect(custom.color).toBe("indigo");
    const ageParam = custom.endpoints[0].params.find((p) => p.name === "age");
    expect(ageParam).toBeDefined();
    expect(custom.quickFills).toHaveLength(3);
  });
});
