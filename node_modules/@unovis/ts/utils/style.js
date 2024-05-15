import { injectGlobal } from '@emotion/css';
import { kebabCaseToCamel } from './text.js';

function getCssVarNames(cssVarsObject, prefix) {
    const defaultPrefix = '--vis-';
    const entries = Object.entries(cssVarsObject);
    return Object.fromEntries(entries.map(([key]) => [kebabCaseToCamel(key.replace(prefix !== null && prefix !== void 0 ? prefix : defaultPrefix, '')), key]));
}
function injectGlobalCssVariables(cssVarsObject, componentRootClassName) {
    injectGlobal({
        ':root': cssVarsObject,
        [`body.theme-dark .${componentRootClassName}`]: Object.keys(cssVarsObject)
            .filter(key => key.includes('--vis-dark'))
            .map(key => ({
            [key.replace('--vis-dark', '--vis')]: `var(${key})`,
        })),
    });
}
function cssvar(name) {
    return `var(${name})`;
}

export { cssvar, getCssVarNames, injectGlobalCssVariables };
//# sourceMappingURL=style.js.map
