import "#internal/nitro/virtual/polyfill";
import { toNodeListener } from "h3";
import { nitroApp } from "../app.mjs";
const handler = toNodeListener(nitroApp.h3App);
export default (function(req, res) {
  return handler(req, res);
});
