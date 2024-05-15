import type { Flags } from './flags.js';
export declare const requestFlags: unique symbol;
export declare const requestRoute: unique symbol;
declare const BaseRequest: {
    new (input: URL | RequestInfo, init?: RequestInit | undefined): Request;
    prototype: Request;
};
export declare class NetlifyRequest extends BaseRequest {
    [requestFlags]?: Flags;
    [requestRoute]?: string;
}
export declare const buildRequestBody: (body: string | undefined, isBase64Encoded: boolean) => BodyInit | undefined;
export {};
