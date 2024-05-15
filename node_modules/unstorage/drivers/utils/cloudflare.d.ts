/// <reference types="@cloudflare/workers-types" />
export declare function getBinding(binding: KVNamespace | R2Bucket | string): KVNamespace<string> | R2Bucket;
export declare function getKVBinding(binding?: KVNamespace | string): KVNamespace<string>;
export declare function getR2Binding(binding?: R2Bucket | string): R2Bucket;
