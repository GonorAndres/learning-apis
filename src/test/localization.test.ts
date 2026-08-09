import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

function collectKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [prefix];

  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("message catalogs", () => {
  it("keeps English and Spanish translation keys in sync", () => {
    expect(collectKeys(es).sort()).toEqual(collectKeys(en).sort());
  });
});
