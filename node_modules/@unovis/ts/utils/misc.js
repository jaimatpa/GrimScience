import { isString, getString } from './data.js';
import toPx from 'to-px';

function guid() {
    const s4 = () => Math.floor((1 + crypto.getRandomValues(new Uint32Array(1))[0]) * 0x10000)
        .toString(16)
        .substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
function stringToHtmlId(str) {
    return (str || '').replace(/\W/g, '_');
}
function isStringCSSVariable(s) {
    return isString(s) ? (s.substring(0, 6) === 'var(--') : false;
}
function getCSSVariableValue(s, context) {
    if (!isString(s))
        return '';
    const variableName = s.substr(4, s.length - 5);
    return getComputedStyle(context).getPropertyValue(variableName);
}
function getCSSVariableValueInPixels(s, context) {
    const val = getCSSVariableValue(s, context);
    return toPx(val);
}
function getPixelValue(v) {
    return typeof v === 'number' ? v : toPx(v);
}
function rectIntersect(rect1, rect2, tolerancePx = 0) {
    const [left1, top1, right1, bottom1] = [
        rect1.x + tolerancePx,
        rect1.y + rect1.height - 2 * tolerancePx,
        rect1.x + rect1.width - 2 * tolerancePx,
        rect1.y + tolerancePx,
    ];
    const [left2, top2, right2, bottom2] = [
        rect2.x + tolerancePx,
        rect2.y + rect2.height - 2 * tolerancePx,
        rect2.x + rect2.width - 2 * tolerancePx,
        rect2.y + tolerancePx,
    ];
    return !(top1 < bottom2 || top2 < bottom1 || right1 < left2 || right2 < left1);
}
function getHref(d, identifier) {
    const id = getString(d, identifier);
    return id ? `url(#${id})` : null;
}
function parseUnit(value, basis = 0) {
    if (!value)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (value.endsWith('%'))
        return basis * parseFloat(value) / 100;
    else if (value.endsWith('px'))
        return parseFloat(value);
    else
        return parseFloat(value) || 0;
}

export { getCSSVariableValue, getCSSVariableValueInPixels, getHref, getPixelValue, guid, isStringCSSVariable, parseUnit, rectIntersect, stringToHtmlId };
//# sourceMappingURL=misc.js.map
