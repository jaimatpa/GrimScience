import type { H3Event } from 'h3';
import type { NuxtApp } from '../nuxt.js';
/** @since 3.0.0 */
export declare function useRequestEvent(nuxtApp?: NuxtApp): H3Event<import("h3").EventHandlerRequest> | undefined;
/** @since 3.0.0 */
export declare function useRequestHeaders<K extends string = string>(include: K[]): {
    [key in Lowercase<K>]?: string;
};
export declare function useRequestHeaders(): Readonly<Record<string, string>>;
/** @since 3.9.0 */
export declare function useRequestHeader(header: string): string | undefined;
/** @since 3.2.0 */
export declare function useRequestFetch(): typeof global.$fetch;
/** @since 3.0.0 */
export declare function setResponseStatus(event: H3Event, code?: number, message?: string): void;
/** @deprecated Pass `event` as first option. */
export declare function setResponseStatus(code: number, message?: string): void;
/** @since 3.8.0 */
export declare function prerenderRoutes(path: string | string[]): void;
