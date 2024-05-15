import { TransformValues } from "../types/svg";
export declare const allowedSvgTags: string[];
export declare function getTransformValues(svgElement: SVGElement): TransformValues;
export declare function transformValuesToString(transformValues: TransformValues): string;
export declare function sanitizeSvgString(svgString: string, allowedTags?: string[]): string;
export declare function isStringSvg(input: string): boolean;
