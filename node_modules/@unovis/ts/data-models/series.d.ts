import { CoreDataModel } from './core';
export declare class SeriesDataModel<Datum> extends CoreDataModel<Datum[]> {
    constructor(data?: Datum[]);
    get data(): Datum[];
    set data(data: Datum[]);
}
