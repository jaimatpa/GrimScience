import { ColorAccessor } from "../types/accessor";
declare type RGBColor = {
    r: number;
    g: number;
    b: number;
};
/** Retrieves color from the data if provided, fallbacks to CSS variables if the index was passed */
export declare function getColor<T>(d: T, accessor: ColorAccessor<T>, index?: number, dontFallbackToCssVar?: boolean): string | null;
export declare function hexToRgb(hex: string): RGBColor;
export declare function rgbToBrightness(rgb: RGBColor): number;
export declare function hexToBrightness(hex: string): number;
export declare function getHexValue(s: string, context: HTMLElement | SVGElement): string;
export declare function rgbaToRgb(rgba: string, backgroundColor?: string): RGBColor;
export {};
