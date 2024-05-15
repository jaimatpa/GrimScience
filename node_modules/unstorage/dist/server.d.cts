import { RequestListener } from 'node:http';
import { H3Event, EventHandler } from 'h3';
import { a as Storage } from './shared/unstorage.5b07592d.cjs';

type StorageServerRequest = {
    event: H3Event;
    key: string;
    type: "read" | "write";
};
interface StorageServerOptions {
    authorize?: (request: StorageServerRequest) => void | Promise<void>;
    resolvePath?: (event: H3Event) => string;
}
declare function createH3StorageHandler(storage: Storage, opts?: StorageServerOptions): EventHandler;
declare function createStorageServer(storage: Storage, options?: StorageServerOptions): {
    handle: RequestListener;
};

export { type StorageServerOptions, type StorageServerRequest, createH3StorageHandler, createStorageServer };
