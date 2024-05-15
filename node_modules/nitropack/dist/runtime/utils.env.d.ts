export type EnvOptions = {
    prefix?: string;
    altPrefix?: string;
    envExpansion?: boolean;
};
export declare function getEnv(key: string, opts: EnvOptions): unknown;
export declare function applyEnv(obj: object, opts: EnvOptions, parentKey?: string): object;
