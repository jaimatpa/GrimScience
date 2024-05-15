"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/RequestController.ts
var _outvariant = require('outvariant');
var _deferredpromise = require('@open-draft/deferred-promise');
var RequestController = class {
  constructor(request) {
    this.request = request;
    this.responsePromise = new (0, _deferredpromise.DeferredPromise)();
  }
  respondWith(response) {
    _outvariant.invariant.call(void 0, 
      this.responsePromise.state === "pending",
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    );
    this.responsePromise.resolve(response);
  }
};

// src/utils/toInteractiveRequest.ts
function toInteractiveRequest(request) {
  const requestController = new RequestController(request);
  Reflect.set(
    request,
    "respondWith",
    requestController.respondWith.bind(requestController)
  );
  return {
    interactiveRequest: request,
    requestController
  };
}

// src/utils/emitAsync.ts
async function emitAsync(emitter, eventName, ...data) {
  const listners = emitter.listeners(eventName);
  if (listners.length === 0) {
    return;
  }
  for (const listener of listners) {
    await listener.apply(emitter, data);
  }
}




exports.toInteractiveRequest = toInteractiveRequest; exports.emitAsync = emitAsync;
//# sourceMappingURL=chunk-MQJ3JOOK.js.map