import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRace } from "@/hooks/useRace";
import { useCallHistory } from "@/hooks/useCallHistory";

function response(body: string, status = 200) {
  return { status, text: () => Promise.resolve(body) };
}

describe("useRace", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    useCallHistory.setState({ records: [], selectedId: null, compareId: null });
    localStorage.clear();
  });

  it("records one result per racer when a response is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response("plain text")));
    const { result } = renderHook(() => useRace());

    await act(async () => result.current.startRace());

    expect(result.current.raceStatus).toBe("done");
    expect(result.current.history[0]).toHaveLength(4);
    expect(result.current.history[0].every((entry) => entry.status === 200)).toBe(true);
    expect(useCallHistory.getState().records).toHaveLength(4);
    expect(useCallHistory.getState().records[0].responseBody).toBe("plain text");
  });

  it("ignores in-flight results after reset", async () => {
    const resolvers: ((value: ReturnType<typeof response>) => void)[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        () => new Promise<ReturnType<typeof response>>((resolve) => resolvers.push(resolve))
      )
    );
    const { result } = renderHook(() => useRace());

    let race!: Promise<void>;
    act(() => {
      race = result.current.startRace();
    });
    act(() => result.current.reset());
    resolvers.forEach((resolve) => resolve(response("{}")));
    await act(async () => race);

    expect(result.current.raceStatus).toBe("idle");
    expect(result.current.history).toEqual([]);
    expect(useCallHistory.getState().records).toEqual([]);
  });
});
