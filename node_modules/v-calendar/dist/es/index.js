var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { reactive, computed, ref, watch, onUnmounted, provide, inject, onMounted, watchEffect, defineComponent, toRefs, nextTick, openBlock, createElementBlock, normalizeClass, createVNode, Transition, withCtx, mergeProps, renderSlot, createTextVNode, toDisplayString, createElementVNode, createCommentVNode, unref, createBlock, resolveDynamicComponent, normalizeProps, Fragment, renderList, normalizeStyle, withKeys, withDirectives, toRef, resolveComponent, resolveDirective, toHandlers, withModifiers, isRef, guardReactiveProps } from "vue";
import { createPopper } from "@popperjs/core";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var objectProto$g = Object.prototype;
var hasOwnProperty$d = objectProto$g.hasOwnProperty;
function baseHas$1(object, key) {
  return object != null && hasOwnProperty$d.call(object, key);
}
var _baseHas = baseHas$1;
var isArray$c = Array.isArray;
var isArray_1 = isArray$c;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$8 = freeGlobal || freeSelf || Function("return this")();
var _root = root$8;
var root$7 = _root;
var Symbol$5 = root$7.Symbol;
var _Symbol = Symbol$5;
var Symbol$4 = _Symbol;
var objectProto$f = Object.prototype;
var hasOwnProperty$c = objectProto$f.hasOwnProperty;
var nativeObjectToString$1 = objectProto$f.toString;
var symToStringTag$1 = Symbol$4 ? Symbol$4.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$c.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto$e = Object.prototype;
var nativeObjectToString = objectProto$e.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$3 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$3 ? Symbol$3.toStringTag : void 0;
function baseGetTag$a(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$a;
function isObjectLike$b(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$b;
var baseGetTag$9 = _baseGetTag, isObjectLike$a = isObjectLike_1;
var symbolTag$1 = "[object Symbol]";
function isSymbol$3(value) {
  return typeof value == "symbol" || isObjectLike$a(value) && baseGetTag$9(value) == symbolTag$1;
}
var isSymbol_1 = isSymbol$3;
var isArray$b = isArray_1, isSymbol$2 = isSymbol_1;
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey$3(value, object) {
  if (isArray$b(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol$2(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var _isKey = isKey$3;
function isObject$a(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$a;
var baseGetTag$8 = _baseGetTag, isObject$9 = isObject_1;
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$3(value) {
  if (!isObject$9(value)) {
    return false;
  }
  var tag = baseGetTag$8(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$3;
var root$6 = _root;
var coreJsData$1 = root$6["__core-js_shared__"];
var _coreJsData = coreJsData$1;
var coreJsData = _coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked$1;
var funcProto$2 = Function.prototype;
var funcToString$2 = funcProto$2.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$2 = isFunction_1, isMasked = _isMasked, isObject$8 = isObject_1, toSource$1 = _toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$d = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$b).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative$1(value) {
  if (!isObject$8(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue$1;
var baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$7(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var _getNative = getNative$7;
var getNative$6 = _getNative;
var nativeCreate$4 = getNative$6(Object, "create");
var _nativeCreate = nativeCreate$4;
var nativeCreate$3 = _nativeCreate;
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}
var _hashClear = hashClear$1;
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete$1;
var nativeCreate$2 = _nativeCreate;
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
function hashGet$1(key) {
  var data2 = this.__data__;
  if (nativeCreate$2) {
    var result = data2[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$a.call(data2, key) ? data2[key] : void 0;
}
var _hashGet = hashGet$1;
var nativeCreate$1 = _nativeCreate;
var objectProto$b = Object.prototype;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
function hashHas$1(key) {
  var data2 = this.__data__;
  return nativeCreate$1 ? data2[key] !== void 0 : hasOwnProperty$9.call(data2, key);
}
var _hashHas = hashHas$1;
var nativeCreate = _nativeCreate;
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet$1(key, value) {
  var data2 = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data2[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
var _hashSet = hashSet$1;
var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
function Hash$1(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash$1.prototype.clear = hashClear;
Hash$1.prototype["delete"] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;
var _Hash = Hash$1;
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear$1;
function eq$6(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$6;
var eq$5 = eq_1;
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$5(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf$4;
var assocIndexOf$3 = _assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete$1(key) {
  var data2 = this.__data__, index2 = assocIndexOf$3(data2, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data2.length - 1;
  if (index2 == lastIndex) {
    data2.pop();
  } else {
    splice.call(data2, index2, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete$1;
var assocIndexOf$2 = _assocIndexOf;
function listCacheGet$1(key) {
  var data2 = this.__data__, index2 = assocIndexOf$2(data2, key);
  return index2 < 0 ? void 0 : data2[index2][1];
}
var _listCacheGet = listCacheGet$1;
var assocIndexOf$1 = _assocIndexOf;
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas$1;
var assocIndexOf = _assocIndexOf;
function listCacheSet$1(key, value) {
  var data2 = this.__data__, index2 = assocIndexOf(data2, key);
  if (index2 < 0) {
    ++this.size;
    data2.push([key, value]);
  } else {
    data2[index2][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet$1;
var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
function ListCache$4(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype["delete"] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;
var _ListCache = ListCache$4;
var getNative$5 = _getNative, root$5 = _root;
var Map$3 = getNative$5(root$5, "Map");
var _Map = Map$3;
var Hash = _Hash, ListCache$3 = _ListCache, Map$2 = _Map;
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$2 || ListCache$3)(),
    "string": new Hash()
  };
}
var _mapCacheClear = mapCacheClear$1;
function isKeyable$1(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable = isKeyable$1;
var isKeyable = _isKeyable;
function getMapData$4(map, key) {
  var data2 = map.__data__;
  return isKeyable(key) ? data2[typeof key == "string" ? "string" : "hash"] : data2.map;
}
var _getMapData = getMapData$4;
var getMapData$3 = _getMapData;
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete$1;
var getMapData$2 = _getMapData;
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}
var _mapCacheGet = mapCacheGet$1;
var getMapData$1 = _getMapData;
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}
var _mapCacheHas = mapCacheHas$1;
var getMapData = _getMapData;
function mapCacheSet$1(key, value) {
  var data2 = getMapData(this, key), size = data2.size;
  data2.set(key, value);
  this.size += data2.size == size ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet$1;
var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
function MapCache$3(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache$3.prototype.clear = mapCacheClear;
MapCache$3.prototype["delete"] = mapCacheDelete;
MapCache$3.prototype.get = mapCacheGet;
MapCache$3.prototype.has = mapCacheHas;
MapCache$3.prototype.set = mapCacheSet;
var _MapCache = MapCache$3;
var MapCache$2 = _MapCache;
var FUNC_ERROR_TEXT = "Expected a function";
function memoize$1(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2)();
  return memoized;
}
memoize$1.Cache = MapCache$2;
var memoize_1 = memoize$1;
var memoize = memoize_1;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped$1(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var _memoizeCapped = memoizeCapped$1;
var memoizeCapped = _memoizeCapped;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath$1 = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
var _stringToPath = stringToPath$1;
function arrayMap$1(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index2 < length) {
    result[index2] = iteratee(array[index2], index2, array);
  }
  return result;
}
var _arrayMap = arrayMap$1;
var Symbol$2 = _Symbol, arrayMap = _arrayMap, isArray$a = isArray_1, isSymbol$1 = isSymbol_1;
var INFINITY$1 = 1 / 0;
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
function baseToString$1(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray$a(value)) {
    return arrayMap(value, baseToString$1) + "";
  }
  if (isSymbol$1(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
var _baseToString = baseToString$1;
var baseToString = _baseToString;
function toString$1(value) {
  return value == null ? "" : baseToString(value);
}
var toString_1 = toString$1;
var isArray$9 = isArray_1, isKey$2 = _isKey, stringToPath = _stringToPath, toString = toString_1;
function castPath$2(value, object) {
  if (isArray$9(value)) {
    return value;
  }
  return isKey$2(value, object) ? [value] : stringToPath(toString(value));
}
var _castPath = castPath$2;
var baseGetTag$7 = _baseGetTag, isObjectLike$9 = isObjectLike_1;
var argsTag$2 = "[object Arguments]";
function baseIsArguments$1(value) {
  return isObjectLike$9(value) && baseGetTag$7(value) == argsTag$2;
}
var _baseIsArguments = baseIsArguments$1;
var baseIsArguments = _baseIsArguments, isObjectLike$8 = isObjectLike_1;
var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;
var isArguments$3 = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike$8(value) && hasOwnProperty$8.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
var isArguments_1 = isArguments$3;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex$3(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var _isIndex = isIndex$3;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength$3(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var isLength_1 = isLength$3;
var isSymbol = isSymbol_1;
var INFINITY = 1 / 0;
function toKey$4(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var _toKey = toKey$4;
var castPath$1 = _castPath, isArguments$2 = isArguments_1, isArray$8 = isArray_1, isIndex$2 = _isIndex, isLength$2 = isLength_1, toKey$3 = _toKey;
function hasPath$2(object, path, hasFunc) {
  path = castPath$1(path, object);
  var index2 = -1, length = path.length, result = false;
  while (++index2 < length) {
    var key = toKey$3(path[index2]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index2 != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength$2(length) && isIndex$2(key, length) && (isArray$8(object) || isArguments$2(object));
}
var _hasPath = hasPath$2;
var baseHas = _baseHas, hasPath$1 = _hasPath;
function has$1(object, path) {
  return object != null && hasPath$1(object, path, baseHas);
}
var has_1 = has$1;
var baseGetTag$6 = _baseGetTag, isObjectLike$7 = isObjectLike_1;
var dateTag$2 = "[object Date]";
function baseIsDate$1(value) {
  return isObjectLike$7(value) && baseGetTag$6(value) == dateTag$2;
}
var _baseIsDate = baseIsDate$1;
function baseUnary$2(func) {
  return function(value) {
    return func(value);
  };
}
var _baseUnary = baseUnary$2;
var _nodeUtilExports = {};
var _nodeUtil = {
  get exports() {
    return _nodeUtilExports;
  },
  set exports(v) {
    _nodeUtilExports = v;
  }
};
(function(module, exports) {
  var freeGlobal2 = _freeGlobal;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  module.exports = nodeUtil2;
})(_nodeUtil, _nodeUtilExports);
var baseIsDate = _baseIsDate, baseUnary$1 = _baseUnary, nodeUtil$1 = _nodeUtilExports;
var nodeIsDate = nodeUtil$1 && nodeUtil$1.isDate;
var isDate$1 = nodeIsDate ? baseUnary$1(nodeIsDate) : baseIsDate;
var isDate_1 = isDate$1;
var baseGetTag$5 = _baseGetTag, isArray$7 = isArray_1, isObjectLike$6 = isObjectLike_1;
var stringTag$2 = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray$7(value) && isObjectLike$6(value) && baseGetTag$5(value) == stringTag$2;
}
var isString_1 = isString;
function arraySome$2(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (predicate(array[index2], index2, array)) {
      return true;
    }
  }
  return false;
}
var _arraySome = arraySome$2;
var ListCache$2 = _ListCache;
function stackClear$1() {
  this.__data__ = new ListCache$2();
  this.size = 0;
}
var _stackClear = stackClear$1;
function stackDelete$1(key) {
  var data2 = this.__data__, result = data2["delete"](key);
  this.size = data2.size;
  return result;
}
var _stackDelete = stackDelete$1;
function stackGet$1(key) {
  return this.__data__.get(key);
}
var _stackGet = stackGet$1;
function stackHas$1(key) {
  return this.__data__.has(key);
}
var _stackHas = stackHas$1;
var ListCache$1 = _ListCache, Map$1 = _Map, MapCache$1 = _MapCache;
var LARGE_ARRAY_SIZE = 200;
function stackSet$1(key, value) {
  var data2 = this.__data__;
  if (data2 instanceof ListCache$1) {
    var pairs = data2.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data2.size;
      return this;
    }
    data2 = this.__data__ = new MapCache$1(pairs);
  }
  data2.set(key, value);
  this.size = data2.size;
  return this;
}
var _stackSet = stackSet$1;
var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
function Stack$3(entries) {
  var data2 = this.__data__ = new ListCache(entries);
  this.size = data2.size;
}
Stack$3.prototype.clear = stackClear;
Stack$3.prototype["delete"] = stackDelete;
Stack$3.prototype.get = stackGet;
Stack$3.prototype.has = stackHas;
Stack$3.prototype.set = stackSet;
var _Stack = Stack$3;
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
var _setCacheAdd = setCacheAdd$1;
function setCacheHas$1(value) {
  return this.__data__.has(value);
}
var _setCacheHas = setCacheHas$1;
var MapCache = _MapCache, setCacheAdd = _setCacheAdd, setCacheHas = _setCacheHas;
function SetCache$1(values) {
  var index2 = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index2 < length) {
    this.add(values[index2]);
  }
}
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
SetCache$1.prototype.has = setCacheHas;
var _SetCache = SetCache$1;
function cacheHas$1(cache, key) {
  return cache.has(key);
}
var _cacheHas = cacheHas$1;
var SetCache = _SetCache, arraySome$1 = _arraySome, cacheHas = _cacheHas;
var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index2 < arrLength) {
    var arrValue = array[index2], othValue = other[index2];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome$1(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var _equalArrays = equalArrays$2;
var root$4 = _root;
var Uint8Array$2 = root$4.Uint8Array;
var _Uint8Array = Uint8Array$2;
function mapToArray$1(map) {
  var index2 = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index2] = [key, value];
  });
  return result;
}
var _mapToArray = mapToArray$1;
function setToArray$1(set) {
  var index2 = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index2] = value;
  });
  return result;
}
var _setToArray = setToArray$1;
var Symbol$1 = _Symbol, Uint8Array$1 = _Uint8Array, eq$4 = eq_1, equalArrays$1 = _equalArrays, mapToArray = _mapToArray, setToArray = _setToArray;
var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
var boolTag$2 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", mapTag$2 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]";
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$2:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$1:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag$2:
    case dateTag$1:
    case numberTag$2:
      return eq$4(+object, +other);
    case errorTag$1:
      return object.name == other.name && object.message == other.message;
    case regexpTag$1:
    case stringTag$1:
      return object == other + "";
    case mapTag$2:
      var convert = mapToArray;
    case setTag$2:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;
      stack.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var _equalByTag = equalByTag$1;
function arrayPush$1(array, values) {
  var index2 = -1, length = values.length, offset = array.length;
  while (++index2 < length) {
    array[offset + index2] = values[index2];
  }
  return array;
}
var _arrayPush = arrayPush$1;
var arrayPush = _arrayPush, isArray$6 = isArray_1;
function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$6(object) ? result : arrayPush(result, symbolsFunc(object));
}
var _baseGetAllKeys = baseGetAllKeys$1;
function arrayFilter$1(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array[index2];
    if (predicate(value, index2, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var _arrayFilter = arrayFilter$1;
function stubArray$1() {
  return [];
}
var stubArray_1 = stubArray$1;
var arrayFilter = _arrayFilter, stubArray = stubArray_1;
var objectProto$9 = Object.prototype;
var propertyIsEnumerable = objectProto$9.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols$1 = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var _getSymbols = getSymbols$1;
function baseTimes$1(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var _baseTimes = baseTimes$1;
var isBufferExports = {};
var isBuffer$3 = {
  get exports() {
    return isBufferExports;
  },
  set exports(v) {
    isBufferExports = v;
  }
};
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
(function(module, exports) {
  var root2 = _root, stubFalse2 = stubFalse_1;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root2.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse2;
  module.exports = isBuffer2;
})(isBuffer$3, isBufferExports);
var baseGetTag$4 = _baseGetTag, isLength$1 = isLength_1, isObjectLike$5 = isObjectLike_1;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$3 = "[object Object]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", weakMapTag$1 = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag$1] = false;
function baseIsTypedArray$1(value) {
  return isObjectLike$5(value) && isLength$1(value.length) && !!typedArrayTags[baseGetTag$4(value)];
}
var _baseIsTypedArray = baseIsTypedArray$1;
var baseIsTypedArray = _baseIsTypedArray, baseUnary = _baseUnary, nodeUtil = _nodeUtilExports;
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray$3 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray_1 = isTypedArray$3;
var baseTimes = _baseTimes, isArguments$1 = isArguments_1, isArray$5 = isArray_1, isBuffer$2 = isBufferExports, isIndex$1 = _isIndex, isTypedArray$2 = isTypedArray_1;
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$5(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex$1(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var _arrayLikeKeys = arrayLikeKeys$2;
var objectProto$7 = Object.prototype;
function isPrototype$3(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$7;
  return value === proto;
}
var _isPrototype = isPrototype$3;
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg$2;
var overArg$1 = _overArg;
var nativeKeys$1 = overArg$1(Object.keys, Object);
var _nativeKeys = nativeKeys$1;
var isPrototype$2 = _isPrototype, nativeKeys = _nativeKeys;
var objectProto$6 = Object.prototype;
var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
function baseKeys$1(object) {
  if (!isPrototype$2(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys$1;
var isFunction$1 = isFunction_1, isLength = isLength_1;
function isArrayLike$5(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}
var isArrayLike_1 = isArrayLike$5;
var arrayLikeKeys$1 = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike$4 = isArrayLike_1;
function keys$3(object) {
  return isArrayLike$4(object) ? arrayLikeKeys$1(object) : baseKeys(object);
}
var keys_1 = keys$3;
var baseGetAllKeys = _baseGetAllKeys, getSymbols = _getSymbols, keys$2 = keys_1;
function getAllKeys$1(object) {
  return baseGetAllKeys(object, keys$2, getSymbols);
}
var _getAllKeys = getAllKeys$1;
var getAllKeys = _getAllKeys;
var COMPARE_PARTIAL_FLAG$3 = 1;
var objectProto$5 = Object.prototype;
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index2 = objLength;
  while (index2--) {
    var key = objProps[index2];
    if (!(isPartial ? key in other : hasOwnProperty$5.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index2 < objLength) {
    key = objProps[index2];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var _equalObjects = equalObjects$1;
var getNative$4 = _getNative, root$3 = _root;
var DataView$1 = getNative$4(root$3, "DataView");
var _DataView = DataView$1;
var getNative$3 = _getNative, root$2 = _root;
var Promise$2 = getNative$3(root$2, "Promise");
var _Promise = Promise$2;
var getNative$2 = _getNative, root$1 = _root;
var Set$1 = getNative$2(root$1, "Set");
var _Set = Set$1;
var getNative$1 = _getNative, root = _root;
var WeakMap$1 = getNative$1(root, "WeakMap");
var _WeakMap = WeakMap$1;
var DataView = _DataView, Map = _Map, Promise$1 = _Promise, Set = _Set, WeakMap = _WeakMap, baseGetTag$3 = _baseGetTag, toSource = _toSource;
var mapTag = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
var dataViewTag = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
var getTag$1 = baseGetTag$3;
if (DataView && getTag$1(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag$1(new Map()) != mapTag || Promise$1 && getTag$1(Promise$1.resolve()) != promiseTag || Set && getTag$1(new Set()) != setTag || WeakMap && getTag$1(new WeakMap()) != weakMapTag) {
  getTag$1 = function(value) {
    var result = baseGetTag$3(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}
var _getTag = getTag$1;
var Stack$2 = _Stack, equalArrays = _equalArrays, equalByTag = _equalByTag, equalObjects = _equalObjects, getTag = _getTag, isArray$4 = isArray_1, isBuffer$1 = isBufferExports, isTypedArray$1 = isTypedArray_1;
var COMPARE_PARTIAL_FLAG$2 = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag$1 = "[object Object]";
var objectProto$4 = Object.prototype;
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$4(object), othIsArr = isArray$4(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag$1 : objTag;
  othTag = othTag == argsTag ? objectTag$1 : othTag;
  var objIsObj = objTag == objectTag$1, othIsObj = othTag == objectTag$1, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer$1(object)) {
    if (!isBuffer$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack$2());
    return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty$4.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$4.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack$2());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack$2());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
var _baseIsEqualDeep = baseIsEqualDeep$1;
var baseIsEqualDeep = _baseIsEqualDeep, isObjectLike$4 = isObjectLike_1;
function baseIsEqual$2(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike$4(value) && !isObjectLike$4(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$2, stack);
}
var _baseIsEqual = baseIsEqual$2;
var Stack$1 = _Stack, baseIsEqual$1 = _baseIsEqual;
var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function baseIsMatch$1(object, source, matchData, customizer) {
  var index2 = matchData.length, length = index2, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index2--) {
    var data2 = matchData[index2];
    if (noCustomizer && data2[2] ? data2[1] !== object[data2[0]] : !(data2[0] in object)) {
      return false;
    }
  }
  while (++index2 < length) {
    data2 = matchData[index2];
    var key = data2[0], objValue = object[key], srcValue = data2[1];
    if (noCustomizer && data2[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack$1();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var _baseIsMatch = baseIsMatch$1;
var isObject$7 = isObject_1;
function isStrictComparable$2(value) {
  return value === value && !isObject$7(value);
}
var _isStrictComparable = isStrictComparable$2;
var isStrictComparable$1 = _isStrictComparable, keys$1 = keys_1;
function getMatchData$1(object) {
  var result = keys$1(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable$1(value)];
  }
  return result;
}
var _getMatchData = getMatchData$1;
function matchesStrictComparable$2(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var _matchesStrictComparable = matchesStrictComparable$2;
var baseIsMatch = _baseIsMatch, getMatchData = _getMatchData, matchesStrictComparable$1 = _matchesStrictComparable;
function baseMatches$1(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}
var _baseMatches = baseMatches$1;
var castPath = _castPath, toKey$2 = _toKey;
function baseGet$2(object, path) {
  path = castPath(path, object);
  var index2 = 0, length = path.length;
  while (object != null && index2 < length) {
    object = object[toKey$2(path[index2++])];
  }
  return index2 && index2 == length ? object : void 0;
}
var _baseGet = baseGet$2;
var baseGet$1 = _baseGet;
function get$1(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet$1(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_1 = get$1;
function baseHasIn$1(object, key) {
  return object != null && key in Object(object);
}
var _baseHasIn = baseHasIn$1;
var baseHasIn = _baseHasIn, hasPath = _hasPath;
function hasIn$1(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
var hasIn_1 = hasIn$1;
var baseIsEqual = _baseIsEqual, get = get_1, hasIn = hasIn_1, isKey$1 = _isKey, isStrictComparable = _isStrictComparable, matchesStrictComparable = _matchesStrictComparable, toKey$1 = _toKey;
var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty$1(path, srcValue) {
  if (isKey$1(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey$1(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}
var _baseMatchesProperty = baseMatchesProperty$1;
function identity$3(value) {
  return value;
}
var identity_1 = identity$3;
function baseProperty$1(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var _baseProperty = baseProperty$1;
var baseGet = _baseGet;
function basePropertyDeep$1(path) {
  return function(object) {
    return baseGet(object, path);
  };
}
var _basePropertyDeep = basePropertyDeep$1;
var baseProperty = _baseProperty, basePropertyDeep = _basePropertyDeep, isKey = _isKey, toKey = _toKey;
function property$1(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
var property_1 = property$1;
var baseMatches = _baseMatches, baseMatchesProperty = _baseMatchesProperty, identity$2 = identity_1, isArray$3 = isArray_1, property = property_1;
function baseIteratee$2(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity$2;
  }
  if (typeof value == "object") {
    return isArray$3(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}
var _baseIteratee = baseIteratee$2;
function createBaseFor$1(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index2];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var _createBaseFor = createBaseFor$1;
var createBaseFor = _createBaseFor;
var baseFor$2 = createBaseFor();
var _baseFor = baseFor$2;
var baseFor$1 = _baseFor, keys = keys_1;
function baseForOwn$2(object, iteratee) {
  return object && baseFor$1(object, iteratee, keys);
}
var _baseForOwn = baseForOwn$2;
var isArrayLike$3 = isArrayLike_1;
function createBaseEach$1(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike$3(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index2 = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index2-- : ++index2 < length) {
      if (iteratee(iterable[index2], index2, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var _createBaseEach = createBaseEach$1;
var baseForOwn$1 = _baseForOwn, createBaseEach = _createBaseEach;
var baseEach$1 = createBaseEach(baseForOwn$1);
var _baseEach = baseEach$1;
var baseEach = _baseEach;
function baseSome$1(collection, predicate) {
  var result;
  baseEach(collection, function(value, index2, collection2) {
    result = predicate(value, index2, collection2);
    return !result;
  });
  return !!result;
}
var _baseSome = baseSome$1;
var eq$3 = eq_1, isArrayLike$2 = isArrayLike_1, isIndex = _isIndex, isObject$6 = isObject_1;
function isIterateeCall$3(value, index2, object) {
  if (!isObject$6(object)) {
    return false;
  }
  var type = typeof index2;
  if (type == "number" ? isArrayLike$2(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
    return eq$3(object[index2], value);
  }
  return false;
}
var _isIterateeCall = isIterateeCall$3;
var arraySome = _arraySome, baseIteratee$1 = _baseIteratee, baseSome = _baseSome, isArray$2 = isArray_1, isIterateeCall$2 = _isIterateeCall;
function some(collection, predicate, guard) {
  var func = isArray$2(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall$2(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee$1(predicate));
}
var some_1 = some;
var baseGetTag$2 = _baseGetTag, isObjectLike$3 = isObjectLike_1;
var boolTag = "[object Boolean]";
function isBoolean(value) {
  return value === true || value === false || isObjectLike$3(value) && baseGetTag$2(value) == boolTag;
}
var isBoolean_1 = isBoolean;
var baseGetTag$1 = _baseGetTag, isObjectLike$2 = isObjectLike_1;
var numberTag = "[object Number]";
function isNumber(value) {
  return typeof value == "number" || isObjectLike$2(value) && baseGetTag$1(value) == numberTag;
}
var isNumber_1 = isNumber;
var getNative = _getNative;
var defineProperty$2 = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var _defineProperty = defineProperty$2;
var defineProperty$1 = _defineProperty;
function baseAssignValue$4(object, key, value) {
  if (key == "__proto__" && defineProperty$1) {
    defineProperty$1(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var _baseAssignValue = baseAssignValue$4;
var baseAssignValue$3 = _baseAssignValue, eq$2 = eq_1;
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
function assignValue$1(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$3.call(object, key) && eq$2(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue$3(object, key, value);
  }
}
var _assignValue = assignValue$1;
var baseAssignValue$2 = _baseAssignValue, baseForOwn = _baseForOwn, baseIteratee = _baseIteratee;
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);
  baseForOwn(object, function(value, key, object2) {
    baseAssignValue$2(result, key, iteratee(value, key, object2));
  });
  return result;
}
var mapValues_1 = mapValues;
function apply$2(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply = apply$2;
var apply$1 = _apply;
var nativeMax = Math.max;
function overRest$1(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index2 = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index2 < length) {
      array[index2] = args[start + index2];
    }
    index2 = -1;
    var otherArgs = Array(start + 1);
    while (++index2 < start) {
      otherArgs[index2] = args[index2];
    }
    otherArgs[start] = transform(array);
    return apply$1(func, this, otherArgs);
  };
}
var _overRest = overRest$1;
function constant$1(value) {
  return function() {
    return value;
  };
}
var constant_1 = constant$1;
var constant = constant_1, defineProperty = _defineProperty, identity$1 = identity_1;
var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var _baseSetToString = baseSetToString$1;
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut$1(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var _shortOut = shortOut$1;
var baseSetToString = _baseSetToString, shortOut = _shortOut;
var setToString$1 = shortOut(baseSetToString);
var _setToString = setToString$1;
var identity = identity_1, overRest = _overRest, setToString = _setToString;
function baseRest$3(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var _baseRest = baseRest$3;
function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var _nativeKeysIn = nativeKeysIn$1;
var isObject$5 = isObject_1, isPrototype$1 = _isPrototype, nativeKeysIn = _nativeKeysIn;
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function baseKeysIn$1(object) {
  if (!isObject$5(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$1(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$2.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var _baseKeysIn = baseKeysIn$1;
var arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike$1 = isArrayLike_1;
function keysIn$3(object) {
  return isArrayLike$1(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var keysIn_1 = keysIn$3;
var baseRest$2 = _baseRest, eq$1 = eq_1, isIterateeCall$1 = _isIterateeCall, keysIn$2 = keysIn_1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
var defaults = baseRest$2(function(object, sources) {
  object = Object(object);
  var index2 = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : void 0;
  if (guard && isIterateeCall$1(sources[0], sources[1], guard)) {
    length = 1;
  }
  while (++index2 < length) {
    var source = sources[index2];
    var props = keysIn$2(source);
    var propsIndex = -1;
    var propsLength = props.length;
    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];
      if (value === void 0 || eq$1(value, objectProto$1[key]) && !hasOwnProperty$1.call(object, key)) {
        object[key] = source[key];
      }
    }
  }
  return object;
});
var defaults_1 = defaults;
var baseAssignValue$1 = _baseAssignValue, eq = eq_1;
function assignMergeValue$2(object, key, value) {
  if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue$1(object, key, value);
  }
}
var _assignMergeValue = assignMergeValue$2;
var _cloneBufferExports = {};
var _cloneBuffer = {
  get exports() {
    return _cloneBufferExports;
  },
  set exports(v) {
    _cloneBufferExports = v;
  }
};
(function(module, exports) {
  var root2 = _root;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
  function cloneBuffer2(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  module.exports = cloneBuffer2;
})(_cloneBuffer, _cloneBufferExports);
var Uint8Array2 = _Uint8Array;
function cloneArrayBuffer$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
  return result;
}
var _cloneArrayBuffer = cloneArrayBuffer$1;
var cloneArrayBuffer = _cloneArrayBuffer;
function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var _cloneTypedArray = cloneTypedArray$1;
function copyArray$1(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var _copyArray = copyArray$1;
var isObject$4 = isObject_1;
var objectCreate = Object.create;
var baseCreate$1 = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject$4(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var _baseCreate = baseCreate$1;
var overArg = _overArg;
var getPrototype$2 = overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype$2;
var baseCreate = _baseCreate, getPrototype$1 = _getPrototype, isPrototype = _isPrototype;
function initCloneObject$1(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype$1(object)) : {};
}
var _initCloneObject = initCloneObject$1;
var isArrayLike = isArrayLike_1, isObjectLike$1 = isObjectLike_1;
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike(value);
}
var isArrayLikeObject_1 = isArrayLikeObject$1;
var baseGetTag = _baseGetTag, getPrototype = _getPrototype, isObjectLike = isObjectLike_1;
var objectTag = "[object Object]";
var funcProto = Function.prototype, objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject$1(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var isPlainObject_1 = isPlainObject$1;
function safeGet$2(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var _safeGet = safeGet$2;
var assignValue = _assignValue, baseAssignValue = _baseAssignValue;
function copyObject$1(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
var _copyObject = copyObject$1;
var copyObject = _copyObject, keysIn$1 = keysIn_1;
function toPlainObject$1(value) {
  return copyObject(value, keysIn$1(value));
}
var toPlainObject_1 = toPlainObject$1;
var assignMergeValue$1 = _assignMergeValue, cloneBuffer = _cloneBufferExports, cloneTypedArray = _cloneTypedArray, copyArray = _copyArray, initCloneObject = _initCloneObject, isArguments = isArguments_1, isArray$1 = isArray_1, isArrayLikeObject = isArrayLikeObject_1, isBuffer = isBufferExports, isFunction = isFunction_1, isObject$3 = isObject_1, isPlainObject = isPlainObject_1, isTypedArray = isTypedArray_1, safeGet$1 = _safeGet, toPlainObject = toPlainObject_1;
function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet$1(object, key), srcValue = safeGet$1(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue$1(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray$1(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray$1(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject$3(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue$1(object, key, newValue);
}
var _baseMergeDeep = baseMergeDeep$1;
var Stack = _Stack, assignMergeValue = _assignMergeValue, baseFor = _baseFor, baseMergeDeep = _baseMergeDeep, isObject$2 = isObject_1, keysIn = keysIn_1, safeGet = _safeGet;
function baseMerge$2(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack());
    if (isObject$2(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge$2, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}
var _baseMerge = baseMerge$2;
var baseMerge$1 = _baseMerge, isObject$1 = isObject_1;
function customDefaultsMerge$1(objValue, srcValue, key, object, source, stack) {
  if (isObject$1(objValue) && isObject$1(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge$1(objValue, srcValue, void 0, customDefaultsMerge$1, stack);
    stack["delete"](srcValue);
  }
  return objValue;
}
var _customDefaultsMerge = customDefaultsMerge$1;
var baseRest$1 = _baseRest, isIterateeCall = _isIterateeCall;
function createAssigner$1(assigner) {
  return baseRest$1(function(object, sources) {
    var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index2 < length) {
      var source = sources[index2];
      if (source) {
        assigner(object, source, index2, customizer);
      }
    }
    return object;
  });
}
var _createAssigner = createAssigner$1;
var baseMerge = _baseMerge, createAssigner = _createAssigner;
var mergeWith$1 = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});
var mergeWith_1 = mergeWith$1;
var apply = _apply, baseRest = _baseRest, customDefaultsMerge = _customDefaultsMerge, mergeWith = mergeWith_1;
var defaultsDeep = baseRest(function(args) {
  args.push(void 0, customDefaultsMerge);
  return apply(mergeWith, void 0, args);
});
var defaultsDeep_1 = defaultsDeep;
function head(array) {
  return array && array.length ? array[0] : void 0;
}
var head_1 = head;
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_1 = last;
const getType = (value) => Object.prototype.toString.call(value).slice(8, -1);
const isDate = (value) => isDate_1(value) && !isNaN(value.getTime());
const isObject = (value) => getType(value) === "Object";
const has = has_1;
const hasAny = (obj, props) => some_1(props, (p) => has_1(obj, p));
const pad = (val, len, char = "0") => {
  val = val !== null && val !== void 0 ? String(val) : "";
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
};
const isArray = (val) => Array.isArray(val);
const arrayHasItems = (array) => isArray(array) && array.length > 0;
const resolveEl = (target) => {
  if (target == null)
    return null;
  if (document && isString_1(target))
    return document.querySelector(target);
  return target.$el ?? target;
};
const off = (element, event, handler, opts = void 0) => {
  element.removeEventListener(event, handler, opts);
};
const on = (element, event, handler, opts = void 0) => {
  element.addEventListener(event, handler, opts);
  return () => off(element, event, handler, opts);
};
const elementContains = (element, child) => !!element && !!child && (element === child || element.contains(child));
const onSpaceOrEnter = (event, handler) => {
  if (event.key === " " || event.key === "Enter") {
    handler(event);
    event.preventDefault();
  }
};
const omit = (obj, ...keys2) => {
  const ret = {};
  let key;
  for (key in obj) {
    if (!keys2.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};
const pick = (obj, keys2) => {
  const ret = {};
  keys2.forEach((key) => {
    if (key in obj)
      ret[key] = obj[key];
  });
  return ret;
};
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
var toIntegerExports = {};
var toInteger$2 = {
  get exports() {
    return toIntegerExports;
  },
  set exports(v) {
    toIntegerExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toInteger2;
  function toInteger2(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
      return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }
  module.exports = exports.default;
})(toInteger$2, toIntegerExports);
const toInteger$1 = /* @__PURE__ */ getDefaultExportFromCjs(toIntegerExports);
var getTimezoneOffsetInMillisecondsExports = {};
var getTimezoneOffsetInMilliseconds$2 = {
  get exports() {
    return getTimezoneOffsetInMillisecondsExports;
  },
  set exports(v) {
    getTimezoneOffsetInMillisecondsExports = v;
  }
};
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getTimezoneOffsetInMilliseconds2;
  function getTimezoneOffsetInMilliseconds2(date) {
    var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    utcDate.setUTCFullYear(date.getFullYear());
    return date.getTime() - utcDate.getTime();
  }
  module.exports = exports.default;
})(getTimezoneOffsetInMilliseconds$2, getTimezoneOffsetInMillisecondsExports);
const getTimezoneOffsetInMilliseconds$1 = /* @__PURE__ */ getDefaultExportFromCjs(getTimezoneOffsetInMillisecondsExports);
function tzTokenizeDate(date, timeZone) {
  var dtf = getDateTimeFormat(timeZone);
  return dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
}
var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};
function partsOffset(dtf, date) {
  try {
    var formatted = dtf.formatToParts(date);
    var filled = [];
    for (var i = 0; i < formatted.length; i++) {
      var pos = typeToPos[formatted[i].type];
      if (pos >= 0) {
        filled[pos] = parseInt(formatted[i].value, 10);
      }
    }
    return filled;
  } catch (error) {
    if (error instanceof RangeError) {
      return [NaN];
    }
    throw error;
  }
}
function hackyOffset(dtf, date) {
  var formatted = dtf.format(date).replace(/\u200E/g, "");
  var parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted);
  return [parsed[3], parsed[1], parsed[2], parsed[4], parsed[5], parsed[6]];
}
var dtfCache = {};
function getDateTimeFormat(timeZone) {
  if (!dtfCache[timeZone]) {
    var testDateFormatted = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: "America/New_York",
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(/* @__PURE__ */ new Date("2014-06-25T04:00:00.123Z"));
    var hourCycleSupported = testDateFormatted === "06/25/2014, 00:00:00" || testDateFormatted === "‎06‎/‎25‎/‎2014‎ ‎00‎:‎00‎:‎00";
    dtfCache[timeZone] = hourCycleSupported ? new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) : new Intl.DateTimeFormat("en-US", {
      hourCycle: "h23",
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  return dtfCache[timeZone];
}
function newDateUTC(fullYear, month, day, hour, minute, second, millisecond) {
  var utcDate = /* @__PURE__ */ new Date(0);
  utcDate.setUTCFullYear(fullYear, month, day);
  utcDate.setUTCHours(hour, minute, second, millisecond);
  return utcDate;
}
var MILLISECONDS_IN_HOUR$1 = 36e5;
var MILLISECONDS_IN_MINUTE$1 = 6e4;
var patterns$1 = {
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-]\d{2})$/,
  timezoneHHMM: /^([+-]\d{2}):?(\d{2})$/
};
function tzParseTimezone(timezoneString, date, isUtcDate) {
  var token2;
  var absoluteOffset;
  if (!timezoneString) {
    return 0;
  }
  token2 = patterns$1.timezoneZ.exec(timezoneString);
  if (token2) {
    return 0;
  }
  var hours2;
  token2 = patterns$1.timezoneHH.exec(timezoneString);
  if (token2) {
    hours2 = parseInt(token2[1], 10);
    if (!validateTimezone(hours2)) {
      return NaN;
    }
    return -(hours2 * MILLISECONDS_IN_HOUR$1);
  }
  token2 = patterns$1.timezoneHHMM.exec(timezoneString);
  if (token2) {
    hours2 = parseInt(token2[1], 10);
    var minutes = parseInt(token2[2], 10);
    if (!validateTimezone(hours2, minutes)) {
      return NaN;
    }
    absoluteOffset = Math.abs(hours2) * MILLISECONDS_IN_HOUR$1 + minutes * MILLISECONDS_IN_MINUTE$1;
    return hours2 > 0 ? -absoluteOffset : absoluteOffset;
  }
  if (isValidTimezoneIANAString(timezoneString)) {
    date = new Date(date || Date.now());
    var utcDate = isUtcDate ? date : toUtcDate(date);
    var offset = calcOffset(utcDate, timezoneString);
    var fixedOffset = isUtcDate ? offset : fixOffset(date, offset, timezoneString);
    return -fixedOffset;
  }
  return NaN;
}
function toUtcDate(date) {
  return newDateUTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}
function calcOffset(date, timezoneString) {
  var tokens = tzTokenizeDate(date, timezoneString);
  var asUTC = newDateUTC(
    tokens[0],
    tokens[1] - 1,
    tokens[2],
    tokens[3] % 24,
    tokens[4],
    tokens[5],
    0
  ).getTime();
  var asTS = date.getTime();
  var over = asTS % 1e3;
  asTS -= over >= 0 ? over : 1e3 + over;
  return asUTC - asTS;
}
function fixOffset(date, offset, timezoneString) {
  var localTS = date.getTime();
  var utcGuess = localTS - offset;
  var o2 = calcOffset(new Date(utcGuess), timezoneString);
  if (offset === o2) {
    return offset;
  }
  utcGuess -= o2 - offset;
  var o3 = calcOffset(new Date(utcGuess), timezoneString);
  if (o2 === o3) {
    return o2;
  }
  return Math.max(o2, o3);
}
function validateTimezone(hours2, minutes) {
  return -23 <= hours2 && hours2 <= 23 && (minutes == null || 0 <= minutes && minutes <= 59);
}
var validIANATimezoneCache = {};
function isValidTimezoneIANAString(timeZoneString) {
  if (validIANATimezoneCache[timeZoneString])
    return true;
  try {
    new Intl.DateTimeFormat(void 0, { timeZone: timeZoneString });
    validIANATimezoneCache[timeZoneString] = true;
    return true;
  } catch (error) {
    return false;
  }
}
var tzPattern = /(Z|[+-]\d{2}(?::?\d{2})?| UTC| [a-zA-Z]+\/[a-zA-Z_]+(?:\/[a-zA-Z_]+)?)$/;
const tzPattern$1 = tzPattern;
var MILLISECONDS_IN_HOUR = 36e5;
var MILLISECONDS_IN_MINUTE = 6e4;
var DEFAULT_ADDITIONAL_DIGITS = 2;
var patterns = {
  dateTimePattern: /^([0-9W+-]+)(T| )(.*)/,
  datePattern: /^([0-9W+-]+)(.*)/,
  plainTime: /:/,
  // year tokens
  YY: /^(\d{2})$/,
  YYY: [
    /^([+-]\d{2})$/,
    // 0 additional digits
    /^([+-]\d{3})$/,
    // 1 additional digit
    /^([+-]\d{4})$/
    // 2 additional digits
  ],
  YYYY: /^(\d{4})/,
  YYYYY: [
    /^([+-]\d{4})/,
    // 0 additional digits
    /^([+-]\d{5})/,
    // 1 additional digit
    /^([+-]\d{6})/
    // 2 additional digits
  ],
  // date tokens
  MM: /^-(\d{2})$/,
  DDD: /^-?(\d{3})$/,
  MMDD: /^-?(\d{2})-?(\d{2})$/,
  Www: /^-?W(\d{2})$/,
  WwwD: /^-?W(\d{2})-?(\d{1})$/,
  HH: /^(\d{2}([.,]\d*)?)$/,
  HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
  HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,
  // time zone tokens (to identify the presence of a tz)
  timeZone: tzPattern$1
};
function toDate$1(argument, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError("1 argument required, but only " + arguments.length + " present");
  }
  if (argument === null) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits == null ? DEFAULT_ADDITIONAL_DIGITS : toInteger$1(options.additionalDigits);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (argument instanceof Date || typeof argument === "object" && Object.prototype.toString.call(argument) === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || Object.prototype.toString.call(argument) === "[object Number]") {
    return new Date(argument);
  } else if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;
  var date = parseDate$1(restDateString, year);
  if (isNaN(date)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;
    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
      if (isNaN(time)) {
        return /* @__PURE__ */ new Date(NaN);
      }
    }
    if (dateStrings.timeZone || options.timeZone) {
      offset = tzParseTimezone(dateStrings.timeZone || options.timeZone, new Date(timestamp + time));
      if (isNaN(offset)) {
        return /* @__PURE__ */ new Date(NaN);
      }
    } else {
      offset = getTimezoneOffsetInMilliseconds$1(new Date(timestamp + time));
      offset = getTimezoneOffsetInMilliseconds$1(new Date(timestamp + time + offset));
    }
    return new Date(timestamp + time + offset);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}
function splitDateString(dateString) {
  var dateStrings = {};
  var parts = patterns.dateTimePattern.exec(dateString);
  var timeString;
  if (!parts) {
    parts = patterns.datePattern.exec(dateString);
    if (parts) {
      dateStrings.date = parts[1];
      timeString = parts[2];
    } else {
      dateStrings.date = null;
      timeString = dateString;
    }
  } else {
    dateStrings.date = parts[1];
    timeString = parts[3];
  }
  if (timeString) {
    var token2 = patterns.timeZone.exec(timeString);
    if (token2) {
      dateStrings.time = timeString.replace(token2[1], "");
      dateStrings.timeZone = token2[1].trim();
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var patternYYY = patterns.YYY[additionalDigits];
  var patternYYYYY = patterns.YYYYY[additionalDigits];
  var token2;
  token2 = patterns.YYYY.exec(dateString) || patternYYYYY.exec(dateString);
  if (token2) {
    var yearString = token2[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    };
  }
  token2 = patterns.YY.exec(dateString) || patternYYY.exec(dateString);
  if (token2) {
    var centuryString = token2[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    };
  }
  return {
    year: null
  };
}
function parseDate$1(dateString, year) {
  if (year === null) {
    return null;
  }
  var token2;
  var date;
  var month;
  var week;
  if (dateString.length === 0) {
    date = /* @__PURE__ */ new Date(0);
    date.setUTCFullYear(year);
    return date;
  }
  token2 = patterns.MM.exec(dateString);
  if (token2) {
    date = /* @__PURE__ */ new Date(0);
    month = parseInt(token2[1], 10) - 1;
    if (!validateDate(year, month)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month);
    return date;
  }
  token2 = patterns.DDD.exec(dateString);
  if (token2) {
    date = /* @__PURE__ */ new Date(0);
    var dayOfYear = parseInt(token2[1], 10);
    if (!validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, 0, dayOfYear);
    return date;
  }
  token2 = patterns.MMDD.exec(dateString);
  if (token2) {
    date = /* @__PURE__ */ new Date(0);
    month = parseInt(token2[1], 10) - 1;
    var day = parseInt(token2[2], 10);
    if (!validateDate(year, month, day)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, day);
    return date;
  }
  token2 = patterns.Www.exec(dateString);
  if (token2) {
    week = parseInt(token2[1], 10) - 1;
    if (!validateWeekDate(year, week)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week);
  }
  token2 = patterns.WwwD.exec(dateString);
  if (token2) {
    week = parseInt(token2[1], 10) - 1;
    var dayOfWeek = parseInt(token2[2], 10) - 1;
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  }
  return null;
}
function parseTime(timeString) {
  var token2;
  var hours2;
  var minutes;
  token2 = patterns.HH.exec(timeString);
  if (token2) {
    hours2 = parseFloat(token2[1].replace(",", "."));
    if (!validateTime(hours2)) {
      return NaN;
    }
    return hours2 % 24 * MILLISECONDS_IN_HOUR;
  }
  token2 = patterns.HHMM.exec(timeString);
  if (token2) {
    hours2 = parseInt(token2[1], 10);
    minutes = parseFloat(token2[2].replace(",", "."));
    if (!validateTime(hours2, minutes)) {
      return NaN;
    }
    return hours2 % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
  }
  token2 = patterns.HHMMSS.exec(timeString);
  if (token2) {
    hours2 = parseInt(token2[1], 10);
    minutes = parseInt(token2[2], 10);
    var seconds = parseFloat(token2[3].replace(",", "."));
    if (!validateTime(hours2, minutes, seconds)) {
      return NaN;
    }
    return hours2 % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1e3;
  }
  return null;
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  if (month < 0 || month > 11) {
    return false;
  }
  if (date != null) {
    if (date < 1) {
      return false;
    }
    var isLeapYear = isLeapYearIndex(year);
    if (isLeapYear && date > DAYS_IN_MONTH_LEAP_YEAR[month]) {
      return false;
    }
    if (!isLeapYear && date > DAYS_IN_MONTH[month]) {
      return false;
    }
  }
  return true;
}
function validateDayOfYearDate(year, dayOfYear) {
  if (dayOfYear < 1) {
    return false;
  }
  var isLeapYear = isLeapYearIndex(year);
  if (isLeapYear && dayOfYear > 366) {
    return false;
  }
  if (!isLeapYear && dayOfYear > 365) {
    return false;
  }
  return true;
}
function validateWeekDate(year, week, day) {
  if (week < 0 || week > 52) {
    return false;
  }
  if (day != null && (day < 0 || day > 6)) {
    return false;
  }
  return true;
}
function validateTime(hours2, minutes, seconds) {
  if (hours2 != null && (hours2 < 0 || hours2 >= 25)) {
    return false;
  }
  if (minutes != null && (minutes < 0 || minutes >= 60)) {
    return false;
  }
  if (seconds != null && (seconds < 0 || seconds >= 60)) {
    return false;
  }
  return true;
}
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return /* @__PURE__ */ new Date(NaN);
  }
}
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function startOfWeek$1(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}
var MILLISECONDS_IN_WEEK$2 = 6048e5;
function differenceInCalendarWeeks(dirtyDateLeft, dirtyDateRight, options) {
  requiredArgs(2, arguments);
  var startOfWeekLeft = startOfWeek$1(dirtyDateLeft, options);
  var startOfWeekRight = startOfWeek$1(dirtyDateRight, options);
  var timestampLeft = startOfWeekLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfWeekLeft);
  var timestampRight = startOfWeekRight.getTime() - getTimezoneOffsetInMilliseconds(startOfWeekRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK$2);
}
function lastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getWeeksInMonth(date, options) {
  requiredArgs(1, arguments);
  return differenceInCalendarWeeks(lastDayOfMonth(date), startOfMonth(date), options) + 1;
}
function getWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfWeek$1(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfWeek$1(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getWeekYear(dirtyDate, options);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  var date = startOfWeek$1(firstWeek, options);
  return date;
}
var MILLISECONDS_IN_WEEK$1 = 6048e5;
function getWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfWeek$1(date, options).getTime() - startOfWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}
function startOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return startOfWeek$1(dirtyDate, {
    weekStartsOn: 1
  });
}
function getISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}
var MILLISECONDS_IN_WEEK = 6048e5;
function getISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}
function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  var dayOfMonth = date.getDate();
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}
function addYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, amount * 12);
}
const viewAddressKeys = {
  daily: ["year", "month", "day"],
  weekly: ["year", "month", "week"],
  monthly: ["year", "month"]
};
function getDays({
  monthComps,
  prevMonthComps,
  nextMonthComps
}, locale) {
  const days = [];
  const {
    firstDayOfWeek,
    firstWeekday,
    isoWeeknumbers,
    weeknumbers,
    numDays,
    numWeeks
  } = monthComps;
  const prevMonthDaysToShow = firstWeekday + (firstWeekday < firstDayOfWeek ? daysInWeek : 0) - firstDayOfWeek;
  let prevMonth = true;
  let thisMonth = false;
  let nextMonth = false;
  let position = 0;
  const formatter = new Intl.DateTimeFormat(locale.id, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  let day = prevMonthComps.numDays - prevMonthDaysToShow + 1;
  let dayFromEnd = prevMonthComps.numDays - day + 1;
  let weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
  let weekdayOrdinalFromEnd = 1;
  let week = prevMonthComps.numWeeks;
  let weekFromEnd = 1;
  let month = prevMonthComps.month;
  let year = prevMonthComps.year;
  const today = /* @__PURE__ */ new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  for (let w = 1; w <= weeksInMonth; w++) {
    for (let i = 1, weekday = firstDayOfWeek; i <= daysInWeek; i++, weekday += weekday === daysInWeek ? 1 - daysInWeek : 1) {
      if (prevMonth && weekday === firstWeekday) {
        day = 1;
        dayFromEnd = monthComps.numDays;
        weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
        week = 1;
        weekFromEnd = numWeeks;
        month = monthComps.month;
        year = monthComps.year;
        prevMonth = false;
        thisMonth = true;
      }
      const startDate = locale.getDateFromParams(year, month, day, 0, 0, 0, 0);
      const noonDate = locale.getDateFromParams(year, month, day, 12, 0, 0, 0);
      const endDate = locale.getDateFromParams(
        year,
        month,
        day,
        23,
        59,
        59,
        999
      );
      const date = startDate;
      const id = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
      const weekdayPosition = i;
      const weekdayPositionFromEnd = daysInWeek - i;
      const weeknumber = weeknumbers[w - 1];
      const isoWeeknumber = isoWeeknumbers[w - 1];
      const isToday = day === todayDay && month === todayMonth && year === todayYear;
      const isFirstDay = thisMonth && day === 1;
      const isLastDay = thisMonth && day === numDays;
      const onTop = w === 1;
      const onBottom = w === numWeeks;
      const onLeft = i === 1;
      const onRight = i === daysInWeek;
      const dayIndex = getDayIndex(year, month, day);
      days.push({
        locale,
        id,
        position: ++position,
        label: day.toString(),
        ariaLabel: formatter.format(new Date(year, month - 1, day)),
        day,
        dayFromEnd,
        weekday,
        weekdayPosition,
        weekdayPositionFromEnd,
        weekdayOrdinal,
        weekdayOrdinalFromEnd,
        week,
        weekFromEnd,
        weekPosition: w,
        weeknumber,
        isoWeeknumber,
        month,
        year,
        date,
        startDate,
        endDate,
        noonDate,
        dayIndex,
        isToday,
        isFirstDay,
        isLastDay,
        isDisabled: !thisMonth,
        isFocusable: !thisMonth,
        isFocused: false,
        inMonth: thisMonth,
        inPrevMonth: prevMonth,
        inNextMonth: nextMonth,
        onTop,
        onBottom,
        onLeft,
        onRight,
        classes: [
          `id-${id}`,
          `day-${day}`,
          `day-from-end-${dayFromEnd}`,
          `weekday-${weekday}`,
          `weekday-position-${weekdayPosition}`,
          `weekday-ordinal-${weekdayOrdinal}`,
          `weekday-ordinal-from-end-${weekdayOrdinalFromEnd}`,
          `week-${week}`,
          `week-from-end-${weekFromEnd}`,
          {
            "is-today": isToday,
            "is-first-day": isFirstDay,
            "is-last-day": isLastDay,
            "in-month": thisMonth,
            "in-prev-month": prevMonth,
            "in-next-month": nextMonth,
            "on-top": onTop,
            "on-bottom": onBottom,
            "on-left": onLeft,
            "on-right": onRight
          }
        ]
      });
      if (thisMonth && isLastDay) {
        thisMonth = false;
        nextMonth = true;
        day = 1;
        dayFromEnd = numDays;
        weekdayOrdinal = 1;
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
        week = 1;
        weekFromEnd = nextMonthComps.numWeeks;
        month = nextMonthComps.month;
        year = nextMonthComps.year;
      } else {
        day++;
        dayFromEnd--;
        weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
      }
    }
    week++;
    weekFromEnd--;
  }
  return days;
}
function getWeeks(days, showWeeknumbers, showIsoWeeknumbers, locale) {
  const result = days.reduce((result2, day, i) => {
    const weekIndex = Math.floor(i / 7);
    let week = result2[weekIndex];
    if (!week) {
      week = {
        id: `week-${weekIndex + 1}`,
        title: "",
        week: day.week,
        weekPosition: day.weekPosition,
        weeknumber: day.weeknumber,
        isoWeeknumber: day.isoWeeknumber,
        weeknumberDisplay: showWeeknumbers ? day.weeknumber : showIsoWeeknumbers ? day.isoWeeknumber : void 0,
        days: []
      };
      result2[weekIndex] = week;
    }
    week.days.push(day);
    return result2;
  }, Array(days.length / daysInWeek));
  result.forEach((week) => {
    const fromDay = week.days[0];
    const toDay = week.days[week.days.length - 1];
    if (fromDay.month === toDay.month) {
      week.title = `${locale.formatDate(fromDay.date, "MMMM YYYY")}`;
    } else if (fromDay.year === toDay.year) {
      week.title = `${locale.formatDate(
        fromDay.date,
        "MMM"
      )} - ${locale.formatDate(toDay.date, "MMM YYYY")}`;
    } else {
      week.title = `${locale.formatDate(
        fromDay.date,
        "MMM YYYY"
      )} - ${locale.formatDate(toDay.date, "MMM YYYY")}`;
    }
  });
  return result;
}
function getWeekdays(week, locale) {
  return week.days.map((day) => ({
    label: locale.formatDate(day.date, locale.masks.weekdays),
    weekday: day.weekday
  }));
}
function getPageId(month, year) {
  return `${year}.${pad(month, 2)}`;
}
function getPageAddressForDate(date, view, locale) {
  return pick(
    locale.getDateParts(locale.toDate(date)),
    viewAddressKeys[view]
  );
}
function addPages({ day, week, month, year }, count, view, locale) {
  if (view === "daily" && day) {
    const date = new Date(year, month - 1, day);
    const newDate = addDays(date, count);
    return {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear()
    };
  } else if (view === "weekly" && week) {
    const comps = locale.getMonthParts(month, year);
    const date = comps.firstDayOfMonth;
    const newDate = addDays(date, (week - 1 + count) * 7);
    const parts = locale.getDateParts(newDate);
    return {
      week: parts.week,
      month: parts.month,
      year: parts.year
    };
  } else {
    const date = new Date(year, month - 1, 1);
    const newDate = addMonths(date, count);
    return {
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear()
    };
  }
}
function pageIsValid(page) {
  return page != null && page.month != null && page.year != null;
}
function pageIsBeforePage(page, comparePage) {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  page = page;
  comparePage = comparePage;
  if (page.year !== comparePage.year)
    return page.year < comparePage.year;
  if (page.month && comparePage.month && page.month !== comparePage.month)
    return page.month < comparePage.month;
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week < comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day < comparePage.day;
  }
  return false;
}
function pageIsAfterPage(page, comparePage) {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  page = page;
  comparePage = comparePage;
  if (page.year !== comparePage.year) {
    return page.year > comparePage.year;
  }
  if (page.month && comparePage.month && page.month !== comparePage.month) {
    return page.month > comparePage.month;
  }
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week > comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day > comparePage.day;
  }
  return false;
}
function pageIsBetweenPages(page, fromPage, toPage) {
  return (page || false) && !pageIsBeforePage(page, fromPage) && !pageIsAfterPage(page, toPage);
}
function pageIsEqualToPage(aPage, bPage) {
  if (!aPage && bPage)
    return false;
  if (aPage && !bPage)
    return false;
  if (!aPage && !bPage)
    return true;
  aPage = aPage;
  bPage = bPage;
  return aPage.year === bPage.year && aPage.month === bPage.month && aPage.week === bPage.week && aPage.day === bPage.day;
}
function pageRangeToArray(from, to, view, locale) {
  if (!pageIsValid(from) || !pageIsValid(to))
    return [];
  const result = [];
  while (!pageIsAfterPage(from, to)) {
    result.push(from);
    from = addPages(from, 1, view, locale);
  }
  return result;
}
function getPageKey(config) {
  const { day, week, month, year } = config;
  let id = `${year}-${pad(month, 2)}`;
  if (week)
    id = `${id}-w${week}`;
  if (day)
    id = `${id}-${pad(day, 2)}`;
  return id;
}
function getCachedPage(config, locale) {
  const { month, year, showWeeknumbers, showIsoWeeknumbers } = config;
  const date = new Date(year, month - 1, 15);
  const monthComps = locale.getMonthParts(month, year);
  const prevMonthComps = locale.getPrevMonthParts(month, year);
  const nextMonthComps = locale.getNextMonthParts(month, year);
  const days = getDays({ monthComps, prevMonthComps, nextMonthComps }, locale);
  const weeks = getWeeks(days, showWeeknumbers, showIsoWeeknumbers, locale);
  const weekdays2 = getWeekdays(weeks[0], locale);
  return {
    id: getPageKey(config),
    month,
    year,
    monthTitle: locale.formatDate(date, locale.masks.title),
    shortMonthLabel: locale.formatDate(date, "MMM"),
    monthLabel: locale.formatDate(date, "MMMM"),
    shortYearLabel: year.toString().substring(2),
    yearLabel: year.toString(),
    monthComps,
    prevMonthComps,
    nextMonthComps,
    days,
    weeks,
    weekdays: weekdays2
  };
}
function getPage(config, cachedPage) {
  const { day, week, view, trimWeeks } = config;
  const page = {
    ...cachedPage,
    ...config,
    title: "",
    viewDays: [],
    viewWeeks: []
  };
  switch (view) {
    case "daily": {
      let dayObj = page.days.find((d) => d.inMonth);
      if (day) {
        dayObj = page.days.find((d) => d.day === day && d.inMonth) || dayObj;
      } else if (week) {
        dayObj = page.days.find((d) => d.week === week && d.inMonth);
      }
      const weekObj = page.weeks[dayObj.week - 1];
      page.viewWeeks = [weekObj];
      page.viewDays = [dayObj];
      page.week = dayObj.week;
      page.weekTitle = weekObj.title;
      page.day = dayObj.day;
      page.dayTitle = dayObj.ariaLabel;
      page.title = page.dayTitle;
      break;
    }
    case "weekly": {
      page.week = week || 1;
      const weekObj = page.weeks[page.week - 1];
      page.viewWeeks = [weekObj];
      page.viewDays = weekObj.days;
      page.weekTitle = weekObj.title;
      page.title = page.weekTitle;
      break;
    }
    default: {
      page.title = page.monthTitle;
      page.viewWeeks = page.weeks.slice(
        0,
        trimWeeks ? page.monthComps.numWeeks : void 0
      );
      page.viewDays = page.days;
      break;
    }
  }
  return page;
}
class Cache {
  constructor(size, createKey, createItem) {
    __publicField(this, "keys", []);
    __publicField(this, "store", {});
    this.size = size;
    this.createKey = createKey;
    this.createItem = createItem;
  }
  get(...args) {
    const key = this.createKey(...args);
    return this.store[key];
  }
  getOrSet(...args) {
    const key = this.createKey(...args);
    if (this.store[key])
      return this.store[key];
    const item = this.createItem(...args);
    if (this.keys.length >= this.size) {
      const removeKey = this.keys.shift();
      if (removeKey != null) {
        delete this.store[removeKey];
      }
    }
    this.keys.push(key);
    this.store[key] = item;
    return item;
  }
}
class DateRange {
  constructor(config, locale = new Locale()) {
    __publicField(this, "order");
    __publicField(this, "locale");
    __publicField(this, "start", null);
    __publicField(this, "end", null);
    __publicField(this, "repeat", null);
    var _a;
    this.locale = locale;
    const { start, end, span, order, repeat } = config;
    if (isDate(start)) {
      this.start = locale.getDateParts(start);
    }
    if (isDate(end)) {
      this.end = locale.getDateParts(end);
    } else if (this.start != null && span) {
      this.end = locale.getDateParts(addDays(this.start.date, span - 1));
    }
    this.order = order ?? 0;
    if (repeat) {
      this.repeat = new DateRepeat(
        {
          from: (_a = this.start) == null ? void 0 : _a.date,
          ...repeat
        },
        {
          locale: this.locale
        }
      );
    }
  }
  static fromMany(ranges, locale) {
    return (isArray(ranges) ? ranges : [ranges]).filter((d) => d).map((d) => DateRange.from(d, locale));
  }
  static from(source, locale) {
    if (source instanceof DateRange)
      return source;
    const config = {
      start: null,
      end: null
    };
    if (source != null) {
      if (isArray(source)) {
        config.start = source[0] ?? null;
        config.end = source[1] ?? null;
      } else if (isObject(source)) {
        Object.assign(config, source);
      } else {
        config.start = source;
        config.end = source;
      }
    }
    if (config.start != null)
      config.start = new Date(config.start);
    if (config.end != null)
      config.end = new Date(config.end);
    return new DateRange(config, locale);
  }
  get opts() {
    const { order, locale } = this;
    return { order, locale };
  }
  get hasRepeat() {
    return !!this.repeat;
  }
  get isSingleDay() {
    const { start, end } = this;
    return start && end && start.year === end.year && start.month === end.month && start.day === end.day;
  }
  get isMultiDay() {
    return !this.isSingleDay;
  }
  get daySpan() {
    if (this.start == null || this.end == null) {
      if (this.hasRepeat)
        return 1;
      return Infinity;
    }
    return this.end.dayIndex - this.start.dayIndex;
  }
  startsOnDay(dayParts) {
    var _a, _b;
    return ((_a = this.start) == null ? void 0 : _a.dayIndex) === dayParts.dayIndex || !!((_b = this.repeat) == null ? void 0 : _b.passes(dayParts));
  }
  intersectsDay(dayIndex) {
    return this.intersectsDayRange(dayIndex, dayIndex);
  }
  intersectsRange(range) {
    var _a, _b;
    return this.intersectsDayRange(
      ((_a = range.start) == null ? void 0 : _a.dayIndex) ?? -Infinity,
      ((_b = range.end) == null ? void 0 : _b.dayIndex) ?? Infinity
    );
  }
  intersectsDayRange(startDayIndex, endDayIndex) {
    if (this.start && this.start.dayIndex > endDayIndex)
      return false;
    if (this.end && this.end.dayIndex < startDayIndex)
      return false;
    return true;
  }
}
class DateRangeContext {
  constructor() {
    __publicField(this, "records", {});
  }
  render(data2, range, days) {
    var _a, _b, _c, _d;
    let result = null;
    const startDayIndex = days[0].dayIndex;
    const endDayIndex = days[days.length - 1].dayIndex;
    if (range.hasRepeat) {
      days.forEach((day) => {
        var _a2, _b2;
        if (range.startsOnDay(day)) {
          const span = range.daySpan < Infinity ? range.daySpan : 1;
          result = {
            startDay: day.dayIndex,
            startTime: ((_a2 = range.start) == null ? void 0 : _a2.time) ?? 0,
            endDay: day.dayIndex + span - 1,
            endTime: ((_b2 = range.end) == null ? void 0 : _b2.time) ?? MS_PER_DAY
          };
          this.getRangeRecords(data2).push(result);
        }
      });
    } else if (range.intersectsDayRange(startDayIndex, endDayIndex)) {
      result = {
        startDay: ((_a = range.start) == null ? void 0 : _a.dayIndex) ?? -Infinity,
        startTime: ((_b = range.start) == null ? void 0 : _b.time) ?? -Infinity,
        endDay: ((_c = range.end) == null ? void 0 : _c.dayIndex) ?? Infinity,
        endTime: ((_d = range.end) == null ? void 0 : _d.time) ?? Infinity
      };
      this.getRangeRecords(data2).push(result);
    }
    return result;
  }
  getRangeRecords(data2) {
    let record = this.records[data2.key];
    if (!record) {
      record = {
        ranges: [],
        data: data2
      };
      this.records[data2.key] = record;
    }
    return record.ranges;
  }
  getCell(key, day) {
    const cells = this.getCells(day);
    const result = cells.find((cell) => cell.data.key === key);
    return result;
  }
  cellExists(key, dayIndex) {
    const records = this.records[key];
    if (records == null)
      return false;
    return records.ranges.some(
      (r) => r.startDay <= dayIndex && r.endDay >= dayIndex
    );
  }
  getCells(day) {
    const records = Object.values(this.records);
    const result = [];
    const { dayIndex } = day;
    records.forEach(({ data: data2, ranges }) => {
      ranges.filter((r) => r.startDay <= dayIndex && r.endDay >= dayIndex).forEach((range) => {
        const onStart = dayIndex === range.startDay;
        const onEnd = dayIndex === range.endDay;
        const startTime = onStart ? range.startTime : 0;
        const startDate = new Date(day.startDate.getTime() + startTime);
        const endTime = onEnd ? range.endTime : MS_PER_DAY;
        const endDate = new Date(day.endDate.getTime() + endTime);
        const allDay = startTime === 0 && endTime === MS_PER_DAY;
        const order = data2.order || 0;
        result.push({
          ...range,
          data: data2,
          onStart,
          onEnd,
          startTime,
          startDate,
          endTime,
          endDate,
          allDay,
          order
        });
      });
    });
    result.sort((a, b) => a.order - b.order);
    return result;
  }
}
const locales = {
  // Arabic
  ar: { dow: 7, L: "D/‏M/‏YYYY" },
  // Bulgarian
  bg: { dow: 2, L: "D.MM.YYYY" },
  // Catalan
  ca: { dow: 2, L: "DD/MM/YYYY" },
  // Chinese (China)
  "zh-CN": { dow: 2, L: "YYYY/MM/DD" },
  // Chinese (Taiwan)
  "zh-TW": { dow: 1, L: "YYYY/MM/DD" },
  // Croatian
  hr: { dow: 2, L: "DD.MM.YYYY" },
  // Czech
  cs: { dow: 2, L: "DD.MM.YYYY" },
  // Danish
  da: { dow: 2, L: "DD.MM.YYYY" },
  // Dutch
  nl: { dow: 2, L: "DD-MM-YYYY" },
  // English (US)
  "en-US": { dow: 1, L: "MM/DD/YYYY" },
  // English (Australia)
  "en-AU": { dow: 2, L: "DD/MM/YYYY" },
  // English (Canada)
  "en-CA": { dow: 1, L: "YYYY-MM-DD" },
  // English (Great Britain)
  "en-GB": { dow: 2, L: "DD/MM/YYYY" },
  // English (Ireland)
  "en-IE": { dow: 2, L: "DD-MM-YYYY" },
  // English (New Zealand)
  "en-NZ": { dow: 2, L: "DD/MM/YYYY" },
  // English (South Africa)
  "en-ZA": { dow: 1, L: "YYYY/MM/DD" },
  // Esperanto
  eo: { dow: 2, L: "YYYY-MM-DD" },
  // Estonian
  et: { dow: 2, L: "DD.MM.YYYY" },
  // Finnish
  fi: { dow: 2, L: "DD.MM.YYYY" },
  // French
  fr: { dow: 2, L: "DD/MM/YYYY" },
  // French (Canada)
  "fr-CA": { dow: 1, L: "YYYY-MM-DD" },
  // French (Switzerland)
  "fr-CH": { dow: 2, L: "DD.MM.YYYY" },
  // German
  de: { dow: 2, L: "DD.MM.YYYY" },
  // Hebrew
  he: { dow: 1, L: "DD.MM.YYYY" },
  // Indonesian
  id: { dow: 2, L: "DD/MM/YYYY" },
  // Italian
  it: { dow: 2, L: "DD/MM/YYYY" },
  // Japanese
  ja: { dow: 1, L: "YYYY年M月D日" },
  // Korean
  ko: { dow: 1, L: "YYYY.MM.DD" },
  // Latvian
  lv: { dow: 2, L: "DD.MM.YYYY" },
  // Lithuanian
  lt: { dow: 2, L: "DD.MM.YYYY" },
  // Macedonian
  mk: { dow: 2, L: "D.MM.YYYY" },
  // Norwegian
  nb: { dow: 2, L: "D. MMMM YYYY" },
  nn: { dow: 2, L: "D. MMMM YYYY" },
  // Polish
  pl: { dow: 2, L: "DD.MM.YYYY" },
  // Portuguese
  pt: { dow: 2, L: "DD/MM/YYYY" },
  // Romanian
  ro: { dow: 2, L: "DD.MM.YYYY" },
  // Russian
  ru: { dow: 2, L: "DD.MM.YYYY" },
  // Slovak
  sk: { dow: 2, L: "DD.MM.YYYY" },
  // Spanish (Spain)
  "es-ES": { dow: 2, L: "DD/MM/YYYY" },
  // Spanish (Mexico)
  "es-MX": { dow: 2, L: "DD/MM/YYYY" },
  // Swedish
  sv: { dow: 2, L: "YYYY-MM-DD" },
  // Thai
  th: { dow: 1, L: "DD/MM/YYYY" },
  // Turkish
  tr: { dow: 2, L: "DD.MM.YYYY" },
  // Ukrainian
  uk: { dow: 2, L: "DD.MM.YYYY" },
  // Vietnam
  vi: { dow: 2, L: "DD/MM/YYYY" }
};
locales.en = locales["en-US"];
locales.es = locales["es-ES"];
locales.no = locales.nb;
locales.zh = locales["zh-CN"];
const localeSettings = Object.entries(locales).reduce(
  (res, [id, { dow, L }]) => {
    res[id] = {
      id,
      firstDayOfWeek: dow,
      masks: { L }
    };
    return res;
  },
  {}
);
const title = "MMMM YYYY";
const weekdays = "W";
const navMonths = "MMM";
const hours = "h A";
const input = [
  "L",
  "YYYY-MM-DD",
  "YYYY/MM/DD"
];
const inputDateTime = [
  "L h:mm A",
  "YYYY-MM-DD h:mm A",
  "YYYY/MM/DD h:mm A"
];
const inputDateTime24hr = [
  "L HH:mm",
  "YYYY-MM-DD HH:mm",
  "YYYY/MM/DD HH:mm"
];
const inputTime = [
  "h:mm A"
];
const inputTime24hr = [
  "HH:mm"
];
const dayPopover = "WWW, MMM D, YYYY";
const data = [
  "L",
  "YYYY-MM-DD",
  "YYYY/MM/DD"
];
const model = "iso";
const iso = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const masks = {
  title,
  weekdays,
  navMonths,
  hours,
  input,
  inputDateTime,
  inputDateTime24hr,
  inputTime,
  inputTime24hr,
  dayPopover,
  data,
  model,
  iso
};
const maxSwipeTime = 300;
const minHorizontalSwipeDistance = 60;
const maxVerticalSwipeDistance = 80;
const touch = {
  maxSwipeTime,
  minHorizontalSwipeDistance,
  maxVerticalSwipeDistance
};
const defaultConfig = {
  componentPrefix: "V",
  color: "blue",
  isDark: false,
  navVisibility: "click",
  titlePosition: "center",
  transition: "slide-h",
  touch,
  masks,
  locales: localeSettings,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1e3,
    popover: {
      visibility: "hover-focus",
      placement: "bottom-start",
      isInteractive: true
    }
  }
};
const state = reactive(defaultConfig);
const defaultLocales = computed(() => {
  return mapValues_1(state.locales, (l) => {
    l.masks = defaultsDeep_1(l.masks, state.masks);
    return l;
  });
});
const getDefault = (path) => {
  if (typeof window !== "undefined" && has(window.__vcalendar__, path)) {
    return get_1(window.__vcalendar__, path);
  }
  return get_1(state, path);
};
const setupDefaults = (app, userDefaults) => {
  app.config.globalProperties.$VCalendar = state;
  return Object.assign(state, defaultsDeep_1(userDefaults, state));
};
const DEFAULT_MONTH_CACHE_SIZE = 12;
const DEFAULT_PAGE_CACHE_SIZE = 5;
function resolveConfig(config, locales2) {
  const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  let id;
  if (isString_1(config)) {
    id = config;
  } else if (has(config, "id")) {
    id = config.id;
  }
  id = (id || detLocale).toLowerCase();
  const localeKeys = Object.keys(locales2);
  const validKey = (k) => localeKeys.find((lk) => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  const defLocale = {
    ...locales2["en-IE"],
    ...locales2[id],
    id,
    monthCacheSize: DEFAULT_MONTH_CACHE_SIZE,
    pageCacheSize: DEFAULT_PAGE_CACHE_SIZE
  };
  const result = isObject(config) ? defaultsDeep_1(config, defLocale) : defLocale;
  return result;
}
class Locale {
  constructor(config = void 0, timezone) {
    __publicField(this, "id");
    __publicField(this, "daysInWeek");
    __publicField(this, "firstDayOfWeek");
    __publicField(this, "masks");
    __publicField(this, "timezone");
    __publicField(this, "hourLabels");
    __publicField(this, "dayNames");
    __publicField(this, "dayNamesShort");
    __publicField(this, "dayNamesShorter");
    __publicField(this, "dayNamesNarrow");
    __publicField(this, "monthNames");
    __publicField(this, "monthNamesShort");
    __publicField(this, "relativeTimeNames");
    __publicField(this, "amPm", ["am", "pm"]);
    __publicField(this, "monthCache");
    __publicField(this, "pageCache");
    const { id, firstDayOfWeek, masks: masks2, monthCacheSize, pageCacheSize } = resolveConfig(config, defaultLocales.value);
    this.monthCache = new Cache(
      monthCacheSize,
      getMonthPartsKey,
      getMonthParts
    );
    this.pageCache = new Cache(pageCacheSize, getPageKey, getCachedPage);
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek);
    this.masks = masks2;
    this.timezone = timezone || void 0;
    this.hourLabels = this.getHourLabels();
    this.dayNames = getDayNames("long", this.id);
    this.dayNamesShort = getDayNames("short", this.id);
    this.dayNamesShorter = this.dayNamesShort.map((s) => s.substring(0, 2));
    this.dayNamesNarrow = getDayNames("narrow", this.id);
    this.monthNames = getMonthNames("long", this.id);
    this.monthNamesShort = getMonthNames("short", this.id);
    this.relativeTimeNames = getRelativeTimeNames(this.id);
  }
  formatDate(date, masks2) {
    return formatDate(date, masks2, this);
  }
  parseDate(dateString, mask) {
    return parseDate(dateString, mask, this);
  }
  toDate(d, opts = {}) {
    const nullDate = /* @__PURE__ */ new Date(NaN);
    let result = nullDate;
    const { fillDate, mask, patch, rules } = opts;
    if (isNumber_1(d)) {
      opts.type = "number";
      result = /* @__PURE__ */ new Date(+d);
    } else if (isString_1(d)) {
      opts.type = "string";
      result = d ? parseDate(d, mask || "iso", this) : nullDate;
    } else if (isDate(d)) {
      opts.type = "date";
      result = new Date(d.getTime());
    } else if (isDateParts(d)) {
      opts.type = "object";
      result = this.getDateFromParts(d);
    }
    if (result && (patch || rules)) {
      let parts = this.getDateParts(result);
      if (patch && fillDate != null) {
        const fillParts = this.getDateParts(this.toDate(fillDate));
        parts = this.getDateParts(
          this.toDate({ ...fillParts, ...pick(parts, DatePatchKeys[patch]) })
        );
      }
      if (rules) {
        parts = applyRulesForDateParts(parts, rules);
      }
      result = this.getDateFromParts(parts);
    }
    return result || nullDate;
  }
  toDateOrNull(d, opts = {}) {
    const dte = this.toDate(d, opts);
    return isNaN(dte.getTime()) ? null : dte;
  }
  fromDate(date, { type, mask } = {}) {
    switch (type) {
      case "number":
        return date ? date.getTime() : NaN;
      case "string":
        return date ? this.formatDate(date, mask || "iso") : "";
      case "object":
        return date ? this.getDateParts(date) : null;
      default:
        return date ? new Date(date) : null;
    }
  }
  range(source) {
    return DateRange.from(source, this);
  }
  ranges(ranges) {
    return DateRange.fromMany(ranges, this);
  }
  getDateParts(date) {
    return getDateParts(date, this);
  }
  getDateFromParts(parts) {
    return getDateFromParts(parts, this.timezone);
  }
  getDateFromParams(year, month, day, hours2, minutes, seconds, milliseconds) {
    return this.getDateFromParts({
      year,
      month,
      day,
      hours: hours2,
      minutes,
      seconds,
      milliseconds
    });
  }
  getPage(config) {
    const cachedPage = this.pageCache.getOrSet(config, this);
    return getPage(config, cachedPage);
  }
  getMonthParts(month, year) {
    const { firstDayOfWeek } = this;
    return this.monthCache.getOrSet(month, year, firstDayOfWeek);
  }
  getThisMonthParts() {
    const date = /* @__PURE__ */ new Date();
    return this.getMonthParts(
      date.getMonth() + 1,
      date.getFullYear()
    );
  }
  getPrevMonthParts(month, year) {
    if (month === 1)
      return this.getMonthParts(12, year - 1);
    return this.getMonthParts(month - 1, year);
  }
  getNextMonthParts(month, year) {
    if (month === 12)
      return this.getMonthParts(1, year + 1);
    return this.getMonthParts(month + 1, year);
  }
  getHourLabels() {
    return getHourDates().map((d) => {
      return this.formatDate(d, this.masks.hours);
    });
  }
  getDayId(date) {
    return this.formatDate(date, "YYYY-MM-DD");
  }
}
var GroupRuleType = /* @__PURE__ */ ((GroupRuleType2) => {
  GroupRuleType2["Any"] = "any";
  GroupRuleType2["All"] = "all";
  return GroupRuleType2;
})(GroupRuleType || {});
var IntervalRuleType = /* @__PURE__ */ ((IntervalRuleType2) => {
  IntervalRuleType2["Days"] = "days";
  IntervalRuleType2["Weeks"] = "weeks";
  IntervalRuleType2["Months"] = "months";
  IntervalRuleType2["Years"] = "years";
  return IntervalRuleType2;
})(IntervalRuleType || {});
var ComponentRuleType = /* @__PURE__ */ ((ComponentRuleType2) => {
  ComponentRuleType2["Days"] = "days";
  ComponentRuleType2["Weekdays"] = "weekdays";
  ComponentRuleType2["Weeks"] = "weeks";
  ComponentRuleType2["Months"] = "months";
  ComponentRuleType2["Years"] = "years";
  return ComponentRuleType2;
})(ComponentRuleType || {});
var OrdinalComponentRuleType = /* @__PURE__ */ ((OrdinalComponentRuleType2) => {
  OrdinalComponentRuleType2["OrdinalWeekdays"] = "ordinalWeekdays";
  return OrdinalComponentRuleType2;
})(OrdinalComponentRuleType || {});
class IntervalRule {
  constructor(type, interval, from) {
    __publicField(this, "validated", true);
    this.type = type;
    this.interval = interval;
    this.from = from;
    if (!this.from) {
      console.error(
        `A valid "from" date is required for date interval rule. This rule will be skipped.`
      );
      this.validated = false;
    }
  }
  passes(dateParts) {
    if (!this.validated)
      return true;
    const { date } = dateParts;
    switch (this.type) {
      case "days": {
        return diffInDays(this.from.date, date) % this.interval === 0;
      }
      case "weeks": {
        return diffInWeeks(this.from.date, date) % this.interval === 0;
      }
      case "months": {
        return diffInMonths(this.from.date, date) % this.interval === 0;
      }
      case "years": {
        return diffInYears(this.from.date, date) % this.interval === 0;
      }
      default: {
        return false;
      }
    }
  }
}
class ComponentRule {
  constructor(type, components2, validator, getter) {
    __publicField(this, "components", []);
    this.type = type;
    this.validator = validator;
    this.getter = getter;
    this.components = this.normalizeComponents(components2);
  }
  static create(type, config) {
    switch (type) {
      case "days":
        return new DaysRule(config);
      case "weekdays":
        return new WeekdaysRule(config);
      case "weeks":
        return new WeeksRule(config);
      case "months":
        return new MonthsRule(config);
      case "years":
        return new YearsRule(config);
    }
  }
  normalizeComponents(components2) {
    if (this.validator(components2))
      return [components2];
    if (!isArray(components2))
      return [];
    const result = [];
    components2.forEach((component) => {
      if (!this.validator(component)) {
        console.error(
          `Component value ${component} in invalid for "${this.type}" rule. This rule will be skipped.`
        );
        return;
      }
      result.push(component);
    });
    return result;
  }
  passes(dayParts) {
    const comps = this.getter(dayParts);
    const result = comps.some((comp) => this.components.includes(comp));
    return result;
  }
}
class DaysRule extends ComponentRule {
  constructor(components2) {
    super(
      "days",
      components2,
      isDayInMonth,
      ({ day, dayFromEnd }) => [day, -dayFromEnd]
    );
  }
}
class WeekdaysRule extends ComponentRule {
  constructor(components2) {
    super(
      "weekdays",
      components2,
      isDayOfWeek,
      ({ weekday }) => [weekday]
    );
  }
}
class WeeksRule extends ComponentRule {
  constructor(components2) {
    super(
      "weeks",
      components2,
      isWeekInMonth,
      ({ week, weekFromEnd }) => [week, -weekFromEnd]
    );
  }
}
class MonthsRule extends ComponentRule {
  constructor(components2) {
    super("months", components2, isMonthInYear, ({ month }) => [
      month
    ]);
  }
}
class YearsRule extends ComponentRule {
  constructor(components2) {
    super("years", components2, isNumber_1, ({ year }) => [year]);
  }
}
class OrdinalComponentRule {
  constructor(type, components2) {
    __publicField(this, "components");
    this.type = type;
    this.components = this.normalizeComponents(components2);
  }
  normalizeArrayConfig(config) {
    const result = [];
    config.forEach((numOrArray, i) => {
      if (isNumber_1(numOrArray)) {
        if (i === 0)
          return;
        if (!isOrdinalWeekInMonth(config[0])) {
          console.error(
            `Ordinal range for "${this.type}" rule is from -5 to -1 or 1 to 5. This rule will be skipped.`
          );
          return;
        }
        if (!isDayOfWeek(numOrArray)) {
          console.error(
            `Acceptable range for "${this.type}" rule is from 1 to 5. This rule will be skipped`
          );
          return;
        }
        result.push([config[0], numOrArray]);
      } else if (isArray(numOrArray)) {
        result.push(...this.normalizeArrayConfig(numOrArray));
      }
    });
    return result;
  }
  normalizeComponents(config) {
    const result = [];
    config.forEach((numOrArray, i) => {
      if (isNumber_1(numOrArray)) {
        if (i === 0)
          return;
        if (!isOrdinalWeekInMonth(config[0])) {
          console.error(
            `Ordinal range for "${this.type}" rule is from -5 to -1 or 1 to 5. This rule will be skipped.`
          );
          return;
        }
        if (!isDayOfWeek(numOrArray)) {
          console.error(
            `Acceptable range for "${this.type}" rule is from 1 to 5. This rule will be skipped`
          );
          return;
        }
        result.push([config[0], numOrArray]);
      } else if (isArray(numOrArray)) {
        result.push(...this.normalizeArrayConfig(numOrArray));
      }
    });
    return result;
  }
  passes(dayParts) {
    const { weekday, weekdayOrdinal, weekdayOrdinalFromEnd } = dayParts;
    return this.components.some(
      ([ordinalWeek, ordinalWeekday]) => (ordinalWeek === weekdayOrdinal || ordinalWeek === -weekdayOrdinalFromEnd) && weekday === ordinalWeekday
    );
  }
}
class FunctionRule {
  constructor(fn) {
    __publicField(this, "type", "function");
    __publicField(this, "validated", true);
    this.fn = fn;
    if (!isFunction_1(fn)) {
      console.error(
        `The function rule requires a valid function. This rule will be skipped.`
      );
      this.validated = false;
    }
  }
  passes(dayParts) {
    if (!this.validated)
      return true;
    return this.fn(dayParts);
  }
}
class DateRepeat {
  constructor(config, options = {}, parent) {
    __publicField(this, "validated", true);
    __publicField(this, "config");
    __publicField(this, "type", GroupRuleType.Any);
    __publicField(this, "from");
    __publicField(this, "until");
    __publicField(this, "rules", []);
    __publicField(this, "locale", new Locale());
    this.parent = parent;
    if (options.locale)
      this.locale = options.locale;
    this.config = config;
    if (isFunction_1(config)) {
      this.type = GroupRuleType.All;
      this.rules = [new FunctionRule(config)];
    } else if (isArray(config)) {
      this.type = GroupRuleType.Any;
      this.rules = config.map((c) => new DateRepeat(c, options, this));
    } else if (isObject(config)) {
      this.type = GroupRuleType.All;
      this.from = config.from ? this.locale.getDateParts(config.from) : parent == null ? void 0 : parent.from;
      this.until = config.until ? this.locale.getDateParts(config.until) : parent == null ? void 0 : parent.until;
      this.rules = this.getObjectRules(config);
    } else {
      console.error("Rule group configuration must be an object or an array.");
      this.validated = false;
    }
  }
  getObjectRules(config) {
    const rules = [];
    if (config.every) {
      if (isString_1(config.every)) {
        config.every = [1, `${config.every}s`];
      }
      if (isArray(config.every)) {
        const [interval = 1, type = IntervalRuleType.Days] = config.every;
        rules.push(new IntervalRule(type, interval, this.from));
      }
    }
    Object.values(ComponentRuleType).forEach((type) => {
      if (!(type in config))
        return;
      rules.push(ComponentRule.create(type, config[type]));
    });
    Object.values(OrdinalComponentRuleType).forEach((type) => {
      if (!(type in config))
        return;
      rules.push(new OrdinalComponentRule(type, config[type]));
    });
    if (config.on != null) {
      if (!isArray(config.on))
        config.on = [config.on];
      rules.push(
        new DateRepeat(config.on, { locale: this.locale }, this.parent)
      );
    }
    return rules;
  }
  passes(dayParts) {
    if (!this.validated)
      return true;
    if (this.from && dayParts.dayIndex <= this.from.dayIndex)
      return false;
    if (this.until && dayParts.dayIndex >= this.until.dayIndex)
      return false;
    if (this.type === GroupRuleType.Any) {
      return this.rules.some((r) => r.passes(dayParts));
    }
    return this.rules.every((r) => r.passes(dayParts));
  }
}
function isDayInMonth(dayInMonth) {
  if (!isNumber_1(dayInMonth))
    return false;
  return dayInMonth >= 1 && dayInMonth <= 31;
}
function isDayOfWeek(dayOfWeek) {
  if (!isNumber_1(dayOfWeek))
    return false;
  return dayOfWeek >= 1 && dayOfWeek <= 7;
}
function isWeekInMonth(weekInMonth) {
  if (!isNumber_1(weekInMonth))
    return false;
  return weekInMonth >= -6 && weekInMonth <= -1 || weekInMonth >= 1 && weekInMonth <= 6;
}
function isMonthInYear(monthInYear) {
  if (!isNumber_1(monthInYear))
    return false;
  return monthInYear >= 1 && monthInYear <= 12;
}
function isOrdinalWeekInMonth(weekInMonth) {
  if (!isNumber_1(weekInMonth))
    return false;
  if (weekInMonth < -5 || weekInMonth > 5 || weekInMonth === 0)
    return false;
  return true;
}
const DatePatchKeys = {
  dateTime: [
    "year",
    "month",
    "day",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  ],
  date: ["year", "month", "day"],
  time: ["hours", "minutes", "seconds", "milliseconds"]
};
const daysInWeek = 7;
const weeksInMonth = 6;
const MS_PER_SECOND = 1e3;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const maskMacros = ["L", "iso"];
const DATE_PART_RANGES = {
  milliseconds: [0, 999, 3],
  seconds: [0, 59, 2],
  minutes: [0, 59, 2],
  hours: [0, 23, 2]
};
const token = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|Z{1,4}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const literal = /\[([^]*?)\]/gm;
const formatFlags = {
  D(d) {
    return d.day;
  },
  DD(d) {
    return pad(d.day, 2);
  },
  // Do(d: DateParts, l: Locale) {
  //   return l.DoFn(d.day);
  // },
  d(d) {
    return d.weekday - 1;
  },
  dd(d) {
    return pad(d.weekday - 1, 2);
  },
  W(d, l) {
    return l.dayNamesNarrow[d.weekday - 1];
  },
  WW(d, l) {
    return l.dayNamesShorter[d.weekday - 1];
  },
  WWW(d, l) {
    return l.dayNamesShort[d.weekday - 1];
  },
  WWWW(d, l) {
    return l.dayNames[d.weekday - 1];
  },
  M(d) {
    return d.month;
  },
  MM(d) {
    return pad(d.month, 2);
  },
  MMM(d, l) {
    return l.monthNamesShort[d.month - 1];
  },
  MMMM(d, l) {
    return l.monthNames[d.month - 1];
  },
  YY(d) {
    return String(d.year).substr(2);
  },
  YYYY(d) {
    return pad(d.year, 4);
  },
  h(d) {
    return d.hours % 12 || 12;
  },
  hh(d) {
    return pad(d.hours % 12 || 12, 2);
  },
  H(d) {
    return d.hours;
  },
  HH(d) {
    return pad(d.hours, 2);
  },
  m(d) {
    return d.minutes;
  },
  mm(d) {
    return pad(d.minutes, 2);
  },
  s(d) {
    return d.seconds;
  },
  ss(d) {
    return pad(d.seconds, 2);
  },
  S(d) {
    return Math.round(d.milliseconds / 100);
  },
  SS(d) {
    return pad(Math.round(d.milliseconds / 10), 2);
  },
  SSS(d) {
    return pad(d.milliseconds, 3);
  },
  a(d, l) {
    return d.hours < 12 ? l.amPm[0] : l.amPm[1];
  },
  A(d, l) {
    return d.hours < 12 ? l.amPm[0].toUpperCase() : l.amPm[1].toUpperCase();
  },
  Z() {
    return "Z";
  },
  ZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(Math.floor(Math.abs(o) / 60), 2)}`;
  },
  ZZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(
      Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60,
      4
    )}`;
  },
  ZZZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(Math.floor(Math.abs(o) / 60), 2)}:${pad(
      Math.abs(o) % 60,
      2
    )}`;
  }
};
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
const noop = () => {
};
const monthUpdate = (arrName) => (d, v, l) => {
  const index2 = l[arrName].indexOf(
    v.charAt(0).toUpperCase() + v.substr(1).toLowerCase()
  );
  if (~index2) {
    d.month = index2;
  }
};
const parseFlags = {
  D: [
    twoDigits,
    (d, v) => {
      d.day = v;
    }
  ],
  Do: [
    new RegExp(twoDigits.source + word.source),
    (d, v) => {
      d.day = parseInt(v, 10);
    }
  ],
  d: [twoDigits, noop],
  W: [word, noop],
  M: [
    twoDigits,
    (d, v) => {
      d.month = v - 1;
    }
  ],
  MMM: [word, monthUpdate("monthNamesShort")],
  MMMM: [word, monthUpdate("monthNames")],
  YY: [
    twoDigits,
    (d, v) => {
      const da = /* @__PURE__ */ new Date();
      const cent = +da.getFullYear().toString().substr(0, 2);
      d.year = +`${v > 68 ? cent - 1 : cent}${v}`;
    }
  ],
  YYYY: [
    fourDigits,
    (d, v) => {
      d.year = v;
    }
  ],
  S: [
    /\d/,
    (d, v) => {
      d.milliseconds = v * 100;
    }
  ],
  SS: [
    /\d{2}/,
    (d, v) => {
      d.milliseconds = v * 10;
    }
  ],
  SSS: [
    threeDigits,
    (d, v) => {
      d.milliseconds = v;
    }
  ],
  h: [
    twoDigits,
    (d, v) => {
      d.hours = v;
    }
  ],
  m: [
    twoDigits,
    (d, v) => {
      d.minutes = v;
    }
  ],
  s: [
    twoDigits,
    (d, v) => {
      d.seconds = v;
    }
  ],
  a: [
    word,
    (d, v, l) => {
      const val = v.toLowerCase();
      if (val === l.amPm[0]) {
        d.isPm = false;
      } else if (val === l.amPm[1]) {
        d.isPm = true;
      }
    }
  ],
  Z: [
    /[^\s]*?[+-]\d\d:?\d\d|[^\s]*?Z?/,
    (d, v) => {
      if (v === "Z")
        v = "+00:00";
      const parts = `${v}`.match(/([+-]|\d\d)/gi);
      if (parts) {
        const minutes = +parts[1] * 60 + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === "+" ? minutes : -minutes;
      }
    }
  ]
};
parseFlags.DD = parseFlags.D;
parseFlags.dd = parseFlags.d;
parseFlags.WWWW = parseFlags.WWW = parseFlags.WW = parseFlags.W;
parseFlags.MM = parseFlags.M;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;
parseFlags.ZZZZ = parseFlags.ZZZ = parseFlags.ZZ = parseFlags.Z;
function normalizeMasks(masks2, locale) {
  return (arrayHasItems(masks2) && masks2 || [
    isString_1(masks2) && masks2 || "YYYY-MM-DD"
  ]).map(
    (m) => maskMacros.reduce(
      (prev, curr) => prev.replace(curr, locale.masks[curr] || ""),
      m
    )
  );
}
function isDateParts(parts) {
  return isObject(parts) && "year" in parts && "month" in parts && "day" in parts;
}
function startOfWeek(date, firstDayOfWeek = 1) {
  const day = date.getDay() + 1;
  const daysToAdd = day >= firstDayOfWeek ? firstDayOfWeek - day : -(7 - (firstDayOfWeek - day));
  return addDays(date, daysToAdd);
}
function getDayIndex(year, month, day) {
  const utcDate = Date.UTC(year, month - 1, day);
  return diffInDays(/* @__PURE__ */ new Date(0), new Date(utcDate));
}
function diffInDays(d1, d2) {
  return Math.round((d2.getTime() - d1.getTime()) / MS_PER_DAY);
}
function diffInWeeks(d1, d2) {
  return Math.ceil(diffInDays(startOfWeek(d1), startOfWeek(d2)) / 7);
}
function diffInYears(d1, d2) {
  return d2.getUTCFullYear() - d1.getUTCFullYear();
}
function diffInMonths(d1, d2) {
  return diffInYears(d1, d2) * 12 + (d2.getMonth() - d1.getMonth());
}
function getDateFromParts(parts, timezone = "") {
  const d = /* @__PURE__ */ new Date();
  const {
    year = d.getFullYear(),
    month = d.getMonth() + 1,
    day = d.getDate(),
    hours: hrs = 0,
    minutes: min = 0,
    seconds: sec = 0,
    milliseconds: ms = 0
  } = parts;
  if (timezone) {
    const dateString = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(
      hrs,
      2
    )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
    return toDate$1(dateString, { timeZone: timezone });
  }
  return new Date(year, month - 1, day, hrs, min, sec, ms);
}
function getDateParts(date, locale) {
  let tzDate = new Date(date.getTime());
  if (locale.timezone) {
    tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: locale.timezone })
    );
    tzDate.setMilliseconds(date.getMilliseconds());
  }
  const milliseconds = tzDate.getMilliseconds();
  const seconds = tzDate.getSeconds();
  const minutes = tzDate.getMinutes();
  const hours2 = tzDate.getHours();
  const time = milliseconds + seconds * MS_PER_SECOND + minutes * MS_PER_MINUTE + hours2 * MS_PER_HOUR;
  const month = tzDate.getMonth() + 1;
  const year = tzDate.getFullYear();
  const monthParts = locale.getMonthParts(month, year);
  const day = tzDate.getDate();
  const dayFromEnd = monthParts.numDays - day + 1;
  const weekday = tzDate.getDay() + 1;
  const weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
  const weekdayOrdinalFromEnd = Math.floor((monthParts.numDays - day) / 7 + 1);
  const week = Math.ceil(
    (day + Math.abs(monthParts.firstWeekday - monthParts.firstDayOfWeek)) / 7
  );
  const weekFromEnd = monthParts.numWeeks - week + 1;
  const weeknumber = monthParts.weeknumbers[week];
  const dayIndex = getDayIndex(year, month, day);
  const parts = {
    milliseconds,
    seconds,
    minutes,
    hours: hours2,
    time,
    day,
    dayFromEnd,
    weekday,
    weekdayOrdinal,
    weekdayOrdinalFromEnd,
    week,
    weekFromEnd,
    weeknumber,
    month,
    year,
    date: tzDate,
    dateTime: tzDate.getTime(),
    dayIndex,
    timezoneOffset: 0,
    isValid: true
  };
  return parts;
}
function getMonthPartsKey(month, year, firstDayOfWeek) {
  return `${year}-${month}-${firstDayOfWeek}`;
}
function getMonthParts(month, year, firstDayOfWeek) {
  const inLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstWeekday = firstDayOfMonth.getDay() + 1;
  const numDays = month === 2 && inLeapYear ? 29 : daysInMonths[month - 1];
  const weekStartsOn = firstDayOfWeek - 1;
  const numWeeks = getWeeksInMonth(firstDayOfMonth, {
    weekStartsOn
  });
  const weeknumbers = [];
  const isoWeeknumbers = [];
  for (let i = 0; i < numWeeks; i++) {
    const date = addDays(firstDayOfMonth, i * 7);
    weeknumbers.push(getWeek(date, { weekStartsOn }));
    isoWeeknumbers.push(getISOWeek(date));
  }
  return {
    firstDayOfWeek,
    firstDayOfMonth,
    inLeapYear,
    firstWeekday,
    numDays,
    numWeeks,
    month,
    year,
    weeknumbers,
    isoWeeknumbers
  };
}
function getWeekdayDates() {
  const dates = [];
  const year = 2020;
  const month = 1;
  const day = 5;
  for (let i = 0; i < daysInWeek; i++) {
    dates.push(
      getDateFromParts({
        year,
        month,
        day: day + i,
        hours: 12
      })
    );
  }
  return dates;
}
function getDayNames(length, localeId = void 0) {
  const dtf = new Intl.DateTimeFormat(localeId, {
    weekday: length
  });
  return getWeekdayDates().map((d) => dtf.format(d));
}
function getHourDates() {
  const dates = [];
  for (let i = 0; i <= 24; i++) {
    dates.push(new Date(2e3, 0, 1, i));
  }
  return dates;
}
function getRelativeTimeNames(localeId = void 0) {
  const units = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "quarter",
    "year"
  ];
  const rtf = new Intl.RelativeTimeFormat(localeId);
  return units.reduce((names, unit) => {
    const parts = rtf.formatToParts(100, unit);
    names[unit] = parts[1].unit;
    return names;
  }, {});
}
function getMonthDates() {
  const dates = [];
  for (let i = 0; i < 12; i++) {
    dates.push(new Date(2e3, i, 15));
  }
  return dates;
}
function getMonthNames(length, localeId = void 0) {
  const dtf = new Intl.DateTimeFormat(localeId, {
    month: length,
    timeZone: "UTC"
  });
  return getMonthDates().map((d) => dtf.format(d));
}
function datePartIsValid(part, rule, parts) {
  if (isNumber_1(rule))
    return rule === part;
  if (isArray(rule))
    return rule.includes(part);
  if (isFunction_1(rule))
    return rule(part, parts);
  if (rule.min != null && rule.min > part)
    return false;
  if (rule.max != null && rule.max < part)
    return false;
  if (rule.interval != null && part % rule.interval !== 0)
    return false;
  return true;
}
function getDatePartOptions(parts, range, rule) {
  const options = [];
  const [min, max, padding] = range;
  for (let i = min; i <= max; i++) {
    if (rule == null || datePartIsValid(i, rule, parts)) {
      options.push({
        value: i,
        label: pad(i, padding)
      });
    }
  }
  return options;
}
function getDatePartsOptions(parts, rules) {
  return {
    milliseconds: getDatePartOptions(
      parts,
      DATE_PART_RANGES.milliseconds,
      rules.milliseconds
    ),
    seconds: getDatePartOptions(parts, DATE_PART_RANGES.seconds, rules.seconds),
    minutes: getDatePartOptions(parts, DATE_PART_RANGES.minutes, rules.minutes),
    hours: getDatePartOptions(parts, DATE_PART_RANGES.hours, rules.hours)
  };
}
function getNearestDatePart(parts, range, value, rule) {
  const options = getDatePartOptions(parts, range, rule);
  const result = options.reduce((prev, opt) => {
    if (opt.disabled)
      return prev;
    if (isNaN(prev))
      return opt.value;
    const diffPrev = Math.abs(prev - value);
    const diffCurr = Math.abs(opt.value - value);
    return diffCurr < diffPrev ? opt.value : prev;
  }, NaN);
  return isNaN(result) ? value : result;
}
function applyRulesForDateParts(dateParts, rules) {
  const result = { ...dateParts };
  Object.entries(rules).forEach(([key, rule]) => {
    const range = DATE_PART_RANGES[key];
    const value = dateParts[key];
    result[key] = getNearestDatePart(
      dateParts,
      range,
      value,
      rule
    );
  });
  return result;
}
function parseDate(dateString, mask, locale) {
  const masks2 = normalizeMasks(mask, locale);
  return masks2.map((m) => {
    if (typeof m !== "string") {
      throw new Error("Invalid mask");
    }
    let str = dateString;
    if (str.length > 1e3) {
      return false;
    }
    let isValid = true;
    const dp = {};
    m.replace(token, ($0) => {
      if (parseFlags[$0]) {
        const info = parseFlags[$0];
        const index2 = str.search(info[0]);
        if (!~index2) {
          isValid = false;
        } else {
          str.replace(info[0], (result) => {
            info[1](dp, result, locale);
            str = str.substr(index2 + result.length);
            return result;
          });
        }
      }
      return parseFlags[$0] ? "" : $0.slice(1, $0.length - 1);
    });
    if (!isValid) {
      return false;
    }
    const today = /* @__PURE__ */ new Date();
    if (dp.hours != null) {
      if (dp.isPm === true && +dp.hours !== 12) {
        dp.hours = +dp.hours + 12;
      } else if (dp.isPm === false && +dp.hours === 12) {
        dp.hours = 0;
      }
    }
    let date;
    if (dp.timezoneOffset != null) {
      dp.minutes = +(dp.minutes || 0) - +dp.timezoneOffset;
      date = new Date(
        Date.UTC(
          dp.year || today.getFullYear(),
          dp.month || 0,
          dp.day || 1,
          dp.hours || 0,
          dp.minutes || 0,
          dp.seconds || 0,
          dp.milliseconds || 0
        )
      );
    } else {
      date = locale.getDateFromParts({
        year: dp.year || today.getFullYear(),
        month: (dp.month || 0) + 1,
        day: dp.day || 1,
        hours: dp.hours || 0,
        minutes: dp.minutes || 0,
        seconds: dp.seconds || 0,
        milliseconds: dp.milliseconds || 0
      });
    }
    return date;
  }).find((d) => d) || new Date(dateString);
}
function formatDate(date, masks2, locale) {
  if (date == null)
    return "";
  let mask = normalizeMasks(masks2, locale)[0];
  if (/Z$/.test(mask))
    locale.timezone = "utc";
  const literals = [];
  mask = mask.replace(literal, ($0, $1) => {
    literals.push($1);
    return "??";
  });
  const dateParts = locale.getDateParts(date);
  mask = mask.replace(
    token,
    ($0) => $0 in formatFlags ? formatFlags[$0](dateParts, locale) : $0.slice(1, $0.length - 1)
  );
  return mask.replace(/\?\?/g, () => literals.shift());
}
let attrKey = 0;
class Attribute {
  constructor(config, theme, locale) {
    __publicField(this, "key", "");
    __publicField(this, "hashcode", "");
    __publicField(this, "highlight", null);
    __publicField(this, "content", null);
    __publicField(this, "dot", null);
    __publicField(this, "bar", null);
    __publicField(this, "event", null);
    __publicField(this, "popover", null);
    __publicField(this, "customData", null);
    __publicField(this, "ranges");
    __publicField(this, "hasRanges", false);
    __publicField(this, "order", 0);
    __publicField(this, "pinPage", false);
    __publicField(this, "maxRepeatSpan", 0);
    __publicField(this, "locale");
    const { dates } = Object.assign(
      this,
      { hashcode: "", order: 0, pinPage: false },
      config
    );
    this.key || (this.key = ++attrKey);
    this.locale = locale;
    theme.normalizeGlyphs(this);
    this.ranges = locale.ranges(dates ?? []);
    this.hasRanges = !!arrayHasItems(this.ranges);
    this.maxRepeatSpan = this.ranges.filter((r) => r.hasRepeat).map((r) => r.daySpan).reduce((res, curr) => Math.max(res, curr), 0);
  }
  intersectsRange({ start, end }) {
    if (start == null || end == null)
      return false;
    const simpleRanges = this.ranges.filter((r) => !r.hasRepeat);
    for (const range of simpleRanges) {
      if (range.intersectsDayRange(start.dayIndex, end.dayIndex)) {
        return true;
      }
    }
    const repeatRanges = this.ranges.filter((r) => r.hasRepeat);
    if (!repeatRanges.length)
      return false;
    let day = start;
    if (this.maxRepeatSpan > 1) {
      day = this.locale.getDateParts(addDays(day.date, -this.maxRepeatSpan));
    }
    while (day.dayIndex <= end.dayIndex) {
      for (const range of repeatRanges) {
        if (range.startsOnDay(day))
          return true;
      }
      day = this.locale.getDateParts(addDays(day.date, 1));
    }
    return false;
  }
}
function showPopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("show-popover", {
        detail: opts
      })
    );
  }
}
function hidePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("hide-popover", {
        detail: opts
      })
    );
  }
}
function togglePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("toggle-popover", {
        detail: opts
      })
    );
  }
}
function getPopoverEventHandlers(opts) {
  const { visibility } = opts;
  const click = visibility === "click";
  const hover = visibility === "hover";
  const hoverFocus = visibility === "hover-focus";
  const focus = visibility === "focus";
  opts.autoHide = !click;
  let hovered = false;
  let focused = false;
  const clickHandler = (e) => {
    if (click) {
      togglePopover({
        ...opts,
        target: opts.target || e.currentTarget
      });
      e.stopPropagation();
    }
  };
  const mouseMoveHandler = (e) => {
    if (!hovered) {
      hovered = true;
      if (hover || hoverFocus) {
        showPopover({
          ...opts,
          target: opts.target || e.currentTarget
        });
      }
    }
  };
  const mouseLeaveHandler = () => {
    if (hovered) {
      hovered = false;
      if (hover || hoverFocus && !focused) {
        hidePopover(opts);
      }
    }
  };
  const focusInHandler = (e) => {
    if (!focused) {
      focused = true;
      if (focus || hoverFocus) {
        showPopover({
          ...opts,
          target: opts.target || e.currentTarget
        });
      }
    }
  };
  const focusOutHandler = (e) => {
    if (focused && !elementContains(e.currentTarget, e.relatedTarget)) {
      focused = false;
      if (focus || hoverFocus && !hovered) {
        hidePopover(opts);
      }
    }
  };
  const handlers = {};
  switch (opts.visibility) {
    case "click":
      handlers.click = clickHandler;
      break;
    case "hover":
      handlers.mousemove = mouseMoveHandler;
      handlers.mouseleave = mouseLeaveHandler;
      break;
    case "focus":
      handlers.focusin = focusInHandler;
      handlers.focusout = focusOutHandler;
      break;
    case "hover-focus":
      handlers.mousemove = mouseMoveHandler;
      handlers.mouseleave = mouseLeaveHandler;
      handlers.focusin = focusInHandler;
      handlers.focusout = focusOutHandler;
      break;
  }
  return handlers;
}
const removeHandlers = (target) => {
  const el = resolveEl(target);
  if (el == null)
    return;
  const handlers = el.popoverHandlers;
  if (!handlers || !handlers.length)
    return;
  handlers.forEach((handler) => handler());
  delete el.popoverHandlers;
};
const addHandlers = (target, opts) => {
  const el = resolveEl(target);
  if (el == null)
    return;
  const remove = [];
  const handlers = getPopoverEventHandlers(opts);
  Object.entries(handlers).forEach(([event, handler]) => {
    remove.push(on(el, event, handler));
  });
  el.popoverHandlers = remove;
};
const popoverDirective = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value)
      return;
    addHandlers(el, value);
  },
  updated(el, binding) {
    const { oldValue, value } = binding;
    const oldVisibility = oldValue == null ? void 0 : oldValue.visibility;
    const newVisibility = value == null ? void 0 : value.visibility;
    if (oldVisibility !== newVisibility) {
      if (oldVisibility) {
        removeHandlers(el);
        if (!newVisibility)
          hidePopover(oldValue);
      }
      if (newVisibility) {
        addHandlers(el, value);
      }
    }
  },
  unmounted(el) {
    removeHandlers(el);
  }
};
const addHorizontalSwipeHandler = (element, handler, {
  maxSwipeTime: maxSwipeTime2,
  minHorizontalSwipeDistance: minHorizontalSwipeDistance2,
  maxVerticalSwipeDistance: maxVerticalSwipeDistance2
}) => {
  if (!element || !element.addEventListener || !isFunction_1(handler)) {
    return null;
  }
  let startX = 0;
  let startY = 0;
  let startTime = null;
  let isSwiping = false;
  function touchStart(e) {
    const t = e.changedTouches[0];
    startX = t.screenX;
    startY = t.screenY;
    startTime = (/* @__PURE__ */ new Date()).getTime();
    isSwiping = true;
  }
  function touchEnd(e) {
    if (!isSwiping || !startTime)
      return;
    isSwiping = false;
    const t = e.changedTouches[0];
    const deltaX = t.screenX - startX;
    const deltaY = t.screenY - startY;
    const deltaTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
    if (deltaTime < maxSwipeTime2) {
      if (Math.abs(deltaX) >= minHorizontalSwipeDistance2 && Math.abs(deltaY) <= maxVerticalSwipeDistance2) {
        const arg = { toLeft: false, toRight: false };
        if (deltaX < 0) {
          arg.toLeft = true;
        } else {
          arg.toRight = true;
        }
        handler(arg);
      }
    }
  }
  on(element, "touchstart", touchStart, { passive: true });
  on(element, "touchend", touchEnd, { passive: true });
  return () => {
    off(element, "touchstart", touchStart);
    off(element, "touchend", touchEnd);
  };
};
const watchSkippers = {};
const skipWatcher = (watcher, durationMs = 10) => {
  watchSkippers[watcher] = Date.now() + durationMs;
};
const handleWatcher = (watcher, handler) => {
  if (watcher in watchSkippers) {
    const dateTime = watchSkippers[watcher];
    if (Date.now() < dateTime)
      return;
    delete watchSkippers[watcher];
  }
  handler();
};
function windowExists() {
  return typeof window !== "undefined";
}
function windowHasFeature(feature) {
  return windowExists() && feature in window;
}
function useDarkMode(config) {
  const isDark = ref(false);
  const displayMode = computed(() => isDark.value ? "dark" : "light");
  let mediaQuery;
  let mutationObserver;
  function mqListener(ev) {
    isDark.value = ev.matches;
  }
  function setupSystem() {
    if (windowHasFeature("matchMedia")) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", mqListener);
      isDark.value = mediaQuery.matches;
    }
  }
  function moListener() {
    const { selector = ":root", darkClass = "dark" } = config.value;
    const el = document.querySelector(selector);
    isDark.value = el.classList.contains(darkClass);
  }
  function setupClass(config2) {
    const { selector = ":root", darkClass = "dark" } = config2;
    if (windowExists() && selector && darkClass) {
      const el = document.querySelector(selector);
      if (el) {
        mutationObserver = new MutationObserver(moListener);
        mutationObserver.observe(el, {
          attributes: true,
          attributeFilter: ["class"]
        });
        isDark.value = el.classList.contains(darkClass);
      }
    }
  }
  function setup() {
    stopObservers();
    const type = typeof config.value;
    if (type === "string" && config.value.toLowerCase() === "system") {
      setupSystem();
    } else if (type === "object") {
      setupClass(config.value);
    } else {
      isDark.value = !!config.value;
    }
  }
  const stopWatch = watch(() => config.value, () => setup(), {
    immediate: true
  });
  function stopObservers() {
    if (mediaQuery) {
      mediaQuery.removeEventListener("change", mqListener);
      mediaQuery = void 0;
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = void 0;
    }
  }
  function cleanup() {
    stopObservers();
    stopWatch();
  }
  onUnmounted(() => cleanup());
  return {
    isDark,
    displayMode,
    cleanup
  };
}
const targetProps = ["base", "start", "end", "startEnd"];
const displayProps = [
  "class",
  "wrapperClass",
  "contentClass",
  "style",
  "contentStyle",
  "color",
  "fillMode"
];
const _defaultProfile = { base: {}, start: {}, end: {} };
function normalizeConfig(color, config, defaultProfile = _defaultProfile) {
  let rootColor = color;
  let root2 = {};
  if (config === true || isString_1(config)) {
    rootColor = isString_1(config) ? config : rootColor;
    root2 = { ...defaultProfile };
  } else if (isObject(config)) {
    if (hasAny(config, targetProps)) {
      root2 = { ...config };
    } else {
      root2 = {
        base: { ...config },
        start: { ...config },
        end: { ...config }
      };
    }
  }
  const result = defaultsDeep_1(
    root2,
    { start: root2.startEnd, end: root2.startEnd },
    defaultProfile
  );
  Object.entries(result).forEach(([targetType, targetConfig]) => {
    let targetColor = rootColor;
    if (targetConfig === true || isString_1(targetConfig)) {
      targetColor = isString_1(targetConfig) ? targetConfig : targetColor;
      result[targetType] = { color: targetColor };
    } else if (isObject(targetConfig)) {
      if (hasAny(targetConfig, displayProps)) {
        result[targetType] = { ...targetConfig };
      } else {
        result[targetType] = {};
      }
    }
    defaultsDeep_1(result[targetType], { color: targetColor });
  });
  return result;
}
class HighlightRenderer {
  constructor() {
    __publicField(this, "type", "highlight");
  }
  normalizeConfig(color, config) {
    return normalizeConfig(color, config, {
      base: { fillMode: "light" },
      start: { fillMode: "solid" },
      end: { fillMode: "solid" }
    });
  }
  prepareRender(glyphs) {
    glyphs.highlights = [];
    if (!glyphs.content)
      glyphs.content = [];
  }
  render({ data: data2, onStart, onEnd }, glyphs) {
    const { key, highlight } = data2;
    if (!highlight)
      return;
    const { highlights } = glyphs;
    const { base, start, end } = highlight;
    if (onStart && onEnd) {
      highlights.push({
        ...start,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        contentClass: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass
        ]
      });
    } else if (onStart) {
      highlights.push({
        ...base,
        key: `${key}-base`,
        wrapperClass: `vc-day-layer vc-day-box-right-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-start vc-highlight-bg-${base.fillMode}`,
          base.class
        ]
      });
      highlights.push({
        ...start,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        contentClass: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass
        ]
      });
    } else if (onEnd) {
      highlights.push({
        ...base,
        key: `${key}-base`,
        wrapperClass: `vc-day-layer vc-day-box-left-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-end vc-highlight-bg-${base.fillMode}`,
          base.class
        ]
      });
      highlights.push({
        ...end,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${end.color}`,
        class: [`vc-highlight vc-highlight-bg-${end.fillMode}`, end.class],
        contentClass: [
          `vc-attr vc-highlight-content-${end.fillMode} vc-${end.color}`,
          end.contentClass
        ]
      });
    } else {
      highlights.push({
        ...base,
        key: `${key}-middle`,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-middle vc-highlight-bg-${base.fillMode}`,
          base.class
        ],
        contentClass: [
          `vc-attr vc-highlight-content-${base.fillMode} vc-${base.color}`,
          base.contentClass
        ]
      });
    }
  }
}
class BaseRenderer {
  constructor(type, collectionType) {
    __publicField(this, "type", "");
    __publicField(this, "collectionType", "");
    this.type = type;
    this.collectionType = collectionType;
  }
  normalizeConfig(color, config) {
    return normalizeConfig(color, config);
  }
  prepareRender(glyphs) {
    glyphs[this.collectionType] = [];
  }
  render({ data: data2, onStart, onEnd }, glyphs) {
    const { key } = data2;
    const item = data2[this.type];
    if (!key || !item) {
      return;
    }
    const collection = glyphs[this.collectionType];
    const { base, start, end } = item;
    if (onStart) {
      collection.push({
        ...start,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-start vc-${start.color} vc-attr`,
          start.class
        ]
      });
    } else if (onEnd) {
      collection.push({
        ...end,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-end vc-${end.color} vc-attr`,
          end.class
        ]
      });
    } else {
      collection.push({
        ...base,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-base vc-${base.color} vc-attr`,
          base.class
        ]
      });
    }
  }
}
class ContentRenderer extends BaseRenderer {
  constructor() {
    super("content", "content");
  }
  normalizeConfig(_, config) {
    return normalizeConfig("base", config);
  }
}
class DotRenderer extends BaseRenderer {
  constructor() {
    super("dot", "dots");
  }
}
class BarRenderer extends BaseRenderer {
  constructor() {
    super("bar", "bars");
  }
}
class Theme {
  constructor(color) {
    __publicField(this, "color");
    __publicField(this, "renderers", [
      new ContentRenderer(),
      new HighlightRenderer(),
      new DotRenderer(),
      new BarRenderer()
    ]);
    this.color = color;
  }
  normalizeGlyphs(attr) {
    this.renderers.forEach((renderer) => {
      const type = renderer.type;
      if (attr[type] != null) {
        attr[type] = renderer.normalizeConfig(this.color, attr[type]);
      }
    });
  }
  prepareRender(glyphs = {}) {
    this.renderers.forEach((renderer) => {
      renderer.prepareRender(glyphs);
    });
    return glyphs;
  }
  render(cell, glyphs) {
    this.renderers.forEach((renderer) => {
      renderer.render(cell, glyphs);
    });
  }
}
const contextKey$4 = Symbol("__vc_base_context__");
const propsDef$2 = {
  color: {
    type: String,
    default: () => getDefault("color")
  },
  isDark: {
    type: [Boolean, String, Object],
    default: () => getDefault("isDark")
  },
  firstDayOfWeek: Number,
  masks: Object,
  locale: [String, Object],
  timezone: String,
  minDate: null,
  maxDate: null,
  disabledDates: null
};
function createBase(props) {
  const color = computed(() => props.color ?? "");
  const isDark = computed(() => props.isDark ?? false);
  const { displayMode } = useDarkMode(isDark);
  const theme = computed(() => new Theme(color.value));
  const locale = computed(() => {
    if (props.locale instanceof Locale)
      return props.locale;
    const config = isObject(props.locale) ? props.locale : {
      id: props.locale,
      firstDayOfWeek: props.firstDayOfWeek,
      masks: props.masks
    };
    return new Locale(config, props.timezone);
  });
  const masks2 = computed(() => locale.value.masks);
  const minDate = computed(() => props.minDate);
  const maxDate = computed(() => props.maxDate);
  const disabledDates = computed(() => {
    const dates = props.disabledDates ? [...props.disabledDates] : [];
    if (minDate.value != null) {
      dates.push({
        start: null,
        end: addDays(locale.value.toDate(minDate.value), -1)
      });
    }
    if (maxDate.value != null) {
      dates.push({
        start: addDays(locale.value.toDate(maxDate.value), 1),
        end: null
      });
    }
    return locale.value.ranges(dates);
  });
  const disabledAttribute = computed(() => {
    return new Attribute(
      {
        key: "disabled",
        dates: disabledDates.value,
        order: 100
      },
      theme.value,
      locale.value
    );
  });
  const context = {
    color,
    isDark,
    displayMode,
    theme,
    locale,
    masks: masks2,
    minDate,
    maxDate,
    disabledDates,
    disabledAttribute
  };
  provide(contextKey$4, context);
  return context;
}
function useOrCreateBase(props) {
  return inject(contextKey$4, () => createBase(props), true);
}
function contextKey$3(slotKey) {
  return `__vc_slot_${slotKey}__`;
}
function provideSlots(slots, remap = {}) {
  Object.keys(slots).forEach((slotKey) => {
    provide(contextKey$3(remap[slotKey] ?? slotKey), slots[slotKey]);
  });
}
function useSlot(slotKey) {
  return inject(contextKey$3(slotKey), null);
}
const propsDef$1 = {
  ...propsDef$2,
  view: {
    type: String,
    default: "monthly",
    validator(value) {
      return ["daily", "weekly", "monthly"].includes(value);
    }
  },
  rows: {
    type: Number,
    default: 1
  },
  columns: {
    type: Number,
    default: 1
  },
  step: Number,
  titlePosition: {
    type: String,
    default: () => getDefault("titlePosition")
  },
  navVisibility: {
    type: String,
    default: () => getDefault("navVisibility")
  },
  showWeeknumbers: [Boolean, String],
  showIsoWeeknumbers: [Boolean, String],
  expanded: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  initialPage: Object,
  initialPagePosition: { type: Number, default: 1 },
  minPage: Object,
  maxPage: Object,
  transition: String,
  attributes: Array,
  trimWeeks: Boolean,
  disablePageSwipe: Boolean
};
const emitsDef = [
  "dayclick",
  "daymouseenter",
  "daymouseleave",
  "dayfocusin",
  "dayfocusout",
  "daykeydown",
  "weeknumberclick",
  "transition-start",
  "transition-end",
  "did-move",
  "update:view",
  "update:pages"
];
const contextKey$2 = Symbol("__vc_calendar_context__");
function createCalendar(props, { slots, emit }) {
  const containerRef = ref(null);
  const focusedDay = ref(null);
  const focusableDay = ref((/* @__PURE__ */ new Date()).getDate());
  const inTransition = ref(false);
  const navPopoverId = ref(Symbol());
  const dayPopoverId = ref(Symbol());
  const _view = ref(props.view);
  const _pages = ref([]);
  const transitionName = ref("");
  let transitionPromise = null;
  let removeHandlers2 = null;
  provideSlots(slots);
  const {
    theme,
    color,
    displayMode,
    locale,
    masks: masks2,
    minDate,
    maxDate,
    disabledAttribute,
    disabledDates
  } = useOrCreateBase(props);
  const count = computed(() => props.rows * props.columns);
  const step = computed(() => props.step || count.value);
  const firstPage = computed(() => head_1(_pages.value) ?? null);
  const lastPage = computed(() => last_1(_pages.value) ?? null);
  const minPage = computed(
    () => props.minPage || (minDate.value ? getDateAddress(minDate.value) : null)
  );
  const maxPage = computed(
    () => props.maxPage || (maxDate.value ? getDateAddress(maxDate.value) : null)
  );
  const navVisibility = computed(() => props.navVisibility);
  const showWeeknumbers = computed(() => !!props.showWeeknumbers);
  const showIsoWeeknumbers = computed(() => !!props.showIsoWeeknumbers);
  const isMonthly = computed(() => _view.value === "monthly");
  const isWeekly = computed(() => _view.value === "weekly");
  const isDaily = computed(() => _view.value === "daily");
  const onTransitionBeforeEnter = () => {
    inTransition.value = true;
    emit("transition-start");
  };
  const onTransitionAfterEnter = () => {
    inTransition.value = false;
    emit("transition-end");
    if (transitionPromise) {
      transitionPromise.resolve(true);
      transitionPromise = null;
    }
  };
  const addPages$1 = (address, count2, view = _view.value) => {
    return addPages(address, count2, view, locale.value);
  };
  const getDateAddress = (date) => {
    return getPageAddressForDate(date, _view.value, locale.value);
  };
  const refreshDisabled = (day) => {
    if (!disabledAttribute.value || !attributeContext.value)
      return;
    day.isDisabled = attributeContext.value.cellExists(
      disabledAttribute.value.key,
      day.dayIndex
    );
  };
  const refreshFocusable = (day) => {
    day.isFocusable = day.inMonth && day.day === focusableDay.value;
  };
  const forDays = (pages, fn) => {
    for (const page of pages) {
      for (const day of page.days) {
        if (fn(day) === false)
          return;
      }
    }
  };
  const days = computed(
    () => _pages.value.reduce((result, page) => {
      result.push(...page.viewDays);
      return result;
    }, [])
  );
  const attributes = computed(() => {
    const result = [];
    (props.attributes || []).forEach((attr, i) => {
      if (!attr || !attr.dates)
        return;
      result.push(
        new Attribute(
          {
            ...attr,
            order: attr.order || 0
          },
          theme.value,
          locale.value
        )
      );
    });
    if (disabledAttribute.value) {
      result.push(disabledAttribute.value);
    }
    return result;
  });
  const hasAttributes = computed(() => arrayHasItems(attributes.value));
  const attributeContext = computed(() => {
    const ctx = new DateRangeContext();
    attributes.value.forEach((attr) => {
      attr.ranges.forEach((range) => {
        ctx.render(attr, range, days.value);
      });
    });
    return ctx;
  });
  const dayCells = computed(() => {
    return days.value.reduce((result, day) => {
      result[day.dayIndex] = { day, cells: [] };
      result[day.dayIndex].cells.push(...attributeContext.value.getCells(day));
      return result;
    }, {});
  });
  const getWeeknumberPosition = (column, columnFromEnd) => {
    const showWeeknumbers2 = props.showWeeknumbers || props.showIsoWeeknumbers;
    if (showWeeknumbers2 == null)
      return "";
    if (isBoolean_1(showWeeknumbers2)) {
      return showWeeknumbers2 ? "left" : "";
    }
    if (showWeeknumbers2.startsWith("right")) {
      return columnFromEnd > 1 ? "right" : showWeeknumbers2;
    }
    return column > 1 ? "left" : showWeeknumbers2;
  };
  const getPageForAttributes = () => {
    var _a, _b;
    if (!hasAttributes.value)
      return null;
    const attr = attributes.value.find((attr2) => attr2.pinPage) || attributes.value[0];
    if (!attr || !attr.hasRanges)
      return null;
    const [range] = attr.ranges;
    const date = ((_a = range.start) == null ? void 0 : _a.date) || ((_b = range.end) == null ? void 0 : _b.date);
    return date ? getDateAddress(date) : null;
  };
  const getDefaultInitialPage = () => {
    if (pageIsValid(firstPage.value))
      return firstPage.value;
    const page = getPageForAttributes();
    if (pageIsValid(page))
      return page;
    return getDateAddress(/* @__PURE__ */ new Date());
  };
  const getTargetPageRange = (page, opts = {}) => {
    const { view = _view.value, position = 1, force } = opts;
    const pagesToAdd = position > 0 ? 1 - position : -(count.value + position);
    let fromPage = addPages$1(page, pagesToAdd, view);
    let toPage = addPages$1(fromPage, count.value - 1, view);
    if (!force) {
      if (pageIsBeforePage(fromPage, minPage.value)) {
        fromPage = minPage.value;
      } else if (pageIsAfterPage(toPage, maxPage.value)) {
        fromPage = addPages$1(maxPage.value, 1 - count.value);
      }
      toPage = addPages$1(fromPage, count.value - 1);
    }
    return { fromPage, toPage };
  };
  const getPageTransition = (oldPage, newPage, defaultTransition = "") => {
    if (defaultTransition === "none" || defaultTransition === "fade")
      return defaultTransition;
    if ((oldPage == null ? void 0 : oldPage.view) !== (newPage == null ? void 0 : newPage.view))
      return "fade";
    const moveNext2 = pageIsAfterPage(newPage, oldPage);
    const movePrev2 = pageIsBeforePage(newPage, oldPage);
    if (!moveNext2 && !movePrev2) {
      return "fade";
    }
    if (defaultTransition === "slide-v") {
      return movePrev2 ? "slide-down" : "slide-up";
    }
    return movePrev2 ? "slide-right" : "slide-left";
  };
  const refreshPages = (opts = {}) => {
    return new Promise((resolve, reject) => {
      const { position = 1, force = false, transition } = opts;
      const page = pageIsValid(opts.page) ? opts.page : getDefaultInitialPage();
      const { fromPage } = getTargetPageRange(page, {
        position,
        force
      });
      const pages = [];
      for (let i = 0; i < count.value; i++) {
        const newPage = addPages$1(fromPage, i);
        const position2 = i + 1;
        const row = Math.ceil(position2 / props.columns);
        const rowFromEnd = props.rows - row + 1;
        const column = position2 % props.columns || props.columns;
        const columnFromEnd = props.columns - column + 1;
        const weeknumberPosition = getWeeknumberPosition(column, columnFromEnd);
        pages.push(
          locale.value.getPage({
            ...newPage,
            view: _view.value,
            titlePosition: props.titlePosition,
            trimWeeks: props.trimWeeks,
            position: position2,
            row,
            rowFromEnd,
            column,
            columnFromEnd,
            showWeeknumbers: showWeeknumbers.value,
            showIsoWeeknumbers: showIsoWeeknumbers.value,
            weeknumberPosition
          })
        );
      }
      transitionName.value = getPageTransition(
        _pages.value[0],
        pages[0],
        transition
      );
      _pages.value = pages;
      if (transitionName.value && transitionName.value !== "none") {
        transitionPromise = {
          resolve,
          reject
        };
      } else {
        resolve(true);
      }
    });
  };
  const targetBy = (pages) => {
    const fromPage = firstPage.value ?? getDateAddress(/* @__PURE__ */ new Date());
    return addPages$1(fromPage, pages);
  };
  const canMove = (target, opts = {}) => {
    const page = pageIsValid(target) ? target : getDateAddress(target);
    Object.assign(
      opts,
      getTargetPageRange(page, {
        ...opts,
        force: true
      })
    );
    const pagesInRange = pageRangeToArray(
      opts.fromPage,
      opts.toPage,
      _view.value,
      locale.value
    ).map((p) => pageIsBetweenPages(p, minPage.value, maxPage.value));
    return pagesInRange.some((val) => val);
  };
  const canMoveBy = (pages, opts = {}) => {
    return canMove(targetBy(pages), opts);
  };
  const canMovePrev = computed(() => canMoveBy(-step.value));
  const canMoveNext = computed(() => canMoveBy(step.value));
  const move = async (target, opts = {}) => {
    if (!opts.force && !canMove(target, opts))
      return false;
    if (opts.fromPage && !pageIsEqualToPage(opts.fromPage, firstPage.value)) {
      hidePopover({ id: navPopoverId.value, hideDelay: 0 });
      if (opts.view) {
        skipWatcher("view", 10);
        _view.value = opts.view;
      }
      await refreshPages({
        ...opts,
        page: opts.fromPage,
        position: 1,
        force: true
      });
      emit("did-move", _pages.value);
    }
    return true;
  };
  const moveBy = (pages, opts = {}) => {
    return move(targetBy(pages), opts);
  };
  const movePrev = () => {
    return moveBy(-step.value);
  };
  const moveNext = () => {
    return moveBy(step.value);
  };
  const tryFocusDate = (date) => {
    const inMonth = isMonthly.value ? ".in-month" : "";
    const daySelector = `.id-${locale.value.getDayId(date)}${inMonth}`;
    const selector = `${daySelector}.vc-focusable, ${daySelector} .vc-focusable`;
    const el = containerRef.value;
    if (el) {
      const focusableEl = el.querySelector(selector);
      if (focusableEl) {
        focusableEl.focus();
        return true;
      }
    }
    return false;
  };
  const focusDate = async (date, opts = {}) => {
    if (tryFocusDate(date))
      return true;
    await move(date, opts);
    return tryFocusDate(date);
  };
  const onDayClick = (day, event) => {
    focusableDay.value = day.day;
    emit("dayclick", day, event);
  };
  const onDayMouseenter = (day, event) => {
    emit("daymouseenter", day, event);
  };
  const onDayMouseleave = (day, event) => {
    emit("daymouseleave", day, event);
  };
  const onDayFocusin = (day, event) => {
    focusableDay.value = day.day;
    focusedDay.value = day;
    day.isFocused = true;
    emit("dayfocusin", day, event);
  };
  const onDayFocusout = (day, event) => {
    focusedDay.value = null;
    day.isFocused = false;
    emit("dayfocusout", day, event);
  };
  const onDayKeydown = (day, event) => {
    emit("daykeydown", day, event);
    const date = day.noonDate;
    let newDate = null;
    switch (event.key) {
      case "ArrowLeft": {
        newDate = addDays(date, -1);
        break;
      }
      case "ArrowRight": {
        newDate = addDays(date, 1);
        break;
      }
      case "ArrowUp": {
        newDate = addDays(date, -7);
        break;
      }
      case "ArrowDown": {
        newDate = addDays(date, 7);
        break;
      }
      case "Home": {
        newDate = addDays(date, -day.weekdayPosition + 1);
        break;
      }
      case "End": {
        newDate = addDays(date, day.weekdayPositionFromEnd);
        break;
      }
      case "PageUp": {
        if (event.altKey) {
          newDate = addYears(date, -1);
        } else {
          newDate = addMonths(date, -1);
        }
        break;
      }
      case "PageDown": {
        if (event.altKey) {
          newDate = addYears(date, 1);
        } else {
          newDate = addMonths(date, 1);
        }
        break;
      }
    }
    if (newDate) {
      event.preventDefault();
      focusDate(newDate).catch();
    }
  };
  const onKeydown = (event) => {
    const day = focusedDay.value;
    if (day != null) {
      onDayKeydown(day, event);
    }
  };
  const onWeeknumberClick = (week, event) => {
    emit("weeknumberclick", week, event);
  };
  refreshPages({
    page: props.initialPage,
    position: props.initialPagePosition
  });
  onMounted(() => {
    if (!props.disablePageSwipe && containerRef.value) {
      removeHandlers2 = addHorizontalSwipeHandler(
        containerRef.value,
        ({ toLeft = false, toRight = false }) => {
          if (toLeft) {
            moveNext();
          } else if (toRight) {
            movePrev();
          }
        },
        getDefault("touch")
      );
    }
  });
  onUnmounted(() => {
    _pages.value = [];
    if (removeHandlers2)
      removeHandlers2();
  });
  watch(
    () => locale.value,
    () => {
      refreshPages();
    }
  );
  watch(
    () => count.value,
    () => refreshPages()
  );
  watch(
    () => props.view,
    () => _view.value = props.view
  );
  watch(
    () => _view.value,
    () => {
      handleWatcher("view", () => {
        refreshPages();
      });
      emit("update:view", _view.value);
    }
  );
  watch(
    () => focusableDay.value,
    () => {
      forDays(_pages.value, (day) => refreshFocusable(day));
    }
  );
  watchEffect(() => {
    emit("update:pages", _pages.value);
    forDays(_pages.value, (day) => {
      refreshDisabled(day);
      refreshFocusable(day);
    });
  });
  const context = {
    emit,
    containerRef,
    focusedDay,
    inTransition,
    navPopoverId,
    dayPopoverId,
    view: _view,
    pages: _pages,
    transitionName,
    theme,
    color,
    displayMode,
    locale,
    masks: masks2,
    attributes,
    disabledAttribute,
    disabledDates,
    attributeContext,
    days,
    dayCells,
    count,
    step,
    firstPage,
    lastPage,
    canMovePrev,
    canMoveNext,
    minPage,
    maxPage,
    isMonthly,
    isWeekly,
    isDaily,
    navVisibility,
    showWeeknumbers,
    showIsoWeeknumbers,
    getDateAddress,
    canMove,
    canMoveBy,
    move,
    moveBy,
    movePrev,
    moveNext,
    onTransitionBeforeEnter,
    onTransitionAfterEnter,
    tryFocusDate,
    focusDate,
    onKeydown,
    onDayKeydown,
    onDayClick,
    onDayMouseenter,
    onDayMouseleave,
    onDayFocusin,
    onDayFocusout,
    onWeeknumberClick
  };
  provide(contextKey$2, context);
  return context;
}
function useCalendar() {
  const context = inject(contextKey$2);
  if (context)
    return context;
  throw new Error(
    "Calendar context missing. Please verify this component is nested within a valid context provider."
  );
}
const _sfc_main$k = defineComponent({
  inheritAttrs: false,
  emits: ["before-show", "after-show", "before-hide", "after-hide"],
  props: {
    id: { type: [Number, String, Symbol], required: true },
    showDelay: { type: Number, default: 0 },
    hideDelay: { type: Number, default: 110 },
    boundarySelector: { type: String }
  },
  setup(props, { emit }) {
    let timeout = void 0;
    const popoverRef = ref();
    let resizeObserver = null;
    let popper = null;
    const state2 = reactive({
      isVisible: false,
      target: null,
      data: null,
      transition: "slide-fade",
      placement: "bottom",
      direction: "",
      positionFixed: false,
      modifiers: [],
      isInteractive: true,
      visibility: "click",
      isHovered: false,
      isFocused: false,
      autoHide: false,
      force: false
    });
    function updateDirection(placement) {
      if (placement)
        state2.direction = placement.split("-")[0];
    }
    function onPopperUpdate({ placement, options }) {
      updateDirection(placement || (options == null ? void 0 : options.placement));
    }
    const popperOptions = computed(() => {
      return {
        placement: state2.placement,
        strategy: state2.positionFixed ? "fixed" : "absolute",
        boundary: "",
        modifiers: [
          {
            name: "onUpdate",
            enabled: true,
            phase: "afterWrite",
            fn: onPopperUpdate
          },
          ...state2.modifiers || []
        ],
        onFirstUpdate: onPopperUpdate
      };
    });
    const alignment = computed(() => {
      const isLeftRight = state2.direction === "left" || state2.direction === "right";
      let alignment2 = "";
      if (state2.placement) {
        const parts = state2.placement.split("-");
        if (parts.length > 1)
          alignment2 = parts[1];
      }
      if (["start", "top", "left"].includes(alignment2)) {
        return isLeftRight ? "top" : "left";
      }
      if (["end", "bottom", "right"].includes(alignment2)) {
        return isLeftRight ? "bottom" : "right";
      }
      return isLeftRight ? "middle" : "center";
    });
    function destroyPopper() {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    }
    function setupPopper() {
      nextTick(() => {
        const el = resolveEl(state2.target);
        if (!el || !popoverRef.value)
          return;
        if (popper && popper.state.elements.reference !== el) {
          destroyPopper();
        }
        if (!popper) {
          popper = createPopper(
            el,
            popoverRef.value,
            popperOptions.value
          );
        } else {
          popper.update();
        }
      });
    }
    function updateState(newState) {
      Object.assign(state2, omit(newState, "force"));
    }
    function setTimer(delay, fn) {
      clearTimeout(timeout);
      if (delay > 0) {
        timeout = setTimeout(fn, delay);
      } else {
        fn();
      }
    }
    function isCurrentTarget(target) {
      if (!target || !popper)
        return false;
      const el = resolveEl(target);
      return el === popper.state.elements.reference;
    }
    async function show(opts = {}) {
      if (state2.force)
        return;
      if (opts.force)
        state2.force = true;
      setTimer(opts.showDelay ?? props.showDelay, () => {
        if (state2.isVisible) {
          state2.force = false;
        }
        updateState({
          ...opts,
          isVisible: true
        });
        setupPopper();
      });
    }
    function hide(opts = {}) {
      if (!popper)
        return;
      if (opts.target && !isCurrentTarget(opts.target))
        return;
      if (state2.force)
        return;
      if (opts.force)
        state2.force = true;
      setTimer(opts.hideDelay ?? props.hideDelay, () => {
        if (!state2.isVisible)
          state2.force = false;
        state2.isVisible = false;
      });
    }
    function toggle(opts = {}) {
      if (opts.target == null)
        return;
      if (state2.isVisible && isCurrentTarget(opts.target)) {
        hide(opts);
      } else {
        show(opts);
      }
    }
    function onDocumentClick(e) {
      if (!popper)
        return;
      const popperRef = popper.state.elements.reference;
      if (!popoverRef.value || !popperRef) {
        return;
      }
      const target = e.target;
      if (elementContains(popoverRef.value, target) || elementContains(popperRef, target)) {
        return;
      }
      hide({ force: true });
    }
    function onDocumentKeydown(e) {
      if (e.key === "Esc" || e.key === "Escape") {
        hide();
      }
    }
    function onDocumentShowPopover({ detail }) {
      if (!detail.id || detail.id !== props.id)
        return;
      show(detail);
    }
    function onDocumentHidePopover({ detail }) {
      if (!detail.id || detail.id !== props.id)
        return;
      hide(detail);
    }
    function onDocumentTogglePopover({ detail }) {
      if (!detail.id || detail.id !== props.id)
        return;
      toggle(detail);
    }
    function addEvents() {
      on(document, "keydown", onDocumentKeydown);
      on(document, "click", onDocumentClick);
      on(document, "show-popover", onDocumentShowPopover);
      on(document, "hide-popover", onDocumentHidePopover);
      on(document, "toggle-popover", onDocumentTogglePopover);
    }
    function removeEvents() {
      off(document, "keydown", onDocumentKeydown);
      off(document, "click", onDocumentClick);
      off(document, "show-popover", onDocumentShowPopover);
      off(document, "hide-popover", onDocumentHidePopover);
      off(document, "toggle-popover", onDocumentTogglePopover);
    }
    function beforeEnter(el) {
      emit("before-show", el);
    }
    function afterEnter(el) {
      state2.force = false;
      emit("after-show", el);
    }
    function beforeLeave(el) {
      emit("before-hide", el);
    }
    function afterLeave(el) {
      state2.force = false;
      destroyPopper();
      emit("after-hide", el);
    }
    function onClick(e) {
      e.stopPropagation();
    }
    function onMouseOver() {
      state2.isHovered = true;
      if (state2.isInteractive && ["hover", "hover-focus"].includes(state2.visibility)) {
        show();
      }
    }
    function onMouseLeave() {
      state2.isHovered = false;
      if (!popper)
        return;
      const popperRef = popper.state.elements.reference;
      if (state2.autoHide && !state2.isFocused && (!popperRef || popperRef !== document.activeElement) && ["hover", "hover-focus"].includes(state2.visibility)) {
        hide();
      }
    }
    function onFocusIn() {
      state2.isFocused = true;
      if (state2.isInteractive && ["focus", "hover-focus"].includes(state2.visibility)) {
        show();
      }
    }
    function onFocusOut(e) {
      if (["focus", "hover-focus"].includes(state2.visibility) && (!e.relatedTarget || !elementContains(popoverRef.value, e.relatedTarget))) {
        state2.isFocused = false;
        if (!state2.isHovered && state2.autoHide)
          hide();
      }
    }
    function cleanupRO() {
      if (resizeObserver != null) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    }
    watch(
      () => popoverRef.value,
      (val) => {
        cleanupRO();
        if (!val)
          return;
        resizeObserver = new ResizeObserver(() => {
          if (popper)
            popper.update();
        });
        resizeObserver.observe(val);
      }
    );
    watch(() => state2.placement, updateDirection, {
      immediate: true
    });
    onMounted(() => {
      addEvents();
    });
    onUnmounted(() => {
      destroyPopper();
      cleanupRO();
      removeEvents();
    });
    return {
      ...toRefs(state2),
      popoverRef,
      alignment,
      hide,
      setupPopper,
      beforeEnter,
      afterEnter,
      beforeLeave,
      afterLeave,
      onClick,
      onMouseOver,
      onMouseLeave,
      onFocusIn,
      onFocusOut
    };
  }
});
const Popover_vue_vue_type_style_index_0_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vc-popover-content-wrapper", { "is-interactive": _ctx.isInteractive }]),
    ref: "popoverRef",
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args)),
    onMouseover: _cache[1] || (_cache[1] = (...args) => _ctx.onMouseOver && _ctx.onMouseOver(...args)),
    onMouseleave: _cache[2] || (_cache[2] = (...args) => _ctx.onMouseLeave && _ctx.onMouseLeave(...args)),
    onFocusin: _cache[3] || (_cache[3] = (...args) => _ctx.onFocusIn && _ctx.onFocusIn(...args)),
    onFocusout: _cache[4] || (_cache[4] = (...args) => _ctx.onFocusOut && _ctx.onFocusOut(...args))
  }, [
    createVNode(Transition, {
      name: `vc-${_ctx.transition}`,
      appear: "",
      onBeforeEnter: _ctx.beforeEnter,
      onAfterEnter: _ctx.afterEnter,
      onBeforeLeave: _ctx.beforeLeave,
      onAfterLeave: _ctx.afterLeave
    }, {
      default: withCtx(() => [
        _ctx.isVisible ? (openBlock(), createElementBlock("div", mergeProps({
          key: 0,
          tabindex: "-1",
          class: `vc-popover-content direction-${_ctx.direction}`
        }, _ctx.$attrs), [
          renderSlot(_ctx.$slots, "default", {
            direction: _ctx.direction,
            alignment: _ctx.alignment,
            data: _ctx.data,
            hide: _ctx.hide
          }, () => [
            createTextVNode(toDisplayString(_ctx.data), 1)
          ]),
          createElementVNode("span", {
            class: normalizeClass([
              "vc-popover-caret",
              `direction-${_ctx.direction}`,
              `align-${_ctx.alignment}`
            ])
          }, null, 2)
        ], 16)) : createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["name", "onBeforeEnter", "onAfterEnter", "onBeforeLeave", "onAfterLeave"])
  ], 34);
}
const Popover = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$7]]);
const _hoisted_1$c = { class: "vc-day-popover-row" };
const _hoisted_2$b = {
  key: 0,
  class: "vc-day-popover-row-indicator"
};
const _hoisted_3$9 = { class: "vc-day-popover-row-label" };
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "PopoverRow",
  props: {
    attribute: null
  },
  setup(__props) {
    const props = __props;
    const indicator = computed(() => {
      const { content, highlight, dot, bar, popover } = props.attribute;
      if (popover && popover.hideIndicator)
        return null;
      if (content) {
        return {
          class: `vc-bar vc-day-popover-row-bar vc-attr vc-${content.base.color}`
        };
      }
      if (highlight) {
        return {
          class: `vc-highlight-bg-solid vc-day-popover-row-highlight vc-attr vc-${highlight.base.color}`
        };
      }
      if (dot) {
        return {
          class: `vc-dot vc-attr vc-${dot.base.color}`
        };
      }
      if (bar) {
        return {
          class: `vc-bar vc-day-popover-row-bar vc-attr vc-${bar.base.color}`
        };
      }
      return null;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$c, [
        unref(indicator) ? (openBlock(), createElementBlock("div", _hoisted_2$b, [
          createElementVNode("span", {
            class: normalizeClass(unref(indicator).class)
          }, null, 2)
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_3$9, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(__props.attribute.popover ? __props.attribute.popover.label : "No content provided"), 1)
          ])
        ])
      ]);
    };
  }
});
const PopoverRow_vue_vue_type_style_index_0_lang = "";
const __default__$3 = {
  inheritAttrs: false
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  ...__default__$3,
  __name: "CalendarSlot",
  props: {
    name: null
  },
  setup(__props) {
    const props = __props;
    const slot = useSlot(props.name);
    return (_ctx, _cache) => {
      return unref(slot) ? (openBlock(), createBlock(resolveDynamicComponent(unref(slot)), normalizeProps(mergeProps({ key: 0 }, _ctx.$attrs)), null, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 });
    };
  }
});
const _hoisted_1$b = { class: "vc-day-popover-container" };
const _hoisted_2$a = {
  key: 0,
  class: "vc-day-popover-header"
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "CalendarDayPopover",
  setup(__props) {
    const { dayPopoverId, displayMode, color, masks: masks2, locale } = useCalendar();
    function format(date, mask) {
      return locale.value.formatDate(date, mask);
    }
    function dayTitle(day) {
      return locale.value.formatDate(day.date, masks2.value.dayPopover);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Popover, {
        id: unref(dayPopoverId),
        class: normalizeClass([`vc-${unref(color)}`, `vc-${unref(displayMode)}`])
      }, {
        default: withCtx(({ data: { day, attributes }, hide }) => [
          createVNode(_sfc_main$i, {
            name: "day-popover",
            day,
            "day-title": dayTitle(day),
            attributes,
            format,
            masks: unref(masks2),
            hide
          }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1$b, [
                unref(masks2).dayPopover ? (openBlock(), createElementBlock("div", _hoisted_2$a, toDisplayString(dayTitle(day)), 1)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(attributes, (attribute) => {
                  return openBlock(), createBlock(_sfc_main$j, {
                    key: attribute.key,
                    attribute
                  }, null, 8, ["attribute"]);
                }), 128))
              ])
            ]),
            _: 2
          }, 1032, ["day", "day-title", "attributes", "masks", "hide"])
        ]),
        _: 1
      }, 8, ["id", "class"]);
    };
  }
});
const _sfc_main$g = {};
const _hoisted_1$a = {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  viewBox: "0 0 24 24"
};
const _hoisted_2$9 = /* @__PURE__ */ createElementVNode("polyline", { points: "9 18 15 12 9 6" }, null, -1);
const _hoisted_3$8 = [
  _hoisted_2$9
];
function _sfc_render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, _hoisted_3$8);
}
const IconChevronRight = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$6]]);
const _sfc_main$f = {};
const _hoisted_1$9 = {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  viewBox: "0 0 24 24"
};
const _hoisted_2$8 = /* @__PURE__ */ createElementVNode("polyline", { points: "15 18 9 12 15 6" }, null, -1);
const _hoisted_3$7 = [
  _hoisted_2$8
];
function _sfc_render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$9, _hoisted_3$7);
}
const IconChevronLeft = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$5]]);
const _sfc_main$e = {};
const _hoisted_1$8 = {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  viewBox: "0 0 24 24"
};
const _hoisted_2$7 = /* @__PURE__ */ createElementVNode("polyline", { points: "6 9 12 15 18 9" }, null, -1);
const _hoisted_3$6 = [
  _hoisted_2$7
];
function _sfc_render$4(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$8, _hoisted_3$6);
}
const IconChevronDown = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$4]]);
const _sfc_main$d = {};
const _hoisted_1$7 = {
  fill: "none",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
const _hoisted_2$6 = /* @__PURE__ */ createElementVNode("path", { d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, null, -1);
const _hoisted_3$5 = [
  _hoisted_2$6
];
function _sfc_render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$7, _hoisted_3$5);
}
const IconClock = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$3]]);
const icons = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "BaseIcon",
  props: {
    name: { type: String, required: true },
    width: { type: String },
    height: { type: String },
    size: { type: String, default: "26" },
    viewBox: { type: String }
  },
  setup(__props) {
    const props = __props;
    const width = computed(() => props.width || props.size);
    const height = computed(() => props.height || props.size);
    const icon = computed(() => icons[`Icon${props.name}`]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(icon)), {
        width: unref(width),
        height: unref(height),
        class: "vc-base-icon"
      }, null, 8, ["width", "height"]);
    };
  }
});
const BaseIcon_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$6 = ["disabled"];
const _hoisted_2$5 = {
  key: 1,
  class: "vc-title-wrapper"
};
const _hoisted_3$4 = {
  type: "button",
  class: "vc-title"
};
const _hoisted_4$3 = ["disabled"];
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeader",
  props: {
    page: null,
    layout: null,
    isLg: { type: Boolean },
    isXl: { type: Boolean },
    is2xl: { type: Boolean },
    hideTitle: { type: Boolean },
    hideArrows: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const {
      navPopoverId,
      navVisibility,
      canMovePrev,
      movePrev,
      canMoveNext,
      moveNext
    } = useCalendar();
    const navPlacement = computed(() => {
      switch (props.page.titlePosition) {
        case "left":
          return "bottom-start";
        case "right":
          return "bottom-end";
        default:
          return "bottom";
      }
    });
    const navPopoverOptions = computed(() => {
      const { page } = props;
      return {
        id: navPopoverId.value,
        visibility: navVisibility.value,
        placement: navPlacement.value,
        modifiers: [{ name: "flip", options: { fallbackPlacements: ["bottom"] } }],
        data: { page },
        isInteractive: true
      };
    });
    const titleLeft = computed(() => props.page.titlePosition.includes("left"));
    const titleRight = computed(() => props.page.titlePosition.includes("right"));
    const layout_ = computed(() => {
      if (props.layout)
        return props.layout;
      if (titleLeft.value)
        return "tu-pn";
      if (titleRight.value)
        return "pn-tu";
      return "p-tu-n;";
    });
    const show = computed(() => {
      return {
        prev: layout_.value.includes("p") && !props.hideArrows,
        title: layout_.value.includes("t") && !props.hideTitle,
        next: layout_.value.includes("n") && !props.hideArrows
      };
    });
    const gridStyle = computed(() => {
      const gridTemplateColumns = layout_.value.split("").map((l) => {
        switch (l) {
          case "p":
            return "[prev] auto";
          case "n":
            return "[next] auto";
          case "t":
            return "[title] auto";
          case "-":
            return "1fr";
          default:
            return "";
        }
      }).join(" ");
      return { gridTemplateColumns };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vc-header", { "is-lg": __props.isLg, "is-xl": __props.isXl, "is-2xl": __props.is2xl }]),
        style: normalizeStyle(unref(gridStyle))
      }, [
        unref(show).prev ? (openBlock(), createElementBlock("button", {
          key: 0,
          type: "button",
          class: "vc-arrow vc-prev vc-focus",
          disabled: !unref(canMovePrev),
          onClick: _cache[0] || (_cache[0] = //@ts-ignore
          (...args) => unref(movePrev) && unref(movePrev)(...args)),
          onKeydown: _cache[1] || (_cache[1] = withKeys(
            //@ts-ignore
            (...args) => unref(movePrev) && unref(movePrev)(...args),
            ["space", "enter"]
          ))
        }, [
          createVNode(_sfc_main$i, {
            name: "header-prev-button",
            disabled: !unref(canMovePrev)
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$c, {
                name: "ChevronLeft",
                size: "24"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 40, _hoisted_1$6)) : createCommentVNode("", true),
        unref(show).title ? (openBlock(), createElementBlock("div", _hoisted_2$5, [
          createVNode(_sfc_main$i, { name: "header-title-wrapper" }, {
            default: withCtx(() => [
              withDirectives((openBlock(), createElementBlock("button", _hoisted_3$4, [
                createVNode(_sfc_main$i, {
                  name: "header-title",
                  title: __props.page.title
                }, {
                  default: withCtx(() => [
                    createElementVNode("span", null, toDisplayString(__props.page.title), 1)
                  ]),
                  _: 1
                }, 8, ["title"])
              ])), [
                [unref(popoverDirective), unref(navPopoverOptions)]
              ])
            ]),
            _: 1
          })
        ])) : createCommentVNode("", true),
        unref(show).next ? (openBlock(), createElementBlock("button", {
          key: 2,
          type: "button",
          class: "vc-arrow vc-next vc-focus",
          disabled: !unref(canMoveNext),
          onClick: _cache[2] || (_cache[2] = //@ts-ignore
          (...args) => unref(moveNext) && unref(moveNext)(...args)),
          onKeydown: _cache[3] || (_cache[3] = withKeys(
            //@ts-ignore
            (...args) => unref(moveNext) && unref(moveNext)(...args),
            ["space", "enter"]
          ))
        }, [
          createVNode(_sfc_main$i, {
            name: "header-next-button",
            disabled: !unref(canMoveNext)
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$c, {
                name: "ChevronRight",
                size: "24"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 40, _hoisted_4$3)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
const CalendarHeader_vue_vue_type_style_index_0_lang = "";
const contextKey$1 = Symbol("__vc_page_context__");
function createPage(page) {
  const { locale, getDateAddress, canMove } = useCalendar();
  function getMonthItems(year, mask) {
    const { month: thisMonth, year: thisYear } = getDateAddress(/* @__PURE__ */ new Date());
    return getMonthDates().map((d, i) => {
      const month = i + 1;
      return {
        month,
        year,
        id: getPageId(month, year),
        label: locale.value.formatDate(d, mask),
        ariaLabel: locale.value.formatDate(d, "MMMM"),
        isActive: month === page.value.month && year === page.value.year,
        isCurrent: month === thisMonth && year === thisYear,
        isDisabled: !canMove(
          { month, year },
          { position: page.value.position }
        )
      };
    });
  }
  function getYearItems(startYear, endYear) {
    const { year: thisYear } = getDateAddress(/* @__PURE__ */ new Date());
    const { position } = page.value;
    const items = [];
    for (let year = startYear; year <= endYear; year += 1) {
      const enabled = [...Array(12).keys()].some(
        (m) => canMove({ month: m + 1, year }, { position })
      );
      items.push({
        year,
        id: year.toString(),
        label: year.toString(),
        ariaLabel: year.toString(),
        isActive: year === page.value.year,
        isCurrent: year === thisYear,
        isDisabled: !enabled
      });
    }
    return items;
  }
  const context = { page, getMonthItems, getYearItems };
  provide(contextKey$1, context);
  return context;
}
function usePage() {
  const context = inject(contextKey$1);
  if (context)
    return context;
  throw new Error(
    "Page context missing. Please verify this component is nested within a valid context provider."
  );
}
const _hoisted_1$5 = { class: "vc-nav-header" };
const _hoisted_2$4 = ["disabled"];
const _hoisted_3$3 = ["disabled"];
const _hoisted_4$2 = { class: "vc-nav-items" };
const _hoisted_5$2 = ["data-id", "aria-label", "disabled", "onClick", "onKeydown"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "CalendarNav",
  setup(__props) {
    const { masks: masks2, move } = useCalendar();
    const { page, getMonthItems, getYearItems } = usePage();
    const monthMode = ref(true);
    const yearGroupCount = 12;
    const selectedYear = ref(page.value.year);
    const selectedYearGroup = ref(getYearGroupIndex(page.value.year));
    const navContainer = ref(null);
    function focusFirstItem() {
      setTimeout(() => {
        if (navContainer.value == null)
          return;
        const focusableEl = navContainer.value.querySelector(
          ".vc-nav-item:not(:disabled)"
        );
        if (focusableEl) {
          focusableEl.focus();
        }
      }, 10);
    }
    function getYearGroupIndex(year) {
      return Math.floor(year / yearGroupCount);
    }
    function toggleMode() {
      monthMode.value = !monthMode.value;
    }
    function getStartYear(groupIndex) {
      return groupIndex * yearGroupCount;
    }
    function getEndYear(groupIndex) {
      return yearGroupCount * (groupIndex + 1) - 1;
    }
    function movePrev() {
      if (!prevItemsEnabled.value)
        return;
      if (monthMode.value) {
        movePrevYear();
      }
      movePrevYearGroup();
    }
    function moveNext() {
      if (!nextItemsEnabled.value)
        return;
      if (monthMode.value) {
        moveNextYear();
      }
      moveNextYearGroup();
    }
    function movePrevYear() {
      selectedYear.value--;
    }
    function moveNextYear() {
      selectedYear.value++;
    }
    function movePrevYearGroup() {
      selectedYearGroup.value--;
    }
    function moveNextYearGroup() {
      selectedYearGroup.value++;
    }
    const monthItems = computed(
      () => getMonthItems(selectedYear.value, masks2.value.navMonths).map((item) => ({
        ...item,
        click: () => move(
          { month: item.month, year: item.year },
          { position: page.value.position }
        )
      }))
    );
    const prevMonthItems = computed(
      () => getMonthItems(selectedYear.value - 1, masks2.value.navMonths)
    );
    const prevMonthItemsEnabled = computed(
      () => prevMonthItems.value.some((i) => !i.isDisabled)
    );
    const nextMonthItems = computed(
      () => getMonthItems(selectedYear.value + 1, masks2.value.navMonths)
    );
    const nextMonthItemsEnabled = computed(
      () => nextMonthItems.value.some((i) => !i.isDisabled)
    );
    const yearItems = computed(
      () => getYearItems(
        getStartYear(selectedYearGroup.value),
        getEndYear(selectedYearGroup.value)
      ).map((item) => {
        return {
          ...item,
          click: () => {
            selectedYear.value = item.year;
            monthMode.value = true;
            focusFirstItem();
          }
        };
      })
    );
    const prevYearItems = computed(
      () => getYearItems(
        getStartYear(selectedYearGroup.value - 1),
        getEndYear(selectedYearGroup.value - 1)
      )
    );
    const prevYearItemsEnabled = computed(
      () => prevYearItems.value.some((i) => !i.isDisabled)
    );
    const nextYearItems = computed(
      () => getYearItems(
        getStartYear(selectedYearGroup.value + 1),
        getEndYear(selectedYearGroup.value + 1)
      )
    );
    const nextYearItemsEnabled = computed(
      () => nextYearItems.value.some((i) => !i.isDisabled)
    );
    const activeItems = computed(
      () => monthMode.value ? monthItems.value : yearItems.value
    );
    const prevItemsEnabled = computed(
      () => monthMode.value ? prevMonthItemsEnabled.value : prevYearItemsEnabled.value
    );
    const nextItemsEnabled = computed(
      () => monthMode.value ? nextMonthItemsEnabled.value : nextYearItemsEnabled.value
    );
    const firstYear = computed(() => head_1(yearItems.value.map((i) => i.year)));
    const lastYear = computed(() => last_1(yearItems.value.map((i) => i.year)));
    const title2 = computed(() => {
      return monthMode.value ? selectedYear.value : `${firstYear.value} - ${lastYear.value}`;
    });
    watchEffect(() => {
      selectedYear.value = page.value.year;
      focusFirstItem();
    });
    watch(
      () => selectedYear.value,
      (val) => selectedYearGroup.value = getYearGroupIndex(val)
    );
    onMounted(() => focusFirstItem());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "vc-nav-container",
        ref_key: "navContainer",
        ref: navContainer
      }, [
        createElementVNode("div", _hoisted_1$5, [
          createElementVNode("button", {
            type: "button",
            class: "vc-nav-arrow is-left vc-focus",
            disabled: !unref(prevItemsEnabled),
            onClick: movePrev,
            onKeydown: _cache[0] || (_cache[0] = (e) => unref(onSpaceOrEnter)(e, movePrev))
          }, [
            createVNode(_sfc_main$i, {
              name: "nav-prev-button",
              move: movePrev,
              disabled: !unref(prevItemsEnabled)
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$c, {
                  name: "ChevronLeft",
                  width: "22px",
                  height: "24px"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ], 40, _hoisted_2$4),
          createElementVNode("button", {
            type: "button",
            class: "vc-nav-title vc-focus",
            onClick: toggleMode,
            onKeydown: _cache[1] || (_cache[1] = (e) => unref(onSpaceOrEnter)(e, toggleMode))
          }, toDisplayString(unref(title2)), 33),
          createElementVNode("button", {
            type: "button",
            class: "vc-nav-arrow is-right vc-focus",
            disabled: !unref(nextItemsEnabled),
            onClick: moveNext,
            onKeydown: _cache[2] || (_cache[2] = (e) => unref(onSpaceOrEnter)(e, moveNext))
          }, [
            createVNode(_sfc_main$i, {
              name: "nav-next-button",
              move: moveNext,
              disabled: !unref(nextItemsEnabled)
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$c, {
                  name: "ChevronRight",
                  width: "22px",
                  height: "24px"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ], 40, _hoisted_3$3)
        ]),
        createElementVNode("div", _hoisted_4$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(activeItems), (item) => {
            return openBlock(), createElementBlock("button", {
              key: item.label,
              type: "button",
              "data-id": item.id,
              "aria-label": item.ariaLabel,
              class: normalizeClass(["vc-nav-item vc-focus", [
                item.isActive ? "is-active" : item.isCurrent ? "is-current" : ""
              ]]),
              disabled: item.isDisabled,
              onClick: item.click,
              onKeydown: (e) => unref(onSpaceOrEnter)(e, item.click)
            }, toDisplayString(item.label), 43, _hoisted_5$2);
          }), 128))
        ])
      ], 512);
    };
  }
});
const CalendarNav_vue_vue_type_style_index_0_lang = "";
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "CalendarPageProvider",
  props: {
    page: null
  },
  setup(__props) {
    const props = __props;
    createPage(toRef(props, "page"));
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
});
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "CalendarNavPopover",
  setup(__props) {
    const { navPopoverId, color, displayMode } = useCalendar();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Popover, {
        id: unref(navPopoverId),
        class: normalizeClass(["vc-nav-popover-container", `vc-${unref(color)}`, `vc-${unref(displayMode)}`])
      }, {
        default: withCtx(({ data: data2 }) => [
          createVNode(_sfc_main$9, {
            page: data2.page
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$i, { name: "nav" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$a)
                ]),
                _: 1
              })
            ]),
            _: 2
          }, 1032, ["page"])
        ]),
        _: 1
      }, 8, ["id", "class"]);
    };
  }
});
const _sfc_main$7 = defineComponent({
  directives: { popover: popoverDirective },
  components: { CalendarSlot: _sfc_main$i },
  props: {
    day: { type: Object, required: true }
  },
  setup(props) {
    const {
      locale,
      theme,
      attributeContext,
      dayPopoverId,
      onDayClick,
      onDayMouseenter,
      onDayMouseleave,
      onDayFocusin,
      onDayFocusout,
      onDayKeydown
    } = useCalendar();
    const day = computed(() => props.day);
    const attributeCells = computed(() => {
      return attributeContext.value.getCells(day.value);
    });
    const attributes = computed(
      () => attributeCells.value.map((cell) => cell.data)
    );
    const attributedDay = computed(() => {
      return {
        ...day.value,
        attributes: attributes.value,
        attributeCells: attributeCells.value
      };
    });
    function processPopover({ data: attribute }, { popovers: popovers2 }) {
      const { key, customData, popover } = attribute;
      if (!popover)
        return;
      const resolvedPopover = defaults_1(
        {
          key,
          customData,
          attribute
        },
        { ...popover },
        {
          visibility: popover.label ? "hover" : "click",
          placement: "bottom",
          isInteractive: !popover.label
        }
      );
      popovers2.splice(0, 0, resolvedPopover);
    }
    const glyphs = computed(() => {
      const result = {
        ...theme.value.prepareRender({}),
        popovers: []
      };
      attributeCells.value.forEach((cell) => {
        theme.value.render(cell, result);
        processPopover(cell, result);
      });
      return result;
    });
    const highlights = computed(() => glyphs.value.highlights);
    const hasHighlights = computed(() => !!arrayHasItems(highlights.value));
    const content = computed(() => glyphs.value.content);
    const dots = computed(() => glyphs.value.dots);
    const hasDots = computed(() => !!arrayHasItems(dots.value));
    const bars = computed(() => glyphs.value.bars);
    const hasBars = computed(() => !!arrayHasItems(bars.value));
    const popovers = computed(() => glyphs.value.popovers);
    const popoverAttrs = computed(
      () => popovers.value.map((p) => p.attribute)
    );
    const dayContentSlot = useSlot("day-content");
    const dayClasses = computed(() => {
      return [
        "vc-day",
        ...day.value.classes,
        { "vc-day-box-center-center": !dayContentSlot },
        { "is-not-in-month": !props.day.inMonth }
      ];
    });
    const dayContentProps = computed(() => {
      let tabindex;
      if (day.value.isFocusable) {
        tabindex = "0";
      } else {
        tabindex = "-1";
      }
      const classes = [
        "vc-day-content vc-focusable vc-focus vc-attr",
        { "vc-disabled": day.value.isDisabled },
        get_1(last_1(highlights.value), "contentClass"),
        get_1(last_1(content.value), "class") || ""
      ];
      const style = {
        ...get_1(last_1(highlights.value), "contentStyle"),
        ...get_1(last_1(content.value), "style")
      };
      return {
        class: classes,
        style,
        tabindex,
        "aria-label": day.value.ariaLabel,
        "aria-disabled": day.value.isDisabled ? true : false,
        role: "button"
      };
    });
    const dayContentEvents = computed(() => {
      return {
        click(event) {
          onDayClick(attributedDay.value, event);
        },
        mouseenter(event) {
          onDayMouseenter(attributedDay.value, event);
        },
        mouseleave(event) {
          onDayMouseleave(attributedDay.value, event);
        },
        focusin(event) {
          onDayFocusin(attributedDay.value, event);
        },
        focusout(event) {
          onDayFocusout(attributedDay.value, event);
        },
        keydown(event) {
          onDayKeydown(attributedDay.value, event);
        }
      };
    });
    const dayPopover2 = computed(() => {
      if (!arrayHasItems(popovers.value))
        return null;
      return defaults_1(
        {
          id: dayPopoverId.value,
          data: { day, attributes: popoverAttrs.value }
        },
        ...popovers.value
      );
    });
    return {
      attributes,
      attributeCells,
      bars,
      dayClasses,
      dayContentProps,
      dayContentEvents,
      dayPopover: dayPopover2,
      glyphs,
      dots,
      hasDots,
      hasBars,
      highlights,
      hasHighlights,
      locale,
      popovers
    };
  }
});
const CalendarDay_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$4 = {
  key: 0,
  class: "vc-highlights vc-day-layer"
};
const _hoisted_2$3 = {
  key: 1,
  class: "vc-day-layer vc-day-box-center-bottom"
};
const _hoisted_3$2 = { class: "vc-dots" };
const _hoisted_4$1 = {
  key: 2,
  class: "vc-day-layer vc-day-box-center-bottom"
};
const _hoisted_5$1 = { class: "vc-bars" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CalendarSlot = resolveComponent("CalendarSlot");
  const _directive_popover = resolveDirective("popover");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.dayClasses)
  }, [
    _ctx.hasHighlights ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.highlights, ({ key, wrapperClass, class: bgClass, style }) => {
        return openBlock(), createElementBlock("div", {
          key,
          class: normalizeClass(wrapperClass)
        }, [
          createElementVNode("div", {
            class: normalizeClass(bgClass),
            style: normalizeStyle(style)
          }, null, 6)
        ], 2);
      }), 128))
    ])) : createCommentVNode("", true),
    createVNode(_component_CalendarSlot, {
      name: "day-content",
      day: _ctx.day,
      attributes: _ctx.attributes,
      "attribute-cells": _ctx.attributeCells,
      dayProps: _ctx.dayContentProps,
      dayEvents: _ctx.dayContentEvents,
      locale: _ctx.locale
    }, {
      default: withCtx(() => [
        withDirectives((openBlock(), createElementBlock("div", mergeProps(_ctx.dayContentProps, toHandlers(_ctx.dayContentEvents, true)), [
          createTextVNode(toDisplayString(_ctx.day.label), 1)
        ], 16)), [
          [_directive_popover, _ctx.dayPopover]
        ])
      ]),
      _: 1
    }, 8, ["day", "attributes", "attribute-cells", "dayProps", "dayEvents", "locale"]),
    _ctx.hasDots ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
      createElementVNode("div", _hoisted_3$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.dots, ({ key, class: bgClass, style }) => {
          return openBlock(), createElementBlock("span", {
            key,
            class: normalizeClass(bgClass),
            style: normalizeStyle(style)
          }, null, 6);
        }), 128))
      ])
    ])) : createCommentVNode("", true),
    _ctx.hasBars ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
      createElementVNode("div", _hoisted_5$1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.bars, ({ key, class: bgClass, style }) => {
          return openBlock(), createElementBlock("span", {
            key,
            class: normalizeClass(bgClass),
            style: normalizeStyle(style)
          }, null, 6);
        }), 128))
      ])
    ])) : createCommentVNode("", true)
  ], 2);
}
const CalendarDay = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$2]]);
const _hoisted_1$3 = { class: "vc-weekdays" };
const _hoisted_2$2 = ["onClick"];
const __default__$2 = {
  inheritAttrs: false
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  ...__default__$2,
  __name: "CalendarPage",
  setup(__props) {
    const { page } = usePage();
    const { onWeeknumberClick } = useCalendar();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          "vc-pane",
          `row-${unref(page).row}`,
          `row-from-end-${unref(page).rowFromEnd}`,
          `column-${unref(page).column}`,
          `column-from-end-${unref(page).columnFromEnd}`
        ]),
        ref: "pane"
      }, [
        createVNode(_sfc_main$b, {
          page: unref(page),
          "is-lg": "",
          "hide-arrows": ""
        }, null, 8, ["page"]),
        createElementVNode("div", {
          class: normalizeClass(["vc-weeks", {
            [`vc-show-weeknumbers-${unref(page).weeknumberPosition}`]: unref(page).weeknumberPosition
          }])
        }, [
          createElementVNode("div", _hoisted_1$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(page).weekdays, ({ weekday, label }, i) => {
              return openBlock(), createElementBlock("div", {
                key: i,
                class: normalizeClass(`vc-weekday vc-weekday-${weekday}`)
              }, toDisplayString(label), 3);
            }), 128))
          ]),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(page).viewWeeks, (week) => {
            return openBlock(), createElementBlock("div", {
              key: `weeknumber-${week.weeknumber}`,
              class: "vc-week"
            }, [
              unref(page).weeknumberPosition ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["vc-weeknumber", `is-${unref(page).weeknumberPosition}`])
              }, [
                createElementVNode("span", {
                  class: normalizeClass(["vc-weeknumber-content"]),
                  onClick: ($event) => unref(onWeeknumberClick)(week, $event)
                }, toDisplayString(week.weeknumberDisplay), 9, _hoisted_2$2)
              ], 2)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(week.days, (day) => {
                return openBlock(), createBlock(CalendarDay, {
                  key: day.id,
                  day
                }, null, 8, ["day"]);
              }), 128))
            ]);
          }), 128))
        ], 2)
      ], 2);
    };
  }
});
const CalendarPage_vue_vue_type_style_index_0_lang = "";
const _sfc_main$5 = defineComponent({
  components: {
    CalendarHeader: _sfc_main$b,
    CalendarPage: _sfc_main$6,
    CalendarNavPopover: _sfc_main$8,
    CalendarDayPopover: _sfc_main$h,
    CalendarPageProvider: _sfc_main$9,
    CalendarSlot: _sfc_main$i
  },
  props: propsDef$1,
  emit: emitsDef,
  setup(props, { emit, slots }) {
    return createCalendar(props, { emit, slots });
  }
});
const Calendar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = { class: "vc-pane-header-wrapper" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CalendarHeader = resolveComponent("CalendarHeader");
  const _component_CalendarPage = resolveComponent("CalendarPage");
  const _component_CalendarSlot = resolveComponent("CalendarSlot");
  const _component_CalendarPageProvider = resolveComponent("CalendarPageProvider");
  const _component_CalendarDayPopover = resolveComponent("CalendarDayPopover");
  const _component_CalendarNavPopover = resolveComponent("CalendarNavPopover");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", mergeProps({ "data-helptext": "Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year" }, _ctx.$attrs, {
      class: [
        "vc-container",
        `vc-${_ctx.view}`,
        `vc-${_ctx.color}`,
        `vc-${_ctx.displayMode}`,
        {
          "vc-expanded": _ctx.expanded,
          "vc-bordered": !_ctx.borderless,
          "vc-transparent": _ctx.transparent
        }
      ],
      onMouseup: _cache[0] || (_cache[0] = withModifiers(() => {
      }, ["prevent"])),
      ref: "containerRef"
    }), [
      createElementVNode("div", {
        class: normalizeClass(["vc-pane-container", { "in-transition": _ctx.inTransition }])
      }, [
        createElementVNode("div", _hoisted_1$2, [
          _ctx.firstPage ? (openBlock(), createBlock(_component_CalendarHeader, {
            key: 0,
            page: _ctx.firstPage,
            "is-lg": "",
            "hide-title": ""
          }, null, 8, ["page"])) : createCommentVNode("", true)
        ]),
        createVNode(Transition, {
          name: `vc-${_ctx.transitionName}`,
          onBeforeEnter: _ctx.onTransitionBeforeEnter,
          onAfterEnter: _ctx.onTransitionAfterEnter
        }, {
          default: withCtx(() => [
            (openBlock(), createElementBlock("div", {
              key: _ctx.pages[0].id,
              class: "vc-pane-layout",
              style: normalizeStyle({
                gridTemplateColumns: `repeat(${_ctx.columns}, 1fr)`
              })
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pages, (page) => {
                return openBlock(), createBlock(_component_CalendarPageProvider, {
                  key: page.id,
                  page
                }, {
                  default: withCtx(() => [
                    createVNode(_component_CalendarSlot, {
                      name: "page",
                      page
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_CalendarPage)
                      ]),
                      _: 2
                    }, 1032, ["page"])
                  ]),
                  _: 2
                }, 1032, ["page"]);
              }), 128))
            ], 4))
          ]),
          _: 1
        }, 8, ["name", "onBeforeEnter", "onAfterEnter"]),
        createVNode(_component_CalendarSlot, { name: "footer" })
      ], 2)
    ], 16),
    createVNode(_component_CalendarDayPopover),
    createVNode(_component_CalendarNavPopover)
  ], 64);
}
const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$1]]);
const contextKey = Symbol("__vc_date_picker_context__");
const propsDef = {
  ...propsDef$2,
  mode: { type: String, default: "date" },
  modelValue: {
    type: [Number, String, Date, Object]
  },
  modelModifiers: {
    type: Object,
    default: () => ({})
  },
  rules: [String, Object],
  is24hr: Boolean,
  hideTimeHeader: Boolean,
  timeAccuracy: { type: Number, default: 2 },
  isRequired: Boolean,
  isRange: Boolean,
  updateOnInput: {
    type: Boolean,
    default: () => getDefault("datePicker.updateOnInput")
  },
  inputDebounce: {
    type: Number,
    default: () => getDefault("datePicker.inputDebounce")
  },
  popover: {
    type: [Boolean, Object],
    default: true
  },
  dragAttribute: Object,
  selectAttribute: Object,
  attributes: [Object, Array]
};
const emits = [
  "update:modelValue",
  "drag",
  "dayclick",
  "daykeydown",
  "popover-will-show",
  "popover-did-show",
  "popover-will-hide",
  "popover-did-hide"
];
function createDatePicker(props, { emit, slots }) {
  provideSlots(slots, { footer: "dp-footer" });
  const baseCtx = createBase(props);
  const { locale, masks: masks2, disabledAttribute } = baseCtx;
  const showCalendar = ref(false);
  const datePickerPopoverId = ref(Symbol());
  const dateValue = ref(null);
  const dragValue = ref(null);
  const inputValues = ref(["", ""]);
  const popoverRef = ref(null);
  const calendarRef = ref(null);
  let updateTimeout = void 0;
  let dragTrackingValue;
  let watchValue = true;
  const isRange = computed(() => {
    return props.isRange || props.modelModifiers.range === true;
  });
  const valueStart = computed(
    () => isRange.value && dateValue.value != null ? dateValue.value.start : null
  );
  const valueEnd = computed(
    () => isRange.value && dateValue.value != null ? dateValue.value.end : null
  );
  const isDateMode = computed(() => props.mode.toLowerCase() === "date");
  const isDateTimeMode = computed(
    () => props.mode.toLowerCase() === "datetime"
  );
  const isTimeMode = computed(() => props.mode.toLowerCase() === "time");
  const isDragging = computed(() => !!dragValue.value);
  const modelConfig = computed(() => {
    let type = "date";
    if (props.modelModifiers.number)
      type = "number";
    if (props.modelModifiers.string)
      type = "string";
    const mask = masks2.value.modelValue || "iso";
    return normalizeConfig2({ type, mask });
  });
  const dateParts = computed(
    () => getDateParts2(dragValue.value ?? dateValue.value)
  );
  const inputMask = computed(() => {
    if (isTimeMode.value) {
      return props.is24hr ? masks2.value.inputTime24hr : masks2.value.inputTime;
    }
    if (isDateTimeMode.value) {
      return props.is24hr ? masks2.value.inputDateTime24hr : masks2.value.inputDateTime;
    }
    return masks2.value.input;
  });
  const inputMaskHasTime = computed(() => /[Hh]/g.test(inputMask.value));
  const inputMaskHasDate = computed(
    () => /[dD]{1,2}|Do|W{1,4}|M{1,4}|YY(?:YY)?/g.test(inputMask.value)
  );
  const inputMaskPatch = computed(() => {
    if (inputMaskHasTime.value && inputMaskHasDate.value) {
      return "dateTime";
    }
    if (inputMaskHasDate.value)
      return "date";
    if (inputMaskHasTime.value)
      return "time";
    return void 0;
  });
  const popover = computed(() => {
    var _a;
    const target = ((_a = popoverRef.value) == null ? void 0 : _a.$el.previousElementSibling) ?? void 0;
    return defaultsDeep_1({}, props.popover, getDefault("datePicker.popover"), {
      target
    });
  });
  const popoverEvents = computed(
    () => getPopoverEventHandlers({
      ...popover.value,
      id: datePickerPopoverId.value
    })
  );
  const inputValue = computed(() => {
    return isRange.value ? {
      start: inputValues.value[0],
      end: inputValues.value[1]
    } : inputValues.value[0];
  });
  const inputEvents = computed(() => {
    const events = ["start", "end"].map((target) => ({
      input: onInputInput(target),
      change: onInputChange(target),
      keyup: onInputKeyup,
      ...props.popover && popoverEvents.value
    }));
    return isRange.value ? {
      start: events[0],
      end: events[1]
    } : events[0];
  });
  const selectAttribute = computed(() => {
    if (!hasValue(dateValue.value))
      return null;
    const attribute = {
      key: "select-drag",
      ...props.selectAttribute,
      dates: dateValue.value,
      pinPage: true
    };
    const { dot, bar, highlight, content } = attribute;
    if (!dot && !bar && !highlight && !content) {
      attribute.highlight = true;
    }
    return attribute;
  });
  const dragAttribute = computed(() => {
    if (!isRange.value || !hasValue(dragValue.value)) {
      return null;
    }
    const attribute = {
      key: "select-drag",
      ...props.dragAttribute,
      dates: dragValue.value
    };
    const { dot, bar, highlight, content } = attribute;
    if (!dot && !bar && !highlight && !content) {
      attribute.highlight = {
        startEnd: {
          fillMode: "outline"
        }
      };
    }
    return attribute;
  });
  const attributes = computed(() => {
    const attrs = isArray(props.attributes) ? [...props.attributes] : [];
    if (dragAttribute.value) {
      attrs.unshift(dragAttribute.value);
    } else if (selectAttribute.value) {
      attrs.unshift(selectAttribute.value);
    }
    return attrs;
  });
  const rules = computed(() => {
    return normalizeConfig2(
      props.rules === "auto" ? getAutoRules() : props.rules ?? {}
    );
  });
  function getAutoRules() {
    const _rules = {
      ms: [0, 999],
      sec: [0, 59],
      min: [0, 59],
      hr: [0, 23]
    };
    const accuracy = isDateMode.value ? 0 : props.timeAccuracy;
    return [0, 1].map((i) => {
      switch (accuracy) {
        case 0:
          return {
            hours: _rules.hr[i],
            minutes: _rules.min[i],
            seconds: _rules.sec[i],
            milliseconds: _rules.ms[i]
          };
        case 1:
          return {
            minutes: _rules.min[i],
            seconds: _rules.sec[i],
            milliseconds: _rules.ms[i]
          };
        case 3:
          return { milliseconds: _rules.ms[i] };
        case 4:
          return {};
        default:
          return { seconds: _rules.sec[i], milliseconds: _rules.ms[i] };
      }
    });
  }
  function normalizeConfig2(config2) {
    if (isArray(config2)) {
      if (config2.length === 1)
        return [config2[0], config2[0]];
      return config2;
    }
    return [config2, config2];
  }
  function normalizeDateConfig(config2) {
    return normalizeConfig2(config2).map(
      (c, i) => ({
        ...c,
        rules: rules.value[i]
      })
    );
  }
  function hasDateValue(value) {
    if (value == null)
      return false;
    if (isNumber_1(value))
      return !isNaN(value);
    if (isDate(value))
      return !isNaN(value.getTime());
    if (isString_1(value))
      return value !== "";
    return isDateParts(value);
  }
  function hasRangeValue(value) {
    return isObject(value) && "start" in value && "end" in value && hasDateValue(value.start ?? null) && hasDateValue(value.end ?? null);
  }
  function hasValue(value) {
    return hasRangeValue(value) || hasDateValue(value);
  }
  function valuesAreEqual(a, b) {
    if (a == null && b == null)
      return true;
    if (a == null || b == null)
      return false;
    const aIsDate = isDate(a);
    const bIsDate = isDate(b);
    if (aIsDate && bIsDate)
      return a.getTime() === b.getTime();
    if (aIsDate || bIsDate)
      return false;
    return valuesAreEqual(a.start, b.start) && valuesAreEqual(a.end, b.end);
  }
  function valueIsDisabled(value) {
    if (!hasValue(value) || !disabledAttribute.value)
      return false;
    return disabledAttribute.value.intersectsRange(locale.value.range(value));
  }
  function normalizeValue(value, config2, patch, targetPriority) {
    if (!hasValue(value))
      return null;
    if (hasRangeValue(value)) {
      const start = locale.value.toDate(value.start, {
        ...config2[0],
        fillDate: valueStart.value ?? void 0,
        patch
      });
      const end = locale.value.toDate(value.end, {
        ...config2[1],
        fillDate: valueEnd.value ?? void 0,
        patch
      });
      return sortRange({ start, end }, targetPriority);
    }
    return locale.value.toDateOrNull(value, {
      ...config2[0],
      fillDate: dateValue.value,
      patch
    });
  }
  function denormalizeValue(value, config2) {
    if (hasRangeValue(value)) {
      return {
        start: locale.value.fromDate(value.start, config2[0]),
        end: locale.value.fromDate(value.end, config2[1])
      };
    }
    if (isRange.value) {
      return null;
    }
    return locale.value.fromDate(value, config2[0]);
  }
  function updateValue(value, opts = {}) {
    clearTimeout(updateTimeout);
    return new Promise((resolve) => {
      const { debounce = 0, ...args } = opts;
      if (debounce > 0) {
        updateTimeout = window.setTimeout(() => {
          resolve(forceUpdateValue(value, args));
        }, debounce);
      } else {
        resolve(forceUpdateValue(value, args));
      }
    });
  }
  function forceUpdateValue(value, {
    config: config2 = modelConfig.value,
    patch = "dateTime",
    clearIfEqual = false,
    formatInput: fInput = true,
    hidePopover: hPopover = false,
    dragging = isDragging.value,
    targetPriority,
    moveToValue: mValue = false
  } = {}) {
    const normalizedConfig = normalizeDateConfig(config2);
    let normalizedValue = normalizeValue(
      value,
      normalizedConfig,
      patch,
      targetPriority
    );
    const isDisabled = valueIsDisabled(normalizedValue);
    if (isDisabled) {
      if (dragging)
        return null;
      normalizedValue = dateValue.value;
      hPopover = false;
    } else if (normalizedValue == null && props.isRequired) {
      normalizedValue = dateValue.value;
    } else if (
      // Clear value if same value was passed
      normalizedValue != null && valuesAreEqual(dateValue.value, normalizedValue) && clearIfEqual
    ) {
      normalizedValue = null;
    }
    const valueRef = dragging ? dragValue : dateValue;
    const notify = !valuesAreEqual(valueRef.value, normalizedValue);
    valueRef.value = normalizedValue;
    if (!dragging)
      dragValue.value = null;
    const denormalizedValue = denormalizeValue(
      normalizedValue,
      modelConfig.value
    );
    if (notify) {
      watchValue = false;
      emit(dragging ? "drag" : "update:modelValue", denormalizedValue);
      nextTick(() => watchValue = true);
    }
    if (hPopover && !dragging)
      hidePopover$1();
    if (fInput)
      formatInput();
    if (mValue) {
      nextTick(() => moveToValue(targetPriority ?? "start"));
    }
    return denormalizedValue;
  }
  function formatInput() {
    nextTick(() => {
      const config2 = normalizeDateConfig({
        type: "string",
        mask: inputMask.value
      });
      const value = denormalizeValue(
        dragValue.value ?? dateValue.value,
        config2
      );
      if (isRange.value) {
        inputValues.value = [value && value.start, value && value.end];
      } else {
        inputValues.value = [value, ""];
      }
    });
  }
  function onInputUpdate(inputValue2, target, opts) {
    inputValues.value.splice(target === "start" ? 0 : 1, 1, inputValue2);
    const value = isRange.value ? {
      start: inputValues.value[0],
      end: inputValues.value[1] || inputValues.value[0]
    } : inputValue2;
    const config2 = {
      type: "string",
      mask: inputMask.value
    };
    updateValue(value, {
      ...opts,
      config: config2,
      patch: inputMaskPatch.value,
      targetPriority: target,
      moveToValue: true
    });
  }
  function onInputInput(target) {
    return (e) => {
      if (!props.updateOnInput)
        return;
      onInputUpdate(e.currentTarget.value, target, {
        formatInput: false,
        hidePopover: false,
        debounce: props.inputDebounce
      });
    };
  }
  function onInputChange(target) {
    return (e) => {
      onInputUpdate(e.currentTarget.value, target, {
        formatInput: true,
        hidePopover: false
      });
    };
  }
  function onInputKeyup(e) {
    if (e.key !== "Escape")
      return;
    updateValue(dateValue.value, {
      formatInput: true,
      hidePopover: true
    });
  }
  function getDateParts2(value) {
    if (isRange.value) {
      return [
        value && value.start ? locale.value.getDateParts(value.start) : null,
        value && value.end ? locale.value.getDateParts(value.end) : null
      ];
    }
    return [value ? locale.value.getDateParts(value) : null];
  }
  function cancelDrag() {
    dragValue.value = null;
    formatInput();
  }
  function onPopoverBeforeShow(el) {
    emit("popover-will-show", el);
  }
  function onPopoverAfterShow(el) {
    emit("popover-did-show", el);
  }
  function onPopoverBeforeHide(el) {
    cancelDrag();
    emit("popover-will-hide", el);
  }
  function onPopoverAfterHide(el) {
    emit("popover-did-hide", el);
  }
  function handleDayClick(day) {
    const opts = {
      patch: "date",
      formatInput: true,
      hidePopover: true
    };
    if (isRange.value) {
      const dragging = !isDragging.value;
      if (dragging) {
        dragTrackingValue = { start: day.startDate, end: day.endDate };
      } else if (dragTrackingValue != null) {
        dragTrackingValue.end = day.date;
      }
      updateValue(dragTrackingValue, {
        ...opts,
        dragging
      });
    } else {
      updateValue(day.date, {
        ...opts,
        clearIfEqual: !props.isRequired
      });
    }
  }
  function onDayClick(day, event) {
    handleDayClick(day);
    emit("dayclick", day, event);
  }
  function onDayKeydown(day, event) {
    switch (event.key) {
      case " ":
      case "Enter": {
        handleDayClick(day);
        event.preventDefault();
        break;
      }
      case "Escape": {
        hidePopover$1();
      }
    }
    emit("daykeydown", day, event);
  }
  function onDayMouseEnter(day, event) {
    if (!isDragging.value || dragTrackingValue == null)
      return;
    dragTrackingValue.end = day.date;
    updateValue(sortRange(dragTrackingValue), {
      patch: "date",
      formatInput: true
    });
  }
  function showPopover$1(opts = {}) {
    showPopover({
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: datePickerPopoverId.value
    });
  }
  function hidePopover$1(opts = {}) {
    hidePopover({
      hideDelay: 10,
      force: true,
      ...popover.value,
      ...opts,
      id: datePickerPopoverId.value
    });
  }
  function togglePopover$1(opts) {
    togglePopover({
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: datePickerPopoverId.value
    });
  }
  function sortRange(range, priority) {
    const { start, end } = range;
    if (start > end) {
      switch (priority) {
        case "start":
          return { start, end: start };
        case "end":
          return { start: end, end };
        default:
          return { start: end, end: start };
      }
    }
    return { start, end };
  }
  async function move(target, opts = {}) {
    if (calendarRef.value == null)
      return false;
    return calendarRef.value.move(target, opts);
  }
  async function moveBy(pages, opts = {}) {
    if (calendarRef.value == null)
      return false;
    return calendarRef.value.moveBy(pages, opts);
  }
  async function moveToValue(target, opts = {}) {
    const dValue = dateValue.value;
    if (calendarRef.value == null || !hasValue(dValue))
      return false;
    const start = target !== "end";
    const position = start ? 1 : -1;
    const date = hasRangeValue(dValue) ? start ? dValue.start : dValue.end : dValue;
    const page = getPageAddressForDate(date, "monthly", locale.value);
    return calendarRef.value.move(page, { position, ...opts });
  }
  watch(
    () => props.isRange,
    (val) => {
      if (val) {
        console.warn(
          "The `is-range` prop will be deprecated in future releases. Please use the `range` modifier."
        );
      }
    },
    { immediate: true }
  );
  watch(
    () => isRange.value,
    () => {
      forceUpdateValue(null, { formatInput: true });
    }
  );
  watch(
    () => inputMask.value,
    () => formatInput()
  );
  watch(
    () => props.modelValue,
    (val) => {
      if (!watchValue)
        return;
      forceUpdateValue(val, {
        formatInput: true,
        hidePopover: false
      });
    }
  );
  watch(
    () => rules.value,
    () => {
      if (isObject(props.rules)) {
        forceUpdateValue(props.modelValue, {
          formatInput: true,
          hidePopover: false
        });
      }
    }
  );
  watch(
    () => props.timezone,
    () => {
      forceUpdateValue(dateValue.value, { formatInput: true });
    }
  );
  const config = normalizeConfig2(modelConfig.value);
  dateValue.value = normalizeValue(
    props.modelValue ?? null,
    config,
    "dateTime"
  );
  onMounted(() => {
    forceUpdateValue(props.modelValue, {
      formatInput: true,
      hidePopover: false
    });
  });
  nextTick(() => showCalendar.value = true);
  const context = {
    ...baseCtx,
    showCalendar,
    datePickerPopoverId,
    popoverRef,
    popoverEvents,
    calendarRef,
    isRange,
    isTimeMode,
    isDateTimeMode,
    is24hr: toRef(props, "is24hr"),
    hideTimeHeader: toRef(props, "hideTimeHeader"),
    timeAccuracy: toRef(props, "timeAccuracy"),
    isDragging,
    inputValue,
    inputEvents,
    dateParts,
    attributes,
    rules,
    move,
    moveBy,
    moveToValue,
    updateValue,
    showPopover: showPopover$1,
    hidePopover: hidePopover$1,
    togglePopover: togglePopover$1,
    onDayClick,
    onDayKeydown,
    onDayMouseEnter,
    onPopoverBeforeShow,
    onPopoverAfterShow,
    onPopoverBeforeHide,
    onPopoverAfterHide
  };
  provide(contextKey, context);
  return context;
}
function useDatePicker() {
  const context = inject(contextKey);
  if (context)
    return context;
  throw new Error(
    "DatePicker context missing. Please verify this component is nested within a valid context provider."
  );
}
const _amOptions = [
  { value: 0, label: "12" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" }
];
const _pmOptions = [
  { value: 12, label: "12" },
  { value: 13, label: "1" },
  { value: 14, label: "2" },
  { value: 15, label: "3" },
  { value: 16, label: "4" },
  { value: 17, label: "5" },
  { value: 18, label: "6" },
  { value: 19, label: "7" },
  { value: 20, label: "8" },
  { value: 21, label: "9" },
  { value: 22, label: "10" },
  { value: 23, label: "11" }
];
function createTimePicker(props) {
  const ctx = useDatePicker();
  const {
    locale,
    isRange,
    isTimeMode,
    dateParts,
    rules,
    is24hr,
    hideTimeHeader,
    timeAccuracy,
    updateValue: updateDpValue
  } = ctx;
  function updateParts(newParts) {
    newParts = Object.assign(parts.value, newParts);
    let newValue = null;
    if (isRange.value) {
      const start = isStart.value ? newParts : dateParts.value[0];
      const end = isStart.value ? dateParts.value[1] : newParts;
      newValue = { start, end };
    } else {
      newValue = newParts;
    }
    updateDpValue(newValue, {
      patch: "time",
      targetPriority: isStart.value ? "start" : "end",
      moveToValue: true
    });
  }
  const isStart = computed(() => props.position === 0);
  const parts = computed(
    () => dateParts.value[props.position] || { isValid: false }
  );
  const partsValid = computed(() => isDateParts(parts.value));
  const isValid = computed(() => !!parts.value.isValid);
  const showHeader = computed(() => {
    return !hideTimeHeader.value && isValid.value;
  });
  const date = computed(() => {
    if (!partsValid.value)
      return null;
    let date2 = locale.value.toDate(parts.value);
    if (parts.value.hours === 24) {
      date2 = new Date(date2.getTime() - 1);
    }
    return date2;
  });
  const hours2 = computed({
    get() {
      return parts.value.hours;
    },
    set(val) {
      updateParts({ hours: val });
    }
  });
  const minutes = computed({
    get() {
      return parts.value.minutes;
    },
    set(val) {
      updateParts({ minutes: val });
    }
  });
  const seconds = computed({
    get() {
      return parts.value.seconds;
    },
    set(val) {
      updateParts({ seconds: val });
    }
  });
  const milliseconds = computed({
    get() {
      return parts.value.milliseconds;
    },
    set(val) {
      updateParts({ milliseconds: val });
    }
  });
  const isAM = computed({
    get() {
      return parts.value.hours < 12;
    },
    set(value) {
      value = String(value).toLowerCase() == "true";
      let hValue = hours2.value;
      if (value && hValue >= 12) {
        hValue -= 12;
      } else if (!value && hValue < 12) {
        hValue += 12;
      }
      updateParts({ hours: hValue });
    }
  });
  const options = computed(
    () => getDatePartsOptions(parts.value, rules.value[props.position])
  );
  const amHourOptions = computed(() => {
    return _amOptions.filter(
      (opt) => options.value.hours.some((ho) => ho.value === opt.value)
    );
  });
  const pmHourOptions = computed(() => {
    return _pmOptions.filter(
      (opt) => options.value.hours.some((ho) => ho.value === opt.value)
    );
  });
  const hourOptions = computed(() => {
    if (is24hr.value)
      return options.value.hours;
    if (isAM.value)
      return amHourOptions.value;
    return pmHourOptions.value;
  });
  const isAMOptions = computed(() => {
    const result = [];
    if (arrayHasItems(amHourOptions.value))
      result.push({ value: true, label: "AM" });
    if (arrayHasItems(pmHourOptions.value))
      result.push({ value: false, label: "PM" });
    return result;
  });
  return {
    ...ctx,
    showHeader,
    timeAccuracy,
    parts,
    isValid,
    date,
    hours: hours2,
    minutes,
    seconds,
    milliseconds,
    options,
    hourOptions,
    isAM,
    isAMOptions,
    is24hr
  };
}
const _hoisted_1$1 = ["value"];
const _hoisted_2$1 = ["value", "disabled"];
const _hoisted_3$1 = {
  key: 1,
  class: "vc-base-sizer",
  "aria-hidden": "true"
};
const __default__$1 = {
  inheritAttrs: false
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  ...__default__$1,
  __name: "BaseSelect",
  props: {
    options: null,
    modelValue: null,
    alignRight: { type: Boolean },
    alignLeft: { type: Boolean },
    showIcon: { type: Boolean },
    fitContent: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const selectedLabel = computed(() => {
      const option = props.options.find((opt) => opt.value === props.modelValue);
      return option == null ? void 0 : option.label;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vc-base-select", {
          "vc-fit-content": __props.fitContent,
          "vc-has-icon": __props.showIcon
        }])
      }, [
        createElementVNode("select", mergeProps(_ctx.$attrs, {
          value: __props.modelValue,
          class: ["vc-focus", {
            "vc-align-right": __props.alignRight,
            "vc-align-left": __props.alignLeft
          }],
          onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.value))
        }), [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
            return openBlock(), createElementBlock("option", {
              key: option.value,
              value: option.value,
              disabled: option.disabled
            }, toDisplayString(option.label), 9, _hoisted_2$1);
          }), 128))
        ], 16, _hoisted_1$1),
        __props.showIcon ? (openBlock(), createBlock(_sfc_main$c, {
          key: 0,
          name: "ChevronDown",
          size: "18"
        })) : createCommentVNode("", true),
        __props.fitContent ? (openBlock(), createElementBlock("div", _hoisted_3$1, toDisplayString(unref(selectedLabel)), 1)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const BaseSelect_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = {
  key: 0,
  class: "vc-time-header"
};
const _hoisted_2 = { class: "vc-time-weekday" };
const _hoisted_3 = { class: "vc-time-month" };
const _hoisted_4 = { class: "vc-time-day" };
const _hoisted_5 = { class: "vc-time-year" };
const _hoisted_6 = { class: "vc-time-select-group" };
const _hoisted_7 = /* @__PURE__ */ createElementVNode("span", { class: "vc-time-colon" }, ":", -1);
const _hoisted_8 = /* @__PURE__ */ createElementVNode("span", { class: "vc-time-colon" }, ":", -1);
const _hoisted_9 = /* @__PURE__ */ createElementVNode("span", { class: "vc-time-decimal" }, ".", -1);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TimePicker",
  props: {
    position: null
  },
  setup(__props, { expose }) {
    const props = __props;
    const timePicker = createTimePicker(props);
    expose(timePicker);
    const {
      locale,
      isValid,
      date,
      hours: hours2,
      minutes,
      seconds,
      milliseconds,
      options,
      hourOptions,
      isTimeMode,
      isAM,
      isAMOptions,
      is24hr,
      showHeader,
      timeAccuracy
    } = timePicker;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vc-time-picker", [{ "vc-invalid": !unref(isValid), "vc-attached": !unref(isTimeMode) }]])
      }, [
        createVNode(_sfc_main$i, { name: "time-header" }, {
          default: withCtx(() => [
            unref(showHeader) && unref(date) ? (openBlock(), createElementBlock("div", _hoisted_1, [
              createElementVNode("span", _hoisted_2, toDisplayString(unref(locale).formatDate(unref(date), "WWW")), 1),
              createElementVNode("span", _hoisted_3, toDisplayString(unref(locale).formatDate(unref(date), "MMM")), 1),
              createElementVNode("span", _hoisted_4, toDisplayString(unref(locale).formatDate(unref(date), "D")), 1),
              createElementVNode("span", _hoisted_5, toDisplayString(unref(locale).formatDate(unref(date), "YYYY")), 1)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createElementVNode("div", _hoisted_6, [
          createVNode(_sfc_main$c, {
            name: "Clock",
            size: "17"
          }),
          createVNode(_sfc_main$4, {
            modelValue: unref(hours2),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(hours2) ? hours2.value = $event : null),
            modelModifiers: { number: true },
            options: unref(hourOptions),
            class: "vc-time-select-hours",
            "align-right": ""
          }, null, 8, ["modelValue", "options"]),
          unref(timeAccuracy) > 1 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _hoisted_7,
            createVNode(_sfc_main$4, {
              modelValue: unref(minutes),
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isRef(minutes) ? minutes.value = $event : null),
              modelModifiers: { number: true },
              options: unref(options).minutes,
              class: "vc-time-select-minutes",
              "align-left": unref(timeAccuracy) === 2
            }, null, 8, ["modelValue", "options", "align-left"])
          ], 64)) : createCommentVNode("", true),
          unref(timeAccuracy) > 2 ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            _hoisted_8,
            createVNode(_sfc_main$4, {
              modelValue: unref(seconds),
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isRef(seconds) ? seconds.value = $event : null),
              modelModifiers: { number: true },
              options: unref(options).seconds,
              class: "vc-time-select-seconds",
              "align-left": unref(timeAccuracy) === 3
            }, null, 8, ["modelValue", "options", "align-left"])
          ], 64)) : createCommentVNode("", true),
          unref(timeAccuracy) > 3 ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            _hoisted_9,
            createVNode(_sfc_main$4, {
              modelValue: unref(milliseconds),
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => isRef(milliseconds) ? milliseconds.value = $event : null),
              modelModifiers: { number: true },
              options: unref(options).milliseconds,
              class: "vc-time-select-milliseconds",
              "align-left": ""
            }, null, 8, ["modelValue", "options"])
          ], 64)) : createCommentVNode("", true),
          !unref(is24hr) ? (openBlock(), createBlock(_sfc_main$4, {
            key: 3,
            modelValue: unref(isAM),
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => isRef(isAM) ? isAM.value = $event : null),
            options: unref(isAMOptions)
          }, null, 8, ["modelValue", "options"])) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
});
const TimePicker_vue_vue_type_style_index_0_lang = "";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DatePickerBase",
  setup(__props) {
    const {
      attributes,
      calendarRef,
      color,
      displayMode,
      isDateTimeMode,
      isTimeMode,
      isRange,
      onDayClick,
      onDayMouseEnter,
      onDayKeydown
    } = useDatePicker();
    const positions = isRange.value ? [0, 1] : [0];
    return (_ctx, _cache) => {
      return unref(isTimeMode) ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`vc-container vc-bordered vc-${unref(color)} vc-${unref(displayMode)}`)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(positions), (position) => {
          return openBlock(), createBlock(_sfc_main$3, {
            key: position,
            position
          }, null, 8, ["position"]);
        }), 128))
      ], 2)) : (openBlock(), createBlock(Calendar, {
        key: 1,
        attributes: unref(attributes),
        ref_key: "calendarRef",
        ref: calendarRef,
        onDayclick: unref(onDayClick),
        onDaymouseenter: unref(onDayMouseEnter),
        onDaykeydown: unref(onDayKeydown)
      }, {
        footer: withCtx(() => [
          unref(isDateTimeMode) ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(unref(positions), (position) => {
            return openBlock(), createBlock(_sfc_main$3, {
              key: position,
              position
            }, null, 8, ["position"]);
          }), 128)) : createCommentVNode("", true),
          createVNode(_sfc_main$i, { name: "dp-footer" })
        ]),
        _: 1
      }, 8, ["attributes", "onDayclick", "onDaymouseenter", "onDaykeydown"]));
    };
  }
});
const __default__ = {
  inheritAttrs: false
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "DatePickerPopover",
  setup(__props) {
    const {
      datePickerPopoverId,
      color,
      displayMode,
      popoverRef,
      onPopoverBeforeShow,
      onPopoverAfterShow,
      onPopoverBeforeHide,
      onPopoverAfterHide
    } = useDatePicker();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Popover, {
        id: unref(datePickerPopoverId),
        placement: "bottom-start",
        class: normalizeClass(`vc-date-picker-content vc-${unref(color)} vc-${unref(displayMode)}`),
        ref_key: "popoverRef",
        ref: popoverRef,
        onBeforeShow: unref(onPopoverBeforeShow),
        onAfterShow: unref(onPopoverAfterShow),
        onBeforeHide: unref(onPopoverBeforeHide),
        onAfterHide: unref(onPopoverAfterHide)
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, normalizeProps(guardReactiveProps(_ctx.$attrs)), null, 16)
        ]),
        _: 1
      }, 8, ["id", "class", "onBeforeShow", "onAfterShow", "onBeforeHide", "onAfterHide"]);
    };
  }
});
const _sfc_main = defineComponent({
  inheritAttrs: false,
  emits,
  props: propsDef,
  components: { DatePickerBase: _sfc_main$2, DatePickerPopover: _sfc_main$1 },
  setup(props, ctx) {
    const datePicker = createDatePicker(props, ctx);
    const slotCtx = reactive(omit(datePicker, "calendarRef", "popoverRef"));
    return { ...datePicker, slotCtx };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DatePickerPopover = resolveComponent("DatePickerPopover");
  const _component_DatePickerBase = resolveComponent("DatePickerBase");
  return _ctx.$slots.default ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.slotCtx))),
    createVNode(_component_DatePickerPopover, normalizeProps(guardReactiveProps(_ctx.$attrs)), null, 16)
  ], 64)) : (openBlock(), createBlock(_component_DatePickerBase, normalizeProps(mergeProps({ key: 1 }, _ctx.$attrs)), null, 16));
}
const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Calendar,
  DatePicker,
  Popover,
  PopoverRow: _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const index$1 = "";
const install = (app, defaults2 = {}) => {
  app.use(setupDefaults, defaults2);
  const prefix = app.config.globalProperties.$VCalendar.componentPrefix;
  for (const componentKey in components) {
    const component = components[componentKey];
    app.component(`${prefix}${componentKey}`, component);
  }
};
const index = { install };
export {
  Calendar,
  DatePicker,
  Popover,
  _sfc_main$j as PopoverRow,
  createCalendar,
  createDatePicker,
  index as default,
  popoverDirective,
  setupDefaults as setupCalendar,
  useCalendar,
  useDatePicker
};
//# sourceMappingURL=index.js.map
