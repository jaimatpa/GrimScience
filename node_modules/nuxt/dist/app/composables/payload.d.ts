interface LoadPayloadOptions {
    fresh?: boolean;
    hash?: string;
}
/** @since 3.0.0 */
export declare function loadPayload(url: string, opts?: LoadPayloadOptions): Record<string, any> | Promise<Record<string, any>> | null;
/** @since 3.0.0 */
export declare function preloadPayload(url: string, opts?: LoadPayloadOptions): void;
/** @since 3.0.0 */
export declare function isPrerendered(url?: any): Promise<boolean>;
/** @since 3.4.0 */
export declare function getNuxtClientPayload(): Promise<any>;
export declare function parsePayload(payload: string): Promise<any>;
/**
 * This is an experimental function for configuring passing rich data from server -> client.
 * @since 3.4.0
 */
export declare function definePayloadReducer(name: string, reduce: (data: any) => any): void;
/**
 * This is an experimental function for configuring passing rich data from server -> client.
 *
 * This function _must_ be called in a Nuxt plugin that is `unshift`ed to the beginning of the Nuxt plugins array.
 * @since 3.4.0
 */
export declare function definePayloadReviver(name: string, revive: (data: any) => any | undefined): void;
export {};
