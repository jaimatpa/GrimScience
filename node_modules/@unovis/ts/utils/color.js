import { color } from 'd3-color';
import { getCSSColorVariable } from '../styles/colors.js';
import { getString, isNumber } from './data.js';
import { isStringCSSVariable, getCSSVariableValue } from './misc.js';

/** Retrieves color from the data if provided, fallbacks to CSS variables if the index was passed */
function getColor(d, accessor, index, dontFallbackToCssVar) {
    if (Array.isArray(accessor) && isFinite(index))
        return accessor[index % accessor.length];
    const value = getString(d, accessor, index);
    return (value || ((isNumber(index) && !dontFallbackToCssVar) ? `var(${getCSSColorVariable(index)})` : null));
}
function hexToRgb(hex) {
    const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return parsed ? {
        r: parseInt(parsed[1], 16),
        g: parseInt(parsed[2], 16),
        b: parseInt(parsed[3], 16),
    } : { r: 0, g: 0, b: 0 };
}
function rgbToBrightness(rgb) {
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
}
function hexToBrightness(hex) {
    const rgb = hexToRgb(hex);
    return rgbToBrightness(rgb);
}
function getHexValue(s, context) {
    var _a;
    const hex = isStringCSSVariable(s) ? getCSSVariableValue(s, context) : s;
    return (_a = color(hex)) === null || _a === void 0 ? void 0 : _a.formatHex();
}
function rgbaToRgb(rgba, backgroundColor) {
    var _a;
    const rgb = (_a = color(rgba)) === null || _a === void 0 ? void 0 : _a.rgb();
    if (!rgb || rgb.opacity === 1)
        return rgb;
    const alpha = 1 - rgb.opacity;
    const bg = color(backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : '#fff').rgb();
    return {
        r: Math.round((rgb.opacity * (rgb.r / 255) + (alpha * (bg.r / 255))) * 255),
        g: Math.round((rgb.opacity * (rgb.g / 255) + (alpha * (bg.g / 255))) * 255),
        b: Math.round((rgb.opacity * (rgb.b / 255) + (alpha * (bg.b / 255))) * 255),
    };
}

export { getColor, getHexValue, hexToBrightness, hexToRgb, rgbToBrightness, rgbaToRgb };
//# sourceMappingURL=color.js.map
