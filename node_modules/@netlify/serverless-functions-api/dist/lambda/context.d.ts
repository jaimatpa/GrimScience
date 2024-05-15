export interface LambdaContext {
    callbackWaitsForEmptyEventLoop: boolean;
    clientContext: ClientContext;
}
interface ClientContext {
    custom?: {
        blobs?: string;
        netlify?: string;
        purge_api_token?: string;
    };
    identity?: {
        url: string;
        token: string;
    };
}
export {};
