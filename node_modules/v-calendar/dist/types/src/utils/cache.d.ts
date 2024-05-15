export default class Cache<T> {
    size: number;
    createKey: (...args: any[]) => string;
    createItem: (...args: any[]) => T;
    keys: string[];
    store: Record<string, T>;
    constructor(size: number, createKey: (...args: any[]) => string, createItem: (...args: any[]) => T);
    get(...args: any[]): T;
    getOrSet(...args: any[]): T;
}
