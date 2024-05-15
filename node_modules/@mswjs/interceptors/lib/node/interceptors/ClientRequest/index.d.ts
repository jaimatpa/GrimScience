import http from 'http';
import https from 'https';
import { Emitter } from 'strict-event-emitter';
import { H as HttpRequestEventMap, f as Interceptor } from '../../Interceptor-6696a18d.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';

type Protocol = 'http' | 'https';

type ClientRequestEmitter = Emitter<HttpRequestEventMap>;
type ClientRequestModules = Map<Protocol, typeof http | typeof https>;
/**
 * Intercept requests made via the `ClientRequest` class.
 * Such requests include `http.get`, `https.request`, etc.
 */
declare class ClientRequestInterceptor extends Interceptor<HttpRequestEventMap> {
    static interceptorSymbol: symbol;
    private modules;
    constructor();
    protected setup(): void;
}

export { ClientRequestEmitter, ClientRequestInterceptor, ClientRequestModules };
