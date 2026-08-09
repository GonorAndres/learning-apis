export type HealthStatus = "healthy" | "slow" | "down";

export const HEALTHY_THRESHOLD_MS = 1_000;

export function classifyHealth(ok: boolean, latency: number): HealthStatus {
  if (!ok) return "down";
  return latency > HEALTHY_THRESHOLD_MS ? "slow" : "healthy";
}
