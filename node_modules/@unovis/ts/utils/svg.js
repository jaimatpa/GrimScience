import striptags from 'striptags';
import { allowedSvgTextTags } from './text.js';

const allowedSvgTags = [
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'defs', 'clipPath', 'use', 'symbol', 'image', 'marker', 'style', 'mask',
    ...allowedSvgTextTags,
];
function getTransformValues(svgElement) {
    // Get the transform attribute value from the SVG element
    const transformAttribute = svgElement.getAttribute('transform');
    // Regular expressions to extract translate and scale values from the transform attribute
    const translateRegex = /translate\(\s*(-?[\d.]+)\s*,?\s*(-?[\d.]+)?\s*\)/;
    const scaleRegex = /scale\(\s*(-?[\d.]+)\s*,?\s*(-?[\d.]+)?\s*\)/;
    // Initialize default values
    const transformValues = {
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
    };
    if (transformAttribute) {
        // Extract translate values
        const translateMatches = transformAttribute.match(translateRegex);
        if (translateMatches) {
            transformValues.translate.x = parseFloat(translateMatches[1]);
            transformValues.translate.y = translateMatches[2] ? parseFloat(translateMatches[2]) : 0;
        }
        // Extract scale values
        const scaleMatches = transformAttribute.match(scaleRegex);
        if (scaleMatches) {
            transformValues.scale.x = parseFloat(scaleMatches[1]);
            transformValues.scale.y = scaleMatches[2] ? parseFloat(scaleMatches[2]) : transformValues.scale.x;
        }
    }
    return transformValues;
}
function transformValuesToString(transformValues) {
    const translateString = `translate(${transformValues.translate.x} ${transformValues.translate.y})`;
    // Only include scaleString when both scale values are not 1
    const shouldIncludeScaleString = transformValues.scale.x !== 1 || transformValues.scale.y !== 1;
    const scaleString = shouldIncludeScaleString ? `scale(${transformValues.scale.x} ${transformValues.scale.y})` : '';
    // Combine the translate and scale strings into a single transform attribute string
    const transformString = scaleString
        ? `${translateString} ${scaleString}`
        : translateString;
    return transformString;
}
function sanitizeSvgString(svgString, allowedTags = allowedSvgTags) {
    return striptags(svgString, allowedTags);
}
function isStringSvg(input) {
    /* Since a general-purpose regex for this can be complex and potentially vulnerable
    * to ReDoS attacks, we'll create a simpler, safer regex that looks for a few common
    * SVG elements or attributes.
    */
    const svgElementsRegex = new RegExp(`<(${allowedSvgTags.join('|')})\\b`, 'i');
    const svgAttributesRegex = /\b(d|fill|stroke|transform|viewBox)=/i;
    return svgElementsRegex.test(input) || svgAttributesRegex.test(input);
}

export { allowedSvgTags, getTransformValues, isStringSvg, sanitizeSvgString, transformValuesToString };
//# sourceMappingURL=svg.js.map
