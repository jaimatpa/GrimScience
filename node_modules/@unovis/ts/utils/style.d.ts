import type { KebabToCamelCase, RemovePrefix } from "./type";
export declare function getCssVarNames<T extends Record<string, unknown>, Prefix extends string = '--vis-'>(cssVarsObject: T, prefix?: Prefix): {
    [Property in Extract<keyof T, string> as KebabToCamelCase<RemovePrefix<Property, Prefix>>]: Property;
};
export declare function injectGlobalCssVariables<T extends Record<string, string | number | undefined>>(cssVarsObject: T, componentRootClassName: string): void;
export declare function cssvar<T extends string>(name: T): `var(${T})`;
