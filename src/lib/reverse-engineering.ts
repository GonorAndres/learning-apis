function normalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (typeof value !== "object" || value === null) return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, normalizeJson(child)])
  );
}

export function jsonEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeJson(left)) === JSON.stringify(normalizeJson(right));
}

export function normalizeApiGuess(value: string, origin: string): string | null {
  try {
    const url = new URL(value.trim(), origin);
    if (url.origin !== origin || !url.pathname.startsWith("/api/")) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}
