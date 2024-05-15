export declare class CoreDataModel<T> {
    protected _data: T | undefined;
    get data(): T;
    set data(value: T);
    constructor(data?: T);
}
