declare type Pattern = {
    id: string;
    width?: number;
    height?: number;
};
declare type FillPattern = Pattern & {
    svg: string;
};
declare type LinePattern = Pattern & {
    marker: string;
    dashArray: number[];
};
export declare const PATTERN_SIZE_PX = 10;
export declare const fills: FillPattern[];
export declare const lines: LinePattern[];
export declare function getPatternVariable(p: Pattern): string;
export {};
