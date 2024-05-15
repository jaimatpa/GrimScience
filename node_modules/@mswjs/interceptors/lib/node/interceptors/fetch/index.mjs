import {
  isPropertyAccessible
} from "../../chunk-DERTLGL3.mjs";
import {
  IS_PATCHED_MODULE
} from "../../chunk-HAGW22AN.mjs";
import {
  emitAsync,
  toInteractiveRequest
} from "../../chunk-OUWBQF3Z.mjs";
import {
  Interceptor,
  createRequestId
} from "../../chunk-QED3Q6Z2.mjs";

// src/interceptors/fetch/index.ts
import { invariant } from "outvariant";
import { DeferredPromise } from "@open-draft/deferred-promise";
import { until } from "@open-draft/until";

// src/utils/canParseUrl.ts
function canParseUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_error) {
    return false;
  }
}

// src/interceptors/fetch/index.ts
var _FetchInterceptor = class extends Interceptor {
  constructor() {
    super(_FetchInterceptor.symbol);
  }
  checkEnvironment() {
    return typeof globalThis !== "undefined" && typeof globalThis.fetch !== "undefined";
  }
  async setup() {
    const pureFetch = globalThis.fetch;
    invariant(
      !pureFetch[IS_PATCHED_MODULE],
      'Failed to patch the "fetch" module: already patched.'
    );
    globalThis.fetch = async (input, init) => {
      var _a;
      const requestId = createRequestId();
      const resolvedInput = typeof input === "string" && typeof location !== "undefined" && !canParseUrl(input) ? new URL(input, location.origin) : input;
      const request = new Request(resolvedInput, init);
      this.logger.info("[%s] %s", request.method, request.url);
      const { interactiveRequest, requestController } = toInteractiveRequest(request);
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.emitter.once("request", ({ requestId: pendingRequestId }) => {
        if (pendingRequestId !== requestId) {
          return;
        }
        if (requestController.responsePromise.state === "pending") {
          requestController.responsePromise.resolve(void 0);
        }
      });
      this.logger.info("awaiting for the mocked response...");
      const signal = interactiveRequest.signal;
      const requestAborted = new DeferredPromise();
      if (signal) {
        signal.addEventListener(
          "abort",
          () => {
            requestAborted.reject(signal.reason);
          },
          { once: true }
        );
      }
      const resolverResult = await until(async () => {
        const listenersFinished = emitAsync(this.emitter, "request", {
          request: interactiveRequest,
          requestId
        });
        await Promise.race([
          requestAborted,
          // Put the listeners invocation Promise in the same race condition
          // with the request abort Promise because otherwise awaiting the listeners
          // would always yield some response (or undefined).
          listenersFinished,
          requestController.responsePromise
        ]);
        this.logger.info("all request listeners have been resolved!");
        const mockedResponse2 = await requestController.responsePromise;
        this.logger.info("event.respondWith called with:", mockedResponse2);
        return mockedResponse2;
      });
      if (requestAborted.state === "rejected") {
        return Promise.reject(requestAborted.rejectionReason);
      }
      if (resolverResult.error) {
        return Promise.reject(createNetworkError(resolverResult.error));
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse && !((_a = request.signal) == null ? void 0 : _a.aborted)) {
        this.logger.info("received mocked response:", mockedResponse);
        if (isPropertyAccessible(mockedResponse, "type") && mockedResponse.type === "error") {
          this.logger.info(
            "received a network error response, rejecting the request promise..."
          );
          return Promise.reject(createNetworkError(mockedResponse));
        }
        const responseClone = mockedResponse.clone();
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: true,
          request: interactiveRequest,
          requestId
        });
        Object.defineProperty(mockedResponse, "url", {
          writable: false,
          enumerable: true,
          configurable: false,
          value: request.url
        });
        return mockedResponse;
      }
      this.logger.info("no mocked response received!");
      return pureFetch(request).then((response) => {
        const responseClone = response.clone();
        this.logger.info("original fetch performed", responseClone);
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: false,
          request: interactiveRequest,
          requestId
        });
        return response;
      });
    };
    Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
      enumerable: true,
      configurable: true,
      value: true
    });
    this.subscriptions.push(() => {
      Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
        value: void 0
      });
      globalThis.fetch = pureFetch;
      this.logger.info(
        'restored native "globalThis.fetch"!',
        globalThis.fetch.name
      );
    });
  }
};
var FetchInterceptor = _FetchInterceptor;
FetchInterceptor.symbol = Symbol("fetch");
function createNetworkError(cause) {
  return Object.assign(new TypeError("Failed to fetch"), {
    cause
  });
}
export {
  FetchInterceptor
};
//# sourceMappingURL=index.mjs.map