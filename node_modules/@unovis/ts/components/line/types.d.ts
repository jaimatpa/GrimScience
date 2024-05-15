/** Data type for Line Generator: [x, y, defined] */
export declare type LineDatum = {
    x: number;
    y: number;
    value: number | null | undefined;
    defined: boolean;
};
export declare type LineData = {
    values: LineDatum[];
    defined: boolean;
    visible: boolean;
};
