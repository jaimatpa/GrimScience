var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js
var _globalThis;
var init_globalThis = __esm({
  "node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js"() {
    _globalThis = typeof globalThis === "object" ? globalThis : global;
  }
});

// node_modules/@opentelemetry/api/build/esm/platform/node/index.js
var init_node = __esm({
  "node_modules/@opentelemetry/api/build/esm/platform/node/index.js"() {
    init_globalThis();
  }
});

// node_modules/@opentelemetry/api/build/esm/platform/index.js
var init_platform = __esm({
  "node_modules/@opentelemetry/api/build/esm/platform/index.js"() {
    init_node();
  }
});

// node_modules/@opentelemetry/api/build/esm/version.js
var VERSION;
var init_version = __esm({
  "node_modules/@opentelemetry/api/build/esm/version.js"() {
    VERSION = "1.8.0";
  }
});

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
function _makeCompatibilityCheck(ownVersion) {
  var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  var rejectedVersions = /* @__PURE__ */ new Set();
  var myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return function() {
      return false;
    };
  }
  var ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    var globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    var globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var re, isCompatible;
var init_semver = __esm({
  "node_modules/@opentelemetry/api/build/esm/internal/semver.js"() {
    init_version();
    re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
    isCompatible = _makeCompatibilityCheck(VERSION);
  }
});

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
function registerGlobal(type, instance, diag3, allowOverride) {
  var _a;
  if (allowOverride === void 0) {
    allowOverride = false;
  }
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
    version: VERSION
  };
  if (!allowOverride && api[type]) {
    var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
    diag3.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
    diag3.error(err.stack || err.message);
    return false;
  }
  api[type] = instance;
  diag3.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
  return true;
}
function getGlobal(type) {
  var _a, _b;
  var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag3) {
  diag3.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type];
  }
}
var major, GLOBAL_OPENTELEMETRY_API_KEY, _global;
var init_global_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/internal/global-utils.js"() {
    init_platform();
    init_version();
    init_semver();
    major = VERSION.split(".")[0];
    GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
    _global = _globalThis;
  }
});

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
function logProxy(funcName, namespace, args) {
  var logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  args.unshift(namespace);
  return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
}
var __read, __spreadArray, DiagComponentLogger;
var init_ComponentLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js"() {
    init_global_utils();
    __read = function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    __spreadArray = function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    DiagComponentLogger = /** @class */
    function() {
      function DiagComponentLogger2(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      DiagComponentLogger2.prototype.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("debug", this._namespace, args);
      };
      DiagComponentLogger2.prototype.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("error", this._namespace, args);
      };
      DiagComponentLogger2.prototype.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("info", this._namespace, args);
      };
      DiagComponentLogger2.prototype.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("warn", this._namespace, args);
      };
      DiagComponentLogger2.prototype.verbose = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("verbose", this._namespace, args);
      };
      return DiagComponentLogger2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/diag/types.js
var DiagLogLevel;
var init_types = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/types.js"() {
    (function(DiagLogLevel2) {
      DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
      DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
      DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
      DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
      DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
      DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
      DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
    })(DiagLogLevel || (DiagLogLevel = {}));
  }
});

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    var theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}
var init_logLevelLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js"() {
    init_types();
  }
});

// node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read2, __spreadArray2, API_NAME, DiagAPI;
var init_diag = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/diag.js"() {
    init_ComponentLogger();
    init_logLevelLogger();
    init_types();
    init_global_utils();
    __read2 = function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    __spreadArray2 = function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    API_NAME = "diag";
    DiagAPI = /** @class */
    function() {
      function DiagAPI2() {
        function _logProxy(funcName) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var logger = getGlobal("diag");
            if (!logger)
              return;
            return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
          };
        }
        var self2 = this;
        var setLogger = function(logger, optionsOrLogLevel) {
          var _a, _b, _c;
          if (optionsOrLogLevel === void 0) {
            optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
          }
          if (logger === self2) {
            var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          var oldLogger = getGlobal("diag");
          var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn("Current logger will be overwritten from " + stack);
            newLogger.warn("Current logger will overwrite one already registered from " + stack);
          }
          return registerGlobal("diag", newLogger, self2, true);
        };
        self2.setLogger = setLogger;
        self2.disable = function() {
          unregisterGlobal(API_NAME, self2);
        };
        self2.createComponentLogger = function(options) {
          return new DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
      DiagAPI2.instance = function() {
        if (!this._instance) {
          this._instance = new DiagAPI2();
        }
        return this._instance;
      };
      return DiagAPI2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
var __read3, __values, BaggageImpl;
var init_baggage_impl = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js"() {
    __read3 = function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    __values = function(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    BaggageImpl = /** @class */
    function() {
      function BaggageImpl2(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      BaggageImpl2.prototype.getEntry = function(key) {
        var entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      };
      BaggageImpl2.prototype.getAllEntries = function() {
        return Array.from(this._entries.entries()).map(function(_a) {
          var _b = __read3(_a, 2), k = _b[0], v = _b[1];
          return [k, v];
        });
      };
      BaggageImpl2.prototype.setEntry = function(key, entry) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntry = function(key) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntries = function() {
        var e_1, _a;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl2(this._entries);
        try {
          for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            newBaggage._entries.delete(key);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return))
              _a.call(keys_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return newBaggage;
      };
      BaggageImpl2.prototype.clear = function() {
        return new BaggageImpl2();
      };
      return BaggageImpl2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js
var baggageEntryMetadataSymbol;
var init_symbol = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js"() {
    baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
  }
});

// node_modules/@opentelemetry/api/build/esm/baggage/utils.js
function createBaggage(entries) {
  if (entries === void 0) {
    entries = {};
  }
  return new BaggageImpl(new Map(Object.entries(entries)));
}
function baggageEntryMetadataFromString(str) {
  if (typeof str !== "string") {
    diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
    str = "";
  }
  return {
    __TYPE__: baggageEntryMetadataSymbol,
    toString: function() {
      return str;
    }
  };
}
var diag;
var init_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/utils.js"() {
    init_diag();
    init_baggage_impl();
    init_symbol();
    diag = DiagAPI.instance();
  }
});

// node_modules/@opentelemetry/api/build/esm/context/context.js
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext, ROOT_CONTEXT;
var init_context = __esm({
  "node_modules/@opentelemetry/api/build/esm/context/context.js"() {
    BaseContext = /** @class */
    /* @__PURE__ */ function() {
      function BaseContext2(parentContext) {
        var self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = function(key) {
          return self2._currentContext.get(key);
        };
        self2.setValue = function(key, value) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.set(key, value);
          return context2;
        };
        self2.deleteValue = function(key) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.delete(key);
          return context2;
        };
      }
      return BaseContext2;
    }();
    ROOT_CONTEXT = new BaseContext();
  }
});

// node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js
var consoleMap, DiagConsoleLogger;
var init_consoleLogger = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js"() {
    consoleMap = [
      { n: "error", c: "error" },
      { n: "warn", c: "warn" },
      { n: "info", c: "info" },
      { n: "debug", c: "debug" },
      { n: "verbose", c: "trace" }
    ];
    DiagConsoleLogger = /** @class */
    /* @__PURE__ */ function() {
      function DiagConsoleLogger2() {
        function _consoleFunc(funcName) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (console) {
              var theFunc = console[funcName];
              if (typeof theFunc !== "function") {
                theFunc = console.log;
              }
              if (typeof theFunc === "function") {
                return theFunc.apply(console, args);
              }
            }
          };
        }
        for (var i = 0; i < consoleMap.length; i++) {
          this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
      }
      return DiagConsoleLogger2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
var defaultTextMapGetter, defaultTextMapSetter;
var init_TextMapPropagator = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js"() {
    defaultTextMapGetter = {
      get: function(carrier, key) {
        if (carrier == null) {
          return void 0;
        }
        return carrier[key];
      },
      keys: function(carrier) {
        if (carrier == null) {
          return [];
        }
        return Object.keys(carrier);
      }
    };
    defaultTextMapSetter = {
      set: function(carrier, key, value) {
        if (carrier == null) {
          return;
        }
        carrier[key] = value;
      }
    };
  }
});

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read4, __spreadArray3, NoopContextManager;
var init_NoopContextManager = __esm({
  "node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js"() {
    init_context();
    __read4 = function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    __spreadArray3 = function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    NoopContextManager = /** @class */
    function() {
      function NoopContextManager2() {
      }
      NoopContextManager2.prototype.active = function() {
        return ROOT_CONTEXT;
      };
      NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray3([thisArg], __read4(args), false));
      };
      NoopContextManager2.prototype.bind = function(_context, target) {
        return target;
      };
      NoopContextManager2.prototype.enable = function() {
        return this;
      };
      NoopContextManager2.prototype.disable = function() {
        return this;
      };
      return NoopContextManager2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/api/context.js
var __read5, __spreadArray4, API_NAME2, NOOP_CONTEXT_MANAGER, ContextAPI;
var init_context2 = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/context.js"() {
    init_NoopContextManager();
    init_global_utils();
    init_diag();
    __read5 = function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    __spreadArray4 = function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    API_NAME2 = "context";
    NOOP_CONTEXT_MANAGER = new NoopContextManager();
    ContextAPI = /** @class */
    function() {
      function ContextAPI2() {
      }
      ContextAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new ContextAPI2();
        }
        return this._instance;
      };
      ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
        return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
      };
      ContextAPI2.prototype.active = function() {
        return this._getContextManager().active();
      };
      ContextAPI2.prototype.with = function(context2, fn, thisArg) {
        var _a;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return (_a = this._getContextManager()).with.apply(_a, __spreadArray4([context2, fn, thisArg], __read5(args), false));
      };
      ContextAPI2.prototype.bind = function(context2, target) {
        return this._getContextManager().bind(context2, target);
      };
      ContextAPI2.prototype._getContextManager = function() {
        return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
      };
      ContextAPI2.prototype.disable = function() {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME2, DiagAPI.instance());
      };
      return ContextAPI2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
var init_trace_flags = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js"() {
    (function(TraceFlags2) {
      TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
      TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
    })(TraceFlags || (TraceFlags = {}));
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID, INVALID_TRACEID, INVALID_SPAN_CONTEXT;
var init_invalid_span_constants = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js"() {
    init_trace_flags();
    INVALID_SPANID = "0000000000000000";
    INVALID_TRACEID = "00000000000000000000000000000000";
    INVALID_SPAN_CONTEXT = {
      traceId: INVALID_TRACEID,
      spanId: INVALID_SPANID,
      traceFlags: TraceFlags.NONE
    };
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var NonRecordingSpan;
var init_NonRecordingSpan = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js"() {
    init_invalid_span_constants();
    NonRecordingSpan = /** @class */
    function() {
      function NonRecordingSpan2(_spanContext) {
        if (_spanContext === void 0) {
          _spanContext = INVALID_SPAN_CONTEXT;
        }
        this._spanContext = _spanContext;
      }
      NonRecordingSpan2.prototype.spanContext = function() {
        return this._spanContext;
      };
      NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
        return this;
      };
      NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.setStatus = function(_status) {
        return this;
      };
      NonRecordingSpan2.prototype.updateName = function(_name) {
        return this;
      };
      NonRecordingSpan2.prototype.end = function(_endTime) {
      };
      NonRecordingSpan2.prototype.isRecording = function() {
        return false;
      };
      NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
      };
      return NonRecordingSpan2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
function getSpan(context2) {
  return context2.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context2, span) {
  return context2.setValue(SPAN_KEY, span);
}
function deleteSpan(context2) {
  return context2.deleteValue(SPAN_KEY);
}
function setSpanContext(context2, spanContext) {
  return setSpan(context2, new NonRecordingSpan(spanContext));
}
function getSpanContext(context2) {
  var _a;
  return (_a = getSpan(context2)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
var SPAN_KEY;
var init_context_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/context-utils.js"() {
    init_context();
    init_NonRecordingSpan();
    init_context2();
    SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
function isValidTraceId(traceId) {
  return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}
var VALID_TRACEID_REGEX, VALID_SPANID_REGEX;
var init_spancontext_utils = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js"() {
    init_invalid_span_constants();
    init_NonRecordingSpan();
    VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
    VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}
var contextApi, NoopTracer;
var init_NoopTracer = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js"() {
    init_context2();
    init_context_utils();
    init_NonRecordingSpan();
    init_spancontext_utils();
    contextApi = ContextAPI.getInstance();
    NoopTracer = /** @class */
    function() {
      function NoopTracer2() {
      }
      NoopTracer2.prototype.startSpan = function(name, options, context2) {
        if (context2 === void 0) {
          context2 = contextApi.active();
        }
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan();
        }
        var parentFromContext = context2 && getSpanContext(context2);
        if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
          return new NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan();
        }
      };
      NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      };
      return NoopTracer2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER, ProxyTracer;
var init_ProxyTracer = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js"() {
    init_NoopTracer();
    NOOP_TRACER = new NoopTracer();
    ProxyTracer = /** @class */
    function() {
      function ProxyTracer2(_provider, name, version2, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version2;
        this.options = options;
      }
      ProxyTracer2.prototype.startSpan = function(name, options, context2) {
        return this._getTracer().startSpan(name, options, context2);
      };
      ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      };
      ProxyTracer2.prototype._getTracer = function() {
        if (this._delegate) {
          return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
          return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
      };
      return ProxyTracer2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var NoopTracerProvider;
var init_NoopTracerProvider = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js"() {
    init_NoopTracer();
    NoopTracerProvider = /** @class */
    function() {
      function NoopTracerProvider2() {
      }
      NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
        return new NoopTracer();
      };
      return NoopTracerProvider2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER, ProxyTracerProvider;
var init_ProxyTracerProvider = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js"() {
    init_ProxyTracer();
    init_NoopTracerProvider();
    NOOP_TRACER_PROVIDER = new NoopTracerProvider();
    ProxyTracerProvider = /** @class */
    function() {
      function ProxyTracerProvider2() {
      }
      ProxyTracerProvider2.prototype.getTracer = function(name, version2, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version2, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version2, options);
      };
      ProxyTracerProvider2.prototype.getDelegate = function() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      };
      ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
      };
      ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version2, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version2, options);
      };
      return ProxyTracerProvider2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js
var SamplingDecision;
var init_SamplingResult = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js"() {
    (function(SamplingDecision3) {
      SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
      SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
      SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
    })(SamplingDecision || (SamplingDecision = {}));
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
var init_span_kind = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/span_kind.js"() {
    (function(SpanKind2) {
      SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
      SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
      SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
      SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
      SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
    })(SpanKind || (SpanKind = {}));
  }
});

// node_modules/@opentelemetry/api/build/esm/trace/status.js
var SpanStatusCode;
var init_status = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace/status.js"() {
    (function(SpanStatusCode2) {
      SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
      SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
      SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
    })(SpanStatusCode || (SpanStatusCode = {}));
  }
});

// node_modules/@opentelemetry/api/build/esm/context-api.js
var context;
var init_context_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/context-api.js"() {
    init_context2();
    context = ContextAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/esm/diag-api.js
var diag2;
var init_diag_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/diag-api.js"() {
    init_diag();
    diag2 = DiagAPI.instance();
  }
});

// node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
var NoopTextMapPropagator;
var init_NoopTextMapPropagator = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js"() {
    NoopTextMapPropagator = /** @class */
    function() {
      function NoopTextMapPropagator2() {
      }
      NoopTextMapPropagator2.prototype.inject = function(_context, _carrier) {
      };
      NoopTextMapPropagator2.prototype.extract = function(context2, _carrier) {
        return context2;
      };
      NoopTextMapPropagator2.prototype.fields = function() {
        return [];
      };
      return NoopTextMapPropagator2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
function getBaggage(context2) {
  return context2.getValue(BAGGAGE_KEY) || void 0;
}
function getActiveBaggage() {
  return getBaggage(ContextAPI.getInstance().active());
}
function setBaggage(context2, baggage) {
  return context2.setValue(BAGGAGE_KEY, baggage);
}
function deleteBaggage(context2) {
  return context2.deleteValue(BAGGAGE_KEY);
}
var BAGGAGE_KEY;
var init_context_helpers = __esm({
  "node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js"() {
    init_context2();
    init_context();
    BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
  }
});

// node_modules/@opentelemetry/api/build/esm/api/propagation.js
var API_NAME3, NOOP_TEXT_MAP_PROPAGATOR, PropagationAPI;
var init_propagation = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/propagation.js"() {
    init_global_utils();
    init_NoopTextMapPropagator();
    init_TextMapPropagator();
    init_context_helpers();
    init_utils();
    init_diag();
    API_NAME3 = "propagation";
    NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
    PropagationAPI = /** @class */
    function() {
      function PropagationAPI2() {
        this.createBaggage = createBaggage;
        this.getBaggage = getBaggage;
        this.getActiveBaggage = getActiveBaggage;
        this.setBaggage = setBaggage;
        this.deleteBaggage = deleteBaggage;
      }
      PropagationAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new PropagationAPI2();
        }
        return this._instance;
      };
      PropagationAPI2.prototype.setGlobalPropagator = function(propagator) {
        return registerGlobal(API_NAME3, propagator, DiagAPI.instance());
      };
      PropagationAPI2.prototype.inject = function(context2, carrier, setter) {
        if (setter === void 0) {
          setter = defaultTextMapSetter;
        }
        return this._getGlobalPropagator().inject(context2, carrier, setter);
      };
      PropagationAPI2.prototype.extract = function(context2, carrier, getter) {
        if (getter === void 0) {
          getter = defaultTextMapGetter;
        }
        return this._getGlobalPropagator().extract(context2, carrier, getter);
      };
      PropagationAPI2.prototype.fields = function() {
        return this._getGlobalPropagator().fields();
      };
      PropagationAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME3, DiagAPI.instance());
      };
      PropagationAPI2.prototype._getGlobalPropagator = function() {
        return getGlobal(API_NAME3) || NOOP_TEXT_MAP_PROPAGATOR;
      };
      return PropagationAPI2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/propagation-api.js
var propagation;
var init_propagation_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/propagation-api.js"() {
    init_propagation();
    propagation = PropagationAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME4, TraceAPI;
var init_trace = __esm({
  "node_modules/@opentelemetry/api/build/esm/api/trace.js"() {
    init_global_utils();
    init_ProxyTracerProvider();
    init_spancontext_utils();
    init_context_utils();
    init_diag();
    API_NAME4 = "trace";
    TraceAPI = /** @class */
    function() {
      function TraceAPI2() {
        this._proxyTracerProvider = new ProxyTracerProvider();
        this.wrapSpanContext = wrapSpanContext;
        this.isSpanContextValid = isSpanContextValid;
        this.deleteSpan = deleteSpan;
        this.getSpan = getSpan;
        this.getActiveSpan = getActiveSpan;
        this.getSpanContext = getSpanContext;
        this.setSpan = setSpan;
        this.setSpanContext = setSpanContext;
      }
      TraceAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new TraceAPI2();
        }
        return this._instance;
      };
      TraceAPI2.prototype.setGlobalTracerProvider = function(provider2) {
        var success = registerGlobal(API_NAME4, this._proxyTracerProvider, DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider2);
        }
        return success;
      };
      TraceAPI2.prototype.getTracerProvider = function() {
        return getGlobal(API_NAME4) || this._proxyTracerProvider;
      };
      TraceAPI2.prototype.getTracer = function(name, version2) {
        return this.getTracerProvider().getTracer(name, version2);
      };
      TraceAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME4, DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider();
      };
      return TraceAPI2;
    }();
  }
});

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace;
var init_trace_api = __esm({
  "node_modules/@opentelemetry/api/build/esm/trace-api.js"() {
    init_trace();
    trace = TraceAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/esm/index.js
var init_esm = __esm({
  "node_modules/@opentelemetry/api/build/esm/index.js"() {
    init_utils();
    init_context();
    init_consoleLogger();
    init_types();
    init_SamplingResult();
    init_span_kind();
    init_status();
    init_trace_flags();
    init_spancontext_utils();
    init_invalid_span_constants();
    init_context_api();
    init_diag_api();
    init_propagation_api();
    init_trace_api();
  }
});

// src/telemetry/instrumentation.ts
init_esm();
import { env as env2, version } from "node:process";

// node_modules/@opentelemetry/resources/build/esnext/Resource.js
init_esm();

// node_modules/@opentelemetry/semantic-conventions/build/esnext/internal/utils.js
// @__NO_SIDE_EFFECTS__
function createConstMap(values) {
  let res = {};
  const len = values.length;
  for (let lp = 0; lp < len; lp++) {
    const val = values[lp];
    if (val) {
      res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
    }
  }
  return res;
}

// node_modules/@opentelemetry/semantic-conventions/build/esnext/trace/SemanticAttributes.js
var TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
var TMP_DB_SYSTEM = "db.system";
var TMP_DB_CONNECTION_STRING = "db.connection_string";
var TMP_DB_USER = "db.user";
var TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
var TMP_DB_NAME = "db.name";
var TMP_DB_STATEMENT = "db.statement";
var TMP_DB_OPERATION = "db.operation";
var TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
var TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
var TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
var TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
var TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
var TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
var TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
var TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
var TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
var TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
var TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
var TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
var TMP_DB_SQL_TABLE = "db.sql.table";
var TMP_EXCEPTION_TYPE = "exception.type";
var TMP_EXCEPTION_MESSAGE = "exception.message";
var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
var TMP_EXCEPTION_ESCAPED = "exception.escaped";
var TMP_FAAS_TRIGGER = "faas.trigger";
var TMP_FAAS_EXECUTION = "faas.execution";
var TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
var TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
var TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
var TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
var TMP_FAAS_TIME = "faas.time";
var TMP_FAAS_CRON = "faas.cron";
var TMP_FAAS_COLDSTART = "faas.coldstart";
var TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
var TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
var TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
var TMP_NET_TRANSPORT = "net.transport";
var TMP_NET_PEER_IP = "net.peer.ip";
var TMP_NET_PEER_PORT = "net.peer.port";
var TMP_NET_PEER_NAME = "net.peer.name";
var TMP_NET_HOST_IP = "net.host.ip";
var TMP_NET_HOST_PORT = "net.host.port";
var TMP_NET_HOST_NAME = "net.host.name";
var TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
var TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
var TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
var TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
var TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
var TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
var TMP_PEER_SERVICE = "peer.service";
var TMP_ENDUSER_ID = "enduser.id";
var TMP_ENDUSER_ROLE = "enduser.role";
var TMP_ENDUSER_SCOPE = "enduser.scope";
var TMP_THREAD_ID = "thread.id";
var TMP_THREAD_NAME = "thread.name";
var TMP_CODE_FUNCTION = "code.function";
var TMP_CODE_NAMESPACE = "code.namespace";
var TMP_CODE_FILEPATH = "code.filepath";
var TMP_CODE_LINENO = "code.lineno";
var TMP_HTTP_METHOD = "http.method";
var TMP_HTTP_URL = "http.url";
var TMP_HTTP_TARGET = "http.target";
var TMP_HTTP_HOST = "http.host";
var TMP_HTTP_SCHEME = "http.scheme";
var TMP_HTTP_STATUS_CODE = "http.status_code";
var TMP_HTTP_FLAVOR = "http.flavor";
var TMP_HTTP_USER_AGENT = "http.user_agent";
var TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
var TMP_HTTP_SERVER_NAME = "http.server_name";
var TMP_HTTP_ROUTE = "http.route";
var TMP_HTTP_CLIENT_IP = "http.client_ip";
var TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
var TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
var TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
var TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
var TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
var TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
var TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
var TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
var TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
var TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
var TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
var TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
var TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
var TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
var TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
var TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
var TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
var TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
var TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
var TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
var TMP_MESSAGING_SYSTEM = "messaging.system";
var TMP_MESSAGING_DESTINATION = "messaging.destination";
var TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
var TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
var TMP_MESSAGING_PROTOCOL = "messaging.protocol";
var TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
var TMP_MESSAGING_URL = "messaging.url";
var TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
var TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
var TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
var TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
var TMP_MESSAGING_OPERATION = "messaging.operation";
var TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
var TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
var TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
var TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
var TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
var TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
var TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
var TMP_RPC_SYSTEM = "rpc.system";
var TMP_RPC_SERVICE = "rpc.service";
var TMP_RPC_METHOD = "rpc.method";
var TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
var TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
var TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
var TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
var TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
var TMP_MESSAGE_TYPE = "message.type";
var TMP_MESSAGE_ID = "message.id";
var TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
var TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
var SemanticAttributes = /* @__PURE__ */ createConstMap([
  TMP_AWS_LAMBDA_INVOKED_ARN,
  TMP_DB_SYSTEM,
  TMP_DB_CONNECTION_STRING,
  TMP_DB_USER,
  TMP_DB_JDBC_DRIVER_CLASSNAME,
  TMP_DB_NAME,
  TMP_DB_STATEMENT,
  TMP_DB_OPERATION,
  TMP_DB_MSSQL_INSTANCE_NAME,
  TMP_DB_CASSANDRA_KEYSPACE,
  TMP_DB_CASSANDRA_PAGE_SIZE,
  TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
  TMP_DB_CASSANDRA_TABLE,
  TMP_DB_CASSANDRA_IDEMPOTENCE,
  TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
  TMP_DB_CASSANDRA_COORDINATOR_ID,
  TMP_DB_CASSANDRA_COORDINATOR_DC,
  TMP_DB_HBASE_NAMESPACE,
  TMP_DB_REDIS_DATABASE_INDEX,
  TMP_DB_MONGODB_COLLECTION,
  TMP_DB_SQL_TABLE,
  TMP_EXCEPTION_TYPE,
  TMP_EXCEPTION_MESSAGE,
  TMP_EXCEPTION_STACKTRACE,
  TMP_EXCEPTION_ESCAPED,
  TMP_FAAS_TRIGGER,
  TMP_FAAS_EXECUTION,
  TMP_FAAS_DOCUMENT_COLLECTION,
  TMP_FAAS_DOCUMENT_OPERATION,
  TMP_FAAS_DOCUMENT_TIME,
  TMP_FAAS_DOCUMENT_NAME,
  TMP_FAAS_TIME,
  TMP_FAAS_CRON,
  TMP_FAAS_COLDSTART,
  TMP_FAAS_INVOKED_NAME,
  TMP_FAAS_INVOKED_PROVIDER,
  TMP_FAAS_INVOKED_REGION,
  TMP_NET_TRANSPORT,
  TMP_NET_PEER_IP,
  TMP_NET_PEER_PORT,
  TMP_NET_PEER_NAME,
  TMP_NET_HOST_IP,
  TMP_NET_HOST_PORT,
  TMP_NET_HOST_NAME,
  TMP_NET_HOST_CONNECTION_TYPE,
  TMP_NET_HOST_CONNECTION_SUBTYPE,
  TMP_NET_HOST_CARRIER_NAME,
  TMP_NET_HOST_CARRIER_MCC,
  TMP_NET_HOST_CARRIER_MNC,
  TMP_NET_HOST_CARRIER_ICC,
  TMP_PEER_SERVICE,
  TMP_ENDUSER_ID,
  TMP_ENDUSER_ROLE,
  TMP_ENDUSER_SCOPE,
  TMP_THREAD_ID,
  TMP_THREAD_NAME,
  TMP_CODE_FUNCTION,
  TMP_CODE_NAMESPACE,
  TMP_CODE_FILEPATH,
  TMP_CODE_LINENO,
  TMP_HTTP_METHOD,
  TMP_HTTP_URL,
  TMP_HTTP_TARGET,
  TMP_HTTP_HOST,
  TMP_HTTP_SCHEME,
  TMP_HTTP_STATUS_CODE,
  TMP_HTTP_FLAVOR,
  TMP_HTTP_USER_AGENT,
  TMP_HTTP_REQUEST_CONTENT_LENGTH,
  TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
  TMP_HTTP_RESPONSE_CONTENT_LENGTH,
  TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
  TMP_HTTP_SERVER_NAME,
  TMP_HTTP_ROUTE,
  TMP_HTTP_CLIENT_IP,
  TMP_AWS_DYNAMODB_TABLE_NAMES,
  TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
  TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
  TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
  TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
  TMP_AWS_DYNAMODB_CONSISTENT_READ,
  TMP_AWS_DYNAMODB_PROJECTION,
  TMP_AWS_DYNAMODB_LIMIT,
  TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
  TMP_AWS_DYNAMODB_INDEX_NAME,
  TMP_AWS_DYNAMODB_SELECT,
  TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
  TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
  TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
  TMP_AWS_DYNAMODB_TABLE_COUNT,
  TMP_AWS_DYNAMODB_SCAN_FORWARD,
  TMP_AWS_DYNAMODB_SEGMENT,
  TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
  TMP_AWS_DYNAMODB_COUNT,
  TMP_AWS_DYNAMODB_SCANNED_COUNT,
  TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
  TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
  TMP_MESSAGING_SYSTEM,
  TMP_MESSAGING_DESTINATION,
  TMP_MESSAGING_DESTINATION_KIND,
  TMP_MESSAGING_TEMP_DESTINATION,
  TMP_MESSAGING_PROTOCOL,
  TMP_MESSAGING_PROTOCOL_VERSION,
  TMP_MESSAGING_URL,
  TMP_MESSAGING_MESSAGE_ID,
  TMP_MESSAGING_CONVERSATION_ID,
  TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
  TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
  TMP_MESSAGING_OPERATION,
  TMP_MESSAGING_CONSUMER_ID,
  TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
  TMP_MESSAGING_KAFKA_MESSAGE_KEY,
  TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
  TMP_MESSAGING_KAFKA_CLIENT_ID,
  TMP_MESSAGING_KAFKA_PARTITION,
  TMP_MESSAGING_KAFKA_TOMBSTONE,
  TMP_RPC_SYSTEM,
  TMP_RPC_SERVICE,
  TMP_RPC_METHOD,
  TMP_RPC_GRPC_STATUS_CODE,
  TMP_RPC_JSONRPC_VERSION,
  TMP_RPC_JSONRPC_REQUEST_ID,
  TMP_RPC_JSONRPC_ERROR_CODE,
  TMP_RPC_JSONRPC_ERROR_MESSAGE,
  TMP_MESSAGE_TYPE,
  TMP_MESSAGE_ID,
  TMP_MESSAGE_COMPRESSED_SIZE,
  TMP_MESSAGE_UNCOMPRESSED_SIZE
]);

// node_modules/@opentelemetry/semantic-conventions/build/esnext/resource/SemanticResourceAttributes.js
var TMP_CLOUD_PROVIDER = "cloud.provider";
var TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
var TMP_CLOUD_REGION = "cloud.region";
var TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
var TMP_CLOUD_PLATFORM = "cloud.platform";
var TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
var TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
var TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
var TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
var TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
var TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
var TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
var TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
var TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
var TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
var TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
var TMP_CONTAINER_NAME = "container.name";
var TMP_CONTAINER_ID = "container.id";
var TMP_CONTAINER_RUNTIME = "container.runtime";
var TMP_CONTAINER_IMAGE_NAME = "container.image.name";
var TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
var TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
var TMP_DEVICE_ID = "device.id";
var TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
var TMP_DEVICE_MODEL_NAME = "device.model.name";
var TMP_FAAS_NAME = "faas.name";
var TMP_FAAS_ID = "faas.id";
var TMP_FAAS_VERSION = "faas.version";
var TMP_FAAS_INSTANCE = "faas.instance";
var TMP_FAAS_MAX_MEMORY = "faas.max_memory";
var TMP_HOST_ID = "host.id";
var TMP_HOST_NAME = "host.name";
var TMP_HOST_TYPE = "host.type";
var TMP_HOST_ARCH = "host.arch";
var TMP_HOST_IMAGE_NAME = "host.image.name";
var TMP_HOST_IMAGE_ID = "host.image.id";
var TMP_HOST_IMAGE_VERSION = "host.image.version";
var TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
var TMP_K8S_NODE_NAME = "k8s.node.name";
var TMP_K8S_NODE_UID = "k8s.node.uid";
var TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
var TMP_K8S_POD_UID = "k8s.pod.uid";
var TMP_K8S_POD_NAME = "k8s.pod.name";
var TMP_K8S_CONTAINER_NAME = "k8s.container.name";
var TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
var TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
var TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
var TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
var TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
var TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
var TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
var TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
var TMP_K8S_JOB_UID = "k8s.job.uid";
var TMP_K8S_JOB_NAME = "k8s.job.name";
var TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
var TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
var TMP_OS_TYPE = "os.type";
var TMP_OS_DESCRIPTION = "os.description";
var TMP_OS_NAME = "os.name";
var TMP_OS_VERSION = "os.version";
var TMP_PROCESS_PID = "process.pid";
var TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
var TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
var TMP_PROCESS_COMMAND = "process.command";
var TMP_PROCESS_COMMAND_LINE = "process.command_line";
var TMP_PROCESS_COMMAND_ARGS = "process.command_args";
var TMP_PROCESS_OWNER = "process.owner";
var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
var TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
var TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
var TMP_SERVICE_NAME = "service.name";
var TMP_SERVICE_NAMESPACE = "service.namespace";
var TMP_SERVICE_INSTANCE_ID = "service.instance.id";
var TMP_SERVICE_VERSION = "service.version";
var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
var TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
var TMP_WEBENGINE_NAME = "webengine.name";
var TMP_WEBENGINE_VERSION = "webengine.version";
var TMP_WEBENGINE_DESCRIPTION = "webengine.description";
var SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
var SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
var SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
var SemanticResourceAttributes = /* @__PURE__ */ createConstMap([
  TMP_CLOUD_PROVIDER,
  TMP_CLOUD_ACCOUNT_ID,
  TMP_CLOUD_REGION,
  TMP_CLOUD_AVAILABILITY_ZONE,
  TMP_CLOUD_PLATFORM,
  TMP_AWS_ECS_CONTAINER_ARN,
  TMP_AWS_ECS_CLUSTER_ARN,
  TMP_AWS_ECS_LAUNCHTYPE,
  TMP_AWS_ECS_TASK_ARN,
  TMP_AWS_ECS_TASK_FAMILY,
  TMP_AWS_ECS_TASK_REVISION,
  TMP_AWS_EKS_CLUSTER_ARN,
  TMP_AWS_LOG_GROUP_NAMES,
  TMP_AWS_LOG_GROUP_ARNS,
  TMP_AWS_LOG_STREAM_NAMES,
  TMP_AWS_LOG_STREAM_ARNS,
  TMP_CONTAINER_NAME,
  TMP_CONTAINER_ID,
  TMP_CONTAINER_RUNTIME,
  TMP_CONTAINER_IMAGE_NAME,
  TMP_CONTAINER_IMAGE_TAG,
  TMP_DEPLOYMENT_ENVIRONMENT,
  TMP_DEVICE_ID,
  TMP_DEVICE_MODEL_IDENTIFIER,
  TMP_DEVICE_MODEL_NAME,
  TMP_FAAS_NAME,
  TMP_FAAS_ID,
  TMP_FAAS_VERSION,
  TMP_FAAS_INSTANCE,
  TMP_FAAS_MAX_MEMORY,
  TMP_HOST_ID,
  TMP_HOST_NAME,
  TMP_HOST_TYPE,
  TMP_HOST_ARCH,
  TMP_HOST_IMAGE_NAME,
  TMP_HOST_IMAGE_ID,
  TMP_HOST_IMAGE_VERSION,
  TMP_K8S_CLUSTER_NAME,
  TMP_K8S_NODE_NAME,
  TMP_K8S_NODE_UID,
  TMP_K8S_NAMESPACE_NAME,
  TMP_K8S_POD_UID,
  TMP_K8S_POD_NAME,
  TMP_K8S_CONTAINER_NAME,
  TMP_K8S_REPLICASET_UID,
  TMP_K8S_REPLICASET_NAME,
  TMP_K8S_DEPLOYMENT_UID,
  TMP_K8S_DEPLOYMENT_NAME,
  TMP_K8S_STATEFULSET_UID,
  TMP_K8S_STATEFULSET_NAME,
  TMP_K8S_DAEMONSET_UID,
  TMP_K8S_DAEMONSET_NAME,
  TMP_K8S_JOB_UID,
  TMP_K8S_JOB_NAME,
  TMP_K8S_CRONJOB_UID,
  TMP_K8S_CRONJOB_NAME,
  TMP_OS_TYPE,
  TMP_OS_DESCRIPTION,
  TMP_OS_NAME,
  TMP_OS_VERSION,
  TMP_PROCESS_PID,
  TMP_PROCESS_EXECUTABLE_NAME,
  TMP_PROCESS_EXECUTABLE_PATH,
  TMP_PROCESS_COMMAND,
  TMP_PROCESS_COMMAND_LINE,
  TMP_PROCESS_COMMAND_ARGS,
  TMP_PROCESS_OWNER,
  TMP_PROCESS_RUNTIME_NAME,
  TMP_PROCESS_RUNTIME_VERSION,
  TMP_PROCESS_RUNTIME_DESCRIPTION,
  TMP_SERVICE_NAME,
  TMP_SERVICE_NAMESPACE,
  TMP_SERVICE_INSTANCE_ID,
  TMP_SERVICE_VERSION,
  TMP_TELEMETRY_SDK_NAME,
  TMP_TELEMETRY_SDK_LANGUAGE,
  TMP_TELEMETRY_SDK_VERSION,
  TMP_TELEMETRY_AUTO_VERSION,
  TMP_WEBENGINE_NAME,
  TMP_WEBENGINE_VERSION,
  TMP_WEBENGINE_DESCRIPTION
]);
var TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
var TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
var TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
var TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
var TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
var TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
var TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
var TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
var TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
var TelemetrySdkLanguageValues = /* @__PURE__ */ createConstMap([
  TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
  TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
  TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
  TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
  TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
  TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
  TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
  TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
  TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
  TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
]);

// node_modules/@opentelemetry/core/build/esnext/baggage/propagation/W3CBaggagePropagator.js
init_esm();

// node_modules/@opentelemetry/core/build/esnext/trace/suppress-tracing.js
init_esm();
var SUPPRESS_TRACING_KEY = createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
function suppressTracing(context2) {
  return context2.setValue(SUPPRESS_TRACING_KEY, true);
}
function isTracingSuppressed(context2) {
  return context2.getValue(SUPPRESS_TRACING_KEY) === true;
}

// node_modules/@opentelemetry/core/build/esnext/baggage/constants.js
var BAGGAGE_KEY_PAIR_SEPARATOR = "=";
var BAGGAGE_PROPERTIES_SEPARATOR = ";";
var BAGGAGE_ITEMS_SEPARATOR = ",";
var BAGGAGE_HEADER = "baggage";
var BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
var BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
var BAGGAGE_MAX_TOTAL_LENGTH = 8192;

// node_modules/@opentelemetry/core/build/esnext/baggage/utils.js
init_esm();
function serializeKeyPairs(keyPairs) {
  return keyPairs.reduce((hValue, current) => {
    const value = `${hValue}${hValue !== "" ? BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
    return value.length > BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
  }, "");
}
function getKeyPairs(baggage) {
  return baggage.getAllEntries().map(([key, value]) => {
    let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
    if (value.metadata !== void 0) {
      entry += BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
    }
    return entry;
  });
}
function parsePairKeyValue(entry) {
  const valueProps = entry.split(BAGGAGE_PROPERTIES_SEPARATOR);
  if (valueProps.length <= 0)
    return;
  const keyPairPart = valueProps.shift();
  if (!keyPairPart)
    return;
  const separatorIndex = keyPairPart.indexOf(BAGGAGE_KEY_PAIR_SEPARATOR);
  if (separatorIndex <= 0)
    return;
  const key = decodeURIComponent(keyPairPart.substring(0, separatorIndex).trim());
  const value = decodeURIComponent(keyPairPart.substring(separatorIndex + 1).trim());
  let metadata;
  if (valueProps.length > 0) {
    metadata = baggageEntryMetadataFromString(valueProps.join(BAGGAGE_PROPERTIES_SEPARATOR));
  }
  return { key, value, metadata };
}

// node_modules/@opentelemetry/core/build/esnext/baggage/propagation/W3CBaggagePropagator.js
var W3CBaggagePropagator = class {
  inject(context2, carrier, setter) {
    const baggage = propagation.getBaggage(context2);
    if (!baggage || isTracingSuppressed(context2))
      return;
    const keyPairs = getKeyPairs(baggage).filter((pair) => {
      return pair.length <= BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
    }).slice(0, BAGGAGE_MAX_NAME_VALUE_PAIRS);
    const headerValue = serializeKeyPairs(keyPairs);
    if (headerValue.length > 0) {
      setter.set(carrier, BAGGAGE_HEADER, headerValue);
    }
  }
  extract(context2, carrier, getter) {
    const headerValue = getter.get(carrier, BAGGAGE_HEADER);
    const baggageString = Array.isArray(headerValue) ? headerValue.join(BAGGAGE_ITEMS_SEPARATOR) : headerValue;
    if (!baggageString)
      return context2;
    const baggage = {};
    if (baggageString.length === 0) {
      return context2;
    }
    const pairs = baggageString.split(BAGGAGE_ITEMS_SEPARATOR);
    pairs.forEach((entry) => {
      const keyPair = parsePairKeyValue(entry);
      if (keyPair) {
        const baggageEntry = { value: keyPair.value };
        if (keyPair.metadata) {
          baggageEntry.metadata = keyPair.metadata;
        }
        baggage[keyPair.key] = baggageEntry;
      }
    });
    if (Object.entries(baggage).length === 0) {
      return context2;
    }
    return propagation.setBaggage(context2, propagation.createBaggage(baggage));
  }
  fields() {
    return [BAGGAGE_HEADER];
  }
};

// node_modules/@opentelemetry/core/build/esnext/common/attributes.js
init_esm();
function sanitizeAttributes(attributes) {
  const out = {};
  if (typeof attributes !== "object" || attributes == null) {
    return out;
  }
  for (const [key, val] of Object.entries(attributes)) {
    if (!isAttributeKey(key)) {
      diag2.warn(`Invalid attribute key: ${key}`);
      continue;
    }
    if (!isAttributeValue(val)) {
      diag2.warn(`Invalid attribute value set for key: ${key}`);
      continue;
    }
    if (Array.isArray(val)) {
      out[key] = val.slice();
    } else {
      out[key] = val;
    }
  }
  return out;
}
function isAttributeKey(key) {
  return typeof key === "string" && key.length > 0;
}
function isAttributeValue(val) {
  if (val == null) {
    return true;
  }
  if (Array.isArray(val)) {
    return isHomogeneousAttributeValueArray(val);
  }
  return isValidPrimitiveAttributeValue(val);
}
function isHomogeneousAttributeValueArray(arr) {
  let type;
  for (const element of arr) {
    if (element == null)
      continue;
    if (!type) {
      if (isValidPrimitiveAttributeValue(element)) {
        type = typeof element;
        continue;
      }
      return false;
    }
    if (typeof element === type) {
      continue;
    }
    return false;
  }
  return true;
}
function isValidPrimitiveAttributeValue(val) {
  switch (typeof val) {
    case "number":
    case "boolean":
    case "string":
      return true;
  }
  return false;
}

// node_modules/@opentelemetry/core/build/esnext/common/logging-error-handler.js
init_esm();
function loggingErrorHandler() {
  return (ex) => {
    diag2.error(stringifyException(ex));
  };
}
function stringifyException(ex) {
  if (typeof ex === "string") {
    return ex;
  } else {
    return JSON.stringify(flattenException(ex));
  }
}
function flattenException(ex) {
  const result = {};
  let current = ex;
  while (current !== null) {
    Object.getOwnPropertyNames(current).forEach((propertyName) => {
      if (result[propertyName])
        return;
      const value = current[propertyName];
      if (value) {
        result[propertyName] = String(value);
      }
    });
    current = Object.getPrototypeOf(current);
  }
  return result;
}

// node_modules/@opentelemetry/core/build/esnext/common/global-error-handler.js
var delegateHandler = loggingErrorHandler();
function globalErrorHandler(ex) {
  try {
    delegateHandler(ex);
  } catch (_a) {
  }
}

// node_modules/@opentelemetry/core/build/esnext/utils/environment.js
init_esm();

// node_modules/@opentelemetry/core/build/esnext/utils/sampling.js
var TracesSamplerValues;
(function(TracesSamplerValues2) {
  TracesSamplerValues2["AlwaysOff"] = "always_off";
  TracesSamplerValues2["AlwaysOn"] = "always_on";
  TracesSamplerValues2["ParentBasedAlwaysOff"] = "parentbased_always_off";
  TracesSamplerValues2["ParentBasedAlwaysOn"] = "parentbased_always_on";
  TracesSamplerValues2["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
  TracesSamplerValues2["TraceIdRatio"] = "traceidratio";
})(TracesSamplerValues || (TracesSamplerValues = {}));

// node_modules/@opentelemetry/core/build/esnext/platform/browser/globalThis.js
var _globalThis2 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

// node_modules/@opentelemetry/core/build/esnext/utils/environment.js
var DEFAULT_LIST_SEPARATOR = ",";
var ENVIRONMENT_BOOLEAN_KEYS = ["OTEL_SDK_DISABLED"];
function isEnvVarABoolean(key) {
  return ENVIRONMENT_BOOLEAN_KEYS.indexOf(key) > -1;
}
var ENVIRONMENT_NUMBERS_KEYS = [
  "OTEL_BSP_EXPORT_TIMEOUT",
  "OTEL_BSP_MAX_EXPORT_BATCH_SIZE",
  "OTEL_BSP_MAX_QUEUE_SIZE",
  "OTEL_BSP_SCHEDULE_DELAY",
  "OTEL_BLRP_EXPORT_TIMEOUT",
  "OTEL_BLRP_MAX_EXPORT_BATCH_SIZE",
  "OTEL_BLRP_MAX_QUEUE_SIZE",
  "OTEL_BLRP_SCHEDULE_DELAY",
  "OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT",
  "OTEL_ATTRIBUTE_COUNT_LIMIT",
  "OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT",
  "OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT",
  "OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT",
  "OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT",
  "OTEL_SPAN_EVENT_COUNT_LIMIT",
  "OTEL_SPAN_LINK_COUNT_LIMIT",
  "OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT",
  "OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT",
  "OTEL_EXPORTER_OTLP_TIMEOUT",
  "OTEL_EXPORTER_OTLP_TRACES_TIMEOUT",
  "OTEL_EXPORTER_OTLP_METRICS_TIMEOUT",
  "OTEL_EXPORTER_OTLP_LOGS_TIMEOUT",
  "OTEL_EXPORTER_JAEGER_AGENT_PORT"
];
function isEnvVarANumber(key) {
  return ENVIRONMENT_NUMBERS_KEYS.indexOf(key) > -1;
}
var ENVIRONMENT_LISTS_KEYS = [
  "OTEL_NO_PATCH_MODULES",
  "OTEL_PROPAGATORS"
];
function isEnvVarAList(key) {
  return ENVIRONMENT_LISTS_KEYS.indexOf(key) > -1;
}
var DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
var DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
var DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT = 128;
var DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT = 128;
var DEFAULT_ENVIRONMENT = {
  OTEL_SDK_DISABLED: false,
  CONTAINER_NAME: "",
  ECS_CONTAINER_METADATA_URI_V4: "",
  ECS_CONTAINER_METADATA_URI: "",
  HOSTNAME: "",
  KUBERNETES_SERVICE_HOST: "",
  NAMESPACE: "",
  OTEL_BSP_EXPORT_TIMEOUT: 3e4,
  OTEL_BSP_MAX_EXPORT_BATCH_SIZE: 512,
  OTEL_BSP_MAX_QUEUE_SIZE: 2048,
  OTEL_BSP_SCHEDULE_DELAY: 5e3,
  OTEL_BLRP_EXPORT_TIMEOUT: 3e4,
  OTEL_BLRP_MAX_EXPORT_BATCH_SIZE: 512,
  OTEL_BLRP_MAX_QUEUE_SIZE: 2048,
  OTEL_BLRP_SCHEDULE_DELAY: 5e3,
  OTEL_EXPORTER_JAEGER_AGENT_HOST: "",
  OTEL_EXPORTER_JAEGER_AGENT_PORT: 6832,
  OTEL_EXPORTER_JAEGER_ENDPOINT: "",
  OTEL_EXPORTER_JAEGER_PASSWORD: "",
  OTEL_EXPORTER_JAEGER_USER: "",
  OTEL_EXPORTER_OTLP_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: "",
  OTEL_EXPORTER_OTLP_HEADERS: "",
  OTEL_EXPORTER_OTLP_TRACES_HEADERS: "",
  OTEL_EXPORTER_OTLP_METRICS_HEADERS: "",
  OTEL_EXPORTER_OTLP_LOGS_HEADERS: "",
  OTEL_EXPORTER_OTLP_TIMEOUT: 1e4,
  OTEL_EXPORTER_OTLP_TRACES_TIMEOUT: 1e4,
  OTEL_EXPORTER_OTLP_METRICS_TIMEOUT: 1e4,
  OTEL_EXPORTER_OTLP_LOGS_TIMEOUT: 1e4,
  OTEL_EXPORTER_ZIPKIN_ENDPOINT: "http://localhost:9411/api/v2/spans",
  OTEL_LOG_LEVEL: DiagLogLevel.INFO,
  OTEL_NO_PATCH_MODULES: [],
  OTEL_PROPAGATORS: ["tracecontext", "baggage"],
  OTEL_RESOURCE_ATTRIBUTES: "",
  OTEL_SERVICE_NAME: "",
  OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
  OTEL_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
  OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
  OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
  OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
  OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
  OTEL_SPAN_EVENT_COUNT_LIMIT: 128,
  OTEL_SPAN_LINK_COUNT_LIMIT: 128,
  OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
  OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT,
  OTEL_TRACES_EXPORTER: "",
  OTEL_TRACES_SAMPLER: TracesSamplerValues.ParentBasedAlwaysOn,
  OTEL_TRACES_SAMPLER_ARG: "",
  OTEL_LOGS_EXPORTER: "",
  OTEL_EXPORTER_OTLP_INSECURE: "",
  OTEL_EXPORTER_OTLP_TRACES_INSECURE: "",
  OTEL_EXPORTER_OTLP_METRICS_INSECURE: "",
  OTEL_EXPORTER_OTLP_LOGS_INSECURE: "",
  OTEL_EXPORTER_OTLP_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_TRACES_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_METRICS_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_LOGS_COMPRESSION: "",
  OTEL_EXPORTER_OTLP_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY: "",
  OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE: "",
  OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_METRICS_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_LOGS_PROTOCOL: "http/protobuf",
  OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: "cumulative"
};
function parseBoolean(key, environment, values) {
  if (typeof values[key] === "undefined") {
    return;
  }
  const value = String(values[key]);
  environment[key] = value.toLowerCase() === "true";
}
function parseNumber(name, environment, values, min = -Infinity, max = Infinity) {
  if (typeof values[name] !== "undefined") {
    const value = Number(values[name]);
    if (!isNaN(value)) {
      if (value < min) {
        environment[name] = min;
      } else if (value > max) {
        environment[name] = max;
      } else {
        environment[name] = value;
      }
    }
  }
}
function parseStringList(name, output, input, separator = DEFAULT_LIST_SEPARATOR) {
  const givenValue = input[name];
  if (typeof givenValue === "string") {
    output[name] = givenValue.split(separator).map((v) => v.trim());
  }
}
var logLevelMap = {
  ALL: DiagLogLevel.ALL,
  VERBOSE: DiagLogLevel.VERBOSE,
  DEBUG: DiagLogLevel.DEBUG,
  INFO: DiagLogLevel.INFO,
  WARN: DiagLogLevel.WARN,
  ERROR: DiagLogLevel.ERROR,
  NONE: DiagLogLevel.NONE
};
function setLogLevelFromEnv(key, environment, values) {
  const value = values[key];
  if (typeof value === "string") {
    const theLevel = logLevelMap[value.toUpperCase()];
    if (theLevel != null) {
      environment[key] = theLevel;
    }
  }
}
function parseEnvironment(values) {
  const environment = {};
  for (const env3 in DEFAULT_ENVIRONMENT) {
    const key = env3;
    switch (key) {
      case "OTEL_LOG_LEVEL":
        setLogLevelFromEnv(key, environment, values);
        break;
      default:
        if (isEnvVarABoolean(key)) {
          parseBoolean(key, environment, values);
        } else if (isEnvVarANumber(key)) {
          parseNumber(key, environment, values);
        } else if (isEnvVarAList(key)) {
          parseStringList(key, environment, values);
        } else {
          const value = values[key];
          if (typeof value !== "undefined" && value !== null) {
            environment[key] = String(value);
          }
        }
    }
  }
  return environment;
}
function getEnvWithoutDefaults() {
  return typeof process !== "undefined" && process && process.env ? parseEnvironment(process.env) : parseEnvironment(_globalThis2);
}

// node_modules/@opentelemetry/core/build/esnext/platform/node/environment.js
function getEnv() {
  const processEnv = parseEnvironment(process.env);
  return Object.assign({}, DEFAULT_ENVIRONMENT, processEnv);
}

// node_modules/@opentelemetry/core/build/esnext/common/hex-to-binary.js
function intValue(charCode) {
  if (charCode >= 48 && charCode <= 57) {
    return charCode - 48;
  }
  if (charCode >= 97 && charCode <= 102) {
    return charCode - 87;
  }
  return charCode - 55;
}
function hexToBinary(hexStr) {
  const buf = new Uint8Array(hexStr.length / 2);
  let offset = 0;
  for (let i = 0; i < hexStr.length; i += 2) {
    const hi = intValue(hexStr.charCodeAt(i));
    const lo = intValue(hexStr.charCodeAt(i + 1));
    buf[offset++] = hi << 4 | lo;
  }
  return buf;
}

// node_modules/@opentelemetry/core/build/esnext/platform/node/performance.js
import { performance } from "perf_hooks";
var otperformance = performance;

// node_modules/@opentelemetry/core/build/esnext/version.js
var VERSION2 = "1.23.0";

// node_modules/@opentelemetry/core/build/esnext/platform/node/sdk-info.js
var SDK_INFO = {
  [SemanticResourceAttributes.TELEMETRY_SDK_NAME]: "opentelemetry",
  [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: "node",
  [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: TelemetrySdkLanguageValues.NODEJS,
  [SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: VERSION2
};

// node_modules/@opentelemetry/core/build/esnext/platform/node/timer-util.js
function unrefTimer(timer) {
  timer.unref();
}

// node_modules/@opentelemetry/core/build/esnext/common/time.js
var NANOSECOND_DIGITS = 9;
var NANOSECOND_DIGITS_IN_MILLIS = 6;
var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
function millisToHrTime(epochMillis) {
  const epochSeconds = epochMillis / 1e3;
  const seconds = Math.trunc(epochSeconds);
  const nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS);
  return [seconds, nanos];
}
function getTimeOrigin() {
  let timeOrigin = otperformance.timeOrigin;
  if (typeof timeOrigin !== "number") {
    const perf = otperformance;
    timeOrigin = perf.timing && perf.timing.fetchStart;
  }
  return timeOrigin;
}
function hrTime(performanceNow) {
  const timeOrigin = millisToHrTime(getTimeOrigin());
  const now = millisToHrTime(typeof performanceNow === "number" ? performanceNow : otperformance.now());
  return addHrTimes(timeOrigin, now);
}
function hrTimeDuration(startTime, endTime) {
  let seconds = endTime[0] - startTime[0];
  let nanos = endTime[1] - startTime[1];
  if (nanos < 0) {
    seconds -= 1;
    nanos += SECOND_TO_NANOSECONDS;
  }
  return [seconds, nanos];
}
function hrTimeToNanoseconds(time) {
  return time[0] * SECOND_TO_NANOSECONDS + time[1];
}
function isTimeInputHrTime(value) {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
}
function isTimeInput(value) {
  return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
}
function addHrTimes(time1, time2) {
  const out = [time1[0] + time2[0], time1[1] + time2[1]];
  if (out[1] >= SECOND_TO_NANOSECONDS) {
    out[1] -= SECOND_TO_NANOSECONDS;
    out[0] += 1;
  }
  return out;
}

// node_modules/@opentelemetry/core/build/esnext/ExportResult.js
var ExportResultCode;
(function(ExportResultCode2) {
  ExportResultCode2[ExportResultCode2["SUCCESS"] = 0] = "SUCCESS";
  ExportResultCode2[ExportResultCode2["FAILED"] = 1] = "FAILED";
})(ExportResultCode || (ExportResultCode = {}));

// node_modules/@opentelemetry/core/build/esnext/propagation/composite.js
init_esm();
var CompositePropagator = class {
  /**
   * Construct a composite propagator from a list of propagators.
   *
   * @param [config] Configuration object for composite propagator
   */
  constructor(config = {}) {
    var _a;
    this._propagators = (_a = config.propagators) !== null && _a !== void 0 ? _a : [];
    this._fields = Array.from(new Set(this._propagators.map((p) => typeof p.fields === "function" ? p.fields() : []).reduce((x, y) => x.concat(y), [])));
  }
  /**
   * Run each of the configured propagators with the given context and carrier.
   * Propagators are run in the order they are configured, so if multiple
   * propagators write the same carrier key, the propagator later in the list
   * will "win".
   *
   * @param context Context to inject
   * @param carrier Carrier into which context will be injected
   */
  inject(context2, carrier, setter) {
    for (const propagator of this._propagators) {
      try {
        propagator.inject(context2, carrier, setter);
      } catch (err) {
        diag2.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
      }
    }
  }
  /**
   * Run each of the configured propagators with the given context and carrier.
   * Propagators are run in the order they are configured, so if multiple
   * propagators write the same context key, the propagator later in the list
   * will "win".
   *
   * @param context Context to add values to
   * @param carrier Carrier from which to extract context
   */
  extract(context2, carrier, getter) {
    return this._propagators.reduce((ctx, propagator) => {
      try {
        return propagator.extract(ctx, carrier, getter);
      } catch (err) {
        diag2.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
      }
      return ctx;
    }, context2);
  }
  fields() {
    return this._fields.slice();
  }
};

// node_modules/@opentelemetry/core/build/esnext/trace/W3CTraceContextPropagator.js
init_esm();

// node_modules/@opentelemetry/core/build/esnext/internal/validators.js
var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
var VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
var VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
var VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
function validateKey(key) {
  return VALID_KEY_REGEX.test(key);
}
function validateValue(value) {
  return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}

// node_modules/@opentelemetry/core/build/esnext/trace/TraceState.js
var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ",";
var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
var TraceState = class _TraceState {
  constructor(rawTraceState) {
    this._internalState = /* @__PURE__ */ new Map();
    if (rawTraceState)
      this._parse(rawTraceState);
  }
  set(key, value) {
    const traceState = this._clone();
    if (traceState._internalState.has(key)) {
      traceState._internalState.delete(key);
    }
    traceState._internalState.set(key, value);
    return traceState;
  }
  unset(key) {
    const traceState = this._clone();
    traceState._internalState.delete(key);
    return traceState;
  }
  get(key) {
    return this._internalState.get(key);
  }
  serialize() {
    return this._keys().reduce((agg, key) => {
      agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
      return agg;
    }, []).join(LIST_MEMBERS_SEPARATOR);
  }
  _parse(rawTraceState) {
    if (rawTraceState.length > MAX_TRACE_STATE_LEN)
      return;
    this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce((agg, part) => {
      const listMember = part.trim();
      const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
      if (i !== -1) {
        const key = listMember.slice(0, i);
        const value = listMember.slice(i + 1, part.length);
        if (validateKey(key) && validateValue(value)) {
          agg.set(key, value);
        } else {
        }
      }
      return agg;
    }, /* @__PURE__ */ new Map());
    if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
      this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
    }
  }
  _keys() {
    return Array.from(this._internalState.keys()).reverse();
  }
  _clone() {
    const traceState = new _TraceState();
    traceState._internalState = new Map(this._internalState);
    return traceState;
  }
};

// node_modules/@opentelemetry/core/build/esnext/trace/W3CTraceContextPropagator.js
var TRACE_PARENT_HEADER = "traceparent";
var TRACE_STATE_HEADER = "tracestate";
var VERSION3 = "00";
var VERSION_PART = "(?!ff)[\\da-f]{2}";
var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
var FLAGS_PART = "[\\da-f]{2}";
var TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
function parseTraceParent(traceParent) {
  const match = TRACE_PARENT_REGEX.exec(traceParent);
  if (!match)
    return null;
  if (match[1] === "00" && match[5])
    return null;
  return {
    traceId: match[2],
    spanId: match[3],
    traceFlags: parseInt(match[4], 16)
  };
}
var W3CTraceContextPropagator = class {
  inject(context2, carrier, setter) {
    const spanContext = trace.getSpanContext(context2);
    if (!spanContext || isTracingSuppressed(context2) || !isSpanContextValid(spanContext))
      return;
    const traceParent = `${VERSION3}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || TraceFlags.NONE).toString(16)}`;
    setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
    if (spanContext.traceState) {
      setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
    }
  }
  extract(context2, carrier, getter) {
    const traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
    if (!traceParentHeader)
      return context2;
    const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
    if (typeof traceParent !== "string")
      return context2;
    const spanContext = parseTraceParent(traceParent);
    if (!spanContext)
      return context2;
    spanContext.isRemote = true;
    const traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
    if (traceStateHeader) {
      const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
      spanContext.traceState = new TraceState(typeof state === "string" ? state : void 0);
    }
    return trace.setSpanContext(context2, spanContext);
  }
  fields() {
    return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
  }
};

// node_modules/@opentelemetry/core/build/esnext/utils/lodash.merge.js
var objectTag = "[object Object]";
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
var objectCtorString = funcToString.call(Object);
var getPrototype = overArg(Object.getPrototypeOf, Object);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
var nativeObjectToString = objectProto.toString;
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
    return false;
  }
  const proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function getRawTag(value) {
  const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = void 0;
    unmasked = true;
  } catch (e) {
  }
  const result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
function objectToString(value) {
  return nativeObjectToString.call(value);
}

// node_modules/@opentelemetry/core/build/esnext/utils/merge.js
var MAX_LEVEL = 20;
function merge(...args) {
  let result = args.shift();
  const objects = /* @__PURE__ */ new WeakMap();
  while (args.length > 0) {
    result = mergeTwoObjects(result, args.shift(), 0, objects);
  }
  return result;
}
function takeValue(value) {
  if (isArray(value)) {
    return value.slice();
  }
  return value;
}
function mergeTwoObjects(one, two, level = 0, objects) {
  let result;
  if (level > MAX_LEVEL) {
    return void 0;
  }
  level++;
  if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
    result = takeValue(two);
  } else if (isArray(one)) {
    result = one.slice();
    if (isArray(two)) {
      for (let i = 0, j = two.length; i < j; i++) {
        result.push(takeValue(two[i]));
      }
    } else if (isObject(two)) {
      const keys = Object.keys(two);
      for (let i = 0, j = keys.length; i < j; i++) {
        const key = keys[i];
        result[key] = takeValue(two[key]);
      }
    }
  } else if (isObject(one)) {
    if (isObject(two)) {
      if (!shouldMerge(one, two)) {
        return two;
      }
      result = Object.assign({}, one);
      const keys = Object.keys(two);
      for (let i = 0, j = keys.length; i < j; i++) {
        const key = keys[i];
        const twoValue = two[key];
        if (isPrimitive(twoValue)) {
          if (typeof twoValue === "undefined") {
            delete result[key];
          } else {
            result[key] = twoValue;
          }
        } else {
          const obj1 = result[key];
          const obj2 = twoValue;
          if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
            delete result[key];
          } else {
            if (isObject(obj1) && isObject(obj2)) {
              const arr1 = objects.get(obj1) || [];
              const arr2 = objects.get(obj2) || [];
              arr1.push({ obj: one, key });
              arr2.push({ obj: two, key });
              objects.set(obj1, arr1);
              objects.set(obj2, arr2);
            }
            result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
          }
        }
      }
    } else {
      result = two;
    }
  }
  return result;
}
function wasObjectReferenced(obj, key, objects) {
  const arr = objects.get(obj[key]) || [];
  for (let i = 0, j = arr.length; i < j; i++) {
    const info = arr[i];
    if (info.key === key && info.obj === obj) {
      return true;
    }
  }
  return false;
}
function isArray(value) {
  return Array.isArray(value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
}
function isPrimitive(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
}
function shouldMerge(one, two) {
  if (!isPlainObject(one) || !isPlainObject(two)) {
    return false;
  }
  return true;
}

// node_modules/@opentelemetry/core/build/esnext/utils/promise.js
var Deferred = class {
  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  get promise() {
    return this._promise;
  }
  resolve(val) {
    this._resolve(val);
  }
  reject(err) {
    this._reject(err);
  }
};

// node_modules/@opentelemetry/core/build/esnext/utils/callback.js
var BindOnceFuture = class {
  constructor(_callback, _that) {
    this._callback = _callback;
    this._that = _that;
    this._isCalled = false;
    this._deferred = new Deferred();
  }
  get isCalled() {
    return this._isCalled;
  }
  get promise() {
    return this._deferred.promise;
  }
  call(...args) {
    if (!this._isCalled) {
      this._isCalled = true;
      try {
        Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err) => this._deferred.reject(err));
      } catch (err) {
        this._deferred.reject(err);
      }
    }
    return this._deferred.promise;
  }
};

// node_modules/@opentelemetry/core/build/esnext/internal/exporter.js
init_esm();
function _export(exporter, arg) {
  return new Promise((resolve) => {
    context.with(suppressTracing(context.active()), () => {
      exporter.export(arg, (result) => {
        resolve(result);
      });
    });
  });
}

// node_modules/@opentelemetry/core/build/esnext/index.js
var internal = {
  _export
};

// node_modules/@opentelemetry/resources/build/esnext/platform/node/default-service-name.js
function defaultServiceName() {
  return `unknown_service:${process.argv0}`;
}

// node_modules/@opentelemetry/resources/build/esnext/Resource.js
var Resource = class _Resource {
  constructor(attributes, asyncAttributesPromise) {
    var _a;
    this._attributes = attributes;
    this.asyncAttributesPending = asyncAttributesPromise != null;
    this._syncAttributes = (_a = this._attributes) !== null && _a !== void 0 ? _a : {};
    this._asyncAttributesPromise = asyncAttributesPromise === null || asyncAttributesPromise === void 0 ? void 0 : asyncAttributesPromise.then((asyncAttributes) => {
      this._attributes = Object.assign({}, this._attributes, asyncAttributes);
      this.asyncAttributesPending = false;
      return asyncAttributes;
    }, (err) => {
      diag2.debug("a resource's async attributes promise rejected: %s", err);
      this.asyncAttributesPending = false;
      return {};
    });
  }
  /**
   * Returns an empty Resource
   */
  static empty() {
    return _Resource.EMPTY;
  }
  /**
   * Returns a Resource that identifies the SDK in use.
   */
  static default() {
    return new _Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: defaultServiceName(),
      [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE],
      [SemanticResourceAttributes.TELEMETRY_SDK_NAME]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_NAME],
      [SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_VERSION]
    });
  }
  get attributes() {
    var _a;
    if (this.asyncAttributesPending) {
      diag2.error("Accessing resource attributes before async attributes settled");
    }
    return (_a = this._attributes) !== null && _a !== void 0 ? _a : {};
  }
  /**
   * Returns a promise that will never be rejected. Resolves when all async attributes have finished being added to
   * this Resource's attributes. This is useful in exporters to block until resource detection
   * has finished.
   */
  async waitForAsyncAttributes() {
    if (this.asyncAttributesPending) {
      await this._asyncAttributesPromise;
    }
  }
  /**
   * Returns a new, merged {@link Resource} by merging the current Resource
   * with the other Resource. In case of a collision, other Resource takes
   * precedence.
   *
   * @param other the Resource that will be merged with this.
   * @returns the newly merged Resource.
   */
  merge(other) {
    var _a;
    if (!other)
      return this;
    const mergedSyncAttributes = Object.assign(Object.assign({}, this._syncAttributes), (_a = other._syncAttributes) !== null && _a !== void 0 ? _a : other.attributes);
    if (!this._asyncAttributesPromise && !other._asyncAttributesPromise) {
      return new _Resource(mergedSyncAttributes);
    }
    const mergedAttributesPromise = Promise.all([
      this._asyncAttributesPromise,
      other._asyncAttributesPromise
    ]).then(([thisAsyncAttributes, otherAsyncAttributes]) => {
      var _a2;
      return Object.assign(Object.assign(Object.assign(Object.assign({}, this._syncAttributes), thisAsyncAttributes), (_a2 = other._syncAttributes) !== null && _a2 !== void 0 ? _a2 : other.attributes), otherAsyncAttributes);
    });
    return new _Resource(mergedSyncAttributes, mergedAttributesPromise);
  }
};
Resource.EMPTY = new Resource({});

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/Tracer.js
init_esm();

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/Span.js
init_esm();

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/enums.js
var ExceptionEventName = "exception";

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/Span.js
var Span = class {
  /**
   * Constructs a new Span instance.
   *
   * @deprecated calling Span constructor directly is not supported. Please use tracer.startSpan.
   * */
  constructor(parentTracer, context2, spanName, spanContext, kind, parentSpanId, links = [], startTime, _deprecatedClock, attributes) {
    this.attributes = {};
    this.links = [];
    this.events = [];
    this._droppedAttributesCount = 0;
    this._droppedEventsCount = 0;
    this._droppedLinksCount = 0;
    this.status = {
      code: SpanStatusCode.UNSET
    };
    this.endTime = [0, 0];
    this._ended = false;
    this._duration = [-1, -1];
    this.name = spanName;
    this._spanContext = spanContext;
    this.parentSpanId = parentSpanId;
    this.kind = kind;
    this.links = links;
    const now = Date.now();
    this._performanceStartTime = otperformance.now();
    this._performanceOffset = now - (this._performanceStartTime + getTimeOrigin());
    this._startTimeProvided = startTime != null;
    this.startTime = this._getTime(startTime !== null && startTime !== void 0 ? startTime : now);
    this.resource = parentTracer.resource;
    this.instrumentationLibrary = parentTracer.instrumentationLibrary;
    this._spanLimits = parentTracer.getSpanLimits();
    this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
    if (attributes != null) {
      this.setAttributes(attributes);
    }
    this._spanProcessor = parentTracer.getActiveSpanProcessor();
    this._spanProcessor.onStart(this, context2);
  }
  spanContext() {
    return this._spanContext;
  }
  setAttribute(key, value) {
    if (value == null || this._isSpanEnded())
      return this;
    if (key.length === 0) {
      diag2.warn(`Invalid attribute key: ${key}`);
      return this;
    }
    if (!isAttributeValue(value)) {
      diag2.warn(`Invalid attribute value set for key: ${key}`);
      return this;
    }
    if (Object.keys(this.attributes).length >= this._spanLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
      this._droppedAttributesCount++;
      return this;
    }
    this.attributes[key] = this._truncateToSize(value);
    return this;
  }
  setAttributes(attributes) {
    for (const [k, v] of Object.entries(attributes)) {
      this.setAttribute(k, v);
    }
    return this;
  }
  /**
   *
   * @param name Span Name
   * @param [attributesOrStartTime] Span attributes or start time
   *     if type is {@type TimeInput} and 3rd param is undefined
   * @param [timeStamp] Specified time stamp for the event
   */
  addEvent(name, attributesOrStartTime, timeStamp) {
    if (this._isSpanEnded())
      return this;
    if (this._spanLimits.eventCountLimit === 0) {
      diag2.warn("No events allowed.");
      this._droppedEventsCount++;
      return this;
    }
    if (this.events.length >= this._spanLimits.eventCountLimit) {
      if (this._droppedEventsCount === 0) {
        diag2.debug("Dropping extra events.");
      }
      this.events.shift();
      this._droppedEventsCount++;
    }
    if (isTimeInput(attributesOrStartTime)) {
      if (!isTimeInput(timeStamp)) {
        timeStamp = attributesOrStartTime;
      }
      attributesOrStartTime = void 0;
    }
    const attributes = sanitizeAttributes(attributesOrStartTime);
    this.events.push({
      name,
      attributes,
      time: this._getTime(timeStamp),
      droppedAttributesCount: 0
    });
    return this;
  }
  setStatus(status) {
    if (this._isSpanEnded())
      return this;
    this.status = status;
    return this;
  }
  updateName(name) {
    if (this._isSpanEnded())
      return this;
    this.name = name;
    return this;
  }
  end(endTime) {
    if (this._isSpanEnded()) {
      diag2.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
      return;
    }
    this._ended = true;
    this.endTime = this._getTime(endTime);
    this._duration = hrTimeDuration(this.startTime, this.endTime);
    if (this._duration[0] < 0) {
      diag2.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime);
      this.endTime = this.startTime.slice();
      this._duration = [0, 0];
    }
    if (this._droppedEventsCount > 0) {
      diag2.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
    }
    this._spanProcessor.onEnd(this);
  }
  _getTime(inp) {
    if (typeof inp === "number" && inp < otperformance.now()) {
      return hrTime(inp + this._performanceOffset);
    }
    if (typeof inp === "number") {
      return millisToHrTime(inp);
    }
    if (inp instanceof Date) {
      return millisToHrTime(inp.getTime());
    }
    if (isTimeInputHrTime(inp)) {
      return inp;
    }
    if (this._startTimeProvided) {
      return millisToHrTime(Date.now());
    }
    const msDuration = otperformance.now() - this._performanceStartTime;
    return addHrTimes(this.startTime, millisToHrTime(msDuration));
  }
  isRecording() {
    return this._ended === false;
  }
  recordException(exception, time) {
    const attributes = {};
    if (typeof exception === "string") {
      attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception;
    } else if (exception) {
      if (exception.code) {
        attributes[SemanticAttributes.EXCEPTION_TYPE] = exception.code.toString();
      } else if (exception.name) {
        attributes[SemanticAttributes.EXCEPTION_TYPE] = exception.name;
      }
      if (exception.message) {
        attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception.message;
      }
      if (exception.stack) {
        attributes[SemanticAttributes.EXCEPTION_STACKTRACE] = exception.stack;
      }
    }
    if (attributes[SemanticAttributes.EXCEPTION_TYPE] || attributes[SemanticAttributes.EXCEPTION_MESSAGE]) {
      this.addEvent(ExceptionEventName, attributes, time);
    } else {
      diag2.warn(`Failed to record an exception ${exception}`);
    }
  }
  get duration() {
    return this._duration;
  }
  get ended() {
    return this._ended;
  }
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this._droppedEventsCount;
  }
  get droppedLinksCount() {
    return this._droppedLinksCount;
  }
  _isSpanEnded() {
    if (this._ended) {
      diag2.warn(`Can not execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
    }
    return this._ended;
  }
  // Utility function to truncate given value within size
  // for value type of string, will truncate to given limit
  // for type of non-string, will return same value
  _truncateToLimitUtil(value, limit) {
    if (value.length <= limit) {
      return value;
    }
    return value.substr(0, limit);
  }
  /**
   * If the given attribute value is of type string and has more characters than given {@code attributeValueLengthLimit} then
   * return string with truncated to {@code attributeValueLengthLimit} characters
   *
   * If the given attribute value is array of strings then
   * return new array of strings with each element truncated to {@code attributeValueLengthLimit} characters
   *
   * Otherwise return same Attribute {@code value}
   *
   * @param value Attribute value
   * @returns truncated attribute value if required, otherwise same value
   */
  _truncateToSize(value) {
    const limit = this._attributeValueLengthLimit;
    if (limit <= 0) {
      diag2.warn(`Attribute value limit must be positive, got ${limit}`);
      return value;
    }
    if (typeof value === "string") {
      return this._truncateToLimitUtil(value, limit);
    }
    if (Array.isArray(value)) {
      return value.map((val) => typeof val === "string" ? this._truncateToLimitUtil(val, limit) : val);
    }
    return value;
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/config.js
init_esm();

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/Sampler.js
var SamplingDecision2;
(function(SamplingDecision3) {
  SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
  SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
  SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision2 || (SamplingDecision2 = {}));

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/sampler/AlwaysOffSampler.js
var AlwaysOffSampler = class {
  shouldSample() {
    return {
      decision: SamplingDecision2.NOT_RECORD
    };
  }
  toString() {
    return "AlwaysOffSampler";
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/sampler/AlwaysOnSampler.js
var AlwaysOnSampler = class {
  shouldSample() {
    return {
      decision: SamplingDecision2.RECORD_AND_SAMPLED
    };
  }
  toString() {
    return "AlwaysOnSampler";
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/sampler/ParentBasedSampler.js
init_esm();
var ParentBasedSampler = class {
  constructor(config) {
    var _a, _b, _c, _d;
    this._root = config.root;
    if (!this._root) {
      globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured"));
      this._root = new AlwaysOnSampler();
    }
    this._remoteParentSampled = (_a = config.remoteParentSampled) !== null && _a !== void 0 ? _a : new AlwaysOnSampler();
    this._remoteParentNotSampled = (_b = config.remoteParentNotSampled) !== null && _b !== void 0 ? _b : new AlwaysOffSampler();
    this._localParentSampled = (_c = config.localParentSampled) !== null && _c !== void 0 ? _c : new AlwaysOnSampler();
    this._localParentNotSampled = (_d = config.localParentNotSampled) !== null && _d !== void 0 ? _d : new AlwaysOffSampler();
  }
  shouldSample(context2, traceId, spanName, spanKind, attributes, links) {
    const parentContext = trace.getSpanContext(context2);
    if (!parentContext || !isSpanContextValid(parentContext)) {
      return this._root.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
    }
    if (parentContext.isRemote) {
      if (parentContext.traceFlags & TraceFlags.SAMPLED) {
        return this._remoteParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      }
      return this._remoteParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
    }
    if (parentContext.traceFlags & TraceFlags.SAMPLED) {
      return this._localParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
    }
    return this._localParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
  }
  toString() {
    return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/sampler/TraceIdRatioBasedSampler.js
init_esm();
var TraceIdRatioBasedSampler = class {
  constructor(_ratio = 0) {
    this._ratio = _ratio;
    this._ratio = this._normalize(_ratio);
    this._upperBound = Math.floor(this._ratio * 4294967295);
  }
  shouldSample(context2, traceId) {
    return {
      decision: isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound ? SamplingDecision2.RECORD_AND_SAMPLED : SamplingDecision2.NOT_RECORD
    };
  }
  toString() {
    return `TraceIdRatioBased{${this._ratio}}`;
  }
  _normalize(ratio) {
    if (typeof ratio !== "number" || isNaN(ratio))
      return 0;
    return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
  }
  _accumulate(traceId) {
    let accumulation = 0;
    for (let i = 0; i < traceId.length / 8; i++) {
      const pos = i * 8;
      const part = parseInt(traceId.slice(pos, pos + 8), 16);
      accumulation = (accumulation ^ part) >>> 0;
    }
    return accumulation;
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/config.js
var env = getEnv();
var FALLBACK_OTEL_TRACES_SAMPLER = TracesSamplerValues.AlwaysOn;
var DEFAULT_RATIO = 1;
function loadDefaultConfig() {
  return {
    sampler: buildSamplerFromEnv(env),
    forceFlushTimeoutMillis: 3e4,
    generalLimits: {
      attributeValueLengthLimit: getEnv().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
      attributeCountLimit: getEnv().OTEL_ATTRIBUTE_COUNT_LIMIT
    },
    spanLimits: {
      attributeValueLengthLimit: getEnv().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
      attributeCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
      linkCountLimit: getEnv().OTEL_SPAN_LINK_COUNT_LIMIT,
      eventCountLimit: getEnv().OTEL_SPAN_EVENT_COUNT_LIMIT,
      attributePerEventCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
      attributePerLinkCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT
    }
  };
}
function buildSamplerFromEnv(environment = getEnv()) {
  switch (environment.OTEL_TRACES_SAMPLER) {
    case TracesSamplerValues.AlwaysOn:
      return new AlwaysOnSampler();
    case TracesSamplerValues.AlwaysOff:
      return new AlwaysOffSampler();
    case TracesSamplerValues.ParentBasedAlwaysOn:
      return new ParentBasedSampler({
        root: new AlwaysOnSampler()
      });
    case TracesSamplerValues.ParentBasedAlwaysOff:
      return new ParentBasedSampler({
        root: new AlwaysOffSampler()
      });
    case TracesSamplerValues.TraceIdRatio:
      return new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
    case TracesSamplerValues.ParentBasedTraceIdRatio:
      return new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment))
      });
    default:
      diag2.error(`OTEL_TRACES_SAMPLER value "${environment.OTEL_TRACES_SAMPLER} invalid, defaulting to ${FALLBACK_OTEL_TRACES_SAMPLER}".`);
      return new AlwaysOnSampler();
  }
}
function getSamplerProbabilityFromEnv(environment) {
  if (environment.OTEL_TRACES_SAMPLER_ARG === void 0 || environment.OTEL_TRACES_SAMPLER_ARG === "") {
    diag2.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
    return DEFAULT_RATIO;
  }
  const probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
  if (isNaN(probability)) {
    diag2.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is invalid, defaulting to ${DEFAULT_RATIO}.`);
    return DEFAULT_RATIO;
  }
  if (probability < 0 || probability > 1) {
    diag2.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
    return DEFAULT_RATIO;
  }
  return probability;
}

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/utility.js
function mergeConfig(userConfig) {
  const perInstanceDefaults = {
    sampler: buildSamplerFromEnv()
  };
  const DEFAULT_CONFIG = loadDefaultConfig();
  const target = Object.assign({}, DEFAULT_CONFIG, perInstanceDefaults, userConfig);
  target.generalLimits = Object.assign({}, DEFAULT_CONFIG.generalLimits, userConfig.generalLimits || {});
  target.spanLimits = Object.assign({}, DEFAULT_CONFIG.spanLimits, userConfig.spanLimits || {});
  return target;
}
function reconfigureLimits(userConfig) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
  const spanLimits = Object.assign({}, userConfig.spanLimits);
  const parsedEnvConfig = getEnvWithoutDefaults();
  spanLimits.attributeCountLimit = (_f = (_e = (_d = (_b = (_a = userConfig.spanLimits) === null || _a === void 0 ? void 0 : _a.attributeCountLimit) !== null && _b !== void 0 ? _b : (_c = userConfig.generalLimits) === null || _c === void 0 ? void 0 : _c.attributeCountLimit) !== null && _d !== void 0 ? _d : parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT) !== null && _e !== void 0 ? _e : parsedEnvConfig.OTEL_ATTRIBUTE_COUNT_LIMIT) !== null && _f !== void 0 ? _f : DEFAULT_ATTRIBUTE_COUNT_LIMIT;
  spanLimits.attributeValueLengthLimit = (_m = (_l = (_k = (_h = (_g = userConfig.spanLimits) === null || _g === void 0 ? void 0 : _g.attributeValueLengthLimit) !== null && _h !== void 0 ? _h : (_j = userConfig.generalLimits) === null || _j === void 0 ? void 0 : _j.attributeValueLengthLimit) !== null && _k !== void 0 ? _k : parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT) !== null && _l !== void 0 ? _l : parsedEnvConfig.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT) !== null && _m !== void 0 ? _m : DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
  return Object.assign({}, userConfig, { spanLimits });
}

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/export/BatchSpanProcessorBase.js
init_esm();
var BatchSpanProcessorBase = class {
  constructor(_exporter, config) {
    this._exporter = _exporter;
    this._isExporting = false;
    this._finishedSpans = [];
    this._droppedSpansCount = 0;
    const env3 = getEnv();
    this._maxExportBatchSize = typeof (config === null || config === void 0 ? void 0 : config.maxExportBatchSize) === "number" ? config.maxExportBatchSize : env3.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
    this._maxQueueSize = typeof (config === null || config === void 0 ? void 0 : config.maxQueueSize) === "number" ? config.maxQueueSize : env3.OTEL_BSP_MAX_QUEUE_SIZE;
    this._scheduledDelayMillis = typeof (config === null || config === void 0 ? void 0 : config.scheduledDelayMillis) === "number" ? config.scheduledDelayMillis : env3.OTEL_BSP_SCHEDULE_DELAY;
    this._exportTimeoutMillis = typeof (config === null || config === void 0 ? void 0 : config.exportTimeoutMillis) === "number" ? config.exportTimeoutMillis : env3.OTEL_BSP_EXPORT_TIMEOUT;
    this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
    if (this._maxExportBatchSize > this._maxQueueSize) {
      diag2.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
      this._maxExportBatchSize = this._maxQueueSize;
    }
  }
  forceFlush() {
    if (this._shutdownOnce.isCalled) {
      return this._shutdownOnce.promise;
    }
    return this._flushAll();
  }
  // does nothing.
  onStart(_span, _parentContext) {
  }
  onEnd(span) {
    if (this._shutdownOnce.isCalled) {
      return;
    }
    if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
      return;
    }
    this._addToBuffer(span);
  }
  shutdown() {
    return this._shutdownOnce.call();
  }
  _shutdown() {
    return Promise.resolve().then(() => {
      return this.onShutdown();
    }).then(() => {
      return this._flushAll();
    }).then(() => {
      return this._exporter.shutdown();
    });
  }
  /** Add a span in the buffer. */
  _addToBuffer(span) {
    if (this._finishedSpans.length >= this._maxQueueSize) {
      if (this._droppedSpansCount === 0) {
        diag2.debug("maxQueueSize reached, dropping spans");
      }
      this._droppedSpansCount++;
      return;
    }
    if (this._droppedSpansCount > 0) {
      diag2.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`);
      this._droppedSpansCount = 0;
    }
    this._finishedSpans.push(span);
    this._maybeStartTimer();
  }
  /**
   * Send all spans to the exporter respecting the batch size limit
   * This function is used only on forceFlush or shutdown,
   * for all other cases _flush should be used
   * */
  _flushAll() {
    return new Promise((resolve, reject) => {
      const promises = [];
      const count = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
      for (let i = 0, j = count; i < j; i++) {
        promises.push(this._flushOneBatch());
      }
      Promise.all(promises).then(() => {
        resolve();
      }).catch(reject);
    });
  }
  _flushOneBatch() {
    this._clearTimer();
    if (this._finishedSpans.length === 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timeout"));
      }, this._exportTimeoutMillis);
      context.with(suppressTracing(context.active()), () => {
        let spans;
        if (this._finishedSpans.length <= this._maxExportBatchSize) {
          spans = this._finishedSpans;
          this._finishedSpans = [];
        } else {
          spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
        }
        const doExport = () => this._exporter.export(spans, (result) => {
          var _a;
          clearTimeout(timer);
          if (result.code === ExportResultCode.SUCCESS) {
            resolve();
          } else {
            reject((_a = result.error) !== null && _a !== void 0 ? _a : new Error("BatchSpanProcessor: span export failed"));
          }
        });
        let pendingResources = null;
        for (let i = 0, len = spans.length; i < len; i++) {
          const span = spans[i];
          if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes) {
            pendingResources !== null && pendingResources !== void 0 ? pendingResources : pendingResources = [];
            pendingResources.push(span.resource.waitForAsyncAttributes());
          }
        }
        if (pendingResources === null) {
          doExport();
        } else {
          Promise.all(pendingResources).then(doExport, (err) => {
            globalErrorHandler(err);
            reject(err);
          });
        }
      });
    });
  }
  _maybeStartTimer() {
    if (this._isExporting)
      return;
    const flush = () => {
      this._isExporting = true;
      this._flushOneBatch().finally(() => {
        this._isExporting = false;
        if (this._finishedSpans.length > 0) {
          this._clearTimer();
          this._maybeStartTimer();
        }
      }).catch((e) => {
        this._isExporting = false;
        globalErrorHandler(e);
      });
    };
    if (this._finishedSpans.length >= this._maxExportBatchSize) {
      return flush();
    }
    if (this._timer !== void 0)
      return;
    this._timer = setTimeout(() => flush(), this._scheduledDelayMillis);
    unrefTimer(this._timer);
  }
  _clearTimer() {
    if (this._timer !== void 0) {
      clearTimeout(this._timer);
      this._timer = void 0;
    }
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/platform/node/export/BatchSpanProcessor.js
var BatchSpanProcessor = class extends BatchSpanProcessorBase {
  onShutdown() {
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/platform/node/RandomIdGenerator.js
var SPAN_ID_BYTES = 8;
var TRACE_ID_BYTES = 16;
var RandomIdGenerator = class {
  constructor() {
    this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
    this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
  }
};
var SHARED_BUFFER = Buffer.allocUnsafe(TRACE_ID_BYTES);
function getIdGenerator(bytes) {
  return function generateId() {
    for (let i = 0; i < bytes / 4; i++) {
      SHARED_BUFFER.writeUInt32BE(Math.random() * 2 ** 32 >>> 0, i * 4);
    }
    for (let i = 0; i < bytes; i++) {
      if (SHARED_BUFFER[i] > 0) {
        break;
      } else if (i === bytes - 1) {
        SHARED_BUFFER[bytes - 1] = 1;
      }
    }
    return SHARED_BUFFER.toString("hex", 0, bytes);
  };
}

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/Tracer.js
var Tracer = class {
  /**
   * Constructs a new Tracer instance.
   */
  constructor(instrumentationLibrary, config, _tracerProvider) {
    this._tracerProvider = _tracerProvider;
    const localConfig = mergeConfig(config);
    this._sampler = localConfig.sampler;
    this._generalLimits = localConfig.generalLimits;
    this._spanLimits = localConfig.spanLimits;
    this._idGenerator = config.idGenerator || new RandomIdGenerator();
    this.resource = _tracerProvider.resource;
    this.instrumentationLibrary = instrumentationLibrary;
  }
  /**
   * Starts a new Span or returns the default NoopSpan based on the sampling
   * decision.
   */
  startSpan(name, options = {}, context2 = context.active()) {
    var _a, _b, _c;
    if (options.root) {
      context2 = trace.deleteSpan(context2);
    }
    const parentSpan = trace.getSpan(context2);
    if (isTracingSuppressed(context2)) {
      diag2.debug("Instrumentation suppressed, returning Noop Span");
      const nonRecordingSpan = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
      return nonRecordingSpan;
    }
    const parentSpanContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
    const spanId = this._idGenerator.generateSpanId();
    let traceId;
    let traceState;
    let parentSpanId;
    if (!parentSpanContext || !trace.isSpanContextValid(parentSpanContext)) {
      traceId = this._idGenerator.generateTraceId();
    } else {
      traceId = parentSpanContext.traceId;
      traceState = parentSpanContext.traceState;
      parentSpanId = parentSpanContext.spanId;
    }
    const spanKind = (_a = options.kind) !== null && _a !== void 0 ? _a : SpanKind.INTERNAL;
    const links = ((_b = options.links) !== null && _b !== void 0 ? _b : []).map((link) => {
      return {
        context: link.context,
        attributes: sanitizeAttributes(link.attributes)
      };
    });
    const attributes = sanitizeAttributes(options.attributes);
    const samplingResult = this._sampler.shouldSample(context2, traceId, name, spanKind, attributes, links);
    traceState = (_c = samplingResult.traceState) !== null && _c !== void 0 ? _c : traceState;
    const traceFlags = samplingResult.decision === SamplingDecision.RECORD_AND_SAMPLED ? TraceFlags.SAMPLED : TraceFlags.NONE;
    const spanContext = { traceId, spanId, traceFlags, traceState };
    if (samplingResult.decision === SamplingDecision.NOT_RECORD) {
      diag2.debug("Recording is off, propagating context in a non-recording span");
      const nonRecordingSpan = trace.wrapSpanContext(spanContext);
      return nonRecordingSpan;
    }
    const initAttributes = sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
    const span = new Span(this, context2, name, spanContext, spanKind, parentSpanId, links, options.startTime, void 0, initAttributes);
    return span;
  }
  startActiveSpan(name, arg2, arg3, arg4) {
    let opts;
    let ctx;
    let fn;
    if (arguments.length < 2) {
      return;
    } else if (arguments.length === 2) {
      fn = arg2;
    } else if (arguments.length === 3) {
      opts = arg2;
      fn = arg3;
    } else {
      opts = arg2;
      ctx = arg3;
      fn = arg4;
    }
    const parentContext = ctx !== null && ctx !== void 0 ? ctx : context.active();
    const span = this.startSpan(name, opts, parentContext);
    const contextWithSpanSet = trace.setSpan(parentContext, span);
    return context.with(contextWithSpanSet, fn, void 0, span);
  }
  /** Returns the active {@link GeneralLimits}. */
  getGeneralLimits() {
    return this._generalLimits;
  }
  /** Returns the active {@link SpanLimits}. */
  getSpanLimits() {
    return this._spanLimits;
  }
  getActiveSpanProcessor() {
    return this._tracerProvider.getActiveSpanProcessor();
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/BasicTracerProvider.js
init_esm();

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/MultiSpanProcessor.js
var MultiSpanProcessor = class {
  constructor(_spanProcessors) {
    this._spanProcessors = _spanProcessors;
  }
  forceFlush() {
    const promises = [];
    for (const spanProcessor of this._spanProcessors) {
      promises.push(spanProcessor.forceFlush());
    }
    return new Promise((resolve) => {
      Promise.all(promises).then(() => {
        resolve();
      }).catch((error) => {
        globalErrorHandler(error || new Error("MultiSpanProcessor: forceFlush failed"));
        resolve();
      });
    });
  }
  onStart(span, context2) {
    for (const spanProcessor of this._spanProcessors) {
      spanProcessor.onStart(span, context2);
    }
  }
  onEnd(span) {
    for (const spanProcessor of this._spanProcessors) {
      spanProcessor.onEnd(span);
    }
  }
  shutdown() {
    const promises = [];
    for (const spanProcessor of this._spanProcessors) {
      promises.push(spanProcessor.shutdown());
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve();
      }, reject);
    });
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/export/NoopSpanProcessor.js
var NoopSpanProcessor = class {
  onStart(_span, _context) {
  }
  onEnd(_span) {
  }
  shutdown() {
    return Promise.resolve();
  }
  forceFlush() {
    return Promise.resolve();
  }
};

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/BasicTracerProvider.js
var ForceFlushState;
(function(ForceFlushState2) {
  ForceFlushState2[ForceFlushState2["resolved"] = 0] = "resolved";
  ForceFlushState2[ForceFlushState2["timeout"] = 1] = "timeout";
  ForceFlushState2[ForceFlushState2["error"] = 2] = "error";
  ForceFlushState2[ForceFlushState2["unresolved"] = 3] = "unresolved";
})(ForceFlushState || (ForceFlushState = {}));
var BasicTracerProvider = class {
  constructor(config = {}) {
    var _a;
    this._registeredSpanProcessors = [];
    this._tracers = /* @__PURE__ */ new Map();
    const mergedConfig = merge({}, loadDefaultConfig(), reconfigureLimits(config));
    this.resource = (_a = mergedConfig.resource) !== null && _a !== void 0 ? _a : Resource.empty();
    this.resource = Resource.default().merge(this.resource);
    this._config = Object.assign({}, mergedConfig, {
      resource: this.resource
    });
    const defaultExporter = this._buildExporterFromEnv();
    if (defaultExporter !== void 0) {
      const batchProcessor = new BatchSpanProcessor(defaultExporter);
      this.activeSpanProcessor = batchProcessor;
    } else {
      this.activeSpanProcessor = new NoopSpanProcessor();
    }
  }
  getTracer(name, version2, options) {
    const key = `${name}@${version2 || ""}:${(options === null || options === void 0 ? void 0 : options.schemaUrl) || ""}`;
    if (!this._tracers.has(key)) {
      this._tracers.set(key, new Tracer({ name, version: version2, schemaUrl: options === null || options === void 0 ? void 0 : options.schemaUrl }, this._config, this));
    }
    return this._tracers.get(key);
  }
  /**
   * Adds a new {@link SpanProcessor} to this tracer.
   * @param spanProcessor the new SpanProcessor to be added.
   */
  addSpanProcessor(spanProcessor) {
    if (this._registeredSpanProcessors.length === 0) {
      this.activeSpanProcessor.shutdown().catch((err) => diag2.error("Error while trying to shutdown current span processor", err));
    }
    this._registeredSpanProcessors.push(spanProcessor);
    this.activeSpanProcessor = new MultiSpanProcessor(this._registeredSpanProcessors);
  }
  getActiveSpanProcessor() {
    return this.activeSpanProcessor;
  }
  /**
   * Register this TracerProvider for use with the OpenTelemetry API.
   * Undefined values may be replaced with defaults, and
   * null values will be skipped.
   *
   * @param config Configuration object for SDK registration
   */
  register(config = {}) {
    trace.setGlobalTracerProvider(this);
    if (config.propagator === void 0) {
      config.propagator = this._buildPropagatorFromEnv();
    }
    if (config.contextManager) {
      context.setGlobalContextManager(config.contextManager);
    }
    if (config.propagator) {
      propagation.setGlobalPropagator(config.propagator);
    }
  }
  forceFlush() {
    const timeout = this._config.forceFlushTimeoutMillis;
    const promises = this._registeredSpanProcessors.map((spanProcessor) => {
      return new Promise((resolve) => {
        let state;
        const timeoutInterval = setTimeout(() => {
          resolve(new Error(`Span processor did not completed within timeout period of ${timeout} ms`));
          state = ForceFlushState.timeout;
        }, timeout);
        spanProcessor.forceFlush().then(() => {
          clearTimeout(timeoutInterval);
          if (state !== ForceFlushState.timeout) {
            state = ForceFlushState.resolved;
            resolve(state);
          }
        }).catch((error) => {
          clearTimeout(timeoutInterval);
          state = ForceFlushState.error;
          resolve(error);
        });
      });
    });
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((results) => {
        const errors = results.filter((result) => result !== ForceFlushState.resolved);
        if (errors.length > 0) {
          reject(errors);
        } else {
          resolve();
        }
      }).catch((error) => reject([error]));
    });
  }
  shutdown() {
    return this.activeSpanProcessor.shutdown();
  }
  /**
   * TS cannot yet infer the type of this.constructor:
   * https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
   * There is no need to override either of the getters in your child class.
   * The type of the registered component maps should be the same across all
   * classes in the inheritance tree.
   */
  _getPropagator(name) {
    var _a;
    return (_a = this.constructor._registeredPropagators.get(name)) === null || _a === void 0 ? void 0 : _a();
  }
  _getSpanExporter(name) {
    var _a;
    return (_a = this.constructor._registeredExporters.get(name)) === null || _a === void 0 ? void 0 : _a();
  }
  _buildPropagatorFromEnv() {
    const uniquePropagatorNames = Array.from(new Set(getEnv().OTEL_PROPAGATORS));
    const propagators = uniquePropagatorNames.map((name) => {
      const propagator = this._getPropagator(name);
      if (!propagator) {
        diag2.warn(`Propagator "${name}" requested through environment variable is unavailable.`);
      }
      return propagator;
    });
    const validPropagators = propagators.reduce((list, item) => {
      if (item) {
        list.push(item);
      }
      return list;
    }, []);
    if (validPropagators.length === 0) {
      return;
    } else if (uniquePropagatorNames.length === 1) {
      return validPropagators[0];
    } else {
      return new CompositePropagator({
        propagators: validPropagators
      });
    }
  }
  _buildExporterFromEnv() {
    const exporterName = getEnv().OTEL_TRACES_EXPORTER;
    if (exporterName === "none" || exporterName === "")
      return;
    const exporter = this._getSpanExporter(exporterName);
    if (!exporter) {
      diag2.error(`Exporter "${exporterName}" requested through environment variable is unavailable.`);
    }
    return exporter;
  }
};
BasicTracerProvider._registeredPropagators = /* @__PURE__ */ new Map([
  ["tracecontext", () => new W3CTraceContextPropagator()],
  ["baggage", () => new W3CBaggagePropagator()]
]);
BasicTracerProvider._registeredExporters = /* @__PURE__ */ new Map();

// node_modules/@opentelemetry/sdk-trace-base/build/esnext/export/SimpleSpanProcessor.js
init_esm();
var SimpleSpanProcessor = class {
  constructor(_exporter) {
    this._exporter = _exporter;
    this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
    this._unresolvedExports = /* @__PURE__ */ new Set();
  }
  async forceFlush() {
    await Promise.all(Array.from(this._unresolvedExports));
    if (this._exporter.forceFlush) {
      await this._exporter.forceFlush();
    }
  }
  onStart(_span, _parentContext) {
  }
  onEnd(span) {
    var _a, _b;
    if (this._shutdownOnce.isCalled) {
      return;
    }
    if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
      return;
    }
    const doExport = () => internal._export(this._exporter, [span]).then((result) => {
      var _a2;
      if (result.code !== ExportResultCode.SUCCESS) {
        globalErrorHandler((_a2 = result.error) !== null && _a2 !== void 0 ? _a2 : new Error(`SimpleSpanProcessor: span export failed (status ${result})`));
      }
    }).catch((error) => {
      globalErrorHandler(error);
    });
    if (span.resource.asyncAttributesPending) {
      const exportPromise = (_b = (_a = span.resource).waitForAsyncAttributes) === null || _b === void 0 ? void 0 : _b.call(_a).then(() => {
        if (exportPromise != null) {
          this._unresolvedExports.delete(exportPromise);
        }
        return doExport();
      }, (err) => globalErrorHandler(err));
      if (exportPromise != null) {
        this._unresolvedExports.add(exportPromise);
      }
    } else {
      void doExport();
    }
  }
  shutdown() {
    return this._shutdownOnce.call();
  }
  _shutdown() {
    return this._exporter.shutdown();
  }
};

// src/telemetry/netlify_span_exporter.ts
init_esm();

// node_modules/@opentelemetry/otlp-transformer/build/esnext/common/index.js
function hrTimeToNanos(hrTime2) {
  const NANOSECONDS = BigInt(1e9);
  return BigInt(hrTime2[0]) * NANOSECONDS + BigInt(hrTime2[1]);
}
function toLongBits(value) {
  const low = Number(BigInt.asUintN(32, value));
  const high = Number(BigInt.asUintN(32, value >> BigInt(32)));
  return { low, high };
}
function encodeAsLongBits(hrTime2) {
  const nanos = hrTimeToNanos(hrTime2);
  return toLongBits(nanos);
}
function encodeAsString(hrTime2) {
  const nanos = hrTimeToNanos(hrTime2);
  return nanos.toString();
}
var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds;
function identity(value) {
  return value;
}
function optionalHexToBinary(str) {
  if (str === void 0)
    return void 0;
  return hexToBinary(str);
}
var DEFAULT_ENCODER = {
  encodeHrTime: encodeAsLongBits,
  encodeSpanContext: hexToBinary,
  encodeOptionalSpanContext: optionalHexToBinary
};
function getOtlpEncoder(options) {
  var _a, _b;
  if (options === void 0) {
    return DEFAULT_ENCODER;
  }
  const useLongBits = (_a = options.useLongBits) !== null && _a !== void 0 ? _a : true;
  const useHex = (_b = options.useHex) !== null && _b !== void 0 ? _b : false;
  return {
    encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
    encodeSpanContext: useHex ? identity : hexToBinary,
    encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
  };
}

// node_modules/@opentelemetry/otlp-transformer/build/esnext/common/internal.js
function toAttributes(attributes) {
  return Object.keys(attributes).map((key) => toKeyValue(key, attributes[key]));
}
function toKeyValue(key, value) {
  return {
    key,
    value: toAnyValue(value)
  };
}
function toAnyValue(value) {
  const t = typeof value;
  if (t === "string")
    return { stringValue: value };
  if (t === "number") {
    if (!Number.isInteger(value))
      return { doubleValue: value };
    return { intValue: value };
  }
  if (t === "boolean")
    return { boolValue: value };
  if (value instanceof Uint8Array)
    return { bytesValue: value };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map(toAnyValue) } };
  if (t === "object" && value != null)
    return {
      kvlistValue: {
        values: Object.entries(value).map(([k, v]) => toKeyValue(k, v))
      }
    };
  return {};
}

// node_modules/@opentelemetry/otlp-transformer/build/esnext/trace/internal.js
function sdkSpanToOtlpSpan(span, encoder) {
  var _a;
  const ctx = span.spanContext();
  const status = span.status;
  return {
    traceId: encoder.encodeSpanContext(ctx.traceId),
    spanId: encoder.encodeSpanContext(ctx.spanId),
    parentSpanId: encoder.encodeOptionalSpanContext(span.parentSpanId),
    traceState: (_a = ctx.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
    name: span.name,
    // Span kind is offset by 1 because the API does not define a value for unset
    kind: span.kind == null ? 0 : span.kind + 1,
    startTimeUnixNano: encoder.encodeHrTime(span.startTime),
    endTimeUnixNano: encoder.encodeHrTime(span.endTime),
    attributes: toAttributes(span.attributes),
    droppedAttributesCount: span.droppedAttributesCount,
    events: span.events.map((event) => toOtlpSpanEvent(event, encoder)),
    droppedEventsCount: span.droppedEventsCount,
    status: {
      // API and proto enums share the same values
      code: status.code,
      message: status.message
    },
    links: span.links.map((link) => toOtlpLink(link, encoder)),
    droppedLinksCount: span.droppedLinksCount
  };
}
function toOtlpLink(link, encoder) {
  var _a;
  return {
    attributes: link.attributes ? toAttributes(link.attributes) : [],
    spanId: encoder.encodeSpanContext(link.context.spanId),
    traceId: encoder.encodeSpanContext(link.context.traceId),
    traceState: (_a = link.context.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
    droppedAttributesCount: link.droppedAttributesCount || 0
  };
}
function toOtlpSpanEvent(timedEvent, encoder) {
  return {
    attributes: timedEvent.attributes ? toAttributes(timedEvent.attributes) : [],
    name: timedEvent.name,
    timeUnixNano: encoder.encodeHrTime(timedEvent.time),
    droppedAttributesCount: timedEvent.droppedAttributesCount || 0
  };
}

// node_modules/@opentelemetry/otlp-transformer/build/esnext/trace/index.js
function createExportTraceServiceRequest(spans, options) {
  const encoder = getOtlpEncoder(options);
  return {
    resourceSpans: spanRecordsToResourceSpans(spans, encoder)
  };
}
function createResourceMap(readableSpans) {
  const resourceMap = /* @__PURE__ */ new Map();
  for (const record of readableSpans) {
    let ilmMap = resourceMap.get(record.resource);
    if (!ilmMap) {
      ilmMap = /* @__PURE__ */ new Map();
      resourceMap.set(record.resource, ilmMap);
    }
    const instrumentationLibraryKey = `${record.instrumentationLibrary.name}@${record.instrumentationLibrary.version || ""}:${record.instrumentationLibrary.schemaUrl || ""}`;
    let records = ilmMap.get(instrumentationLibraryKey);
    if (!records) {
      records = [];
      ilmMap.set(instrumentationLibraryKey, records);
    }
    records.push(record);
  }
  return resourceMap;
}
function spanRecordsToResourceSpans(readableSpans, encoder) {
  const resourceMap = createResourceMap(readableSpans);
  const out = [];
  const entryIterator = resourceMap.entries();
  let entry = entryIterator.next();
  while (!entry.done) {
    const [resource2, ilmMap] = entry.value;
    const scopeResourceSpans = [];
    const ilmIterator = ilmMap.values();
    let ilmEntry = ilmIterator.next();
    while (!ilmEntry.done) {
      const scopeSpans = ilmEntry.value;
      if (scopeSpans.length > 0) {
        const { name, version: version2, schemaUrl } = scopeSpans[0].instrumentationLibrary;
        const spans = scopeSpans.map((readableSpan) => sdkSpanToOtlpSpan(readableSpan, encoder));
        scopeResourceSpans.push({
          scope: { name, version: version2 },
          spans,
          schemaUrl
        });
      }
      ilmEntry = ilmIterator.next();
    }
    const transformedSpans = {
      resource: {
        attributes: toAttributes(resource2.attributes),
        droppedAttributesCount: 0
      },
      scopeSpans: scopeResourceSpans,
      schemaUrl: void 0
    };
    out.push(transformedSpans);
    entry = entryIterator.next();
  }
  return out;
}

// src/telemetry/netlify_span_exporter.ts
var NetlifySpanExporter = class {
  #shutdownOnce;
  #logger;
  constructor() {
    this.#shutdownOnce = new BindOnceFuture(this.#shutdown, this);
    this.#logger = diag2.createComponentLogger({
      namespace: "netlify-span-exporter"
    });
  }
  /** Convert a readable span array to the OTLP Trace protocol */
  // Having a convert method is a standard practice in OpenTelemetry
  // eslint-disable-next-line class-methods-use-this
  convert(spans) {
    return createExportTraceServiceRequest(spans, {
      useHex: true,
      useLongBits: false
    });
  }
  /** Export spans. */
  export(spans, resultCallback) {
    this.#logger.debug(`export ${spans.length} spans`);
    if (this.#shutdownOnce.isCalled) {
      resultCallback({
        code: ExportResultCode.FAILED,
        error: new Error("Exporter has been shutdown")
      });
      return;
    }
    return this.#sendSpans(spans, resultCallback);
  }
  /**
   * Shutdown the exporter.
   */
  shutdown() {
    this.#logger.debug("Shutting down");
    return this.#shutdownOnce.call();
  }
  /**
   * Exports any pending spans in the exporter
   */
  forceFlush() {
    this.#logger.debug("force flush");
    return Promise.resolve();
  }
  /**
   * Called by #shutdownOnce with BindOnceFuture
   */
  #shutdown() {
    return this.forceFlush();
  }
  /** Log the spans with the system logging capability */
  #sendSpans(spans, done) {
    console.log("__nfOTLPTrace", JSON.stringify(this.convert(spans)));
    if (done) {
      return done({ code: ExportResultCode.SUCCESS });
    }
  }
};

// src/telemetry/instrumentation.ts
if (env2.NETLIFY_DEBUG_OPENTELEMETRY) {
  diag2.setLogger(new DiagConsoleLogger(), { logLevel: DiagLogLevel.ALL, suppressOverrideMessage: true });
}
var resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: "Netlify Functions",
  [SEMRESATTRS_PROCESS_RUNTIME_NAME]: "nodejs",
  // remove the v prefix from the version to match the spec
  [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: version.slice(1)
});
var provider = new BasicTracerProvider({
  resource
});
provider.addSpanProcessor(new SimpleSpanProcessor(new NetlifySpanExporter()));
provider.register();
