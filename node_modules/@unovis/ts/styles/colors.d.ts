/** Array of default colors */
export declare const colors: string[];
export declare const colorsDark: string[];
/** Return a CSS Variable name for a given color index or string */
export declare const getCSSColorVariable: (suffix: string | number) => string;
export declare function getLighterColor(hex: string, percentage?: number): string;
export declare function getDarkerColor(hex: string, percentageL?: number, percentageS?: number): string;
