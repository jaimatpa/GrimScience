// src/check.ts
function isTypeOf(node, types) {
  if (!node)
    return false;
  return [].concat(types).some((type) => {
    if (type === "Function") {
      return isFunctionType(node);
    } else if (type === "Literal") {
      return isLiteralType(node);
    } else if (type === "Expression") {
      return isExpressionType(node);
    } else {
      return node.type === type;
    }
  });
}
function isCallOf(node, test) {
  return !!node && node.type === "CallExpression" && node.callee.type === "Identifier" && (typeof test === "string" ? node.callee.name === test : Array.isArray(test) ? test.includes(node.callee.name) : test(node.callee.name));
}
function isIdentifierOf(node, test) {
  return !!node && node.type === "Identifier" && (typeof test === "string" ? node.name === test : test.includes(node.name));
}
function isLiteralType(node) {
  return !!node && node.type.endsWith("Literal");
}
function isFunctionType(node) {
  return !!node && /Function(?:Expression|Declaration)$|Method$/.test(node.type);
}
function isExpressionType(node) {
  return !!node && (node.type.endsWith("Expression") || isLiteralType(node) || [
    "Identifier",
    "MetaProperty",
    "Super",
    "Import",
    "JSXElement",
    "JSXFragment",
    "TopicReference",
    "PipelineBareFunction",
    "PipelinePrimaryTopicReference",
    "TSTypeAssertion"
  ].includes(node.type));
}
function isReferenced(node, parent, grandparent) {
  switch (parent.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      if (parent.property === node) {
        return !!parent.computed;
      }
      return parent.object === node;
    case "JSXMemberExpression":
      return parent.object === node;
    case "VariableDeclarator":
      return parent.init === node;
    case "ArrowFunctionExpression":
      return parent.body === node;
    case "PrivateName":
      return false;
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "ObjectMethod":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return false;
    case "ObjectProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return !grandparent || grandparent.type !== "ObjectPattern";
    case "ClassProperty":
    case "ClassAccessorProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return true;
    case "ClassPrivateProperty":
      return parent.key !== node;
    case "ClassDeclaration":
    case "ClassExpression":
      return parent.superClass === node;
    case "AssignmentExpression":
      return parent.right === node;
    case "AssignmentPattern":
      return parent.right === node;
    case "LabeledStatement":
      return false;
    case "CatchClause":
      return false;
    case "RestElement":
      return false;
    case "BreakStatement":
    case "ContinueStatement":
      return false;
    case "FunctionDeclaration":
    case "FunctionExpression":
      return false;
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return false;
    case "ExportSpecifier":
      if (grandparent?.source) {
        return false;
      }
      return parent.local === node;
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
      return false;
    case "ImportAttribute":
      return false;
    case "JSXAttribute":
      return false;
    case "ObjectPattern":
    case "ArrayPattern":
      return false;
    case "MetaProperty":
      return false;
    case "ObjectTypeProperty":
      return parent.key !== node;
    case "TSEnumMember":
      return parent.id !== node;
    case "TSPropertySignature":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return true;
  }
  return true;
}

// src/create.ts
function createStringLiteral(value) {
  return {
    type: "StringLiteral",
    value,
    extra: {
      rawValue: value,
      raw: JSON.stringify(value)
    }
  };
}
function createTSUnionType(types) {
  return {
    type: "TSUnionType",
    types
  };
}
function createTSLiteralType(literal) {
  return {
    type: "TSLiteralType",
    literal
  };
}

// src/lang.ts
import { extname } from "pathe";
var REGEX_DTS = /\.d\.[cm]?ts(\?.*)?$/;
var REGEX_LANG_TS = /^[cm]?tsx?$/;
var REGEX_LANG_JSX = /^[cm]?[jt]sx$/;
function getLang(filename) {
  if (isDts(filename))
    return "dts";
  return extname(filename).replace(/^\./, "").replace(/\?.*$/, "");
}
function isDts(filename) {
  return REGEX_DTS.test(filename);
}
function isTs(lang) {
  return !!lang && (lang === "dts" || REGEX_LANG_TS.test(lang));
}

// src/loc.ts
function locateTrailingComma(code, start, end, comments = []) {
  let i = start;
  while (i < end) {
    if (comments.some((c) => i >= c.start && i < c.end)) {
      i++;
      continue;
    }
    const char = code[i];
    if (["}", ")"].includes(char))
      return -1;
    if (char === ",")
      return i;
    i++;
  }
  return -1;
}

// src/parse.ts
import {
  parse,
  parseExpression
} from "@babel/parser";
function hasPlugin(plugins, plugin) {
  return plugins.some((p) => (Array.isArray(p) ? p[0] : p) === plugin);
}
function getParserOptions(lang, options = {}) {
  const plugins = [...options.plugins || []];
  if (isTs(lang)) {
    if (!hasPlugin(plugins, "typescript")) {
      plugins.push(
        lang === "dts" ? ["typescript", { dts: true }] : "typescript"
      );
    }
    if (!hasPlugin(plugins, "decorators") && !hasPlugin(plugins, "decorators-legacy")) {
      plugins.push("decorators-legacy");
    }
    if (!hasPlugin(plugins, "importAttributes") && !hasPlugin(plugins, "importAssertions")) {
      plugins.push(["importAttributes", { deprecatedAssertSyntax: true }]);
    }
    if (!hasPlugin(plugins, "explicitResourceManagement")) {
      plugins.push("explicitResourceManagement");
    }
    if (REGEX_LANG_JSX.test(lang) && !hasPlugin(plugins, "jsx")) {
      plugins.push("jsx");
    }
  } else if (!hasPlugin(plugins, "jsx")) {
    plugins.push("jsx");
  }
  return {
    sourceType: "module",
    ...options,
    plugins
  };
}
function babelParse(code, lang, options = {}) {
  const { program, errors, comments } = parse(
    code,
    getParserOptions(lang, options)
  );
  return { ...program, errors, comments };
}
function babelParseExpression(code, lang, options = {}) {
  return parseExpression(
    code,
    getParserOptions(lang, options)
  );
}

// src/resolve.ts
function resolveString(node, computed = false) {
  if (typeof node === "string")
    return node;
  else if (node.type === "Identifier") {
    if (computed)
      throw new TypeError("Invalid Identifier");
    return node.name;
  } else if (node.type === "PrivateName") {
    return `#${node.id.name}`;
  } else if (node.type === "ThisExpression") {
    return "this";
  } else if (node.type === "Super") {
    return "super";
  }
  return String(resolveLiteral(node));
}
function resolveLiteral(node) {
  switch (node.type) {
    case "TemplateLiteral":
      return resolveTemplateLiteral(node);
    case "NullLiteral":
      return null;
    case "BigIntLiteral":
      return BigInt(node.value);
    case "RegExpLiteral":
      return new RegExp(node.pattern, node.flags);
    case "BooleanLiteral":
    case "NumericLiteral":
    case "StringLiteral":
      return node.value;
    case "DecimalLiteral":
      return Number(node.value);
  }
}
function resolveTemplateLiteral(node) {
  return node.quasis.reduce((prev, curr, idx) => {
    const expr = node.expressions[idx];
    if (expr) {
      if (!isLiteralType(expr))
        throw new TypeError("TemplateLiteral expression must be a literal");
      return prev + curr.value.cooked + resolveLiteral(expr);
    }
    return prev + curr.value.cooked;
  }, "");
}
function resolveIdentifier(node) {
  if (isTypeOf(node, ["Identifier", "PrivateName", "ThisExpression", "Super"]))
    return [resolveString(node)];
  const left = node.type === "TSQualifiedName" ? node.left : node.object;
  const right = node.type === "TSQualifiedName" ? node.right : node.property;
  const computed = node.type === "TSQualifiedName" ? false : node.computed;
  if (isTypeOf(left, [
    "Identifier",
    "MemberExpression",
    "ThisExpression",
    "Super",
    "TSQualifiedName"
  ])) {
    const keys = resolveIdentifier(left);
    if (isTypeOf(right, ["Identifier", "PrivateName", "Literal"])) {
      keys.push(resolveString(right, computed));
    } else {
      throw new TypeError("Invalid Identifier");
    }
    return keys;
  }
  throw new TypeError("Invalid Identifier");
}
function resolveObjectKey(node, raw = false) {
  const { key, computed } = node;
  switch (key.type) {
    case "StringLiteral":
    case "NumericLiteral":
      return raw ? key.extra.raw : key.value;
    case "Identifier":
      if (!computed)
        return raw ? `"${key.name}"` : key.name;
      throw "Cannot resolve computed Identifier";
    default:
      throw new SyntaxError(`Unexpected node type: ${key.type}`);
  }
}

// node_modules/.pnpm/estree-walker@3.0.3/node_modules/estree-walker/src/walker.js
var WalkerBase = class {
  constructor() {
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   * @param {Node} node
   */
  replace(parent, prop, index, node) {
    if (parent && prop) {
      if (index != null) {
        parent[prop][index] = node;
      } else {
        parent[prop] = node;
      }
    }
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   */
  remove(parent, prop, index) {
    if (parent && prop) {
      if (index !== null && index !== void 0) {
        parent[prop].splice(index, 1);
      } else {
        delete parent[prop];
      }
    }
  }
};

// node_modules/.pnpm/estree-walker@3.0.3/node_modules/estree-walker/src/sync.js
var SyncWalker = class extends WalkerBase {
  /**
   *
   * @param {SyncHandler} [enter]
   * @param {SyncHandler} [leave]
   */
  constructor(enter, leave) {
    super();
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
    this.enter = enter;
    this.leave = leave;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Node | null}
   */
  visit(node, parent, prop, index) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;
        this.enter.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const skipped = this.should_skip;
        const removed = this.should_remove;
        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;
        if (skipped)
          return node;
        if (removed)
          return null;
      }
      let key;
      for (key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          if (Array.isArray(value)) {
            const nodes = (
              /** @type {Array<unknown>} */
              value
            );
            for (let i = 0; i < nodes.length; i += 1) {
              const item = nodes[i];
              if (isNode(item)) {
                if (!this.visit(item, node, key, i)) {
                  i--;
                }
              }
            }
          } else if (isNode(value)) {
            this.visit(value, node, key, null);
          }
        }
      }
      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;
        this.leave.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const removed = this.should_remove;
        this.replacement = _replacement;
        this.should_remove = _should_remove;
        if (removed)
          return null;
      }
    }
    return node;
  }
};
function isNode(value) {
  return value !== null && typeof value === "object" && "type" in value && typeof value.type === "string";
}

// node_modules/.pnpm/estree-walker@3.0.3/node_modules/estree-walker/src/async.js
var AsyncWalker = class extends WalkerBase {
  /**
   *
   * @param {AsyncHandler} [enter]
   * @param {AsyncHandler} [leave]
   */
  constructor(enter, leave) {
    super();
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
    this.enter = enter;
    this.leave = leave;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Promise<Node | null>}
   */
  async visit(node, parent, prop, index) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;
        await this.enter.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const skipped = this.should_skip;
        const removed = this.should_remove;
        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;
        if (skipped)
          return node;
        if (removed)
          return null;
      }
      let key;
      for (key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          if (Array.isArray(value)) {
            const nodes = (
              /** @type {Array<unknown>} */
              value
            );
            for (let i = 0; i < nodes.length; i += 1) {
              const item = nodes[i];
              if (isNode2(item)) {
                if (!await this.visit(item, node, key, i)) {
                  i--;
                }
              }
            }
          } else if (isNode2(value)) {
            await this.visit(value, node, key, null);
          }
        }
      }
      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;
        await this.leave.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const removed = this.should_remove;
        this.replacement = _replacement;
        this.should_remove = _should_remove;
        if (removed)
          return null;
      }
    }
    return node;
  }
};
function isNode2(value) {
  return value !== null && typeof value === "object" && "type" in value && typeof value.type === "string";
}

// node_modules/.pnpm/estree-walker@3.0.3/node_modules/estree-walker/src/index.js
function walk(ast, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast, null);
}
async function asyncWalk(ast, { enter, leave }) {
  const instance = new AsyncWalker(enter, leave);
  return await instance.visit(ast, null);
}

// src/walk.ts
var walkAST = walk;
var walkASTAsync = asyncWalk;
async function walkASTSetup(node, cb) {
  const callbacks = {
    enter: [],
    leave: []
  };
  function getFilter(types) {
    if (typeof types === "function")
      return types;
    return (node2) => isTypeOf(node2, Array.isArray(types) ? types : [types]);
  }
  const setup = {
    onEnter(type, cb2) {
      callbacks.enter.push({ filter: getFilter(type), cb: cb2 });
    },
    onLeave(type, cb2) {
      callbacks.leave.push({ filter: getFilter(type), cb: cb2 });
    }
  };
  await cb(setup);
  return walkASTAsync(node, {
    async enter(...args) {
      for (const { filter, cb: cb2 } of callbacks.enter) {
        if (!filter.apply(this, args))
          continue;
        await cb2?.apply(this, args);
      }
    },
    async leave(...args) {
      for (const { filter, cb: cb2 } of callbacks.leave) {
        if (!filter.apply(this, args))
          continue;
        await cb2?.apply(this, args);
      }
    }
  });
}
function walkImportDeclaration(imports, node) {
  if (node.importKind === "type")
    return;
  const source = node.source.value;
  for (const specifier of node.specifiers) {
    const isType = specifier.type === "ImportSpecifier" && specifier.importKind === "type";
    const local = specifier.local.name;
    const imported = specifier.type === "ImportSpecifier" ? resolveString(specifier.imported) : specifier.type === "ImportNamespaceSpecifier" ? "*" : "default";
    imports[local] = {
      source,
      local,
      imported,
      specifier,
      isType
    };
  }
}
function walkExportDeclaration(exports, node) {
  let local;
  let exported;
  let isType;
  let source;
  let specifier;
  let declaration;
  function setExport() {
    exports[exported] = {
      source,
      local,
      exported,
      specifier,
      isType,
      declaration
    };
  }
  if (node.type === "ExportNamedDeclaration") {
    if (node.specifiers.length > 0) {
      for (const s of node.specifiers) {
        const isExportSpecifier = s.type === "ExportSpecifier";
        isType = node.exportKind === "type" || isExportSpecifier && s.exportKind === "type";
        local = isExportSpecifier ? s.local.name : s.type === "ExportNamespaceSpecifier" ? "*" : "default";
        source = node.source ? node.source.value : null;
        exported = isExportSpecifier ? resolveString(s.exported) : s.exported.name;
        declaration = null;
        specifier = s;
        setExport();
      }
    } else if (node.specifiers.length === 0 && !!node.declaration) {
      if (node.declaration.type === "VariableDeclaration") {
        for (const decl of node.declaration.declarations) {
          if (decl.id.type !== "Identifier") {
            continue;
          }
          local = resolveString(decl.id);
          source = null;
          exported = local;
          isType = node.exportKind === "type";
          declaration = node.declaration;
          specifier = null;
          setExport();
        }
      } else if ("id" in node.declaration && node.declaration.id && node.declaration.id.type === "Identifier") {
        local = resolveString(node.declaration.id);
        source = null;
        exported = local;
        isType = node.exportKind === "type";
        declaration = node.declaration;
        specifier = null;
        setExport();
      } else {
      }
    }
    return;
  } else if (node.type === "ExportDefaultDeclaration") {
    if (isExpressionType(node.declaration)) {
      local = "name" in node.declaration ? node.declaration.name : "default";
    } else {
      local = resolveString(node.declaration.id || "default");
    }
    source = null;
    exported = "default";
    isType = false;
    declaration = node.declaration;
    specifier = null;
  } else {
    local = "*";
    source = resolveString(node.source);
    exported = "*";
    isType = node.exportKind === "type";
    specifier = null;
    declaration = null;
  }
  setExport();
}

// src/scope.ts
var extractors = {
  ArrayPattern(names, param) {
    for (const element of param.elements) {
      if (element)
        extractors[element.type](names, element);
    }
  },
  AssignmentPattern(names, param) {
    extractors[param.left.type](names, param.left);
  },
  Identifier(names, param) {
    names.push(param.name);
  },
  MemberExpression() {
  },
  ObjectPattern(names, param) {
    for (const prop of param.properties) {
      if (prop.type === "RestElement") {
        extractors.RestElement(names, prop);
      } else {
        extractors[prop.value.type](names, prop.value);
      }
    }
  },
  RestElement(names, param) {
    extractors[param.argument.type](names, param.argument);
  }
};
var extractAssignedNames = function extractAssignedNames2(param) {
  const names = [];
  extractors[param.type](names, param);
  return names;
};
var blockDeclarations = {
  const: true,
  let: true
};
var Scope = class {
  parent;
  isBlockScope;
  declarations;
  constructor(options = {}) {
    this.parent = options.parent;
    this.isBlockScope = !!options.block;
    this.declarations = /* @__PURE__ */ Object.create(null);
    if (options.params) {
      options.params.forEach((param) => {
        extractAssignedNames(param).forEach((name) => {
          this.declarations[name] = true;
        });
      });
    }
  }
  addDeclaration(node, isBlockDeclaration, isVar) {
    if (!isBlockDeclaration && this.isBlockScope) {
      this.parent.addDeclaration(node, isBlockDeclaration, isVar);
    } else if (node.id) {
      extractAssignedNames(node.id).forEach((name) => {
        this.declarations[name] = true;
      });
    }
  }
  contains(name) {
    return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
  }
};
function attachScopes(ast, propertyName = "scope") {
  let scope = new Scope();
  walkAST(ast, {
    enter(n, parent) {
      const node = n;
      if (/(Function|Class)Declaration/.test(node.type)) {
        scope.addDeclaration(node, false, false);
      }
      if (node.type === "VariableDeclaration") {
        const { kind } = node;
        const isBlockDeclaration = blockDeclarations[kind];
        node.declarations.forEach((declaration) => {
          scope.addDeclaration(declaration, isBlockDeclaration, true);
        });
      }
      let newScope;
      if (/Function/.test(node.type)) {
        const func = node;
        newScope = new Scope({
          parent: scope,
          block: false,
          params: func.params
        });
        if (func.type === "FunctionExpression" && func.id) {
          newScope.addDeclaration(func, false, false);
        }
      }
      if (/For(In|Of)?Statement/.test(node.type)) {
        newScope = new Scope({
          parent: scope,
          block: true
        });
      }
      if (node.type === "BlockStatement" && !/Function/.test(parent.type)) {
        newScope = new Scope({
          parent: scope,
          block: true
        });
      }
      if (node.type === "CatchClause") {
        newScope = new Scope({
          parent: scope,
          params: node.param ? [node.param] : [],
          block: true
        });
      }
      if (newScope) {
        Object.defineProperty(node, propertyName, {
          value: newScope,
          configurable: true
        });
        scope = newScope;
      }
    },
    leave(n) {
      const node = n;
      if (node[propertyName])
        scope = scope.parent;
    }
  });
  return scope;
}

// src/utils.ts
import { parseExpression as parseExpression2 } from "@babel/parser";
var TS_NODE_TYPES = [
  "TSAsExpression",
  // foo as number
  "TSTypeAssertion",
  // (<number>foo)
  "TSNonNullExpression",
  // foo!
  "TSInstantiationExpression",
  // foo<string>
  "TSSatisfiesExpression"
  // foo satisfies T
];
function unwrapTSNode(node) {
  if (isTypeOf(node, TS_NODE_TYPES)) {
    return unwrapTSNode(node.expression);
  } else {
    return node;
  }
}
function escapeKey(rawKey) {
  if (String(+rawKey) === rawKey)
    return rawKey;
  try {
    const node = parseExpression2(`({${rawKey}: 1})`);
    if (node.properties[0].key.type === "Identifier")
      return rawKey;
  } catch {
  }
  return JSON.stringify(rawKey);
}
export {
  REGEX_DTS,
  REGEX_LANG_JSX,
  REGEX_LANG_TS,
  TS_NODE_TYPES,
  attachScopes,
  babelParse,
  babelParseExpression,
  createStringLiteral,
  createTSLiteralType,
  createTSUnionType,
  escapeKey,
  getLang,
  isCallOf,
  isDts,
  isExpressionType,
  isFunctionType,
  isIdentifierOf,
  isLiteralType,
  isReferenced,
  isTs,
  isTypeOf,
  locateTrailingComma,
  resolveIdentifier,
  resolveLiteral,
  resolveObjectKey,
  resolveString,
  resolveTemplateLiteral,
  unwrapTSNode,
  walkAST,
  walkASTAsync,
  walkASTSetup,
  walkExportDeclaration,
  walkImportDeclaration
};
