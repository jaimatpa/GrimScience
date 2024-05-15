/** The most generic data record: an object with unknown properties */
export declare type GenericDataRecord = Record<string, unknown>;
/** Extension of a numbers array that carries additional information required for plotting stacked data */
export declare type StackValuesRecord = Array<[number, number]> & {
    negative?: boolean;
    ending?: boolean;
};
