import {
  BatchInterceptor
} from "./chunk-GUY7XK43.mjs";
import {
  ClientRequestInterceptor
} from "./chunk-CCASONWB.mjs";
import {
  XMLHttpRequestInterceptor
} from "./chunk-VUILOQBY.mjs";
import "./chunk-6HYIRFX2.mjs";
import "./chunk-IBYBTTYK.mjs";
import "./chunk-DERTLGL3.mjs";
import "./chunk-HAGW22AN.mjs";
import {
  emitAsync,
  toInteractiveRequest
} from "./chunk-OUWBQF3Z.mjs";
import {
  Interceptor
} from "./chunk-QED3Q6Z2.mjs";

// src/RemoteHttpInterceptor.ts
var RemoteHttpInterceptor = class extends BatchInterceptor {
  constructor() {
    super({
      name: "remote-interceptor",
      interceptors: [
        new ClientRequestInterceptor(),
        new XMLHttpRequestInterceptor()
      ]
    });
  }
  setup() {
    super.setup();
    let handleParentMessage;
    this.on("request", async ({ request, requestId }) => {
      var _a;
      const serializedRequest = JSON.stringify({
        id: requestId,
        method: request.method,
        url: request.url,
        headers: Array.from(request.headers.entries()),
        credentials: request.credentials,
        body: ["GET", "HEAD"].includes(request.method) ? null : await request.text()
      });
      this.logger.info(
        "sent serialized request to the child:",
        serializedRequest
      );
      (_a = process.send) == null ? void 0 : _a.call(process, `request:${serializedRequest}`);
      const responsePromise = new Promise((resolve) => {
        handleParentMessage = (message) => {
          if (typeof message !== "string") {
            return resolve();
          }
          if (message.startsWith(`response:${requestId}`)) {
            const [, serializedResponse] = message.match(/^response:.+?:(.+)$/) || [];
            if (!serializedResponse) {
              return resolve();
            }
            const responseInit = JSON.parse(
              serializedResponse
            );
            const mockedResponse = new Response(responseInit.body, {
              status: responseInit.status,
              statusText: responseInit.statusText,
              headers: responseInit.headers
            });
            request.respondWith(mockedResponse);
            return resolve();
          }
        };
      });
      this.logger.info(
        'add "message" listener to the parent process',
        handleParentMessage
      );
      process.addListener("message", handleParentMessage);
      return responsePromise;
    });
    this.subscriptions.push(() => {
      process.removeListener("message", handleParentMessage);
    });
  }
};
function requestReviver(key, value) {
  switch (key) {
    case "url":
      return new URL(value);
    case "headers":
      return new Headers(value);
    default:
      return value;
  }
}
var _RemoteHttpResolver = class extends Interceptor {
  constructor(options) {
    super(_RemoteHttpResolver.symbol);
    this.process = options.process;
  }
  setup() {
    const logger = this.logger.extend("setup");
    const handleChildMessage = async (message) => {
      logger.info("received message from child!", message);
      if (typeof message !== "string" || !message.startsWith("request:")) {
        logger.info("unknown message, ignoring...");
        return;
      }
      const [, serializedRequest] = message.match(/^request:(.+)$/) || [];
      if (!serializedRequest) {
        return;
      }
      const requestJson = JSON.parse(
        serializedRequest,
        requestReviver
      );
      logger.info("parsed intercepted request", requestJson);
      const capturedRequest = new Request(requestJson.url, {
        method: requestJson.method,
        headers: new Headers(requestJson.headers),
        credentials: requestJson.credentials,
        body: requestJson.body
      });
      const { interactiveRequest, requestController } = toInteractiveRequest(capturedRequest);
      this.emitter.once("request", () => {
        if (requestController.responsePromise.state === "pending") {
          requestController.respondWith(void 0);
        }
      });
      await emitAsync(this.emitter, "request", {
        request: interactiveRequest,
        requestId: requestJson.id
      });
      const mockedResponse = await requestController.responsePromise;
      if (!mockedResponse) {
        return;
      }
      logger.info("event.respondWith called with:", mockedResponse);
      const responseClone = mockedResponse.clone();
      const responseText = await mockedResponse.text();
      const serializedResponse = JSON.stringify({
        status: mockedResponse.status,
        statusText: mockedResponse.statusText,
        headers: Array.from(mockedResponse.headers.entries()),
        body: responseText
      });
      this.process.send(
        `response:${requestJson.id}:${serializedResponse}`,
        (error) => {
          if (error) {
            return;
          }
          this.emitter.emit("response", {
            response: responseClone,
            isMockedResponse: true,
            request: capturedRequest,
            requestId: requestJson.id
          });
        }
      );
      logger.info(
        "sent serialized mocked response to the parent:",
        serializedResponse
      );
    };
    this.subscriptions.push(() => {
      this.process.removeListener("message", handleChildMessage);
      logger.info('removed the "message" listener from the child process!');
    });
    logger.info('adding a "message" listener to the child process');
    this.process.addListener("message", handleChildMessage);
    this.process.once("error", () => this.dispose());
    this.process.once("exit", () => this.dispose());
  }
};
var RemoteHttpResolver = _RemoteHttpResolver;
RemoteHttpResolver.symbol = Symbol("remote-resolver");
export {
  RemoteHttpInterceptor,
  RemoteHttpResolver,
  requestReviver
};
//# sourceMappingURL=RemoteHttpInterceptor.mjs.map