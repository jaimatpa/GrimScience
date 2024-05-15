import { ClientRequestInterceptor } from '../interceptors/ClientRequest/index.js';
import { XMLHttpRequestInterceptor } from '../interceptors/XMLHttpRequest/index.js';
import 'http';
import 'https';
import 'strict-event-emitter';
import '../Interceptor-6696a18d.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';

/**
 * The default preset provisions the interception of requests
 * regardless of their type (http/https/XMLHttpRequest).
 */
declare const _default: readonly [ClientRequestInterceptor, XMLHttpRequestInterceptor];

export { _default as default };
