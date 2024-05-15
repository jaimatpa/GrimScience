import "#internal/nitro/virtual/polyfill";
import wsAdapter from "crossws/adapters/cloudflare";
import { runCronTasks } from "../task.mjs";
import { requestHasBody } from "#internal/nitro/utils";
import { nitroApp } from "#internal/nitro/app";
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
export default {
  async fetch(request, env, context) {
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
    const url = new URL(request.url);
    if (env.ASSETS && isPublicAssetURL(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    let body;
    if (requestHasBody(request)) {
      body = Buffer.from(await request.arrayBuffer());
    }
    globalThis.__env__ = env;
    return nitroApp.localFetch(url.pathname + url.search, {
      context: {
        cf: request.cf,
        waitUntil: (promise) => context.waitUntil(promise),
        cloudflare: {
          request,
          env,
          context
        }
      },
      host: url.hostname,
      protocol: url.protocol,
      method: request.method,
      headers: request.headers,
      body
    });
  },
  scheduled(event, env, context) {
    if (import.meta._tasks) {
      globalThis.__env__ = env;
      context.waitUntil(
        runCronTasks(event.cron, {
          context: {
            cloudflare: {
              env,
              context
            }
          },
          payload: {}
        })
      );
    }
  }
};
