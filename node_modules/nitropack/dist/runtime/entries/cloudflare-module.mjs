import "#internal/nitro/virtual/polyfill";
import { withoutBase } from "ufo";
import {
  getAssetFromKV,
  mapRequestToAsset
} from "@cloudflare/kv-asset-handler";
import manifest from "__STATIC_CONTENT_MANIFEST";
import wsAdapter from "crossws/adapters/cloudflare";
import { requestHasBody } from "../utils.mjs";
import { nitroApp } from "#internal/nitro/app";
import { runCronTasks, useRuntimeConfig } from "#internal/nitro";
import { getPublicAssetMeta } from "#internal/nitro/virtual/public-assets";
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
export default {
  async fetch(request, env, context) {
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil(promise) {
            return context.waitUntil(promise);
          }
        },
        {
          cacheControl: assetsCacheControl,
          mapRequestToAsset: baseURLModifier,
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(manifest)
        }
      );
    } catch {
    }
    const url = new URL(request.url);
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
function assetsCacheControl(_request) {
  const url = new URL(_request.url);
  const meta = getPublicAssetMeta(url.pathname);
  if (meta.maxAge) {
    return {
      browserTTL: meta.maxAge,
      edgeTTL: meta.maxAge
    };
  }
  return {};
}
const baseURLModifier = (request) => {
  const url = withoutBase(request.url, useRuntimeConfig().app.baseURL);
  return mapRequestToAsset(new Request(url, request));
};
