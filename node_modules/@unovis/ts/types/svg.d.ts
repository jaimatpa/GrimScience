import { TextAlign } from "./text";
export declare type TransformValues = {
    translate: {
        x: number;
        y: number;
    };
    scale: {
        x: number;
        y: number;
    };
};
/**
 * Converts a TextAlign value into an SVG text-anchor attribute value.
 *
 * @param {TextAlign | string} textAlign - The TextAlign value to convert.
 * @returns {'start' | 'middle' | 'end'} The corresponding text-anchor attribute value. Defaults to 'start' if an invalid TextAlign value is provided.
 */
export declare function getTextAnchorFromTextAlign(textAlign: TextAlign | string): 'start' | 'middle' | 'end';
