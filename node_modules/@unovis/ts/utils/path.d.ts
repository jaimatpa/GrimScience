import { Path } from 'd3-path';
export declare type RoundedRectPathOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    tl: boolean;
    tr: boolean;
    bl: boolean;
    br: boolean;
};
export declare function roundedRectPath({ x, y, w, h, tl, tr, bl, br, r, }: RoundedRectPathOptions): string;
export declare function polygon(size: number, n?: number, endAngle?: number, open?: boolean): string;
export declare function circlePath(cx: number, cy: number, r: number): string;
export declare type ScoreRectPathOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    score: number;
};
export declare function scoreRectPath({ x, y, w, h, r, score }: ScoreRectPathOptions): string;
export declare function convertLineToArc(path: Path | string, r: number): string;
