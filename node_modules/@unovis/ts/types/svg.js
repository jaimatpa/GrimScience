import { TextAlign } from './text.js';

/**
 * Converts a TextAlign value into an SVG text-anchor attribute value.
 *
 * @param {TextAlign | string} textAlign - The TextAlign value to convert.
 * @returns {'start' | 'middle' | 'end'} The corresponding text-anchor attribute value. Defaults to 'start' if an invalid TextAlign value is provided.
 */
function getTextAnchorFromTextAlign(textAlign) {
    switch (textAlign) {
        case TextAlign.Center:
            return 'middle';
        case TextAlign.Right:
            return 'end';
        case TextAlign.Left:
        default:
            return 'start';
    }
}

export { getTextAnchorFromTextAlign };
//# sourceMappingURL=svg.js.map
