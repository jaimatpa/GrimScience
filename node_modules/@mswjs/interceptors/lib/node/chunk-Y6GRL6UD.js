"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/isPropertyAccessible.ts
function isPropertyAccessible(obj, key) {
  try {
    obj[key];
    return true;
  } catch (e) {
    return false;
  }
}



exports.isPropertyAccessible = isPropertyAccessible;
//# sourceMappingURL=chunk-Y6GRL6UD.js.map