/**
 * Searches a key or value in the object, with a maximum deepness
 * @param {*} obj Search target
 * @param {string} searchTerm Search string
 * @returns {boolean} Search match
 */
export declare function searchDeepInObject(obj: any, searchTerm: any): any;
export declare function specialTokenToString(value: any): false | "undefined" | "NaN" | "Infinity" | "-Infinity" | "null";
