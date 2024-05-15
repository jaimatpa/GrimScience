"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/responseUtils.ts
var RESPONSE_STATUS_CODES_WITHOUT_BODY = /* @__PURE__ */ new Set([
  101,
  103,
  204,
  205,
  304
]);
function isResponseWithoutBody(status) {
  return RESPONSE_STATUS_CODES_WITHOUT_BODY.has(status);
}



exports.isResponseWithoutBody = isResponseWithoutBody;
//# sourceMappingURL=chunk-JSSEHRRB.js.map