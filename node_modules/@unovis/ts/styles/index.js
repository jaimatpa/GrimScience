import { injectGlobal } from '@emotion/css';
import { getCSSVariableValue } from '../utils/misc.js';
import { getCSSColorVariable, getLighterColor, colors, getDarkerColor, colorsDark } from './colors.js';
import { fills, getPatternVariable, lines } from './patterns.js';

const UNOVIS_ICON_FONT_FAMILY_DEFAULT = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_ICON_FONT_FAMILY) || 'FontAwesome';
const UNOVIS_FONT_WH_RATIO_DEFAULT = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_FONT_W2H_RATIO_DEFAULT) || 0.5;
const UNOVIS_TEXT_SEPARATOR_DEFAULT = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_TEXT_SEPARATOR_DEFAULT) || [' ', '-', '.', ','];
const UNOVIS_TEXT_HYPHEN_CHARACTER_DEFAULT = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_TEXT_HYPHEN_CHARACTER_DEFAULT) || '-';
const UNOVIS_TEXT_DEFAULT = (globalThis === null || globalThis === void 0 ? void 0 : globalThis.UNOVIS_TEXT_DEFAULT) || {
    text: '',
    fontSize: 12,
    fontFamily: 'var(--vis-font-family)',
    lineHeight: 1.25,
    marginTop: 0,
    marginBottom: 0,
};
const variables = injectGlobal `
  :root {
    label: vis-root-styles;
    --vis-font-family: Inter, Arial, "Helvetica Neue", Helvetica, sans-serif;
    --vis-font-wh-ratio: ${UNOVIS_FONT_WH_RATIO_DEFAULT};
    --vis-color-main: var(${getCSSColorVariable(0)});
    --vis-color-main-light: ${getLighterColor(colors[0])};
    --vis-color-main-dark: ${getDarkerColor(colors[0])};
    --vis-color-grey: #2a2a2a;
    ${colors.map((c, i) => `${getCSSColorVariable(i)}: ${c};`)}
    ${colorsDark.map((c, i) => `--vis-dark-color${i}: ${c};`)}
    ${fills.map((p, i) => `
      --${getPatternVariable(p)}: url(#${getPatternVariable(p)});
      --vis-pattern-fill${i}: var(--${getPatternVariable(p)});
    `)}
    ${lines.map((p, i) => {
    var _a;
    return `
      --${getPatternVariable(p)}: url(#${getPatternVariable(p)});
      --vis-pattern-marker${i}: var(--${getPatternVariable(p)});
      --vis-pattern-dasharray${i}: ${(_a = p.dashArray) === null || _a === void 0 ? void 0 : _a.join(' ')};
    `;
})}

    body.theme-dark {
      ${colors.map((c, i) => `${getCSSColorVariable(i)}: var(--vis-dark-color${i});`)}
    }

    body.theme-patterns {
      ${fills.map((_, i) => `path[style*="fill: var(${getCSSColorVariable(i)})"]  {
        mask: var(--vis-pattern-fill${i});
      }`)}
      ${lines.map((_, i) => `
      path[stroke="var(${getCSSColorVariable(i)})"]:not([style*="fill"]),
      path[style*="stroke: var(${getCSSColorVariable(i)})"]:not([style*="fill"]) {
        marker: var(--vis-pattern-marker${i});
        stroke-dasharray: var(--vis-pattern-dasharray${i});
      }
    `)}
}
`;
function getFontWidthToHeightRatio(context = window === null || window === void 0 ? void 0 : window.document.body) {
    return context ? +getCSSVariableValue('var(--vis-font-wh-ratio)', context) : UNOVIS_FONT_WH_RATIO_DEFAULT;
}

export { UNOVIS_FONT_WH_RATIO_DEFAULT, UNOVIS_ICON_FONT_FAMILY_DEFAULT, UNOVIS_TEXT_DEFAULT, UNOVIS_TEXT_HYPHEN_CHARACTER_DEFAULT, UNOVIS_TEXT_SEPARATOR_DEFAULT, getFontWidthToHeightRatio, variables };
//# sourceMappingURL=index.js.map
