import { DeferredPromise } from '@open-draft/deferred-promise';

declare class RequestController {
    protected request: Request;
    responsePromise: DeferredPromise<Response | undefined>;
    constructor(request: Request);
    respondWith(response?: Response): void;
}

type InteractiveRequest = globalThis.Request & {
    respondWith: RequestController['respondWith'];
};

declare const IS_PATCHED_MODULE: unique symbol;
type RequestCredentials = 'omit' | 'include' | 'same-origin';
type HttpRequestEventMap = {
    request: [
        args: {
            request: InteractiveRequest;
            requestId: string;
        }
    ];
    response: [
        args: {
            response: Response;
            isMockedResponse: boolean;
            request: Request;
            requestId: string;
        }
    ];
};

export { HttpRequestEventMap as H, IS_PATCHED_MODULE as I, RequestCredentials as R, InteractiveRequest as a };
