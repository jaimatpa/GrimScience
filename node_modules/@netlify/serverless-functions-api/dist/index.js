// src/index.ts
import { fileURLToPath } from "url";

// src/api.ts
import { Buffer as Buffer5 } from "node:buffer";
import { version } from "node:process";
import { pipeline as pipelineCb, Readable } from "node:stream";
import { promisify } from "node:util";

// src/account.ts
var getAccountObject = (idHeader) => ({
  id: idHeader ?? ""
});

// src/deploy.ts
var getDeploybject = (idHeader) => ({
  id: idHeader ?? ""
});

// src/request.ts
import { Buffer as Buffer2 } from "buffer";
var requestFlags = Symbol("Request flags");
var requestRoute = Symbol("Request route");
var BaseRequest = typeof Request === "undefined" ? class {
} : Request;
var NetlifyRequest = class extends BaseRequest {
};
requestFlags, requestRoute;
var buildRequestBody = (body, isBase64Encoded) => {
  if (body === null || body === void 0 || body === "") {
    return;
  }
  if (isBase64Encoded) {
    return Buffer2.from(body, "base64");
  }
  return body;
};

// src/flags.ts
var Flags = class {
  #evaluatedFlags;
  #values;
  constructor(values) {
    this.#evaluatedFlags = /* @__PURE__ */ new Set();
    this.#values = values;
  }
  get(key) {
    const value = this.#values[key];
    if (value !== void 0) {
      this.#evaluatedFlags.add(key);
    }
    return value;
  }
  get evaluations() {
    return this.#evaluatedFlags;
  }
};
var getRequestFlags = (req) => req[requestFlags] ?? new Flags({});
var setRequestFlags = (event, req) => {
  const { flags: flagValues = {} } = event;
  req[requestFlags] = new Flags(flagValues);
};

// src/geo.ts
import { Buffer as Buffer3 } from "node:buffer";
var parseGeoHeader = (geoHeader) => {
  if (geoHeader === null) {
    return {};
  }
  try {
    const geoData = JSON.parse(Buffer3.from(geoHeader, "base64").toString("utf-8"));
    return geoData;
  } catch {
    return {};
  }
};

// src/headers.ts
var NFClientConnectionIP = "x-nf-client-connection-ip";
var NFGeo = "x-nf-geo";
var NFAccountID = "x-nf-account-id";
var NFDeployID = "x-nf-deploy-id";
var NFSiteID = "x-nf-site-id";
var NFRequestFlags = "x-nf-request-flags";
var NFInvocationMetadata = "x-nf-invocation-metadata";
var NFRequestID = "x-nf-request-id";
var fromEventHeaders = (eventHeaders) => {
  const headers = new Headers();
  Object.entries(eventHeaders).forEach(([name, value]) => {
    if (value !== void 0) {
      headers.set(name.toLowerCase(), value);
    }
  });
  return headers;
};
var toMultiValueHeaders = (headers) => {
  const headersObj = {};
  for (const [name, value] of headers.entries()) {
    if (name in headersObj) {
      headersObj[name].push(value);
    } else {
      headersObj[name] = [value];
    }
  }
  return headersObj;
};

// src/ip.ts
var getIP = (ipHeader) => ipHeader ?? "";

// node_modules/urlpattern-polyfill/dist/urlpattern.js
var Part = class {
  constructor(type, name, prefix, value, suffix, modifier) {
    this.type = 3;
    this.name = "";
    this.prefix = "";
    this.value = "";
    this.suffix = "";
    this.modifier = 3;
    this.type = type;
    this.name = name;
    this.prefix = prefix;
    this.value = value;
    this.suffix = suffix;
    this.modifier = modifier;
  }
  hasCustomName() {
    return this.name !== "" && typeof this.name !== "number";
  }
};
var regexIdentifierStart = /[$_\p{ID_Start}]/u;
var regexIdentifierPart = /[$_\u200C\u200D\p{ID_Continue}]/u;
var kFullWildcardRegex = ".*";
function isASCII(str, extended) {
  return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(str);
}
function lexer(str, lenient = false) {
  const tokens = [];
  let i = 0;
  while (i < str.length) {
    const char = str[i];
    const ErrorOrInvalid = function(msg) {
      if (!lenient)
        throw new TypeError(msg);
      tokens.push({ type: "INVALID_CHAR", index: i, value: str[i++] });
    };
    if (char === "*") {
      tokens.push({ type: "ASTERISK", index: i, value: str[i++] });
      continue;
    }
    if (char === "+" || char === "?") {
      tokens.push({ type: "OTHER_MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      let name = "";
      let j = i + 1;
      while (j < str.length) {
        const code = str.substr(j, 1);
        if (j === i + 1 && regexIdentifierStart.test(code) || j !== i + 1 && regexIdentifierPart.test(code)) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name) {
        ErrorOrInvalid(`Missing parameter name at ${i}`);
        continue;
      }
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      let count = 1;
      let pattern = "";
      let j = i + 1;
      let error2 = false;
      if (str[j] === "?") {
        ErrorOrInvalid(`Pattern cannot start with "?" at ${j}`);
        continue;
      }
      while (j < str.length) {
        if (!isASCII(str[j], false)) {
          ErrorOrInvalid(`Invalid character '${str[j]}' at ${j}.`);
          error2 = true;
          break;
        }
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            ErrorOrInvalid(`Capturing groups are not allowed at ${j}`);
            error2 = true;
            break;
          }
        }
        pattern += str[j++];
      }
      if (error2) {
        continue;
      }
      if (count) {
        ErrorOrInvalid(`Unbalanced pattern at ${i}`);
        continue;
      }
      if (!pattern) {
        ErrorOrInvalid(`Missing pattern at ${i}`);
        continue;
      }
      tokens.push({ type: "REGEX", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse(str, options = {}) {
  const tokens = lexer(str);
  options.delimiter ?? (options.delimiter = "/#?");
  options.prefixes ?? (options.prefixes = "./");
  const segmentWildcardRegex = `[^${escapeString(options.delimiter)}]+?`;
  const result = [];
  let key = 0;
  let i = 0;
  let path = "";
  let nameSet = /* @__PURE__ */ new Set();
  const tryConsume = (type) => {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  const tryConsumeModifier = () => {
    return tryConsume("OTHER_MODIFIER") ?? tryConsume("ASTERISK");
  };
  const mustConsume = (type) => {
    const value = tryConsume(type);
    if (value !== void 0)
      return value;
    const { type: nextType, index } = tokens[i];
    throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
  };
  const consumeText = () => {
    let result2 = "";
    let value;
    while (value = tryConsume("CHAR") ?? tryConsume("ESCAPED_CHAR")) {
      result2 += value;
    }
    return result2;
  };
  const DefaultEncodePart = (value) => {
    return value;
  };
  const encodePart = options.encodePart || DefaultEncodePart;
  let pendingFixedValue = "";
  const appendToPendingFixedValue = (value) => {
    pendingFixedValue += value;
  };
  const maybeAddPartFromPendingFixedValue = () => {
    if (!pendingFixedValue.length) {
      return;
    }
    result.push(new Part(
      3,
      "",
      "",
      encodePart(pendingFixedValue),
      "",
      3
      /* kNone */
    ));
    pendingFixedValue = "";
  };
  const addPart = (prefix, nameToken, regexOrWildcardToken, suffix, modifierToken) => {
    let modifier = 3;
    switch (modifierToken) {
      case "?":
        modifier = 1;
        break;
      case "*":
        modifier = 0;
        break;
      case "+":
        modifier = 2;
        break;
    }
    if (!nameToken && !regexOrWildcardToken && modifier === 3) {
      appendToPendingFixedValue(prefix);
      return;
    }
    maybeAddPartFromPendingFixedValue();
    if (!nameToken && !regexOrWildcardToken) {
      if (!prefix) {
        return;
      }
      result.push(new Part(3, "", "", encodePart(prefix), "", modifier));
      return;
    }
    let regexValue;
    if (!regexOrWildcardToken) {
      regexValue = segmentWildcardRegex;
    } else if (regexOrWildcardToken === "*") {
      regexValue = kFullWildcardRegex;
    } else {
      regexValue = regexOrWildcardToken;
    }
    let type = 2;
    if (regexValue === segmentWildcardRegex) {
      type = 1;
      regexValue = "";
    } else if (regexValue === kFullWildcardRegex) {
      type = 0;
      regexValue = "";
    }
    let name;
    if (nameToken) {
      name = nameToken;
    } else if (regexOrWildcardToken) {
      name = key++;
    }
    if (nameSet.has(name)) {
      throw new TypeError(`Duplicate name '${name}'.`);
    }
    nameSet.add(name);
    result.push(new Part(type, name, encodePart(prefix), regexValue, encodePart(suffix), modifier));
  };
  while (i < tokens.length) {
    const charToken = tryConsume("CHAR");
    const nameToken = tryConsume("NAME");
    let regexOrWildcardToken = tryConsume("REGEX");
    if (!nameToken && !regexOrWildcardToken) {
      regexOrWildcardToken = tryConsume("ASTERISK");
    }
    if (nameToken || regexOrWildcardToken) {
      let prefix = charToken ?? "";
      if (options.prefixes.indexOf(prefix) === -1) {
        appendToPendingFixedValue(prefix);
        prefix = "";
      }
      maybeAddPartFromPendingFixedValue();
      let modifierToken = tryConsumeModifier();
      addPart(prefix, nameToken, regexOrWildcardToken, "", modifierToken);
      continue;
    }
    const value = charToken ?? tryConsume("ESCAPED_CHAR");
    if (value) {
      appendToPendingFixedValue(value);
      continue;
    }
    const openToken = tryConsume("OPEN");
    if (openToken) {
      const prefix = consumeText();
      const nameToken2 = tryConsume("NAME");
      let regexOrWildcardToken2 = tryConsume("REGEX");
      if (!nameToken2 && !regexOrWildcardToken2) {
        regexOrWildcardToken2 = tryConsume("ASTERISK");
      }
      const suffix = consumeText();
      mustConsume("CLOSE");
      const modifierToken = tryConsumeModifier();
      addPart(prefix, nameToken2, regexOrWildcardToken2, suffix, modifierToken);
      continue;
    }
    maybeAddPartFromPendingFixedValue();
    mustConsume("END");
  }
  return result;
}
function escapeString(str) {
  return str.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.ignoreCase ? "ui" : "u";
}
function stringToRegexp(path, names, options) {
  return partsToRegexp(parse(path, options), names, options);
}
function modifierToString(modifier) {
  switch (modifier) {
    case 0:
      return "*";
    case 1:
      return "?";
    case 2:
      return "+";
    case 3:
      return "";
  }
}
function partsToRegexp(parts, names, options = {}) {
  options.delimiter ?? (options.delimiter = "/#?");
  options.prefixes ?? (options.prefixes = "./");
  options.sensitive ?? (options.sensitive = false);
  options.strict ?? (options.strict = false);
  options.end ?? (options.end = true);
  options.start ?? (options.start = true);
  options.endsWith = "";
  let result = options.start ? "^" : "";
  for (const part of parts) {
    if (part.type === 3) {
      if (part.modifier === 3) {
        result += escapeString(part.value);
      } else {
        result += `(?:${escapeString(part.value)})${modifierToString(part.modifier)}`;
      }
      continue;
    }
    if (names)
      names.push(part.name);
    const segmentWildcardRegex = `[^${escapeString(options.delimiter)}]+?`;
    let regexValue = part.value;
    if (part.type === 1)
      regexValue = segmentWildcardRegex;
    else if (part.type === 0)
      regexValue = kFullWildcardRegex;
    if (!part.prefix.length && !part.suffix.length) {
      if (part.modifier === 3 || part.modifier === 1) {
        result += `(${regexValue})${modifierToString(part.modifier)}`;
      } else {
        result += `((?:${regexValue})${modifierToString(part.modifier)})`;
      }
      continue;
    }
    if (part.modifier === 3 || part.modifier === 1) {
      result += `(?:${escapeString(part.prefix)}(${regexValue})${escapeString(part.suffix)})`;
      result += modifierToString(part.modifier);
      continue;
    }
    result += `(?:${escapeString(part.prefix)}`;
    result += `((?:${regexValue})(?:`;
    result += escapeString(part.suffix);
    result += escapeString(part.prefix);
    result += `(?:${regexValue}))*)${escapeString(part.suffix)})`;
    if (part.modifier === 0) {
      result += "?";
    }
  }
  const endsWith = `[${escapeString(options.endsWith)}]|$`;
  const delimiter = `[${escapeString(options.delimiter)}]`;
  if (options.end) {
    if (!options.strict) {
      result += `${delimiter}?`;
    }
    if (!options.endsWith.length) {
      result += "$";
    } else {
      result += `(?=${endsWith})`;
    }
    return new RegExp(result, flags(options));
  }
  if (!options.strict) {
    result += `(?:${delimiter}(?=${endsWith}))?`;
  }
  let isEndDelimited = false;
  if (parts.length) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.type === 3 && lastPart.modifier === 3) {
      isEndDelimited = options.delimiter.indexOf(lastPart) > -1;
    }
  }
  if (!isEndDelimited) {
    result += `(?=${delimiter}|${endsWith})`;
  }
  return new RegExp(result, flags(options));
}
var DEFAULT_OPTIONS = {
  delimiter: "",
  prefixes: "",
  sensitive: true,
  strict: true
};
var HOSTNAME_OPTIONS = {
  delimiter: ".",
  prefixes: "",
  sensitive: true,
  strict: true
};
var PATHNAME_OPTIONS = {
  delimiter: "/",
  prefixes: "/",
  sensitive: true,
  strict: true
};
function isAbsolutePathname(pathname, isPattern) {
  if (!pathname.length) {
    return false;
  }
  if (pathname[0] === "/") {
    return true;
  }
  if (!isPattern) {
    return false;
  }
  if (pathname.length < 2) {
    return false;
  }
  if ((pathname[0] == "\\" || pathname[0] == "{") && pathname[1] == "/") {
    return true;
  }
  return false;
}
function maybeStripPrefix(value, prefix) {
  if (value.startsWith(prefix)) {
    return value.substring(prefix.length, value.length);
  }
  return value;
}
function maybeStripSuffix(value, suffix) {
  if (value.endsWith(suffix)) {
    return value.substr(0, value.length - suffix.length);
  }
  return value;
}
function treatAsIPv6Hostname(value) {
  if (!value || value.length < 2) {
    return false;
  }
  if (value[0] === "[") {
    return true;
  }
  if ((value[0] === "\\" || value[0] === "{") && value[1] === "[") {
    return true;
  }
  return false;
}
var SPECIAL_SCHEMES = [
  "ftp",
  "file",
  "http",
  "https",
  "ws",
  "wss"
];
function isSpecialScheme(protocol_regexp) {
  if (!protocol_regexp) {
    return true;
  }
  for (const scheme of SPECIAL_SCHEMES) {
    if (protocol_regexp.test(scheme)) {
      return true;
    }
  }
  return false;
}
function canonicalizeHash(hash, isPattern) {
  hash = maybeStripPrefix(hash, "#");
  if (isPattern || hash === "") {
    return hash;
  }
  const url = new URL("https://example.com");
  url.hash = hash;
  return url.hash ? url.hash.substring(1, url.hash.length) : "";
}
function canonicalizeSearch(search, isPattern) {
  search = maybeStripPrefix(search, "?");
  if (isPattern || search === "") {
    return search;
  }
  const url = new URL("https://example.com");
  url.search = search;
  return url.search ? url.search.substring(1, url.search.length) : "";
}
function canonicalizeHostname(hostname, isPattern) {
  if (isPattern || hostname === "") {
    return hostname;
  }
  if (treatAsIPv6Hostname(hostname)) {
    return ipv6HostnameEncodeCallback(hostname);
  } else {
    return hostnameEncodeCallback(hostname);
  }
}
function canonicalizePassword(password, isPattern) {
  if (isPattern || password === "") {
    return password;
  }
  const url = new URL("https://example.com");
  url.password = password;
  return url.password;
}
function canonicalizeUsername(username, isPattern) {
  if (isPattern || username === "") {
    return username;
  }
  const url = new URL("https://example.com");
  url.username = username;
  return url.username;
}
function canonicalizePathname(pathname, protocol, isPattern) {
  if (isPattern || pathname === "") {
    return pathname;
  }
  if (protocol && !SPECIAL_SCHEMES.includes(protocol)) {
    const url = new URL(`${protocol}:${pathname}`);
    return url.pathname;
  }
  const leadingSlash = pathname[0] == "/";
  pathname = new URL(
    !leadingSlash ? "/-" + pathname : pathname,
    "https://example.com"
  ).pathname;
  if (!leadingSlash) {
    pathname = pathname.substring(2, pathname.length);
  }
  return pathname;
}
function canonicalizePort(port, protocol, isPattern) {
  if (defaultPortForProtocol(protocol) === port) {
    port = "";
  }
  if (isPattern || port === "") {
    return port;
  }
  return portEncodeCallback(port);
}
function canonicalizeProtocol(protocol, isPattern) {
  protocol = maybeStripSuffix(protocol, ":");
  if (isPattern || protocol === "") {
    return protocol;
  }
  return protocolEncodeCallback(protocol);
}
function defaultPortForProtocol(protocol) {
  switch (protocol) {
    case "ws":
    case "http":
      return "80";
    case "wws":
    case "https":
      return "443";
    case "ftp":
      return "21";
    default:
      return "";
  }
}
function protocolEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  if (/^[-+.A-Za-z0-9]*$/.test(input))
    return input.toLowerCase();
  throw new TypeError(`Invalid protocol '${input}'.`);
}
function usernameEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL("https://example.com");
  url.username = input;
  return url.username;
}
function passwordEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL("https://example.com");
  url.password = input;
  return url.password;
}
function hostnameEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(input)) {
    throw new TypeError(`Invalid hostname '${input}'`);
  }
  const url = new URL("https://example.com");
  url.hostname = input;
  return url.hostname;
}
function ipv6HostnameEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  if (/[^0-9a-fA-F[\]:]/g.test(input)) {
    throw new TypeError(`Invalid IPv6 hostname '${input}'`);
  }
  return input.toLowerCase();
}
function portEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  if (/^[0-9]*$/.test(input) && parseInt(input) <= 65535) {
    return input;
  }
  throw new TypeError(`Invalid port '${input}'.`);
}
function standardURLPathnameEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL("https://example.com");
  url.pathname = input[0] !== "/" ? "/-" + input : input;
  if (input[0] !== "/") {
    return url.pathname.substring(2, url.pathname.length);
  }
  return url.pathname;
}
function pathURLPathnameEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL(`data:${input}`);
  return url.pathname;
}
function searchEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL("https://example.com");
  url.search = input;
  return url.search.substring(1, url.search.length);
}
function hashEncodeCallback(input) {
  if (input === "") {
    return input;
  }
  const url = new URL("https://example.com");
  url.hash = input;
  return url.hash.substring(1, url.hash.length);
}
var Parser = class {
  constructor(input) {
    this.tokenList = [];
    this.internalResult = {};
    this.tokenIndex = 0;
    this.tokenIncrement = 1;
    this.componentStart = 0;
    this.state = 0;
    this.groupDepth = 0;
    this.hostnameIPv6BracketDepth = 0;
    this.shouldTreatAsStandardURL = false;
    this.input = input;
  }
  // Return the parse result.  The result is only available after the
  // `parse()` method completes.
  get result() {
    return this.internalResult;
  }
  // Attempt to parse the input string used to construct the Parser object.
  // This method may only be called once.  Any errors will be thrown as an
  // exception.  Retrieve the parse result by accessing the `Parser.result`
  // property getter.
  parse() {
    this.tokenList = lexer(
      this.input,
      /*lenient=*/
      true
    );
    for (; this.tokenIndex < this.tokenList.length; this.tokenIndex += this.tokenIncrement) {
      this.tokenIncrement = 1;
      if (this.tokenList[this.tokenIndex].type === "END") {
        if (this.state === 0) {
          this.rewind();
          if (this.isHashPrefix()) {
            this.changeState(
              9,
              /*skip=*/
              1
            );
          } else if (this.isSearchPrefix()) {
            this.changeState(
              8,
              /*skip=*/
              1
            );
            this.internalResult.hash = "";
          } else {
            this.changeState(
              7,
              /*skip=*/
              0
            );
            this.internalResult.search = "";
            this.internalResult.hash = "";
          }
          continue;
        } else if (this.state === 2) {
          this.rewindAndSetState(
            5
            /* HOSTNAME */
          );
          continue;
        }
        this.changeState(
          10,
          /*skip=*/
          0
        );
        break;
      }
      if (this.groupDepth > 0) {
        if (this.isGroupClose()) {
          this.groupDepth -= 1;
        } else {
          continue;
        }
      }
      if (this.isGroupOpen()) {
        this.groupDepth += 1;
        continue;
      }
      switch (this.state) {
        case 0:
          if (this.isProtocolSuffix()) {
            this.internalResult.username = "";
            this.internalResult.password = "";
            this.internalResult.hostname = "";
            this.internalResult.port = "";
            this.internalResult.pathname = "";
            this.internalResult.search = "";
            this.internalResult.hash = "";
            this.rewindAndSetState(
              1
              /* PROTOCOL */
            );
          }
          break;
        case 1:
          if (this.isProtocolSuffix()) {
            this.computeShouldTreatAsStandardURL();
            let nextState = 7;
            let skip = 1;
            if (this.shouldTreatAsStandardURL) {
              this.internalResult.pathname = "/";
            }
            if (this.nextIsAuthoritySlashes()) {
              nextState = 2;
              skip = 3;
            } else if (this.shouldTreatAsStandardURL) {
              nextState = 2;
            }
            this.changeState(nextState, skip);
          }
          break;
        case 2:
          if (this.isIdentityTerminator()) {
            this.rewindAndSetState(
              3
              /* USERNAME */
            );
          } else if (this.isPathnameStart() || this.isSearchPrefix() || this.isHashPrefix()) {
            this.rewindAndSetState(
              5
              /* HOSTNAME */
            );
          }
          break;
        case 3:
          if (this.isPasswordPrefix()) {
            this.changeState(
              4,
              /*skip=*/
              1
            );
          } else if (this.isIdentityTerminator()) {
            this.changeState(
              5,
              /*skip=*/
              1
            );
          }
          break;
        case 4:
          if (this.isIdentityTerminator()) {
            this.changeState(
              5,
              /*skip=*/
              1
            );
          }
          break;
        case 5:
          if (this.isIPv6Open()) {
            this.hostnameIPv6BracketDepth += 1;
          } else if (this.isIPv6Close()) {
            this.hostnameIPv6BracketDepth -= 1;
          }
          if (this.isPortPrefix() && !this.hostnameIPv6BracketDepth) {
            this.changeState(
              6,
              /*skip=*/
              1
            );
          } else if (this.isPathnameStart()) {
            this.changeState(
              7,
              /*skip=*/
              0
            );
          } else if (this.isSearchPrefix()) {
            this.changeState(
              8,
              /*skip=*/
              1
            );
          } else if (this.isHashPrefix()) {
            this.changeState(
              9,
              /*skip=*/
              1
            );
          }
          break;
        case 6:
          if (this.isPathnameStart()) {
            this.changeState(
              7,
              /*skip=*/
              0
            );
          } else if (this.isSearchPrefix()) {
            this.changeState(
              8,
              /*skip=*/
              1
            );
          } else if (this.isHashPrefix()) {
            this.changeState(
              9,
              /*skip=*/
              1
            );
          }
          break;
        case 7:
          if (this.isSearchPrefix()) {
            this.changeState(
              8,
              /*skip=*/
              1
            );
          } else if (this.isHashPrefix()) {
            this.changeState(
              9,
              /*skip=*/
              1
            );
          }
          break;
        case 8:
          if (this.isHashPrefix()) {
            this.changeState(
              9,
              /*skip=*/
              1
            );
          }
          break;
        case 9:
          break;
        case 10:
          break;
      }
    }
  }
  changeState(newState, skip) {
    switch (this.state) {
      case 0:
        break;
      case 1:
        this.internalResult.protocol = this.makeComponentString();
        break;
      case 2:
        break;
      case 3:
        this.internalResult.username = this.makeComponentString();
        break;
      case 4:
        this.internalResult.password = this.makeComponentString();
        break;
      case 5:
        this.internalResult.hostname = this.makeComponentString();
        break;
      case 6:
        this.internalResult.port = this.makeComponentString();
        break;
      case 7:
        this.internalResult.pathname = this.makeComponentString();
        break;
      case 8:
        this.internalResult.search = this.makeComponentString();
        break;
      case 9:
        this.internalResult.hash = this.makeComponentString();
        break;
      case 10:
        break;
    }
    this.changeStateWithoutSettingComponent(newState, skip);
  }
  changeStateWithoutSettingComponent(newState, skip) {
    this.state = newState;
    this.componentStart = this.tokenIndex + skip;
    this.tokenIndex += skip;
    this.tokenIncrement = 0;
  }
  rewind() {
    this.tokenIndex = this.componentStart;
    this.tokenIncrement = 0;
  }
  rewindAndSetState(newState) {
    this.rewind();
    this.state = newState;
  }
  safeToken(index) {
    if (index < 0) {
      index = this.tokenList.length - index;
    }
    if (index < this.tokenList.length) {
      return this.tokenList[index];
    }
    return this.tokenList[this.tokenList.length - 1];
  }
  isNonSpecialPatternChar(index, value) {
    const token = this.safeToken(index);
    return token.value === value && (token.type === "CHAR" || token.type === "ESCAPED_CHAR" || token.type === "INVALID_CHAR");
  }
  isProtocolSuffix() {
    return this.isNonSpecialPatternChar(this.tokenIndex, ":");
  }
  nextIsAuthoritySlashes() {
    return this.isNonSpecialPatternChar(this.tokenIndex + 1, "/") && this.isNonSpecialPatternChar(this.tokenIndex + 2, "/");
  }
  isIdentityTerminator() {
    return this.isNonSpecialPatternChar(this.tokenIndex, "@");
  }
  isPasswordPrefix() {
    return this.isNonSpecialPatternChar(this.tokenIndex, ":");
  }
  isPortPrefix() {
    return this.isNonSpecialPatternChar(this.tokenIndex, ":");
  }
  isPathnameStart() {
    return this.isNonSpecialPatternChar(this.tokenIndex, "/");
  }
  isSearchPrefix() {
    if (this.isNonSpecialPatternChar(this.tokenIndex, "?")) {
      return true;
    }
    if (this.tokenList[this.tokenIndex].value !== "?") {
      return false;
    }
    const previousToken = this.safeToken(this.tokenIndex - 1);
    return previousToken.type !== "NAME" && previousToken.type !== "REGEX" && previousToken.type !== "CLOSE" && previousToken.type !== "ASTERISK";
  }
  isHashPrefix() {
    return this.isNonSpecialPatternChar(this.tokenIndex, "#");
  }
  isGroupOpen() {
    return this.tokenList[this.tokenIndex].type == "OPEN";
  }
  isGroupClose() {
    return this.tokenList[this.tokenIndex].type == "CLOSE";
  }
  isIPv6Open() {
    return this.isNonSpecialPatternChar(this.tokenIndex, "[");
  }
  isIPv6Close() {
    return this.isNonSpecialPatternChar(this.tokenIndex, "]");
  }
  makeComponentString() {
    const token = this.tokenList[this.tokenIndex];
    const componentCharStart = this.safeToken(this.componentStart).index;
    return this.input.substring(componentCharStart, token.index);
  }
  computeShouldTreatAsStandardURL() {
    const options = {};
    Object.assign(options, DEFAULT_OPTIONS);
    options.encodePart = protocolEncodeCallback;
    const regexp = stringToRegexp(
      this.makeComponentString(),
      /*keys=*/
      void 0,
      options
    );
    this.shouldTreatAsStandardURL = isSpecialScheme(regexp);
  }
};
var COMPONENTS = [
  "protocol",
  "username",
  "password",
  "hostname",
  "port",
  "pathname",
  "search",
  "hash"
];
var DEFAULT_PATTERN = "*";
function extractValues(url, baseURL) {
  if (typeof url !== "string") {
    throw new TypeError(`parameter 1 is not of type 'string'.`);
  }
  const o = new URL(url, baseURL);
  return {
    protocol: o.protocol.substring(0, o.protocol.length - 1),
    username: o.username,
    password: o.password,
    hostname: o.hostname,
    port: o.port,
    pathname: o.pathname,
    search: o.search !== "" ? o.search.substring(1, o.search.length) : void 0,
    hash: o.hash !== "" ? o.hash.substring(1, o.hash.length) : void 0
  };
}
function processBaseURLString(input, isPattern) {
  if (!isPattern) {
    return input;
  }
  return escapePatternString(input);
}
function applyInit(o, init, isPattern) {
  let baseURL;
  if (typeof init.baseURL === "string") {
    try {
      baseURL = new URL(init.baseURL);
      o.protocol = processBaseURLString(baseURL.protocol.substring(0, baseURL.protocol.length - 1), isPattern);
      o.username = processBaseURLString(baseURL.username, isPattern);
      o.password = processBaseURLString(baseURL.password, isPattern);
      o.hostname = processBaseURLString(baseURL.hostname, isPattern);
      o.port = processBaseURLString(baseURL.port, isPattern);
      o.pathname = processBaseURLString(baseURL.pathname, isPattern);
      o.search = processBaseURLString(baseURL.search.substring(1, baseURL.search.length), isPattern);
      o.hash = processBaseURLString(baseURL.hash.substring(1, baseURL.hash.length), isPattern);
    } catch {
      throw new TypeError(`invalid baseURL '${init.baseURL}'.`);
    }
  }
  if (typeof init.protocol === "string") {
    o.protocol = canonicalizeProtocol(init.protocol, isPattern);
  }
  if (typeof init.username === "string") {
    o.username = canonicalizeUsername(init.username, isPattern);
  }
  if (typeof init.password === "string") {
    o.password = canonicalizePassword(init.password, isPattern);
  }
  if (typeof init.hostname === "string") {
    o.hostname = canonicalizeHostname(init.hostname, isPattern);
  }
  if (typeof init.port === "string") {
    o.port = canonicalizePort(init.port, o.protocol, isPattern);
  }
  if (typeof init.pathname === "string") {
    o.pathname = init.pathname;
    if (baseURL && !isAbsolutePathname(o.pathname, isPattern)) {
      const slashIndex = baseURL.pathname.lastIndexOf("/");
      if (slashIndex >= 0) {
        o.pathname = processBaseURLString(baseURL.pathname.substring(0, slashIndex + 1), isPattern) + o.pathname;
      }
    }
    o.pathname = canonicalizePathname(o.pathname, o.protocol, isPattern);
  }
  if (typeof init.search === "string") {
    o.search = canonicalizeSearch(init.search, isPattern);
  }
  if (typeof init.hash === "string") {
    o.hash = canonicalizeHash(init.hash, isPattern);
  }
  return o;
}
function escapePatternString(value) {
  return value.replace(/([+*?:{}()\\])/g, "\\$1");
}
function escapeRegexpString(value) {
  return value.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
function partsToPattern(parts, options) {
  options.delimiter ?? (options.delimiter = "/#?");
  options.prefixes ?? (options.prefixes = "./");
  options.sensitive ?? (options.sensitive = false);
  options.strict ?? (options.strict = false);
  options.end ?? (options.end = true);
  options.start ?? (options.start = true);
  options.endsWith = "";
  const kFullWildcardRegex2 = ".*";
  const segmentWildcardRegex = `[^${escapeRegexpString(options.delimiter)}]+?`;
  const regexIdentifierPart2 = /[$_\u200C\u200D\p{ID_Continue}]/u;
  let result = "";
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (part.type === 3) {
      if (part.modifier === 3) {
        result += escapePatternString(part.value);
        continue;
      }
      result += `{${escapePatternString(part.value)}}${modifierToString(part.modifier)}`;
      continue;
    }
    const customName = part.hasCustomName();
    let needsGrouping = !!part.suffix.length || !!part.prefix.length && (part.prefix.length !== 1 || !options.prefixes.includes(part.prefix));
    const lastPart = i > 0 ? parts[i - 1] : null;
    const nextPart = i < parts.length - 1 ? parts[i + 1] : null;
    if (!needsGrouping && customName && part.type === 1 && part.modifier === 3 && nextPart && !nextPart.prefix.length && !nextPart.suffix.length) {
      if (nextPart.type === 3) {
        const code = nextPart.value.length > 0 ? nextPart.value[0] : "";
        needsGrouping = regexIdentifierPart2.test(code);
      } else {
        needsGrouping = !nextPart.hasCustomName();
      }
    }
    if (!needsGrouping && !part.prefix.length && lastPart && lastPart.type === 3) {
      const code = lastPart.value[lastPart.value.length - 1];
      needsGrouping = options.prefixes.includes(code);
    }
    if (needsGrouping) {
      result += "{";
    }
    result += escapePatternString(part.prefix);
    if (customName) {
      result += `:${part.name}`;
    }
    if (part.type === 2) {
      result += `(${part.value})`;
    } else if (part.type === 1) {
      if (!customName) {
        result += `(${segmentWildcardRegex})`;
      }
    } else if (part.type === 0) {
      if (!customName && (!lastPart || lastPart.type === 3 || lastPart.modifier !== 3 || needsGrouping || part.prefix !== "")) {
        result += "*";
      } else {
        result += `(${kFullWildcardRegex2})`;
      }
    }
    if (part.type === 1 && customName && !!part.suffix.length) {
      if (regexIdentifierPart2.test(part.suffix[0])) {
        result += "\\";
      }
    }
    result += escapePatternString(part.suffix);
    if (needsGrouping) {
      result += "}";
    }
    if (part.modifier !== 3) {
      result += modifierToString(part.modifier);
    }
  }
  return result;
}
var URLPattern = class {
  constructor(init = {}, baseURLOrOptions, options) {
    this.regexp = {};
    this.names = {};
    this.component_pattern = {};
    this.parts = {};
    try {
      let baseURL = void 0;
      if (typeof baseURLOrOptions === "string") {
        baseURL = baseURLOrOptions;
      } else {
        options = baseURLOrOptions;
      }
      if (typeof init === "string") {
        const parser = new Parser(init);
        parser.parse();
        init = parser.result;
        if (baseURL === void 0 && typeof init.protocol !== "string") {
          throw new TypeError(`A base URL must be provided for a relative constructor string.`);
        }
        init.baseURL = baseURL;
      } else {
        if (!init || typeof init !== "object") {
          throw new TypeError(`parameter 1 is not of type 'string' and cannot convert to dictionary.`);
        }
        if (baseURL) {
          throw new TypeError(`parameter 1 is not of type 'string'.`);
        }
      }
      if (typeof options === "undefined") {
        options = { ignoreCase: false };
      }
      const ignoreCaseOptions = { ignoreCase: options.ignoreCase === true };
      const defaults = {
        pathname: DEFAULT_PATTERN,
        protocol: DEFAULT_PATTERN,
        username: DEFAULT_PATTERN,
        password: DEFAULT_PATTERN,
        hostname: DEFAULT_PATTERN,
        port: DEFAULT_PATTERN,
        search: DEFAULT_PATTERN,
        hash: DEFAULT_PATTERN
      };
      this.pattern = applyInit(defaults, init, true);
      if (defaultPortForProtocol(this.pattern.protocol) === this.pattern.port) {
        this.pattern.port = "";
      }
      let component;
      for (component of COMPONENTS) {
        if (!(component in this.pattern))
          continue;
        const options2 = {};
        const pattern = this.pattern[component];
        this.names[component] = [];
        switch (component) {
          case "protocol":
            Object.assign(options2, DEFAULT_OPTIONS);
            options2.encodePart = protocolEncodeCallback;
            break;
          case "username":
            Object.assign(options2, DEFAULT_OPTIONS);
            options2.encodePart = usernameEncodeCallback;
            break;
          case "password":
            Object.assign(options2, DEFAULT_OPTIONS);
            options2.encodePart = passwordEncodeCallback;
            break;
          case "hostname":
            Object.assign(options2, HOSTNAME_OPTIONS);
            if (treatAsIPv6Hostname(pattern)) {
              options2.encodePart = ipv6HostnameEncodeCallback;
            } else {
              options2.encodePart = hostnameEncodeCallback;
            }
            break;
          case "port":
            Object.assign(options2, DEFAULT_OPTIONS);
            options2.encodePart = portEncodeCallback;
            break;
          case "pathname":
            if (isSpecialScheme(this.regexp.protocol)) {
              Object.assign(options2, PATHNAME_OPTIONS, ignoreCaseOptions);
              options2.encodePart = standardURLPathnameEncodeCallback;
            } else {
              Object.assign(options2, DEFAULT_OPTIONS, ignoreCaseOptions);
              options2.encodePart = pathURLPathnameEncodeCallback;
            }
            break;
          case "search":
            Object.assign(options2, DEFAULT_OPTIONS, ignoreCaseOptions);
            options2.encodePart = searchEncodeCallback;
            break;
          case "hash":
            Object.assign(options2, DEFAULT_OPTIONS, ignoreCaseOptions);
            options2.encodePart = hashEncodeCallback;
            break;
        }
        try {
          this.parts[component] = parse(pattern, options2);
          this.regexp[component] = partsToRegexp(
            this.parts[component],
            /* out */
            this.names[component],
            options2
          );
          this.component_pattern[component] = partsToPattern(this.parts[component], options2);
        } catch (err) {
          throw new TypeError(`invalid ${component} pattern '${this.pattern[component]}'.`);
        }
      }
    } catch (err) {
      throw new TypeError(`Failed to construct 'URLPattern': ${err.message}`);
    }
  }
  test(input = {}, baseURL) {
    let values = {
      pathname: "",
      protocol: "",
      username: "",
      password: "",
      hostname: "",
      port: "",
      search: "",
      hash: ""
    };
    if (typeof input !== "string" && baseURL) {
      throw new TypeError(`parameter 1 is not of type 'string'.`);
    }
    if (typeof input === "undefined") {
      return false;
    }
    try {
      if (typeof input === "object") {
        values = applyInit(values, input, false);
      } else {
        values = applyInit(values, extractValues(input, baseURL), false);
      }
    } catch (err) {
      return false;
    }
    let component;
    for (component of COMPONENTS) {
      if (!this.regexp[component].exec(values[component])) {
        return false;
      }
    }
    return true;
  }
  exec(input = {}, baseURL) {
    let values = {
      pathname: "",
      protocol: "",
      username: "",
      password: "",
      hostname: "",
      port: "",
      search: "",
      hash: ""
    };
    if (typeof input !== "string" && baseURL) {
      throw new TypeError(`parameter 1 is not of type 'string'.`);
    }
    if (typeof input === "undefined") {
      return;
    }
    try {
      if (typeof input === "object") {
        values = applyInit(values, input, false);
      } else {
        values = applyInit(values, extractValues(input, baseURL), false);
      }
    } catch (err) {
      return null;
    }
    let result = {};
    if (baseURL) {
      result.inputs = [input, baseURL];
    } else {
      result.inputs = [input];
    }
    let component;
    for (component of COMPONENTS) {
      let match = this.regexp[component].exec(values[component]);
      if (!match) {
        return null;
      }
      let groups = {};
      for (let [i, name] of this.names[component].entries()) {
        if (typeof name === "string" || typeof name === "number") {
          let value = match[i + 1];
          groups[name] = value;
        }
      }
      result[component] = {
        input: values[component] ?? "",
        groups
      };
    }
    return result;
  }
  static compareComponent(component, left, right) {
    const comparePart = (left2, right2) => {
      for (let attr of ["type", "modifier", "prefix", "value", "suffix"]) {
        if (left2[attr] < right2[attr])
          return -1;
        else if (left2[attr] === right2[attr])
          continue;
        else
          return 1;
      }
      return 0;
    };
    const emptyFixedPart = new Part(
      3,
      "",
      "",
      "",
      "",
      3
      /* kNone */
    );
    const wildcardOnlyPart = new Part(
      0,
      "",
      "",
      "",
      "",
      3
      /* kNone */
    );
    const comparePartList = (left2, right2) => {
      let i = 0;
      for (; i < Math.min(left2.length, right2.length); ++i) {
        let result = comparePart(left2[i], right2[i]);
        if (result)
          return result;
      }
      if (left2.length === right2.length) {
        return 0;
      }
      return comparePart(left2[i] ?? emptyFixedPart, right2[i] ?? emptyFixedPart);
    };
    if (!left.component_pattern[component] && !right.component_pattern[component]) {
      return 0;
    }
    if (left.component_pattern[component] && !right.component_pattern[component]) {
      return comparePartList(left.parts[component], [wildcardOnlyPart]);
    }
    if (!left.component_pattern[component] && right.component_pattern[component]) {
      return comparePartList([wildcardOnlyPart], right.parts[component]);
    }
    return comparePartList(left.parts[component], right.parts[component]);
  }
  get protocol() {
    return this.component_pattern.protocol;
  }
  get username() {
    return this.component_pattern.username;
  }
  get password() {
    return this.component_pattern.password;
  }
  get hostname() {
    return this.component_pattern.hostname;
  }
  get port() {
    return this.component_pattern.port;
  }
  get pathname() {
    return this.component_pattern.pathname;
  }
  get search() {
    return this.component_pattern.search;
  }
  get hash() {
    return this.component_pattern.hash;
  }
};

// node_modules/urlpattern-polyfill/index.js
if (!globalThis.URLPattern) {
  globalThis.URLPattern = URLPattern;
}

// src/path_parameters.ts
var getPathParameters = (path, url) => {
  var _a;
  if (path === void 0) {
    return {};
  }
  const trimmedURL = url.endsWith("/") ? url.slice(0, -1) : url;
  const matcher = new URLPattern({ pathname: path, baseURL: trimmedURL });
  const match = (_a = matcher.exec(trimmedURL)) == null ? void 0 : _a.pathname.groups;
  if (!match) {
    return {};
  }
  const parameters = Object.entries(match).reduce((acc, [key, value]) => {
    if (value === void 0) {
      return acc;
    }
    return {
      ...acc,
      [key]: value
    };
  }, {});
  return parameters;
};

// src/request_id.ts
var getRequestId = (requestIdHeader) => requestIdHeader ?? "";

// src/server.ts
import { env } from "process";
var getServerObject = () => ({
  region: env.AWS_REGION
});

// src/site.ts
import { env as env2 } from "process";
var getSiteObject = () => ({
  id: env2.SITE_ID,
  name: env2.SITE_NAME,
  url: env2.URL
});

// src/context.ts
var json = (input) => {
  const data = JSON.stringify(input);
  return new Response(data, {
    headers: {
      "content-type": "application/json"
    }
  });
};
var getContext = (req, cookies) => {
  let params = {};
  try {
    params = getPathParameters(req[requestRoute], req.url);
  } catch {
    console.log(`Could not parse function route ${req[requestRoute]}.`);
  }
  const context = {
    account: getAccountObject(req.headers.get(NFAccountID)),
    cookies: cookies.getPublicInterface(),
    deploy: getDeploybject(req.headers.get(NFDeployID)),
    flags: getRequestFlags(req),
    geo: parseGeoHeader(req.headers.get(NFGeo)),
    ip: getIP(req.headers.get(NFClientConnectionIP)),
    json,
    log: console.log,
    next: () => {
      throw new Error("`context.next` is not implemented for serverless functions");
    },
    params,
    requestId: getRequestId(req.headers.get(NFRequestID)),
    rewrite: (input) => {
      const url = makeURL(input, req.url);
      return rewrite(url);
    },
    server: getServerObject(),
    site: getSiteObject()
  };
  return context;
};
var makeURL = (input, baseURL) => {
  if (input instanceof URL) {
    return input;
  }
  if (input.startsWith("/")) {
    const url = new URL(baseURL);
    url.pathname = input;
    return url;
  }
  return new URL(input);
};
var rewrite = async (url) => {
  const res = await fetch(url);
  return res;
};

// node_modules/@netlify/node-cookies/dist/http/cookies.js
import assert from "node:assert";

// node_modules/@netlify/node-cookies/dist/datetime/to_imf.js
function toIMF(date) {
  function dtPad(v, lPad = 2) {
    return v.padStart(lPad, "0");
  }
  const d = dtPad(date.getUTCDate().toString());
  const h = dtPad(date.getUTCHours().toString());
  const min = dtPad(date.getUTCMinutes().toString());
  const s = dtPad(date.getUTCSeconds().toString());
  const y = date.getUTCFullYear();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getUTCDay()]}, ${d} ${months[date.getUTCMonth()]} ${y} ${h}:${min}:${s} GMT`;
}

// node_modules/@netlify/node-cookies/dist/http/cookies.js
var FIELD_CONTENT_REGEXP = /^(?=[\u0020-\u007E]*$)[^()@<>,;:\\"[\]?={}\s]+$/;
function toString(cookie) {
  if (!cookie.name) {
    return "";
  }
  const out = [];
  validateName(cookie.name);
  validateValue(cookie.name, cookie.value);
  out.push(`${cookie.name}=${cookie.value}`);
  if (cookie.name.startsWith("__Secure")) {
    cookie.secure = true;
  }
  if (cookie.name.startsWith("__Host")) {
    cookie.path = "/";
    cookie.secure = true;
    delete cookie.domain;
  }
  if (cookie.secure) {
    out.push("Secure");
  }
  if (cookie.httpOnly) {
    out.push("HttpOnly");
  }
  if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
    assert(cookie.maxAge >= 0, "Max-Age must be an integer superior or equal to 0");
    out.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.domain) {
    validateDomain(cookie.domain);
    out.push(`Domain=${cookie.domain}`);
  }
  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`);
  }
  if (cookie.path) {
    validatePath(cookie.path);
    out.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    const { expires } = cookie;
    const dateString = toIMF(typeof expires === "number" ? new Date(expires) : expires);
    out.push(`Expires=${dateString}`);
  }
  if (cookie.unparsed) {
    out.push(cookie.unparsed.join("; "));
  }
  return out.join("; ");
}
function validateName(name) {
  if (name && !FIELD_CONTENT_REGEXP.test(name)) {
    throw new TypeError(`Invalid cookie name: "${name}".`);
  }
}
function validatePath(path) {
  if (path == null) {
    return;
  }
  for (let i = 0; i < path.length; i++) {
    const c = path.charAt(i);
    if (c < String.fromCharCode(32) || c > String.fromCharCode(126) || c == ";") {
      throw new Error(`${path}: Invalid cookie path char '${c}'`);
    }
  }
}
function validateValue(name, value) {
  if (value == null || name == null)
    return;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (c < String.fromCharCode(33) || c == String.fromCharCode(34) || c == String.fromCharCode(44) || c == String.fromCharCode(59) || c == String.fromCharCode(92) || c == String.fromCharCode(127)) {
      throw new Error(`RFC2616 cookie '${name}' cannot contain character '${c}'`);
    }
    if (c > String.fromCharCode(128)) {
      throw new Error(`RFC2616 cookie '${name}' can only have US-ASCII chars as value${c.charCodeAt(0).toString(16)}`);
    }
  }
}
function validateDomain(domain) {
  if (domain == null) {
    return;
  }
  const char1 = domain.charAt(0);
  const charN = domain.charAt(domain.length - 1);
  if (char1 == "-" || charN == "." || charN == "-") {
    throw new Error(`Invalid first/last char in cookie domain: ${domain}`);
  }
}
function getCookies(headers) {
  const cookie = headers.get("Cookie");
  if (cookie != null) {
    const out = {};
    const c = cookie.split(";");
    for (const kv of c) {
      const [cookieKey, ...cookieVal] = kv.split("=");
      assert(cookieKey != null);
      const key = cookieKey.trim();
      out[key] = cookieVal.join("=");
    }
    return out;
  }
  return {};
}
function setCookie(headers, cookie) {
  const v = toString(cookie);
  if (v) {
    headers.append("Set-Cookie", v);
  }
}
function deleteCookie(headers, name, attributes) {
  setCookie(headers, Object.assign({ name, value: "", expires: /* @__PURE__ */ new Date(0) }, attributes));
}

// src/cookie_store.ts
var CookieStore = class {
  constructor(request2) {
    this.ops = [];
    this.request = request2;
  }
  apply(response) {
    this.ops.forEach((op) => {
      switch (op.type) {
        case "delete":
          deleteCookie(response.headers, op.options.name, {
            domain: op.options.domain,
            path: op.options.path
          });
          break;
        case "set":
          setCookie(response.headers, op.cookie);
          break;
        default:
      }
    });
  }
  delete(input) {
    const defaultOptions = {
      path: "/"
    };
    const options = typeof input === "string" ? { name: input } : input;
    this.ops.push({
      options: { ...defaultOptions, ...options },
      type: "delete"
    });
  }
  get(name) {
    return getCookies(this.request.headers)[name];
  }
  getPublicInterface() {
    return {
      delete: this.delete.bind(this),
      get: this.get.bind(this),
      set: this.set.bind(this)
    };
  }
  set(key, value) {
    let cookie;
    if (typeof key === "string") {
      if (typeof value !== "string") {
        throw new TypeError(`You must provide the cookie value as a string to 'cookies.set'`);
      }
      cookie = { name: key, value };
    } else {
      cookie = key;
    }
    this.ops.push({ cookie, type: "set" });
  }
};

// src/environment.ts
import { Buffer as Buffer4 } from "node:buffer";
import process2 from "node:process";
var PURGE_API_TOKEN_VARIABLE = "NETLIFY_PURGE_API_TOKEN";
var NETLIFY_BLOBS_CONTEXT_VARIABLE = "NETLIFY_BLOBS_CONTEXT";
var setEnvironmentContext = (headers, event, lambdaContext) => {
  var _a, _b;
  const { blobs } = event;
  const purgeAPIToken = (_b = (_a = lambdaContext == null ? void 0 : lambdaContext.clientContext) == null ? void 0 : _a.custom) == null ? void 0 : _b.purge_api_token;
  if (typeof blobs === "string" && blobs !== "") {
    try {
      const rawData = Buffer4.from(blobs, "base64").toString("utf8");
      const data = JSON.parse(rawData);
      const siteID = headers.get(NFSiteID);
      const deployID = headers.get(NFDeployID);
      process2.env[NETLIFY_BLOBS_CONTEXT_VARIABLE] = Buffer4.from(
        JSON.stringify({
          edgeURL: data.url,
          uncachedEdgeURL: data.url_uncached,
          token: data.token,
          siteID,
          deployID,
          primaryRegion: data.primary_region
        })
      ).toString("base64");
    } catch (error2) {
      console.error("An internal error occurred while setting up Netlify Blobs:", error2);
    }
  }
  if (typeof purgeAPIToken === "string" && purgeAPIToken !== "") {
    process2.env[PURGE_API_TOKEN_VARIABLE] = purgeAPIToken;
  }
};

// src/errors.ts
var NetlifyUserError = class _NetlifyUserError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetlifyUserError";
    Object.setPrototypeOf(this, _NetlifyUserError.prototype);
  }
};

// src/fingerprint.ts
import { env as env3 } from "node:process";

// node_modules/is-node-process/lib/index.mjs
function isNodeProcess() {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return true;
  }
  if (typeof process !== "undefined") {
    const type = process.type;
    if (type === "renderer" || type === "worker") {
      return false;
    }
    return !!(process.versions && process.versions.node);
  }
  return false;
}

// node_modules/outvariant/lib/index.mjs
var POSITIONALS_EXP = /(%?)(%([sdijo]))/g;
function serializePositional(positional, flag) {
  switch (flag) {
    case "s":
      return positional;
    case "d":
    case "i":
      return Number(positional);
    case "j":
      return JSON.stringify(positional);
    case "o": {
      if (typeof positional === "string") {
        return positional;
      }
      const json2 = JSON.stringify(positional);
      if (json2 === "{}" || json2 === "[]" || /^\[object .+?\]$/.test(json2)) {
        return positional;
      }
      return json2;
    }
  }
}
function format(message, ...positionals) {
  if (positionals.length === 0) {
    return message;
  }
  let positionalIndex = 0;
  let formattedMessage = message.replace(
    POSITIONALS_EXP,
    (match, isEscaped, _, flag) => {
      const positional = positionals[positionalIndex];
      const value = serializePositional(positional, flag);
      if (!isEscaped) {
        positionalIndex++;
        return value;
      }
      return match;
    }
  );
  if (positionalIndex < positionals.length) {
    formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
  }
  formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
  return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE = 2;
function cleanErrorStack(error2) {
  if (!error2.stack) {
    return;
  }
  const nextStack = error2.stack.split("\n");
  nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
  error2.stack = nextStack.join("\n");
}
var InvariantError = class extends Error {
  constructor(message, ...positionals) {
    super(message);
    this.message = message;
    this.name = "Invariant Violation";
    this.message = format(message, ...positionals);
    cleanErrorStack(this);
  }
};
var invariant = (predicate, message, ...positionals) => {
  if (!predicate) {
    throw new InvariantError(message, ...positionals);
  }
};
invariant.as = (ErrorConstructor, predicate, message, ...positionals) => {
  if (!predicate) {
    const formatMessage = positionals.length === 0 ? message : format(message, positionals);
    let error2;
    try {
      error2 = Reflect.construct(ErrorConstructor, [formatMessage]);
    } catch (err) {
      error2 = ErrorConstructor(formatMessage);
    }
    throw error2;
  }
};

// node_modules/@open-draft/logger/lib/index.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var colors_exports = {};
__export(colors_exports, {
  blue: () => blue,
  gray: () => gray,
  green: () => green,
  red: () => red,
  yellow: () => yellow
});
function yellow(text) {
  return `\x1B[33m${text}\x1B[0m`;
}
function blue(text) {
  return `\x1B[34m${text}\x1B[0m`;
}
function gray(text) {
  return `\x1B[90m${text}\x1B[0m`;
}
function red(text) {
  return `\x1B[31m${text}\x1B[0m`;
}
function green(text) {
  return `\x1B[32m${text}\x1B[0m`;
}
var IS_NODE = isNodeProcess();
var Logger = class {
  constructor(name) {
    this.name = name;
    this.prefix = `[${this.name}]`;
    const LOGGER_NAME = getVariable("DEBUG");
    const LOGGER_LEVEL = getVariable("LOG_LEVEL");
    const isLoggingEnabled = LOGGER_NAME === "1" || LOGGER_NAME === "true" || typeof LOGGER_NAME !== "undefined" && this.name.startsWith(LOGGER_NAME);
    if (isLoggingEnabled) {
      this.debug = isDefinedAndNotEquals(LOGGER_LEVEL, "debug") ? noop : this.debug;
      this.info = isDefinedAndNotEquals(LOGGER_LEVEL, "info") ? noop : this.info;
      this.success = isDefinedAndNotEquals(LOGGER_LEVEL, "success") ? noop : this.success;
      this.warning = isDefinedAndNotEquals(LOGGER_LEVEL, "warning") ? noop : this.warning;
      this.error = isDefinedAndNotEquals(LOGGER_LEVEL, "error") ? noop : this.error;
    } else {
      this.info = noop;
      this.success = noop;
      this.warning = noop;
      this.error = noop;
      this.only = noop;
    }
  }
  prefix;
  extend(domain) {
    return new Logger(`${this.name}:${domain}`);
  }
  /**
   * Print a debug message.
   * @example
   * logger.debug('no duplicates found, creating a document...')
   */
  debug(message, ...positionals) {
    this.logEntry({
      level: "debug",
      message: gray(message),
      positionals,
      prefix: this.prefix,
      colors: {
        prefix: "gray"
      }
    });
  }
  /**
   * Print an info message.
   * @example
   * logger.info('start parsing...')
   */
  info(message, ...positionals) {
    this.logEntry({
      level: "info",
      message,
      positionals,
      prefix: this.prefix,
      colors: {
        prefix: "blue"
      }
    });
    const performance2 = new PerformanceEntry();
    return (message2, ...positionals2) => {
      performance2.measure();
      this.logEntry({
        level: "info",
        message: `${message2} ${gray(`${performance2.deltaTime}ms`)}`,
        positionals: positionals2,
        prefix: this.prefix,
        colors: {
          prefix: "blue"
        }
      });
    };
  }
  /**
   * Print a success message.
   * @example
   * logger.success('successfully created document')
   */
  success(message, ...positionals) {
    this.logEntry({
      level: "info",
      message,
      positionals,
      prefix: `\u2714 ${this.prefix}`,
      colors: {
        timestamp: "green",
        prefix: "green"
      }
    });
  }
  /**
   * Print a warning.
   * @example
   * logger.warning('found legacy document format')
   */
  warning(message, ...positionals) {
    this.logEntry({
      level: "warning",
      message,
      positionals,
      prefix: `\u26A0 ${this.prefix}`,
      colors: {
        timestamp: "yellow",
        prefix: "yellow"
      }
    });
  }
  /**
   * Print an error message.
   * @example
   * logger.error('something went wrong')
   */
  error(message, ...positionals) {
    this.logEntry({
      level: "error",
      message,
      positionals,
      prefix: `\u2716 ${this.prefix}`,
      colors: {
        timestamp: "red",
        prefix: "red"
      }
    });
  }
  /**
   * Execute the given callback only when the logging is enabled.
   * This is skipped in its entirety and has no runtime cost otherwise.
   * This executes regardless of the log level.
   * @example
   * logger.only(() => {
   *   logger.info('additional info')
   * })
   */
  only(callback) {
    callback();
  }
  createEntry(level, message) {
    return {
      timestamp: /* @__PURE__ */ new Date(),
      level,
      message
    };
  }
  logEntry(args) {
    const {
      level,
      message,
      prefix,
      colors: customColors,
      positionals = []
    } = args;
    const entry = this.createEntry(level, message);
    const timestampColor = (customColors == null ? void 0 : customColors.timestamp) || "gray";
    const prefixColor = (customColors == null ? void 0 : customColors.prefix) || "gray";
    const colorize = {
      timestamp: colors_exports[timestampColor],
      prefix: colors_exports[prefixColor]
    };
    const write = this.getWriter(level);
    write(
      [colorize.timestamp(this.formatTimestamp(entry.timestamp))].concat(prefix != null ? colorize.prefix(prefix) : []).concat(serializeInput(message)).join(" "),
      ...positionals.map(serializeInput)
    );
  }
  formatTimestamp(timestamp) {
    return `${timestamp.toLocaleTimeString(
      "en-GB"
    )}:${timestamp.getMilliseconds()}`;
  }
  getWriter(level) {
    switch (level) {
      case "debug":
      case "success":
      case "info": {
        return log;
      }
      case "warning": {
        return warn;
      }
      case "error": {
        return error;
      }
    }
  }
};
var PerformanceEntry = class {
  startTime;
  endTime;
  deltaTime;
  constructor() {
    this.startTime = performance.now();
  }
  measure() {
    this.endTime = performance.now();
    const deltaTime = this.endTime - this.startTime;
    this.deltaTime = deltaTime.toFixed(2);
  }
};
var noop = () => void 0;
function log(message, ...positionals) {
  if (IS_NODE) {
    process.stdout.write(format(message, ...positionals) + "\n");
    return;
  }
  console.log(message, ...positionals);
}
function warn(message, ...positionals) {
  if (IS_NODE) {
    process.stderr.write(format(message, ...positionals) + "\n");
    return;
  }
  console.warn(message, ...positionals);
}
function error(message, ...positionals) {
  if (IS_NODE) {
    process.stderr.write(format(message, ...positionals) + "\n");
    return;
  }
  console.error(message, ...positionals);
}
function getVariable(variableName) {
  var _a;
  if (IS_NODE) {
    return process.env[variableName];
  }
  return (_a = globalThis[variableName]) == null ? void 0 : _a.toString();
}
function isDefinedAndNotEquals(value, expected) {
  return value !== void 0 && value !== expected;
}
function serializeInput(message) {
  if (typeof message === "undefined") {
    return "undefined";
  }
  if (message === null) {
    return "null";
  }
  if (typeof message === "string") {
    return message;
  }
  if (typeof message === "object") {
    return JSON.stringify(message);
  }
  return message.toString();
}

// node_modules/strict-event-emitter/lib/index.mjs
var MemoryLeakError = class extends Error {
  constructor(emitter, type, count) {
    super(
      `Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    this.emitter = emitter;
    this.type = type;
    this.count = count;
    this.name = "MaxListenersExceededWarning";
  }
};
var _Emitter = class {
  static listenerCount(emitter, eventName) {
    return emitter.listenerCount(eventName);
  }
  constructor() {
    this.events = /* @__PURE__ */ new Map();
    this.maxListeners = _Emitter.defaultMaxListeners;
    this.hasWarnedAboutPotentialMemoryLeak = false;
  }
  _emitInternalEvent(internalEventName, eventName, listener) {
    this.emit(
      internalEventName,
      ...[eventName, listener]
    );
  }
  _getListeners(eventName) {
    return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
  }
  _removeListener(listeners, listener) {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    return [];
  }
  _wrapOnceListener(eventName, listener) {
    const onceListener = (...data) => {
      this.removeListener(eventName, onceListener);
      return listener.apply(this, data);
    };
    Object.defineProperty(onceListener, "name", { value: listener.name });
    return onceListener;
  }
  setMaxListeners(maxListeners) {
    this.maxListeners = maxListeners;
    return this;
  }
  /**
   * Returns the current max listener value for the `Emitter` which is
   * either set by `emitter.setMaxListeners(n)` or defaults to
   * `Emitter.defaultMaxListeners`.
   */
  getMaxListeners() {
    return this.maxListeners;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   * The values in the array will be strings or Symbols.
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
   *
   * @example
   * const emitter = new Emitter<{ hello: [string] }>()
   * emitter.emit('hello', 'John')
   */
  emit(eventName, ...data) {
    const listeners = this._getListeners(eventName);
    listeners.forEach((listener) => {
      listener.apply(this, data);
    });
    return listeners.length > 0;
  }
  addListener(eventName, listener) {
    this._emitInternalEvent("newListener", eventName, listener);
    const nextListeners = this._getListeners(eventName).concat(listener);
    this.events.set(eventName, nextListeners);
    if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
      this.hasWarnedAboutPotentialMemoryLeak = true;
      const memoryLeakWarning = new MemoryLeakError(
        this,
        eventName,
        this.listenerCount(eventName)
      );
      console.warn(memoryLeakWarning);
    }
    return this;
  }
  on(eventName, listener) {
    return this.addListener(eventName, listener);
  }
  once(eventName, listener) {
    return this.addListener(
      eventName,
      this._wrapOnceListener(eventName, listener)
    );
  }
  prependListener(eventName, listener) {
    const listeners = this._getListeners(eventName);
    if (listeners.length > 0) {
      const nextListeners = [listener].concat(listeners);
      this.events.set(eventName, nextListeners);
    } else {
      this.events.set(eventName, listeners.concat(listener));
    }
    return this;
  }
  prependOnceListener(eventName, listener) {
    return this.prependListener(
      eventName,
      this._wrapOnceListener(eventName, listener)
    );
  }
  removeListener(eventName, listener) {
    const listeners = this._getListeners(eventName);
    if (listeners.length > 0) {
      this._removeListener(listeners, listener);
      this.events.set(eventName, listeners);
      this._emitInternalEvent("removeListener", eventName, listener);
    }
    return this;
  }
  /**
   * Alias for `emitter.removeListener()`.
   *
   * @example
   * emitter.off('hello', listener)
   */
  off(eventName, listener) {
    return this.removeListener(eventName, listener);
  }
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
    return this;
  }
  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   */
  listeners(eventName) {
    return Array.from(this._getListeners(eventName));
  }
  /**
   * Returns the number of listeners listening to the event named `eventName`.
   */
  listenerCount(eventName) {
    return this._getListeners(eventName).length;
  }
  rawListeners(eventName) {
    return this.listeners(eventName);
  }
};
var Emitter = _Emitter;
Emitter.defaultMaxListeners = 10;

// node_modules/@mswjs/interceptors/lib/node/chunk-QED3Q6Z2.mjs
var INTERNAL_REQUEST_ID_HEADER_NAME = "x-interceptors-internal-request-id";
function getGlobalSymbol(symbol) {
  return (
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/24587
    globalThis[symbol] || void 0
  );
}
function setGlobalSymbol(symbol, value) {
  globalThis[symbol] = value;
}
function deleteGlobalSymbol(symbol) {
  delete globalThis[symbol];
}
var Interceptor = class {
  constructor(symbol) {
    this.symbol = symbol;
    this.readyState = "INACTIVE";
    this.emitter = new Emitter();
    this.subscriptions = [];
    this.logger = new Logger(symbol.description);
    this.emitter.setMaxListeners(0);
    this.logger.info("constructing the interceptor...");
  }
  /**
   * Determine if this interceptor can be applied
   * in the current environment.
   */
  checkEnvironment() {
    return true;
  }
  /**
   * Apply this interceptor to the current process.
   * Returns an already running interceptor instance if it's present.
   */
  apply() {
    const logger7 = this.logger.extend("apply");
    logger7.info("applying the interceptor...");
    if (this.readyState === "APPLIED") {
      logger7.info("intercepted already applied!");
      return;
    }
    const shouldApply = this.checkEnvironment();
    if (!shouldApply) {
      logger7.info("the interceptor cannot be applied in this environment!");
      return;
    }
    this.readyState = "APPLYING";
    const runningInstance = this.getInstance();
    if (runningInstance) {
      logger7.info("found a running instance, reusing...");
      this.on = (event, listener) => {
        logger7.info('proxying the "%s" listener', event);
        runningInstance.emitter.addListener(event, listener);
        this.subscriptions.push(() => {
          runningInstance.emitter.removeListener(event, listener);
          logger7.info('removed proxied "%s" listener!', event);
        });
        return this;
      };
      this.readyState = "APPLIED";
      return;
    }
    logger7.info("no running instance found, setting up a new instance...");
    this.setup();
    this.setInstance();
    this.readyState = "APPLIED";
  }
  /**
   * Setup the module augments and stubs necessary for this interceptor.
   * This method is not run if there's a running interceptor instance
   * to prevent instantiating an interceptor multiple times.
   */
  setup() {
  }
  /**
   * Listen to the interceptor's public events.
   */
  on(event, listener) {
    const logger7 = this.logger.extend("on");
    if (this.readyState === "DISPOSING" || this.readyState === "DISPOSED") {
      logger7.info("cannot listen to events, already disposed!");
      return this;
    }
    logger7.info('adding "%s" event listener:', event, listener);
    this.emitter.on(event, listener);
    return this;
  }
  once(event, listener) {
    this.emitter.once(event, listener);
    return this;
  }
  off(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }
  removeAllListeners(event) {
    this.emitter.removeAllListeners(event);
    return this;
  }
  /**
   * Disposes of any side-effects this interceptor has introduced.
   */
  dispose() {
    const logger7 = this.logger.extend("dispose");
    if (this.readyState === "DISPOSED") {
      logger7.info("cannot dispose, already disposed!");
      return;
    }
    logger7.info("disposing the interceptor...");
    this.readyState = "DISPOSING";
    if (!this.getInstance()) {
      logger7.info("no interceptors running, skipping dispose...");
      return;
    }
    this.clearInstance();
    logger7.info("global symbol deleted:", getGlobalSymbol(this.symbol));
    if (this.subscriptions.length > 0) {
      logger7.info("disposing of %d subscriptions...", this.subscriptions.length);
      for (const dispose of this.subscriptions) {
        dispose();
      }
      this.subscriptions = [];
      logger7.info("disposed of all subscriptions!", this.subscriptions.length);
    }
    this.emitter.removeAllListeners();
    logger7.info("destroyed the listener!");
    this.readyState = "DISPOSED";
  }
  getInstance() {
    var _a;
    const instance = getGlobalSymbol(this.symbol);
    this.logger.info("retrieved global instance:", (_a = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a.name);
    return instance;
  }
  setInstance() {
    setGlobalSymbol(this.symbol, this);
    this.logger.info("set global instance!", this.symbol.description);
  }
  clearInstance() {
    deleteGlobalSymbol(this.symbol);
    this.logger.info("cleared global instance!", this.symbol.description);
  }
};
function createRequestId() {
  return Math.random().toString(16).slice(2);
}

// node_modules/@mswjs/interceptors/lib/node/chunk-GUY7XK43.mjs
var BatchInterceptor = class extends Interceptor {
  constructor(options) {
    BatchInterceptor.symbol = Symbol(options.name);
    super(BatchInterceptor.symbol);
    this.interceptors = options.interceptors;
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    logger7.info("applying all %d interceptors...", this.interceptors.length);
    for (const interceptor of this.interceptors) {
      logger7.info('applying "%s" interceptor...', interceptor.constructor.name);
      interceptor.apply();
      logger7.info("adding interceptor dispose subscription");
      this.subscriptions.push(() => interceptor.dispose());
    }
  }
  on(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.on(event, listener);
    }
    return this;
  }
  once(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.once(event, listener);
    }
    return this;
  }
  off(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.off(event, listener);
    }
    return this;
  }
  removeAllListeners(event) {
    for (const interceptors of this.interceptors) {
      interceptors.removeAllListeners(event);
    }
    return this;
  }
};

// node_modules/@mswjs/interceptors/lib/node/chunk-6HYIRFX2.mjs
var encoder = new TextEncoder();

// node_modules/@mswjs/interceptors/lib/node/chunk-IBYBTTYK.mjs
var RESPONSE_STATUS_CODES_WITHOUT_BODY = /* @__PURE__ */ new Set([
  101,
  103,
  204,
  205,
  304
]);
function isResponseWithoutBody(status) {
  return RESPONSE_STATUS_CODES_WITHOUT_BODY.has(status);
}

// node_modules/@mswjs/interceptors/lib/node/chunk-HAGW22AN.mjs
var IS_PATCHED_MODULE = Symbol("isPatchedModule");

// node_modules/@mswjs/interceptors/lib/node/chunk-DERTLGL3.mjs
function isPropertyAccessible(obj, key) {
  try {
    obj[key];
    return true;
  } catch (e) {
    return false;
  }
}

// node_modules/@open-draft/deferred-promise/build/index.mjs
function createDeferredExecutor() {
  const executor = (resolve, reject) => {
    executor.state = "pending";
    executor.resolve = (data) => {
      if (executor.state !== "pending") {
        return;
      }
      executor.result = data;
      const onFulfilled = (value) => {
        executor.state = "fulfilled";
        return value;
      };
      return resolve(
        data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled)
      );
    };
    executor.reject = (reason) => {
      if (executor.state !== "pending") {
        return;
      }
      queueMicrotask(() => {
        executor.state = "rejected";
      });
      return reject(executor.rejectionReason = reason);
    };
  };
  return executor;
}
var DeferredPromise = class extends Promise {
  #executor;
  resolve;
  reject;
  constructor(executor = null) {
    const deferredExecutor = createDeferredExecutor();
    super((originalResolve, originalReject) => {
      deferredExecutor(originalResolve, originalReject);
      executor == null ? void 0 : executor(deferredExecutor.resolve, deferredExecutor.reject);
    });
    this.#executor = deferredExecutor;
    this.resolve = this.#executor.resolve;
    this.reject = this.#executor.reject;
  }
  get state() {
    return this.#executor.state;
  }
  get rejectionReason() {
    return this.#executor.rejectionReason;
  }
  then(onFulfilled, onRejected) {
    return this.#decorate(super.then(onFulfilled, onRejected));
  }
  catch(onRejected) {
    return this.#decorate(super.catch(onRejected));
  }
  finally(onfinally) {
    return this.#decorate(super.finally(onfinally));
  }
  #decorate(promise) {
    return Object.defineProperties(promise, {
      resolve: { configurable: true, value: this.resolve },
      reject: { configurable: true, value: this.reject }
    });
  }
};

// node_modules/@mswjs/interceptors/lib/node/chunk-OUWBQF3Z.mjs
var RequestController = class {
  constructor(request2) {
    this.request = request2;
    this.responsePromise = new DeferredPromise();
  }
  respondWith(response) {
    invariant(
      this.responsePromise.state === "pending",
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    );
    this.responsePromise.resolve(response);
  }
};
function toInteractiveRequest(request2) {
  const requestController = new RequestController(request2);
  Reflect.set(
    request2,
    "respondWith",
    requestController.respondWith.bind(requestController)
  );
  return {
    interactiveRequest: request2,
    requestController
  };
}
async function emitAsync(emitter, eventName, ...data) {
  const listners = emitter.listeners(eventName);
  if (listners.length === 0) {
    return;
  }
  for (const listener of listners) {
    await listener.apply(emitter, data);
  }
}

// node_modules/@mswjs/interceptors/lib/node/chunk-CCASONWB.mjs
import http from "http";
import https from "https";
import { ClientRequest, IncomingMessage as IncomingMessage2 } from "http";

// node_modules/@open-draft/until/lib/index.mjs
var until = async (promise) => {
  try {
    const data = await promise().catch((error2) => {
      throw error2;
    });
    return { error: null, data };
  } catch (error2) {
    return { error: error2, data: null };
  }
};

// node_modules/@mswjs/interceptors/lib/node/chunk-CCASONWB.mjs
import { IncomingMessage } from "http";
import { PassThrough } from "stream";
import {
  Agent as HttpAgent,
  globalAgent as httpGlobalAgent
} from "http";
import {
  Agent as HttpsAgent,
  globalAgent as httpsGlobalAgent
} from "https";
import { parse as parseUrl } from "url";
import { Agent } from "http";
var logger = new Logger("utils getUrlByRequestOptions");
function normalizeClientRequestEndArgs(...args) {
  logger.info("arguments", args);
  const normalizedArgs = new Array(3).fill(null).map((value, index) => args[index] || value);
  normalizedArgs.sort((a, b) => {
    if (typeof a === "function") {
      return 1;
    }
    if (typeof b === "function") {
      return -1;
    }
    if (typeof a === "string" && typeof b === "string") {
      return normalizedArgs.indexOf(a) - normalizedArgs.indexOf(b);
    }
    return 0;
  });
  logger.info("normalized args", normalizedArgs);
  return normalizedArgs;
}
var logger2 = new Logger("http normalizeWriteArgs");
function normalizeClientRequestWriteArgs(args) {
  logger2.info("normalizing ClientRequest.write arguments...", args);
  const chunk = args[0];
  const encoding = typeof args[1] === "string" ? args[1] : void 0;
  const callback = typeof args[1] === "function" ? args[1] : args[2];
  const writeArgs = [
    chunk,
    encoding,
    callback
  ];
  logger2.info(
    "successfully normalized ClientRequest.write arguments:",
    writeArgs
  );
  return writeArgs;
}
var IS_CLONE = Symbol("isClone");
function cloneIncomingMessage(message) {
  const clone = message.pipe(new PassThrough());
  inheritProperties(message, clone);
  const clonedPrototype = Object.create(IncomingMessage.prototype);
  getPrototypes(clone).forEach((prototype) => {
    inheritProperties(prototype, clonedPrototype);
  });
  Object.setPrototypeOf(clone, clonedPrototype);
  Object.defineProperty(clone, IS_CLONE, {
    enumerable: true,
    value: true
  });
  return clone;
}
function getPrototypes(source) {
  const prototypes = [];
  let current = source;
  while (current = Object.getPrototypeOf(current)) {
    prototypes.push(current);
  }
  return prototypes;
}
function inheritProperties(source, target) {
  const properties = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source)
  ];
  for (const property of properties) {
    if (target.hasOwnProperty(property)) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(source, property);
    if (!descriptor) {
      continue;
    }
    Object.defineProperty(target, property, descriptor);
  }
}
function createResponse(message) {
  const responseBodyOrNull = isResponseWithoutBody(message.statusCode || 200) ? null : new ReadableStream({
    start(controller) {
      message.on("data", (chunk) => controller.enqueue(chunk));
      message.on("end", () => controller.close());
    }
  });
  return new Response(responseBodyOrNull, {
    status: message.statusCode,
    statusText: message.statusMessage,
    headers: createHeadersFromIncomingHttpHeaders(message.headers)
  });
}
function createHeadersFromIncomingHttpHeaders(httpHeaders) {
  const headers = new Headers();
  for (const headerName in httpHeaders) {
    const headerValues = httpHeaders[headerName];
    if (typeof headerValues === "undefined") {
      continue;
    }
    if (Array.isArray(headerValues)) {
      headerValues.forEach((headerValue) => {
        headers.append(headerName, headerValue);
      });
      continue;
    }
    headers.set(headerName, headerValues);
  }
  return headers;
}
function createRequest(clientRequest) {
  const headers = new Headers();
  const outgoingHeaders = clientRequest.getHeaders();
  for (const headerName in outgoingHeaders) {
    const headerValue = outgoingHeaders[headerName];
    if (typeof headerValue === "undefined") {
      continue;
    }
    const valuesList = Array.prototype.concat([], headerValue);
    for (const value of valuesList) {
      headers.append(headerName, value.toString());
    }
  }
  if (clientRequest.url.username || clientRequest.url.password) {
    const auth = `${clientRequest.url.username || ""}:${clientRequest.url.password || ""}`;
    headers.set("Authorization", `Basic ${btoa(auth)}`);
    clientRequest.url.username = "";
    clientRequest.url.password = "";
  }
  const method = clientRequest.method || "GET";
  return new Request(clientRequest.url, {
    method,
    headers,
    credentials: "same-origin",
    body: method === "HEAD" || method === "GET" ? null : clientRequest.requestBuffer
  });
}
function getValueBySymbol(symbolName, source) {
  const ownSymbols = Object.getOwnPropertySymbols(source);
  const symbol = ownSymbols.find((symbol2) => {
    return symbol2.description === symbolName;
  });
  if (symbol) {
    return Reflect.get(source, symbol);
  }
  return;
}
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
function getRawFetchHeaders(headers) {
  const headersList = getValueBySymbol("headers list", headers);
  if (!headersList) {
    return;
  }
  const headersMap = getValueBySymbol("headers map", headersList);
  if (!headersMap || !isHeadersMapWithRawHeaderNames(headersMap)) {
    return;
  }
  const rawHeaders = /* @__PURE__ */ new Map();
  headersMap.forEach(({ name, value }) => {
    rawHeaders.set(name, value);
  });
  return rawHeaders;
}
function isHeadersMapWithRawHeaderNames(headersMap) {
  return Array.from(
    headersMap.values()
  ).every((value) => {
    return isObject(value) && "name" in value;
  });
}
var _NodeClientRequest = class extends ClientRequest {
  constructor([url, requestOptions, callback], options) {
    super(requestOptions, callback);
    this.chunks = [];
    this.logger = options.logger.extend(
      `request ${requestOptions.method} ${url.href}`
    );
    this.logger.info("constructing ClientRequest using options:", {
      url,
      requestOptions,
      callback
    });
    this.state = 0;
    this.url = url;
    this.emitter = options.emitter;
    this.requestBuffer = null;
    this.response = new IncomingMessage2(this.socket);
  }
  writeRequestBodyChunk(chunk, encoding) {
    if (chunk == null) {
      return;
    }
    if (this.requestBuffer == null) {
      this.requestBuffer = Buffer.from([]);
    }
    const resolvedChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.requestBuffer = Buffer.concat([this.requestBuffer, resolvedChunk]);
  }
  write(...args) {
    var _a;
    const [chunk, encoding, callback] = normalizeClientRequestWriteArgs(args);
    this.logger.info("write:", { chunk, encoding, callback });
    this.chunks.push({ chunk, encoding });
    this.writeRequestBodyChunk(chunk, encoding);
    this.logger.info(
      "chunk successfully stored!",
      (_a = this.requestBuffer) == null ? void 0 : _a.byteLength
    );
    if (!chunk || chunk.length === 0) {
      this.logger.info("written chunk is empty, skipping callback...");
    } else {
      callback == null ? void 0 : callback();
    }
    return true;
  }
  end(...args) {
    this.logger.info("end", args);
    const requestId = createRequestId();
    const [chunk, encoding, callback] = normalizeClientRequestEndArgs(...args);
    this.logger.info("normalized arguments:", { chunk, encoding, callback });
    this.writeRequestBodyChunk(chunk, encoding || void 0);
    this.state = 2;
    const capturedRequest = createRequest(this);
    const { interactiveRequest, requestController } = toInteractiveRequest(capturedRequest);
    Object.defineProperty(capturedRequest, "respondWith", {
      value: requestController.respondWith.bind(requestController)
    });
    if (this.hasHeader(INTERNAL_REQUEST_ID_HEADER_NAME)) {
      this.removeHeader(INTERNAL_REQUEST_ID_HEADER_NAME);
      return this.passthrough(chunk, encoding, callback);
    }
    this.emitter.once("request", ({ requestId: pendingRequestId }) => {
      if (pendingRequestId !== requestId) {
        return;
      }
      if (requestController.responsePromise.state === "pending") {
        this.logger.info(
          "request has not been handled in listeners, executing fail-safe listener..."
        );
        requestController.responsePromise.resolve(void 0);
      }
    });
    until(async () => {
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.state = 3;
      await emitAsync(this.emitter, "request", {
        request: interactiveRequest,
        requestId
      });
      this.logger.info('all "request" listeners done!');
      const mockedResponse = await requestController.responsePromise;
      this.logger.info("event.respondWith called with:", mockedResponse);
      return mockedResponse;
    }).then((resolverResult) => {
      this.logger.info("the listeners promise awaited!");
      this.state = 4;
      if (!this.headersSent) {
        for (const [headerName, headerValue] of capturedRequest.headers) {
          this.setHeader(headerName, headerValue);
        }
      }
      if (resolverResult.error) {
        this.logger.info(
          "encountered resolver exception, aborting request...",
          resolverResult.error
        );
        this.destroyed = true;
        this.emit("error", resolverResult.error);
        this.terminate();
        return this;
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse) {
        this.logger.info(
          "received mocked response:",
          mockedResponse.status,
          mockedResponse.statusText
        );
        this.destroyed = false;
        if (
          /**
           * @note Some environments, like Miniflare (Cloudflare) do not
           * implement the "Response.type" property and throw on its access.
           * Safely check if we can access "type" on "Response" before continuing.
           * @see https://github.com/mswjs/msw/issues/1834
           */
          isPropertyAccessible(mockedResponse, "type") && mockedResponse.type === "error"
        ) {
          this.logger.info(
            "received network error response, aborting request..."
          );
          this.emit("error", new TypeError("Network error"));
          this.terminate();
          return this;
        }
        const responseClone = mockedResponse.clone();
        this.respondWith(mockedResponse);
        this.logger.info(
          mockedResponse.status,
          mockedResponse.statusText,
          "(MOCKED)"
        );
        callback == null ? void 0 : callback();
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: true,
          request: capturedRequest,
          requestId
        });
        this.logger.info("request (mock) is completed");
        return this;
      }
      this.logger.info("no mocked response received!");
      this.once("response-internal", (message) => {
        this.logger.info(message.statusCode, message.statusMessage);
        this.logger.info("original response headers:", message.headers);
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: createResponse(message),
          isMockedResponse: false,
          request: capturedRequest,
          requestId
        });
      });
      return this.passthrough(chunk, encoding, callback);
    });
    return this;
  }
  emit(event, ...data) {
    this.logger.info("emit: %s", event);
    if (event === "response") {
      this.logger.info('found "response" event, cloning the response...');
      try {
        const response = data[0];
        const firstClone = cloneIncomingMessage(response);
        const secondClone = cloneIncomingMessage(response);
        this.emit("response-internal", secondClone);
        this.logger.info(
          'response successfully cloned, emitting "response" event...'
        );
        return super.emit(event, firstClone, ...data.slice(1));
      } catch (error2) {
        this.logger.info("error when cloning response:", error2);
        return super.emit(event, ...data);
      }
    }
    if (event === "error") {
      const error2 = data[0];
      const errorCode = error2.code || "";
      this.logger.info("error:\n", error2);
      if (_NodeClientRequest.suppressErrorCodes.includes(errorCode)) {
        if (this.state < 4) {
          if (!this.capturedError) {
            this.capturedError = error2;
            this.logger.info("captured the first error:", this.capturedError);
          }
          return false;
        }
        if (this.state === 5 && this.responseType === "mock") {
          return false;
        }
      }
    }
    return super.emit(event, ...data);
  }
  /**
   * Performs the intercepted request as-is.
   * Replays the captured request body chunks,
   * still emits the internal events, and wraps
   * up the request with `super.end()`.
   */
  passthrough(chunk, encoding, callback) {
    this.state = 5;
    this.responseType = "passthrough";
    if (this.capturedError) {
      this.emit("error", this.capturedError);
      return this;
    }
    this.logger.info("writing request chunks...", this.chunks);
    for (const { chunk: chunk2, encoding: encoding2 } of this.chunks) {
      if (encoding2) {
        super.write(chunk2, encoding2);
      } else {
        super.write(chunk2);
      }
    }
    this.once("error", (error2) => {
      this.logger.info("original request error:", error2);
    });
    this.once("abort", () => {
      this.logger.info("original request aborted!");
    });
    this.once("response-internal", (message) => {
      this.logger.info(message.statusCode, message.statusMessage);
      this.logger.info("original response headers:", message.headers);
    });
    this.logger.info("performing original request...");
    return super.end(...[chunk, encoding, callback].filter(Boolean));
  }
  /**
   * Responds to this request instance using a mocked response.
   */
  respondWith(mockedResponse) {
    this.logger.info("responding with a mocked response...", mockedResponse);
    this.state = 5;
    this.responseType = "mock";
    Object.defineProperties(this, {
      writableFinished: { value: true },
      writableEnded: { value: true }
    });
    this.emit("finish");
    const { status, statusText, headers, body } = mockedResponse;
    this.response.statusCode = status;
    this.response.statusMessage = statusText;
    const rawHeaders = getRawFetchHeaders(headers) || headers;
    if (rawHeaders) {
      this.response.headers = {};
      rawHeaders.forEach((headerValue, headerName) => {
        this.response.rawHeaders.push(headerName, headerValue);
        const insensitiveHeaderName = headerName.toLowerCase();
        const prevHeaders = this.response.headers[insensitiveHeaderName];
        this.response.headers[insensitiveHeaderName] = prevHeaders ? Array.prototype.concat([], prevHeaders, headerValue) : headerValue;
      });
    }
    this.logger.info("mocked response headers ready:", headers);
    this.res = this.response;
    this.emit("response", this.response);
    const isResponseStreamFinished = new DeferredPromise();
    const finishResponseStream = () => {
      this.logger.info("finished response stream!");
      this.response.push(null);
      this.response.complete = true;
      isResponseStreamFinished.resolve();
    };
    if (body) {
      const bodyReader = body.getReader();
      const readNextChunk = async () => {
        const { done, value } = await bodyReader.read();
        if (done) {
          finishResponseStream();
          return;
        }
        this.response.emit("data", value);
        return readNextChunk();
      };
      readNextChunk();
    } else {
      finishResponseStream();
    }
    isResponseStreamFinished.then(() => {
      this.logger.info("finalizing response...");
      this.response.emit("end");
      this.terminate();
      this.logger.info("request complete!");
    });
  }
  /**
   * Terminates a pending request.
   */
  terminate() {
    var _a;
    (_a = this.agent) == null ? void 0 : _a.destroy();
  }
};
var NodeClientRequest = _NodeClientRequest;
NodeClientRequest.suppressErrorCodes = [
  "ENOTFOUND",
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ENETUNREACH",
  "EHOSTUNREACH"
];
function getRequestOptionsByUrl(url) {
  const options = {
    method: "GET",
    protocol: url.protocol,
    hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
    host: url.host,
    path: `${url.pathname}${url.search || ""}`
  };
  if (!!url.port) {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`;
  }
  return options;
}
var logger3 = new Logger("utils getUrlByRequestOptions");
var DEFAULT_PATH = "/";
var DEFAULT_PROTOCOL = "http:";
var DEFAULT_HOST = "localhost";
var SSL_PORT = 443;
function getAgent(options) {
  return options.agent instanceof Agent ? options.agent : void 0;
}
function getProtocolByRequestOptions(options) {
  var _a;
  if (options.protocol) {
    return options.protocol;
  }
  const agent = getAgent(options);
  const agentProtocol = agent == null ? void 0 : agent.protocol;
  if (agentProtocol) {
    return agentProtocol;
  }
  const port = getPortByRequestOptions(options);
  const isSecureRequest = options.cert || port === SSL_PORT;
  return isSecureRequest ? "https:" : ((_a = options.uri) == null ? void 0 : _a.protocol) || DEFAULT_PROTOCOL;
}
function getPortByRequestOptions(options) {
  if (options.port) {
    return Number(options.port);
  }
  if (options.hostname != null) {
    const [, extractedPort] = options.hostname.match(/:(\d+)$/) || [];
    if (extractedPort != null) {
      return Number(extractedPort);
    }
  }
  const agent = getAgent(options);
  if (agent == null ? void 0 : agent.options.port) {
    return Number(agent.options.port);
  }
  if (agent == null ? void 0 : agent.defaultPort) {
    return Number(agent.defaultPort);
  }
  return void 0;
}
function getHostByRequestOptions(options) {
  const { hostname, host } = options;
  if (hostname != null) {
    return hostname.replace(/:\d+$/, "");
  }
  return host || DEFAULT_HOST;
}
function getAuthByRequestOptions(options) {
  if (options.auth) {
    const [username, password] = options.auth.split(":");
    return { username, password };
  }
}
function isRawIPv6Address(host) {
  return host.includes(":") && !host.startsWith("[") && !host.endsWith("]");
}
function getHostname(host, port) {
  const portString = typeof port !== "undefined" ? `:${port}` : "";
  if (isRawIPv6Address(host)) {
    return `[${host}]${portString}`;
  }
  if (typeof port === "undefined") {
    return host;
  }
  return `${host}${portString}`;
}
function getUrlByRequestOptions(options) {
  logger3.info("request options", options);
  if (options.uri) {
    logger3.info(
      'constructing url from explicitly provided "options.uri": %s',
      options.uri
    );
    return new URL(options.uri.href);
  }
  logger3.info("figuring out url from request options...");
  const protocol = getProtocolByRequestOptions(options);
  logger3.info("protocol", protocol);
  const host = getHostByRequestOptions(options);
  logger3.info("host", host);
  const port = getPortByRequestOptions(options);
  logger3.info("port", port);
  const hostname = getHostname(host, port);
  logger3.info("hostname", hostname);
  const path = options.path || DEFAULT_PATH;
  logger3.info("path", path);
  const credentials = getAuthByRequestOptions(options);
  logger3.info("credentials", credentials);
  const authString = credentials ? `${credentials.username}:${credentials.password}@` : "";
  logger3.info("auth string:", authString);
  const url = new URL(`${protocol}//${hostname}${path}`);
  url.username = (credentials == null ? void 0 : credentials.username) || "";
  url.password = (credentials == null ? void 0 : credentials.password) || "";
  logger3.info("created url:", url);
  return url;
}
var logger4 = new Logger("cloneObject");
function isPlainObject(obj) {
  var _a;
  logger4.info("is plain object?", obj);
  if (obj == null || !((_a = obj.constructor) == null ? void 0 : _a.name)) {
    logger4.info("given object is undefined, not a plain object...");
    return false;
  }
  logger4.info("checking the object constructor:", obj.constructor.name);
  return obj.constructor.name === "Object";
}
function cloneObject(obj) {
  logger4.info("cloning object:", obj);
  const enumerableProperties = Object.entries(obj).reduce(
    (acc, [key, value]) => {
      logger4.info("analyzing key-value pair:", key, value);
      acc[key] = isPlainObject(value) ? cloneObject(value) : value;
      return acc;
    },
    {}
  );
  return isPlainObject(obj) ? enumerableProperties : Object.assign(Object.getPrototypeOf(obj), enumerableProperties);
}
var logger5 = new Logger("http normalizeClientRequestArgs");
function resolveRequestOptions(args, url) {
  if (typeof args[1] === "undefined" || typeof args[1] === "function") {
    logger5.info("request options not provided, deriving from the url", url);
    return getRequestOptionsByUrl(url);
  }
  if (args[1]) {
    logger5.info("has custom RequestOptions!", args[1]);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("derived RequestOptions from the URL:", requestOptionsFromUrl);
    logger5.info("cloning RequestOptions...");
    const clonedRequestOptions = cloneObject(args[1]);
    logger5.info("successfully cloned RequestOptions!", clonedRequestOptions);
    return {
      ...requestOptionsFromUrl,
      ...clonedRequestOptions
    };
  }
  logger5.info("using an empty object as request options");
  return {};
}
function overrideUrlByRequestOptions(url, options) {
  url.host = options.host || url.host;
  url.hostname = options.hostname || url.hostname;
  url.port = options.port ? options.port.toString() : url.port;
  if (options.path) {
    const parsedOptionsPath = parseUrl(options.path, false);
    url.pathname = parsedOptionsPath.pathname || "";
    url.search = parsedOptionsPath.search || "";
  }
  return url;
}
function resolveCallback(args) {
  return typeof args[1] === "function" ? args[1] : args[2];
}
function normalizeClientRequestArgs(defaultProtocol, ...args) {
  let url;
  let options;
  let callback;
  logger5.info("arguments", args);
  logger5.info("using default protocol:", defaultProtocol);
  if (args.length === 0) {
    const url2 = new URL("http://localhost");
    const options2 = resolveRequestOptions(args, url2);
    return [url2, options2];
  }
  if (typeof args[0] === "string") {
    logger5.info("first argument is a location string:", args[0]);
    url = new URL(args[0]);
    logger5.info("created a url:", url);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("request options from url:", requestOptionsFromUrl);
    options = resolveRequestOptions(args, url);
    logger5.info("resolved request options:", options);
    callback = resolveCallback(args);
  } else if (args[0] instanceof URL) {
    url = args[0];
    logger5.info("first argument is a URL:", url);
    if (typeof args[1] !== "undefined" && isObject(args[1])) {
      url = overrideUrlByRequestOptions(url, args[1]);
    }
    options = resolveRequestOptions(args, url);
    logger5.info("derived request options:", options);
    callback = resolveCallback(args);
  } else if ("hash" in args[0] && !("method" in args[0])) {
    const [legacyUrl] = args;
    logger5.info("first argument is a legacy URL:", legacyUrl);
    if (legacyUrl.hostname === null) {
      logger5.info("given legacy URL is relative (no hostname)");
      return isObject(args[1]) ? normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path, ...args[1] },
        args[2]
      ) : normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path },
        args[1]
      );
    }
    logger5.info("given legacy url is absolute");
    const resolvedUrl = new URL(legacyUrl.href);
    return args[1] === void 0 ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl) : typeof args[1] === "function" ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl, args[1]) : normalizeClientRequestArgs(
      defaultProtocol,
      resolvedUrl,
      args[1],
      args[2]
    );
  } else if (isObject(args[0])) {
    options = args[0];
    logger5.info("first argument is RequestOptions:", options);
    options.protocol = options.protocol || defaultProtocol;
    logger5.info("normalized request options:", options);
    url = getUrlByRequestOptions(options);
    logger5.info("created a URL from RequestOptions:", url.href);
    callback = resolveCallback(args);
  } else {
    throw new Error(
      `Failed to construct ClientRequest with these parameters: ${args}`
    );
  }
  options.protocol = options.protocol || url.protocol;
  options.method = options.method || "GET";
  if (typeof options.agent === "undefined") {
    const agent = options.protocol === "https:" ? new HttpsAgent({
      rejectUnauthorized: options.rejectUnauthorized
    }) : new HttpAgent();
    options.agent = agent;
    logger5.info("resolved fallback agent:", agent);
  }
  if (!options._defaultAgent) {
    logger5.info(
      'has no default agent, setting the default agent for "%s"',
      options.protocol
    );
    options._defaultAgent = options.protocol === "https:" ? httpsGlobalAgent : httpGlobalAgent;
  }
  logger5.info("successfully resolved url:", url.href);
  logger5.info("successfully resolved options:", options);
  logger5.info("successfully resolved callback:", callback);
  return [url, options, callback];
}
function get(protocol, options) {
  return function interceptorsHttpGet(...args) {
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    const request2 = new NodeClientRequest(clientRequestArgs, options);
    request2.end();
    return request2;
  };
}
var logger6 = new Logger("http request");
function request(protocol, options) {
  return function interceptorsHttpRequest(...args) {
    logger6.info('request call (protocol "%s"):', protocol, args);
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    return new NodeClientRequest(clientRequestArgs, options);
  };
}
var _ClientRequestInterceptor = class extends Interceptor {
  constructor() {
    super(_ClientRequestInterceptor.interceptorSymbol);
    this.modules = /* @__PURE__ */ new Map();
    this.modules.set("http", http);
    this.modules.set("https", https);
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    for (const [protocol, requestModule] of this.modules) {
      const { request: pureRequest, get: pureGet } = requestModule;
      this.subscriptions.push(() => {
        requestModule.request = pureRequest;
        requestModule.get = pureGet;
        logger7.info('native "%s" module restored!', protocol);
      });
      const options = {
        emitter: this.emitter,
        logger: this.logger
      };
      requestModule.request = // Force a line break.
      request(protocol, options);
      requestModule.get = // Force a line break.
      get(protocol, options);
      logger7.info('native "%s" module patched!', protocol);
    }
  }
};
var ClientRequestInterceptor = _ClientRequestInterceptor;
ClientRequestInterceptor.interceptorSymbol = Symbol("http");

// node_modules/@mswjs/interceptors/lib/node/interceptors/fetch/index.mjs
function canParseUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_error) {
    return false;
  }
}
var _FetchInterceptor = class extends Interceptor {
  constructor() {
    super(_FetchInterceptor.symbol);
  }
  checkEnvironment() {
    return typeof globalThis !== "undefined" && typeof globalThis.fetch !== "undefined";
  }
  async setup() {
    const pureFetch = globalThis.fetch;
    invariant(
      !pureFetch[IS_PATCHED_MODULE],
      'Failed to patch the "fetch" module: already patched.'
    );
    globalThis.fetch = async (input, init) => {
      var _a;
      const requestId = createRequestId();
      const resolvedInput = typeof input === "string" && typeof location !== "undefined" && !canParseUrl(input) ? new URL(input, location.origin) : input;
      const request2 = new Request(resolvedInput, init);
      this.logger.info("[%s] %s", request2.method, request2.url);
      const { interactiveRequest, requestController } = toInteractiveRequest(request2);
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.emitter.once("request", ({ requestId: pendingRequestId }) => {
        if (pendingRequestId !== requestId) {
          return;
        }
        if (requestController.responsePromise.state === "pending") {
          requestController.responsePromise.resolve(void 0);
        }
      });
      this.logger.info("awaiting for the mocked response...");
      const signal = interactiveRequest.signal;
      const requestAborted = new DeferredPromise();
      if (signal) {
        signal.addEventListener(
          "abort",
          () => {
            requestAborted.reject(signal.reason);
          },
          { once: true }
        );
      }
      const resolverResult = await until(async () => {
        const listenersFinished = emitAsync(this.emitter, "request", {
          request: interactiveRequest,
          requestId
        });
        await Promise.race([
          requestAborted,
          // Put the listeners invocation Promise in the same race condition
          // with the request abort Promise because otherwise awaiting the listeners
          // would always yield some response (or undefined).
          listenersFinished,
          requestController.responsePromise
        ]);
        this.logger.info("all request listeners have been resolved!");
        const mockedResponse2 = await requestController.responsePromise;
        this.logger.info("event.respondWith called with:", mockedResponse2);
        return mockedResponse2;
      });
      if (requestAborted.state === "rejected") {
        return Promise.reject(requestAborted.rejectionReason);
      }
      if (resolverResult.error) {
        return Promise.reject(createNetworkError(resolverResult.error));
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse && !((_a = request2.signal) == null ? void 0 : _a.aborted)) {
        this.logger.info("received mocked response:", mockedResponse);
        if (isPropertyAccessible(mockedResponse, "type") && mockedResponse.type === "error") {
          this.logger.info(
            "received a network error response, rejecting the request promise..."
          );
          return Promise.reject(createNetworkError(mockedResponse));
        }
        const responseClone = mockedResponse.clone();
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: true,
          request: interactiveRequest,
          requestId
        });
        Object.defineProperty(mockedResponse, "url", {
          writable: false,
          enumerable: true,
          configurable: false,
          value: request2.url
        });
        return mockedResponse;
      }
      this.logger.info("no mocked response received!");
      return pureFetch(request2).then((response) => {
        const responseClone = response.clone();
        this.logger.info("original fetch performed", responseClone);
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: false,
          request: interactiveRequest,
          requestId
        });
        return response;
      });
    };
    Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
      enumerable: true,
      configurable: true,
      value: true
    });
    this.subscriptions.push(() => {
      Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
        value: void 0
      });
      globalThis.fetch = pureFetch;
      this.logger.info(
        'restored native "globalThis.fetch"!',
        globalThis.fetch.name
      );
    });
  }
};
var FetchInterceptor = _FetchInterceptor;
FetchInterceptor.symbol = Symbol("fetch");
function createNetworkError(cause) {
  return Object.assign(new TypeError("Failed to fetch"), {
    cause
  });
}

// src/fingerprint.ts
var FINGERPRINT_HEADER_NAME = "X-Nf-Function-Fetch";
var functionName = env3.AWS_LAMBDA_FUNCTION_NAME;
var interceptorStarted = false;
var startInterceptor = () => {
  if (interceptorStarted) {
    return;
  }
  interceptorStarted = true;
  const interceptor = new BatchInterceptor({
    name: "netlify-fingerprint",
    interceptors: [new ClientRequestInterceptor(), new FetchInterceptor()]
  });
  interceptor.apply();
  interceptor.on("request", ({ request: request2 }) => {
    request2.headers.set(FINGERPRINT_HEADER_NAME, functionName || "1");
  });
};

// src/api.ts
var pipeline = promisify(pipelineCb);
var getLambdaHandler = (func) => awslambda.streamifyResponse(async (event, responseStream, lambdaContext) => {
  const { body: rawBody, httpMethod: method, isBase64Encoded, headers: headersObject, rawUrl, route } = event;
  const headers = fromEventHeaders(headersObject);
  const body = buildRequestBody(rawBody, isBase64Encoded);
  const req = new NetlifyRequest(rawUrl, {
    body,
    headers,
    method
  });
  setEnvironmentContext(headers, event, lambdaContext);
  setRequestFlags(event, req);
  if (route) {
    req[requestRoute] = route;
  }
  const featureFlags = getRequestFlags(req);
  if (featureFlags.get("serverless_functions_request_interceptor") === true) {
    startInterceptor();
  }
  if (featureFlags.get("serverless_functions_wait_event_loop") === true) {
    lambdaContext.callbackWaitsForEmptyEventLoop = false;
  }
  const cookies = new CookieStore(req);
  const context = getContext(req, cookies);
  const res = await func.default(req, context);
  const invocationMetadata = {
    version
  };
  const invocationMetadataHeader = Buffer5.from(JSON.stringify(invocationMetadata)).toString("base64");
  if (res instanceof Response) {
    cookies.apply(res);
    const headers2 = new Headers(res.headers);
    const { body: body2, status } = res;
    const evaluatedFlags = featureFlags.evaluations;
    if (evaluatedFlags.size !== 0) {
      headers2.set(NFRequestFlags, [...evaluatedFlags].join(","));
    }
    headers2.set(NFInvocationMetadata, invocationMetadataHeader);
    const responseMetadata = {
      multiValueHeaders: toMultiValueHeaders(headers2),
      statusCode: status
    };
    const responseBody = awslambda.HttpResponseStream.from(responseStream, responseMetadata);
    if (featureFlags.get("serverless_functions_fix_empty_body") === true || body2 === null) {
      responseBody.write("");
    }
    if (body2 === null) {
      responseBody.end();
      return;
    }
    const stream = Readable.fromWeb(body2);
    await pipeline(stream, responseBody);
    return;
  }
  if (res === void 0) {
    const responseBody = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 204,
      headers: { [NFInvocationMetadata]: invocationMetadataHeader }
    });
    responseBody.write("");
    responseBody.end();
    return;
  }
  throw new NetlifyUserError(`Function returned an unsupported value. Accepted types are 'Response' or 'undefined'`);
});

// src/globals.ts
import process3 from "process";
var env4 = {
  delete: (key) => {
    delete process3.env[key];
  },
  get: (key) => process3.env[key],
  has: (key) => Boolean(process3.env[key]),
  set: (key, value) => {
    process3.env[key] = value;
  },
  toObject: () => Object.entries(process3.env).reduce((acc, [key, value]) => {
    if (value === void 0) {
      return acc;
    }
    return {
      ...acc,
      [key]: value
    };
  }, {})
};
var Netlify = { env: env4 };
globalThis.Netlify = Netlify;
var getNetlifyGlobal = () => Netlify;

// src/index.ts
var getPath = () => fileURLToPath(import.meta.url);
export {
  getLambdaHandler,
  getNetlifyGlobal,
  getPath
};
