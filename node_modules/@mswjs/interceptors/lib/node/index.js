"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkLMCO6WE2js = require('./chunk-LMCO6WE2.js');



var _chunkLK6DILFKjs = require('./chunk-LK6DILFK.js');


var _chunkJSSEHRRBjs = require('./chunk-JSSEHRRB.js');


var _chunkFZJKKO5Hjs = require('./chunk-FZJKKO5H.js');







var _chunkTIPR373Rjs = require('./chunk-TIPR373R.js');

// src/utils/getCleanUrl.ts
function getCleanUrl(url, isAbsolute = true) {
  return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}













exports.BatchInterceptor = _chunkLMCO6WE2js.BatchInterceptor; exports.INTERNAL_REQUEST_ID_HEADER_NAME = _chunkTIPR373Rjs.INTERNAL_REQUEST_ID_HEADER_NAME; exports.IS_PATCHED_MODULE = _chunkFZJKKO5Hjs.IS_PATCHED_MODULE; exports.Interceptor = _chunkTIPR373Rjs.Interceptor; exports.InterceptorReadyState = _chunkTIPR373Rjs.InterceptorReadyState; exports.createRequestId = _chunkTIPR373Rjs.createRequestId; exports.decodeBuffer = _chunkLK6DILFKjs.decodeBuffer; exports.deleteGlobalSymbol = _chunkTIPR373Rjs.deleteGlobalSymbol; exports.encodeBuffer = _chunkLK6DILFKjs.encodeBuffer; exports.getCleanUrl = getCleanUrl; exports.getGlobalSymbol = _chunkTIPR373Rjs.getGlobalSymbol; exports.isResponseWithoutBody = _chunkJSSEHRRBjs.isResponseWithoutBody;
//# sourceMappingURL=index.js.map