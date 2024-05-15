import "#internal/nitro/virtual/polyfill";
import wsAdapter from "crossws/adapters/bun";
import { nitroApp } from "../app.mjs";
import { startScheduleRunner } from "../task.mjs";
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
const server = Bun.serve({
  port: process.env.NITRO_PORT || process.env.PORT || 3e3,
  websocket: import.meta._websocket ? ws.websocket : void 0,
  async fetch(req, server2) {
    if (import.meta._websocket && await ws.handleUpgrade(req, server2)) {
      return;
    }
    const url = new URL(req.url);
    let body;
    if (req.body) {
      body = await req.arrayBuffer();
    }
    return nitroApp.localFetch(url.pathname + url.search, {
      host: url.hostname,
      protocol: url.protocol,
      headers: req.headers,
      method: req.method,
      redirect: req.redirect,
      body
    });
  }
});
console.log(`Listening on http://localhost:${server.port}...`);
if (import.meta._tasks) {
  startScheduleRunner();
}
