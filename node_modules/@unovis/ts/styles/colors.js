import { hsl } from 'd3-color';
import { isNumber } from '../utils/data.js';

/** Array of default colors */
const colors = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_COLORS) || ['#4D8CFD', '#FF6B7E', '#F4B83E', '#A6CC74', '#00C19A', '#6859BE'];
const colorsDark = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_COLORS_DARK) || ['#4D8CFD', '#FF6B7E', '#FFC16D', '#A6CC74', '#00C19A', '#7887E0'];
/** Return a CSS Variable name for a given color index or string */
const getCSSColorVariable = (suffix) => {
    return `--vis-${isNumber(suffix) ? `color${suffix % colors.length}` : suffix}`;
};
function getLighterColor(hex, percentage = 0.4) {
    const c = hsl(hex);
    c.l = c.l * (1 + percentage);
    return c.formatHex();
}
function getDarkerColor(hex, percentageL = 0.4, percentageS = 0.6) {
    const c = hsl(hex);
    c.s = c.s * (1 - percentageS);
    c.l = c.l * (1 - percentageL);
    return c.formatHex();
}

export { colors, colorsDark, getCSSColorVariable, getDarkerColor, getLighterColor };
//# sourceMappingURL=colors.js.map
