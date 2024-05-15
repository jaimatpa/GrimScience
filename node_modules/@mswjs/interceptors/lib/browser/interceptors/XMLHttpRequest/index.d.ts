import { Emitter } from 'strict-event-emitter';
import { a as InteractiveRequest, H as HttpRequestEventMap } from '../../glossary-640c9679.js';
import { I as Interceptor } from '../../Interceptor-af98b768.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';

type XMLHttpRequestEventListener = (args: {
    request: InteractiveRequest;
    requestId: string;
}) => Promise<void> | void;
type XMLHttpRequestEmitter = Emitter<HttpRequestEventMap>;
declare class XMLHttpRequestInterceptor extends Interceptor<HttpRequestEventMap> {
    static interceptorSymbol: symbol;
    constructor();
    protected checkEnvironment(): boolean;
    protected setup(): void;
}

export { XMLHttpRequestEmitter, XMLHttpRequestEventListener, XMLHttpRequestInterceptor };
