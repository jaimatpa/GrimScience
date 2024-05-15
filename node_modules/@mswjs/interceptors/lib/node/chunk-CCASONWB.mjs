import {
  isResponseWithoutBody
} from "./chunk-IBYBTTYK.mjs";
import {
  isPropertyAccessible
} from "./chunk-DERTLGL3.mjs";
import {
  emitAsync,
  toInteractiveRequest
} from "./chunk-OUWBQF3Z.mjs";
import {
  INTERNAL_REQUEST_ID_HEADER_NAME,
  Interceptor,
  createRequestId
} from "./chunk-QED3Q6Z2.mjs";

// src/interceptors/ClientRequest/index.ts
import http from "http";
import https from "https";

// src/interceptors/ClientRequest/NodeClientRequest.ts
import { ClientRequest, IncomingMessage as IncomingMessage2 } from "http";
import { until } from "@open-draft/until";
import { DeferredPromise } from "@open-draft/deferred-promise";

// src/interceptors/ClientRequest/utils/normalizeClientRequestEndArgs.ts
import { Logger } from "@open-draft/logger";
var logger = new Logger("utils getUrlByRequestOptions");
function normalizeClientRequestEndArgs(...args) {
  logger.info("arguments", args);
  const normalizedArgs = new Array(3).fill(null).map((value, index) => args[index] || value);
  normalizedArgs.sort((a, b) => {
    if (typeof a === "function") {
      return 1;
    }
    if (typeof b === "function") {
      return -1;
    }
    if (typeof a === "string" && typeof b === "string") {
      return normalizedArgs.indexOf(a) - normalizedArgs.indexOf(b);
    }
    return 0;
  });
  logger.info("normalized args", normalizedArgs);
  return normalizedArgs;
}

// src/interceptors/ClientRequest/utils/normalizeClientRequestWriteArgs.ts
import { Logger as Logger2 } from "@open-draft/logger";
var logger2 = new Logger2("http normalizeWriteArgs");
function normalizeClientRequestWriteArgs(args) {
  logger2.info("normalizing ClientRequest.write arguments...", args);
  const chunk = args[0];
  const encoding = typeof args[1] === "string" ? args[1] : void 0;
  const callback = typeof args[1] === "function" ? args[1] : args[2];
  const writeArgs = [
    chunk,
    encoding,
    callback
  ];
  logger2.info(
    "successfully normalized ClientRequest.write arguments:",
    writeArgs
  );
  return writeArgs;
}

// src/interceptors/ClientRequest/utils/cloneIncomingMessage.ts
import { IncomingMessage } from "http";
import { PassThrough } from "stream";
var IS_CLONE = Symbol("isClone");
function cloneIncomingMessage(message) {
  const clone = message.pipe(new PassThrough());
  inheritProperties(message, clone);
  const clonedPrototype = Object.create(IncomingMessage.prototype);
  getPrototypes(clone).forEach((prototype) => {
    inheritProperties(prototype, clonedPrototype);
  });
  Object.setPrototypeOf(clone, clonedPrototype);
  Object.defineProperty(clone, IS_CLONE, {
    enumerable: true,
    value: true
  });
  return clone;
}
function getPrototypes(source) {
  const prototypes = [];
  let current = source;
  while (current = Object.getPrototypeOf(current)) {
    prototypes.push(current);
  }
  return prototypes;
}
function inheritProperties(source, target) {
  const properties = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source)
  ];
  for (const property of properties) {
    if (target.hasOwnProperty(property)) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(source, property);
    if (!descriptor) {
      continue;
    }
    Object.defineProperty(target, property, descriptor);
  }
}

// src/interceptors/ClientRequest/utils/createResponse.ts
function createResponse(message) {
  const responseBodyOrNull = isResponseWithoutBody(message.statusCode || 200) ? null : new ReadableStream({
    start(controller) {
      message.on("data", (chunk) => controller.enqueue(chunk));
      message.on("end", () => controller.close());
    }
  });
  return new Response(responseBodyOrNull, {
    status: message.statusCode,
    statusText: message.statusMessage,
    headers: createHeadersFromIncomingHttpHeaders(message.headers)
  });
}
function createHeadersFromIncomingHttpHeaders(httpHeaders) {
  const headers = new Headers();
  for (const headerName in httpHeaders) {
    const headerValues = httpHeaders[headerName];
    if (typeof headerValues === "undefined") {
      continue;
    }
    if (Array.isArray(headerValues)) {
      headerValues.forEach((headerValue) => {
        headers.append(headerName, headerValue);
      });
      continue;
    }
    headers.set(headerName, headerValues);
  }
  return headers;
}

// src/interceptors/ClientRequest/utils/createRequest.ts
function createRequest(clientRequest) {
  const headers = new Headers();
  const outgoingHeaders = clientRequest.getHeaders();
  for (const headerName in outgoingHeaders) {
    const headerValue = outgoingHeaders[headerName];
    if (typeof headerValue === "undefined") {
      continue;
    }
    const valuesList = Array.prototype.concat([], headerValue);
    for (const value of valuesList) {
      headers.append(headerName, value.toString());
    }
  }
  if (clientRequest.url.username || clientRequest.url.password) {
    const auth = `${clientRequest.url.username || ""}:${clientRequest.url.password || ""}`;
    headers.set("Authorization", `Basic ${btoa(auth)}`);
    clientRequest.url.username = "";
    clientRequest.url.password = "";
  }
  const method = clientRequest.method || "GET";
  return new Request(clientRequest.url, {
    method,
    headers,
    credentials: "same-origin",
    body: method === "HEAD" || method === "GET" ? null : clientRequest.requestBuffer
  });
}

// src/utils/getValueBySymbol.ts
function getValueBySymbol(symbolName, source) {
  const ownSymbols = Object.getOwnPropertySymbols(source);
  const symbol = ownSymbols.find((symbol2) => {
    return symbol2.description === symbolName;
  });
  if (symbol) {
    return Reflect.get(source, symbol);
  }
  return;
}

// src/utils/isObject.ts
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

// src/utils/getRawFetchHeaders.ts
function getRawFetchHeaders(headers) {
  const headersList = getValueBySymbol("headers list", headers);
  if (!headersList) {
    return;
  }
  const headersMap = getValueBySymbol("headers map", headersList);
  if (!headersMap || !isHeadersMapWithRawHeaderNames(headersMap)) {
    return;
  }
  const rawHeaders = /* @__PURE__ */ new Map();
  headersMap.forEach(({ name, value }) => {
    rawHeaders.set(name, value);
  });
  return rawHeaders;
}
function isHeadersMapWithRawHeaderNames(headersMap) {
  return Array.from(
    headersMap.values()
  ).every((value) => {
    return isObject(value) && "name" in value;
  });
}

// src/interceptors/ClientRequest/NodeClientRequest.ts
var _NodeClientRequest = class extends ClientRequest {
  constructor([url, requestOptions, callback], options) {
    super(requestOptions, callback);
    this.chunks = [];
    this.logger = options.logger.extend(
      `request ${requestOptions.method} ${url.href}`
    );
    this.logger.info("constructing ClientRequest using options:", {
      url,
      requestOptions,
      callback
    });
    this.state = 0 /* Idle */;
    this.url = url;
    this.emitter = options.emitter;
    this.requestBuffer = null;
    this.response = new IncomingMessage2(this.socket);
  }
  writeRequestBodyChunk(chunk, encoding) {
    if (chunk == null) {
      return;
    }
    if (this.requestBuffer == null) {
      this.requestBuffer = Buffer.from([]);
    }
    const resolvedChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.requestBuffer = Buffer.concat([this.requestBuffer, resolvedChunk]);
  }
  write(...args) {
    var _a;
    const [chunk, encoding, callback] = normalizeClientRequestWriteArgs(args);
    this.logger.info("write:", { chunk, encoding, callback });
    this.chunks.push({ chunk, encoding });
    this.writeRequestBodyChunk(chunk, encoding);
    this.logger.info(
      "chunk successfully stored!",
      (_a = this.requestBuffer) == null ? void 0 : _a.byteLength
    );
    if (!chunk || chunk.length === 0) {
      this.logger.info("written chunk is empty, skipping callback...");
    } else {
      callback == null ? void 0 : callback();
    }
    return true;
  }
  end(...args) {
    this.logger.info("end", args);
    const requestId = createRequestId();
    const [chunk, encoding, callback] = normalizeClientRequestEndArgs(...args);
    this.logger.info("normalized arguments:", { chunk, encoding, callback });
    this.writeRequestBodyChunk(chunk, encoding || void 0);
    this.state = 2 /* Sent */;
    const capturedRequest = createRequest(this);
    const { interactiveRequest, requestController } = toInteractiveRequest(capturedRequest);
    Object.defineProperty(capturedRequest, "respondWith", {
      value: requestController.respondWith.bind(requestController)
    });
    if (this.hasHeader(INTERNAL_REQUEST_ID_HEADER_NAME)) {
      this.removeHeader(INTERNAL_REQUEST_ID_HEADER_NAME);
      return this.passthrough(chunk, encoding, callback);
    }
    this.emitter.once("request", ({ requestId: pendingRequestId }) => {
      if (pendingRequestId !== requestId) {
        return;
      }
      if (requestController.responsePromise.state === "pending") {
        this.logger.info(
          "request has not been handled in listeners, executing fail-safe listener..."
        );
        requestController.responsePromise.resolve(void 0);
      }
    });
    until(async () => {
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.state = 3 /* MockLookupStart */;
      await emitAsync(this.emitter, "request", {
        request: interactiveRequest,
        requestId
      });
      this.logger.info('all "request" listeners done!');
      const mockedResponse = await requestController.responsePromise;
      this.logger.info("event.respondWith called with:", mockedResponse);
      return mockedResponse;
    }).then((resolverResult) => {
      this.logger.info("the listeners promise awaited!");
      this.state = 4 /* MockLookupEnd */;
      if (!this.headersSent) {
        for (const [headerName, headerValue] of capturedRequest.headers) {
          this.setHeader(headerName, headerValue);
        }
      }
      if (resolverResult.error) {
        this.logger.info(
          "encountered resolver exception, aborting request...",
          resolverResult.error
        );
        this.destroyed = true;
        this.emit("error", resolverResult.error);
        this.terminate();
        return this;
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse) {
        this.logger.info(
          "received mocked response:",
          mockedResponse.status,
          mockedResponse.statusText
        );
        this.destroyed = false;
        if (
          /**
           * @note Some environments, like Miniflare (Cloudflare) do not
           * implement the "Response.type" property and throw on its access.
           * Safely check if we can access "type" on "Response" before continuing.
           * @see https://github.com/mswjs/msw/issues/1834
           */
          isPropertyAccessible(mockedResponse, "type") && mockedResponse.type === "error"
        ) {
          this.logger.info(
            "received network error response, aborting request..."
          );
          this.emit("error", new TypeError("Network error"));
          this.terminate();
          return this;
        }
        const responseClone = mockedResponse.clone();
        this.respondWith(mockedResponse);
        this.logger.info(
          mockedResponse.status,
          mockedResponse.statusText,
          "(MOCKED)"
        );
        callback == null ? void 0 : callback();
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: true,
          request: capturedRequest,
          requestId
        });
        this.logger.info("request (mock) is completed");
        return this;
      }
      this.logger.info("no mocked response received!");
      this.once("response-internal", (message) => {
        this.logger.info(message.statusCode, message.statusMessage);
        this.logger.info("original response headers:", message.headers);
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: createResponse(message),
          isMockedResponse: false,
          request: capturedRequest,
          requestId
        });
      });
      return this.passthrough(chunk, encoding, callback);
    });
    return this;
  }
  emit(event, ...data) {
    this.logger.info("emit: %s", event);
    if (event === "response") {
      this.logger.info('found "response" event, cloning the response...');
      try {
        const response = data[0];
        const firstClone = cloneIncomingMessage(response);
        const secondClone = cloneIncomingMessage(response);
        this.emit("response-internal", secondClone);
        this.logger.info(
          'response successfully cloned, emitting "response" event...'
        );
        return super.emit(event, firstClone, ...data.slice(1));
      } catch (error) {
        this.logger.info("error when cloning response:", error);
        return super.emit(event, ...data);
      }
    }
    if (event === "error") {
      const error = data[0];
      const errorCode = error.code || "";
      this.logger.info("error:\n", error);
      if (_NodeClientRequest.suppressErrorCodes.includes(errorCode)) {
        if (this.state < 4 /* MockLookupEnd */) {
          if (!this.capturedError) {
            this.capturedError = error;
            this.logger.info("captured the first error:", this.capturedError);
          }
          return false;
        }
        if (this.state === 5 /* ResponseReceived */ && this.responseType === "mock") {
          return false;
        }
      }
    }
    return super.emit(event, ...data);
  }
  /**
   * Performs the intercepted request as-is.
   * Replays the captured request body chunks,
   * still emits the internal events, and wraps
   * up the request with `super.end()`.
   */
  passthrough(chunk, encoding, callback) {
    this.state = 5 /* ResponseReceived */;
    this.responseType = "passthrough";
    if (this.capturedError) {
      this.emit("error", this.capturedError);
      return this;
    }
    this.logger.info("writing request chunks...", this.chunks);
    for (const { chunk: chunk2, encoding: encoding2 } of this.chunks) {
      if (encoding2) {
        super.write(chunk2, encoding2);
      } else {
        super.write(chunk2);
      }
    }
    this.once("error", (error) => {
      this.logger.info("original request error:", error);
    });
    this.once("abort", () => {
      this.logger.info("original request aborted!");
    });
    this.once("response-internal", (message) => {
      this.logger.info(message.statusCode, message.statusMessage);
      this.logger.info("original response headers:", message.headers);
    });
    this.logger.info("performing original request...");
    return super.end(...[chunk, encoding, callback].filter(Boolean));
  }
  /**
   * Responds to this request instance using a mocked response.
   */
  respondWith(mockedResponse) {
    this.logger.info("responding with a mocked response...", mockedResponse);
    this.state = 5 /* ResponseReceived */;
    this.responseType = "mock";
    Object.defineProperties(this, {
      writableFinished: { value: true },
      writableEnded: { value: true }
    });
    this.emit("finish");
    const { status, statusText, headers, body } = mockedResponse;
    this.response.statusCode = status;
    this.response.statusMessage = statusText;
    const rawHeaders = getRawFetchHeaders(headers) || headers;
    if (rawHeaders) {
      this.response.headers = {};
      rawHeaders.forEach((headerValue, headerName) => {
        this.response.rawHeaders.push(headerName, headerValue);
        const insensitiveHeaderName = headerName.toLowerCase();
        const prevHeaders = this.response.headers[insensitiveHeaderName];
        this.response.headers[insensitiveHeaderName] = prevHeaders ? Array.prototype.concat([], prevHeaders, headerValue) : headerValue;
      });
    }
    this.logger.info("mocked response headers ready:", headers);
    this.res = this.response;
    this.emit("response", this.response);
    const isResponseStreamFinished = new DeferredPromise();
    const finishResponseStream = () => {
      this.logger.info("finished response stream!");
      this.response.push(null);
      this.response.complete = true;
      isResponseStreamFinished.resolve();
    };
    if (body) {
      const bodyReader = body.getReader();
      const readNextChunk = async () => {
        const { done, value } = await bodyReader.read();
        if (done) {
          finishResponseStream();
          return;
        }
        this.response.emit("data", value);
        return readNextChunk();
      };
      readNextChunk();
    } else {
      finishResponseStream();
    }
    isResponseStreamFinished.then(() => {
      this.logger.info("finalizing response...");
      this.response.emit("end");
      this.terminate();
      this.logger.info("request complete!");
    });
  }
  /**
   * Terminates a pending request.
   */
  terminate() {
    var _a;
    (_a = this.agent) == null ? void 0 : _a.destroy();
  }
};
var NodeClientRequest = _NodeClientRequest;
/**
 * The list of internal Node.js errors to suppress while
 * using the "mock" response source.
 */
NodeClientRequest.suppressErrorCodes = [
  "ENOTFOUND",
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ENETUNREACH",
  "EHOSTUNREACH"
];

// src/interceptors/ClientRequest/utils/normalizeClientRequestArgs.ts
import {
  Agent as HttpAgent,
  globalAgent as httpGlobalAgent
} from "http";
import {
  Agent as HttpsAgent,
  globalAgent as httpsGlobalAgent
} from "https";
import { parse as parseUrl } from "url";
import { Logger as Logger5 } from "@open-draft/logger";

// src/utils/getRequestOptionsByUrl.ts
function getRequestOptionsByUrl(url) {
  const options = {
    method: "GET",
    protocol: url.protocol,
    hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
    host: url.host,
    path: `${url.pathname}${url.search || ""}`
  };
  if (!!url.port) {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`;
  }
  return options;
}

// src/utils/getUrlByRequestOptions.ts
import { Agent } from "http";
import { Logger as Logger3 } from "@open-draft/logger";
var logger3 = new Logger3("utils getUrlByRequestOptions");
var DEFAULT_PATH = "/";
var DEFAULT_PROTOCOL = "http:";
var DEFAULT_HOST = "localhost";
var SSL_PORT = 443;
function getAgent(options) {
  return options.agent instanceof Agent ? options.agent : void 0;
}
function getProtocolByRequestOptions(options) {
  var _a;
  if (options.protocol) {
    return options.protocol;
  }
  const agent = getAgent(options);
  const agentProtocol = agent == null ? void 0 : agent.protocol;
  if (agentProtocol) {
    return agentProtocol;
  }
  const port = getPortByRequestOptions(options);
  const isSecureRequest = options.cert || port === SSL_PORT;
  return isSecureRequest ? "https:" : ((_a = options.uri) == null ? void 0 : _a.protocol) || DEFAULT_PROTOCOL;
}
function getPortByRequestOptions(options) {
  if (options.port) {
    return Number(options.port);
  }
  if (options.hostname != null) {
    const [, extractedPort] = options.hostname.match(/:(\d+)$/) || [];
    if (extractedPort != null) {
      return Number(extractedPort);
    }
  }
  const agent = getAgent(options);
  if (agent == null ? void 0 : agent.options.port) {
    return Number(agent.options.port);
  }
  if (agent == null ? void 0 : agent.defaultPort) {
    return Number(agent.defaultPort);
  }
  return void 0;
}
function getHostByRequestOptions(options) {
  const { hostname, host } = options;
  if (hostname != null) {
    return hostname.replace(/:\d+$/, "");
  }
  return host || DEFAULT_HOST;
}
function getAuthByRequestOptions(options) {
  if (options.auth) {
    const [username, password] = options.auth.split(":");
    return { username, password };
  }
}
function isRawIPv6Address(host) {
  return host.includes(":") && !host.startsWith("[") && !host.endsWith("]");
}
function getHostname(host, port) {
  const portString = typeof port !== "undefined" ? `:${port}` : "";
  if (isRawIPv6Address(host)) {
    return `[${host}]${portString}`;
  }
  if (typeof port === "undefined") {
    return host;
  }
  return `${host}${portString}`;
}
function getUrlByRequestOptions(options) {
  logger3.info("request options", options);
  if (options.uri) {
    logger3.info(
      'constructing url from explicitly provided "options.uri": %s',
      options.uri
    );
    return new URL(options.uri.href);
  }
  logger3.info("figuring out url from request options...");
  const protocol = getProtocolByRequestOptions(options);
  logger3.info("protocol", protocol);
  const host = getHostByRequestOptions(options);
  logger3.info("host", host);
  const port = getPortByRequestOptions(options);
  logger3.info("port", port);
  const hostname = getHostname(host, port);
  logger3.info("hostname", hostname);
  const path = options.path || DEFAULT_PATH;
  logger3.info("path", path);
  const credentials = getAuthByRequestOptions(options);
  logger3.info("credentials", credentials);
  const authString = credentials ? `${credentials.username}:${credentials.password}@` : "";
  logger3.info("auth string:", authString);
  const url = new URL(`${protocol}//${hostname}${path}`);
  url.username = (credentials == null ? void 0 : credentials.username) || "";
  url.password = (credentials == null ? void 0 : credentials.password) || "";
  logger3.info("created url:", url);
  return url;
}

// src/utils/cloneObject.ts
import { Logger as Logger4 } from "@open-draft/logger";
var logger4 = new Logger4("cloneObject");
function isPlainObject(obj) {
  var _a;
  logger4.info("is plain object?", obj);
  if (obj == null || !((_a = obj.constructor) == null ? void 0 : _a.name)) {
    logger4.info("given object is undefined, not a plain object...");
    return false;
  }
  logger4.info("checking the object constructor:", obj.constructor.name);
  return obj.constructor.name === "Object";
}
function cloneObject(obj) {
  logger4.info("cloning object:", obj);
  const enumerableProperties = Object.entries(obj).reduce(
    (acc, [key, value]) => {
      logger4.info("analyzing key-value pair:", key, value);
      acc[key] = isPlainObject(value) ? cloneObject(value) : value;
      return acc;
    },
    {}
  );
  return isPlainObject(obj) ? enumerableProperties : Object.assign(Object.getPrototypeOf(obj), enumerableProperties);
}

// src/interceptors/ClientRequest/utils/normalizeClientRequestArgs.ts
var logger5 = new Logger5("http normalizeClientRequestArgs");
function resolveRequestOptions(args, url) {
  if (typeof args[1] === "undefined" || typeof args[1] === "function") {
    logger5.info("request options not provided, deriving from the url", url);
    return getRequestOptionsByUrl(url);
  }
  if (args[1]) {
    logger5.info("has custom RequestOptions!", args[1]);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("derived RequestOptions from the URL:", requestOptionsFromUrl);
    logger5.info("cloning RequestOptions...");
    const clonedRequestOptions = cloneObject(args[1]);
    logger5.info("successfully cloned RequestOptions!", clonedRequestOptions);
    return {
      ...requestOptionsFromUrl,
      ...clonedRequestOptions
    };
  }
  logger5.info("using an empty object as request options");
  return {};
}
function overrideUrlByRequestOptions(url, options) {
  url.host = options.host || url.host;
  url.hostname = options.hostname || url.hostname;
  url.port = options.port ? options.port.toString() : url.port;
  if (options.path) {
    const parsedOptionsPath = parseUrl(options.path, false);
    url.pathname = parsedOptionsPath.pathname || "";
    url.search = parsedOptionsPath.search || "";
  }
  return url;
}
function resolveCallback(args) {
  return typeof args[1] === "function" ? args[1] : args[2];
}
function normalizeClientRequestArgs(defaultProtocol, ...args) {
  let url;
  let options;
  let callback;
  logger5.info("arguments", args);
  logger5.info("using default protocol:", defaultProtocol);
  if (args.length === 0) {
    const url2 = new URL("http://localhost");
    const options2 = resolveRequestOptions(args, url2);
    return [url2, options2];
  }
  if (typeof args[0] === "string") {
    logger5.info("first argument is a location string:", args[0]);
    url = new URL(args[0]);
    logger5.info("created a url:", url);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("request options from url:", requestOptionsFromUrl);
    options = resolveRequestOptions(args, url);
    logger5.info("resolved request options:", options);
    callback = resolveCallback(args);
  } else if (args[0] instanceof URL) {
    url = args[0];
    logger5.info("first argument is a URL:", url);
    if (typeof args[1] !== "undefined" && isObject(args[1])) {
      url = overrideUrlByRequestOptions(url, args[1]);
    }
    options = resolveRequestOptions(args, url);
    logger5.info("derived request options:", options);
    callback = resolveCallback(args);
  } else if ("hash" in args[0] && !("method" in args[0])) {
    const [legacyUrl] = args;
    logger5.info("first argument is a legacy URL:", legacyUrl);
    if (legacyUrl.hostname === null) {
      logger5.info("given legacy URL is relative (no hostname)");
      return isObject(args[1]) ? normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path, ...args[1] },
        args[2]
      ) : normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path },
        args[1]
      );
    }
    logger5.info("given legacy url is absolute");
    const resolvedUrl = new URL(legacyUrl.href);
    return args[1] === void 0 ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl) : typeof args[1] === "function" ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl, args[1]) : normalizeClientRequestArgs(
      defaultProtocol,
      resolvedUrl,
      args[1],
      args[2]
    );
  } else if (isObject(args[0])) {
    options = args[0];
    logger5.info("first argument is RequestOptions:", options);
    options.protocol = options.protocol || defaultProtocol;
    logger5.info("normalized request options:", options);
    url = getUrlByRequestOptions(options);
    logger5.info("created a URL from RequestOptions:", url.href);
    callback = resolveCallback(args);
  } else {
    throw new Error(
      `Failed to construct ClientRequest with these parameters: ${args}`
    );
  }
  options.protocol = options.protocol || url.protocol;
  options.method = options.method || "GET";
  if (typeof options.agent === "undefined") {
    const agent = options.protocol === "https:" ? new HttpsAgent({
      rejectUnauthorized: options.rejectUnauthorized
    }) : new HttpAgent();
    options.agent = agent;
    logger5.info("resolved fallback agent:", agent);
  }
  if (!options._defaultAgent) {
    logger5.info(
      'has no default agent, setting the default agent for "%s"',
      options.protocol
    );
    options._defaultAgent = options.protocol === "https:" ? httpsGlobalAgent : httpGlobalAgent;
  }
  logger5.info("successfully resolved url:", url.href);
  logger5.info("successfully resolved options:", options);
  logger5.info("successfully resolved callback:", callback);
  return [url, options, callback];
}

// src/interceptors/ClientRequest/http.get.ts
function get(protocol, options) {
  return function interceptorsHttpGet(...args) {
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    const request2 = new NodeClientRequest(clientRequestArgs, options);
    request2.end();
    return request2;
  };
}

// src/interceptors/ClientRequest/http.request.ts
import { Logger as Logger6 } from "@open-draft/logger";
var logger6 = new Logger6("http request");
function request(protocol, options) {
  return function interceptorsHttpRequest(...args) {
    logger6.info('request call (protocol "%s"):', protocol, args);
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    return new NodeClientRequest(clientRequestArgs, options);
  };
}

// src/interceptors/ClientRequest/index.ts
var _ClientRequestInterceptor = class extends Interceptor {
  constructor() {
    super(_ClientRequestInterceptor.interceptorSymbol);
    this.modules = /* @__PURE__ */ new Map();
    this.modules.set("http", http);
    this.modules.set("https", https);
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    for (const [protocol, requestModule] of this.modules) {
      const { request: pureRequest, get: pureGet } = requestModule;
      this.subscriptions.push(() => {
        requestModule.request = pureRequest;
        requestModule.get = pureGet;
        logger7.info('native "%s" module restored!', protocol);
      });
      const options = {
        emitter: this.emitter,
        logger: this.logger
      };
      requestModule.request = // Force a line break.
      request(protocol, options);
      requestModule.get = // Force a line break.
      get(protocol, options);
      logger7.info('native "%s" module patched!', protocol);
    }
  }
};
var ClientRequestInterceptor = _ClientRequestInterceptor;
ClientRequestInterceptor.interceptorSymbol = Symbol("http");

export {
  ClientRequestInterceptor
};
//# sourceMappingURL=chunk-CCASONWB.mjs.map