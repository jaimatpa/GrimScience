import {
  BatchInterceptor
} from "./chunk-GUY7XK43.mjs";
import {
  decodeBuffer,
  encodeBuffer
} from "./chunk-6HYIRFX2.mjs";
import {
  isResponseWithoutBody
} from "./chunk-IBYBTTYK.mjs";
import {
  IS_PATCHED_MODULE
} from "./chunk-HAGW22AN.mjs";
import {
  INTERNAL_REQUEST_ID_HEADER_NAME,
  Interceptor,
  InterceptorReadyState,
  createRequestId,
  deleteGlobalSymbol,
  getGlobalSymbol
} from "./chunk-QED3Q6Z2.mjs";

// src/utils/getCleanUrl.ts
function getCleanUrl(url, isAbsolute = true) {
  return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}
export {
  BatchInterceptor,
  INTERNAL_REQUEST_ID_HEADER_NAME,
  IS_PATCHED_MODULE,
  Interceptor,
  InterceptorReadyState,
  createRequestId,
  decodeBuffer,
  deleteGlobalSymbol,
  encodeBuffer,
  getCleanUrl,
  getGlobalSymbol,
  isResponseWithoutBody
};
//# sourceMappingURL=index.mjs.map