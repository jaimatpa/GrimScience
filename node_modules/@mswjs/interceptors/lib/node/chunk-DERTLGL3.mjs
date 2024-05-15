// src/utils/isPropertyAccessible.ts
function isPropertyAccessible(obj, key) {
  try {
    obj[key];
    return true;
  } catch (e) {
    return false;
  }
}

export {
  isPropertyAccessible
};
//# sourceMappingURL=chunk-DERTLGL3.mjs.map