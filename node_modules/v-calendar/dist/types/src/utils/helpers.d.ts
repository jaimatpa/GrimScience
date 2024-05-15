import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
export { isFunction, isString };
export { default as isBoolean } from 'lodash/isBoolean';
export { default as isNumber } from 'lodash/isNumber';
export { default as isUndefined } from 'lodash/isUndefined';
export { default as get } from 'lodash/get';
export { default as set } from 'lodash/set';
export { default as mapValues } from 'lodash/mapValues';
export { default as defaults } from 'lodash/defaults';
export { default as defaultsDeep } from 'lodash/defaultsDeep';
export { default as map } from 'lodash/map';
export { default as head } from 'lodash/head';
export { default as last } from 'lodash/last';
export declare const getType: (value: any) => string;
export declare const isDate: (value: unknown) => value is Date;
export declare const isObject: (value: unknown) => value is Object;
export declare const has: <T>(object: T, path: import("lodash").PropertyPath) => boolean;
export declare const hasAny: (obj: object, props: string[]) => boolean;
export declare const some: {
    <T>(collection: import("lodash").List<T> | null | undefined, predicate?: import("lodash").ListIterateeCustom<T, boolean> | undefined): boolean;
    <T_1 extends object>(collection: T_1 | null | undefined, predicate?: import("lodash").ObjectIterateeCustom<T_1, boolean> | undefined): boolean;
};
export declare const pad: (val: string | number, len: number, char?: string) => string;
export declare const roundTenth: (n: number) => number;
export declare const isArray: (val: any) => val is any[];
export declare const arrayHasItems: (array: any) => boolean;
export declare const resolveEl: (target: unknown) => Node | null;
export interface ElementPosition {
    top: number;
    left: number;
}
export interface CustomElement {
    addEventListener: Function;
    removeEventListener: Function;
    dispatchEvent: Function;
}
export declare const off: (element: CustomElement, event: string, handler: (e: any) => void, opts?: boolean | EventListenerOptions | undefined) => void;
export declare const on: (element: CustomElement, event: string, handler: (e: any) => void, opts?: boolean | AddEventListenerOptions | undefined) => () => void;
export declare const elementContains: (element: Node, child: Node) => boolean;
export declare const onSpaceOrEnter: (event: KeyboardEvent, handler: (e: KeyboardEvent) => void) => void;
export declare const capitalize: (str: string) => string;
export declare const omit: <T extends object, K extends (keyof T)[]>(obj: T, ...keys: K) => { [K_1 in keyof T]: T[K_1]; };
export declare const pick: <T extends object, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
export declare function extend<T extends object, E extends object>(value: T, ext: E): T & E;
export declare function clamp(num: number, min: number, max: number): number;
export declare function hash(str: string): number;
