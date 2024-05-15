"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/bufferUtils.ts
var encoder = new TextEncoder();
function encodeBuffer(text) {
  return encoder.encode(text);
}
function decodeBuffer(buffer, encoding) {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}
function toArrayBuffer(array) {
  return array.buffer.slice(
    array.byteOffset,
    array.byteOffset + array.byteLength
  );
}

// src/utils/responseUtils.ts
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






exports.encodeBuffer = encodeBuffer; exports.decodeBuffer = decodeBuffer; exports.toArrayBuffer = toArrayBuffer; exports.isResponseWithoutBody = isResponseWithoutBody;
//# sourceMappingURL=chunk-OJ2CN4LS.js.map