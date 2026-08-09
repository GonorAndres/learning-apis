import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApiCall } from "@/hooks/useApiCall";

describe("useApiCall", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useApiCall());
    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.latency).toBeNull();
  });

  it("transitions to loading then success", async () => {
    const mockData = { observations: [{ date: "2024-01-01", value: "4.5" }] };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const { result } = renderHook(() => useApiCall());

    await act(async () => {
      await result.current.execute("/api/proxy/fred?series_id=DGS10");
    });

    expect(result.current.status).toBe("success");
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.latency).toBeGreaterThanOrEqual(0);
  });

  it("handles HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      })
    );

    const { result } = renderHook(() => useApiCall());

    await act(async () => {
      await result.current.execute("/api/proxy/fred");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Server error");
  });

  it("handles network failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const { result } = renderHook(() => useApiCall());

    await act(async () => {
      await result.current.execute("/api/proxy/fred");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("Network error");
  });

  it("resets state", async () => {
    const mockData = { result: "ok" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const { result } = renderHook(() => useApiCall());

    await act(async () => {
      await result.current.execute("/api/test");
    });
    expect(result.current.status).toBe("success");

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.latency).toBeNull();
  });

  it("records request URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useApiCall());
    const url = "/api/proxy/worldbank?country=MEX";

    await act(async () => {
      await result.current.execute(url);
    });

    expect(result.current.requestUrl).toBe(url);
  });

  it("ignores an older response that finishes after a newer request", async () => {
    let resolveFirst!: (value: object) => void;
    const firstResponse = new Promise<object>((resolve) => {
      resolveFirst = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockReturnValueOnce(firstResponse)
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ "content-type": "application/json" }),
          json: () => Promise.resolve({ request: "second" }),
        })
    );
    const { result } = renderHook(() => useApiCall());

    let firstExecution!: Promise<void>;
    await act(async () => {
      firstExecution = result.current.execute("/api/first");
      await result.current.execute("/api/second");
    });
    resolveFirst({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve({ request: "first" }),
    });
    await act(async () => firstExecution);

    expect(result.current.data).toEqual({ request: "second" });
    expect(result.current.requestUrl).toBe("/api/second");
  });

  it("does not repopulate state after reset", async () => {
    let resolveRequest!: (value: object) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(
        new Promise<object>((resolve) => {
          resolveRequest = resolve;
        })
      )
    );
    const { result } = renderHook(() => useApiCall());

    let execution!: Promise<void>;
    act(() => {
      execution = result.current.execute("/api/test");
    });
    act(() => result.current.reset());
    resolveRequest({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve({ result: "late" }),
    });
    await act(async () => execution);

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
  });

  it("uses a text error body when the response is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        headers: new Headers({ "content-type": "text/plain" }),
        text: () => Promise.resolve("Upstream unavailable"),
      })
    );
    const { result } = renderHook(() => useApiCall());

    await act(async () => result.current.execute("/api/test"));

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Upstream unavailable");
  });
});
