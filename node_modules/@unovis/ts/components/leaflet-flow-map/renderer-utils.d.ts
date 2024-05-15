import { Color } from 'three/src/math/Color.js';
export declare const DEFAULT_POINT_RADIUS = 1;
export declare const DEFAULT_POINT_COLOR = "rgba(255, 113, 111, 1.000)";
export declare function getRadius(r: number | undefined, devicePixelRatio: number): number;
export declare function getColor(color: string | undefined): Color;
