"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type ApiCallState = {
  status: "idle" | "loading" | "success" | "error";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: string | null;
  latency: number | null;
  requestUrl: string | null;
};

export function useApiCall() {
  const activeRequest = useRef<{ id: number; controller: AbortController } | null>(null);
  const nextRequestId = useRef(0);
  const [state, setState] = useState<ApiCallState>({
    status: "idle",
    data: null,
    error: null,
    latency: null,
    requestUrl: null,
  });

  const execute = useCallback(async (url: string) => {
    activeRequest.current?.controller.abort();
    const request = {
      id: ++nextRequestId.current,
      controller: new AbortController(),
    };
    activeRequest.current = request;

    setState({
      status: "loading",
      data: null,
      error: null,
      latency: null,
      requestUrl: url,
    });

    const start = performance.now();

    try {
      const response = await fetch(url, { signal: request.controller.signal });
      const latency = Math.round(performance.now() - start);
      const contentType = response.headers?.get("content-type") || "application/json";
      const data = contentType.includes("json")
        ? await response.json()
        : await response.text();

      if (activeRequest.current?.id !== request.id) return;

      if (!response.ok) {
        setState({
          status: "error",
          data: null,
          error:
            typeof data === "object" && data !== null && "error" in data
              ? String(data.error)
              : typeof data === "string" && data
                ? data
                : `HTTP ${response.status}`,
          latency,
          requestUrl: url,
        });
        return;
      }

      setState({ status: "success", data, error: null, latency, requestUrl: url });
    } catch (error) {
      if (activeRequest.current?.id !== request.id) return;
      if (error instanceof DOMException && error.name === "AbortError") return;

      const latency = Math.round(performance.now() - start);
      setState({
        status: "error",
        data: null,
        error: "Network error. The API may be unavailable.",
        latency,
        requestUrl: url,
      });
    }
  }, []);

  const reset = useCallback(() => {
    activeRequest.current?.controller.abort();
    activeRequest.current = null;
    nextRequestId.current += 1;
    setState({
      status: "idle",
      data: null,
      error: null,
      latency: null,
      requestUrl: null,
    });
  }, []);

  useEffect(() => {
    return () => activeRequest.current?.controller.abort();
  }, []);

  return { ...state, execute, reset };
}
