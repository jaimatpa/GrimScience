export declare function omit<T extends Record<string, any>, K extends keyof T>(object: T, keysToOmit: K[] | any[]): Pick<T, Exclude<keyof T, K>>;
export declare function get(object: Record<string, any>, path: (string | number)[] | string, defaultValue?: any): any;
