import "#internal/nitro/virtual/polyfill";
import { toNodeListener } from "h3";
import { nitroApp } from "../app.mjs";
import { trapUnhandledNodeErrors } from "../utils.mjs";
import { startScheduleRunner } from "../task.mjs";
export const listener = toNodeListener(nitroApp.h3App);
export const websocket = import.meta._websocket ? nitroApp.h3App.websocket : void 0;
export const handler = listener;
trapUnhandledNodeErrors();
if (import.meta._tasks) {
  startScheduleRunner();
}
