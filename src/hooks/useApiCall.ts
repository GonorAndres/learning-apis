"use client";

import { useState, useCallback } from "react";

type ApiCallState = {
  status: "idle" | "loading" | "success" | "error";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: string | null;
  latency: number | null;
  requestUrl: string | null;
};

export function useApiCall() {
  const [state, setState] = useState<ApiCallState>({
    status: "idle",
    data: null,
    error: null,
    latency: null,
    requestUrl: null,
  });

  const execute = useCallback(async (url: string) => {
    setState({
      status: "loading",
      data: null,
      error: null,
      latency: null,
      requestUrl: url,
    });

    const start = performance.now();

    try {
      const response = await fetch(url);
      const latency = Math.round(performance.now() - start);
      const data = await response.json();

      if (!response.ok) {
        setState({
          status: "error",
          data: null,
          error: data.error || `HTTP ${response.status}`,
          latency,
          requestUrl: url,
        });
        return;
      }

      setState({ status: "success", data, error: null, latency, requestUrl: url });
    } catch {
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
    setState({
      status: "idle",
      data: null,
      error: null,
      latency: null,
      requestUrl: null,
    });
  }, []);

  return { ...state, execute, reset };
}
