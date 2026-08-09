// @ts-expect-error The OpenNext worker is generated during the Worker build.
import openNextWorker from "../.open-next/worker.js";

interface Env extends CloudflareEnv {
  CLOUD_RUN_API_ORIGIN: string;
}

interface WorkerExecutionContext {
  passThroughOnException(): void;
  waitUntil(promise: Promise<unknown>): void;
}

function isApiPath(pathname: string) {
  return pathname === "/api" || pathname.startsWith("/api/");
}

export default {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext) {
    const url = new URL(request.url);

    if (!isApiPath(url.pathname)) {
      return openNextWorker.fetch(request, env, ctx);
    }

    const backend = new URL(env.CLOUD_RUN_API_ORIGIN);
    backend.pathname = url.pathname;
    backend.search = url.search;

    return fetch(new Request(backend, request));
  },
};
