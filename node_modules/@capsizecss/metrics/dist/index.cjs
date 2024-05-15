"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function fontFamilyToCamelCase(str) {
  return str.split(/[\s|-]/).filter(Boolean).map(
    (s, i) => `${s.charAt(0)[i > 0 ? "toUpperCase" : "toLowerCase"]()}${s.slice(1)}`
  ).join("");
}
exports.fontFamilyToCamelCase = fontFamilyToCamelCase;
