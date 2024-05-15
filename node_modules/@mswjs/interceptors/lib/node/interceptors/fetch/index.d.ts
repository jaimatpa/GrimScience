import { f as Interceptor, H as HttpRequestEventMap } from '../../Interceptor-6696a18d.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';
import 'strict-event-emitter';

declare class FetchInterceptor extends Interceptor<HttpRequestEventMap> {
    static symbol: symbol;
    constructor();
    protected checkEnvironment(): boolean;
    protected setup(): Promise<void>;
}

export { FetchInterceptor };
