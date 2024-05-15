import * as t from '@babel/types';
import { Node } from '@babel/types';
import { ParseResult as ParseResult$1, ParserOptions } from '@babel/parser';

/**
 * All possible node types.
 */
type NodeType = t.Node['type'] | 'Function' | 'Literal' | 'Expression';
/**
 * Represents the corresponding node based on the given node type.
 */
type GetNode<K extends NodeType> = K extends 'Function' ? t.Function : K extends 'Literal' ? t.Literal : Extract<t.Node, {
    type: K;
}>;
/**
 * Checks if the given node matches the specified type(s).
 *
 * @param node - The node to check.
 * @param types - The type(s) to match against. It can be a single type or an array of types.
 * @returns True if the node matches the specified type(s), false otherwise.
 */
declare function isTypeOf<K extends NodeType>(node: t.Node | undefined | null, types: K | Readonly<K[]>): node is GetNode<K>;
/**
 * Checks if the given node is a CallExpression with the specified callee.
 *
 * @param node - The node to check.
 * @param test - The callee to compare against. It can be a string, an array of strings, or a function that takes a string and returns a boolean.
 * @returns True if the node is a CallExpression with the specified callee, false otherwise.
 */
declare function isCallOf(node: t.Node | null | undefined, test: string | string[] | ((id: string) => boolean)): node is t.CallExpression;
/**
 * Checks if the given node is an Identifier with the specified name.
 *
 * @param node - The node to check.
 * @param test - The name to compare against. It can be a string or an array of strings.
 * @returns True if the node is an Identifier with the specified name, false otherwise.
 */
declare function isIdentifierOf(node: t.Node | undefined | null, test: string | string[]): node is t.Identifier;
/**
 * Checks if the given node is a literal type.
 *
 * @param node - The node to check.
 * @returns True if the node is a literal type, false otherwise.
 */
declare function isLiteralType(node: t.Node | undefined | null): node is t.Literal;
/**
 * Checks if the given node is a function type.
 *
 * @param node - The node to check.
 * @returns True if the node is a function type, false otherwise.
 */
declare function isFunctionType(node: t.Node | undefined | null): node is t.Function;
/**
 * Checks if the given node is an expression type.
 *
 * @param node - The node to check.
 * @returns True if the node is an expression type, false otherwise.
 */
declare function isExpressionType(node: t.Node | null | undefined): node is t.Expression;
/**
 * Checks if the input `node` is a reference to a bound variable.
 *
 * Copied from https://github.com/babel/babel/blob/main/packages/babel-types/src/validators/isReferenced.ts
 *
 * To avoid runtime dependency on `@babel/types` (which includes process references)
 * This file should not change very often in babel but we may need to keep it
 * up-to-date from time to time.
 *
 * @param node - The node to check.
 * @param parent - The parent node of the input `node`.
 * @param grandparent - The grandparent node of the input `node`.
 * @returns True if the input `node` is a reference to a bound variable, false otherwise.
 */
declare function isReferenced(node: t.Node, parent: t.Node, grandparent?: t.Node): boolean;

/**
 * Creates a string literal AST node.
 *
 * @param value - The value of the string literal.
 * @returns The string literal AST node.
 */
declare function createStringLiteral(value: string): t.StringLiteral;
/**
 * Creates a TypeScript union type AST node.
 *
 * @param types - An array of TypeScript types.
 * @returns The TypeScript union type AST node.
 */
declare function createTSUnionType(types: t.TSType[]): t.TSUnionType;
/**
 * Creates a TypeScript literal type AST node.
 *
 * @param literal - The literal value.
 * @returns The TypeScript literal type AST node.
 */
declare function createTSLiteralType(literal: t.TSLiteralType['literal']): t.TSLiteralType;

declare const REGEX_DTS: RegExp;
declare const REGEX_LANG_TS: RegExp;
declare const REGEX_LANG_JSX: RegExp;
/**
 * Returns the language (extension name) of a given filename.
 * @param filename - The name of the file.
 * @returns The language of the file.
 */
declare function getLang(filename: string): string;
/**
 * Checks if a filename represents a TypeScript declaration file (.d.ts).
 * @param filename - The name of the file to check.
 * @returns A boolean value indicating whether the filename is a TypeScript declaration file.
 */
declare function isDts(filename: string): boolean;
/**
 * Checks if the given language (ts, mts, cjs, dts, tsx...) is TypeScript.
 * @param lang - The language to check.
 * @returns A boolean indicating whether the language is TypeScript.
 */
declare function isTs(lang?: string): boolean;

/**
 * Locates the trailing comma in the given code within the specified range.
 *
 * @param code - The code to search for the trailing comma.
 * @param start - The start index of the range to search within.
 * @param end - The end index of the range to search within.
 * @param comments - Optional array of comments to exclude from the search range.
 * @returns The index of the trailing comma, or -1 if not found.
 */
declare function locateTrailingComma(code: string, start: number, end: number, comments?: t.Comment[]): number;

type ParseResult<T> = ParseResult$1<T> & {
    comments?: t.Comment[] | null;
};
/**
 * Parses the given code using Babel parser.
 *
 * @param code - The code to parse.
 * @param lang - The language of the code (optional).
 * @param options - The parser options (optional).
 * @returns The parse result, including the program, errors, and comments.
 */
declare function babelParse(code: string, lang?: string, options?: ParserOptions): ParseResult<t.Program>;
/**
 * Parses the given code using the Babel parser as an expression.
 *
 * @template T - The type of the parsed AST node.
 * @param {string} code - The code to parse.
 * @param {string} [lang] - The language to parse. Defaults to undefined.
 * @param {ParserOptions} [options] - The options to configure the parser. Defaults to an empty object.
 * @returns {ParseResult<T>} - The result of the parsing operation.
 */
declare function babelParseExpression<T extends t.Node = t.Expression>(code: string, lang?: string, options?: ParserOptions): ParseResult<T>;

/**
 * Resolves a string representation of the given node.
 * @param node The node to resolve.
 * @param computed Whether the node is computed or not.
 * @returns The resolved string representation of the node.
 */
declare function resolveString(node: string | t.Identifier | t.Literal | t.PrivateName | t.ThisExpression | t.Super, computed?: boolean): string;
/**
 * Resolves the value of a literal node.
 * @param node The literal node to resolve.
 * @returns The resolved value of the literal node.
 */
declare function resolveLiteral(node: t.Literal): string | number | boolean | null | RegExp | bigint;
/**
 * Resolves a template literal node into a string.
 * @param node The template literal node to resolve.
 * @returns The resolved string representation of the template literal.
 */
declare function resolveTemplateLiteral(node: t.TemplateLiteral): string;
/**
 * Resolves the identifier node into an array of strings.
 * @param node The identifier node to resolve.
 * @returns An array of resolved strings representing the identifier.
 */
declare function resolveIdentifier(node: t.Identifier | t.PrivateName | t.MemberExpression | t.ThisExpression | t.Super | t.TSEntityName): string[];
type ObjectPropertyLike = t.ObjectMethod | t.ObjectProperty | t.TSMethodSignature | t.TSPropertySignature | t.ImportAttribute;
/**
 * Resolves the key of an object property-like node.
 * @param node The object property-like node to resolve.
 * @param raw Whether to return the raw value of the key or not.
 * @returns The resolved key of the object property-like node.
 */
declare function resolveObjectKey(node: ObjectPropertyLike, raw?: false): string | number;
declare function resolveObjectKey(node: ObjectPropertyLike, raw: true): string;

interface AttachedScope {
    parent?: AttachedScope;
    isBlockScope: boolean;
    declarations: {
        [key: string]: boolean;
    };
    addDeclaration: (node: Node, isBlockDeclaration: boolean, isVar: boolean) => void;
    contains: (name: string) => boolean;
}
type WithScope<T> = T & {
    scope?: AttachedScope;
};
interface ScopeOptions {
    parent?: AttachedScope;
    block?: boolean;
    params?: Node[];
}
declare class Scope implements AttachedScope {
    parent?: AttachedScope;
    isBlockScope: boolean;
    declarations: {
        [key: string]: boolean;
    };
    constructor(options?: ScopeOptions);
    addDeclaration(node: Node, isBlockDeclaration: boolean, isVar: boolean): void;
    contains(name: string): boolean;
}
/**
 * Attaches scopes to the given AST
 *
 * @param ast - The AST to attach scopes to.
 * @param propertyName - The name of the property to attach the scopes to. Default is 'scope'.
 * @returns The root scope of the AST.
 */
declare function attachScopes(ast: Node, propertyName?: string): Scope;

type LiteralUnion<LiteralType, BaseType extends null | undefined | string | number | boolean | symbol | bigint = string> = LiteralType | (BaseType & Record<never, never>);

declare const TS_NODE_TYPES: readonly [
    'TSAsExpression',
    'TSTypeAssertion',
    'TSNonNullExpression',
    'TSInstantiationExpression',
    'TSSatisfiesExpression'
];
/**
 * Unwraps a TypeScript node by recursively traversing the AST until a non-TypeScript node is found.
 * @param node - The TypeScript node to unwrap.
 * @returns The unwrapped node.
 */
declare function unwrapTSNode(node: t.Node): t.Node;
/**
 * Escapes a raw key by checking if it needs to be wrapped with quotes or not.
 *
 * @param rawKey - The raw key to escape.
 * @returns The escaped key.
 */
declare function escapeKey(rawKey: string): string;

interface WalkThis<T> {
    skip: () => void;
    remove: () => void;
    replace: (node: T) => void;
}
type WalkCallback<T, R> = (this: WalkThis<T>, node: T, parent: T | null | undefined, key: string | null | undefined, index: number | null | undefined) => R;
interface WalkHandlers<T, R> {
    enter?: WalkCallback<T, R>;
    leave?: WalkCallback<T, R>;
}
/**
 * Walks the AST and applies the provided handlers.
 *
 * @template T - The type of the AST node.
 * @param {T} node - The root node of the AST.
 * @param {WalkHandlers<T, void>} hooks - The handlers to be applied during the walk.
 * @returns {T | null} - The modified AST node or null if the node is removed.
 */
declare const walkAST: <T = t.Node>(node: T, hooks: WalkHandlers<T, void>) => T | null;
/**
 * Asynchronously walks the AST starting from the given node,
 * applying the provided handlers to each node encountered.
 *
 * @template T - The type of the AST node.
 * @param {T} node - The root node of the AST.
 * @param {WalkHandlers<T, Promise<void>>} handlers - The handlers to be applied to each node.
 * @returns {Promise<T | null>} - A promise that resolves to the modified AST or null if the AST is empty.
 */
declare const walkASTAsync: <T = t.Node>(node: T, handlers: WalkHandlers<T, Promise<void>>) => Promise<T | null>;
type SetupCallback<T extends NodeType = NodeType, N = GetNode<T>> = (this: WalkThis<N>, node: N, parent: T extends keyof t.ParentMaps ? t.ParentMaps[T] : t.Node | null, key: string | null | undefined, index: number | null | undefined) => void | Promise<void>;
interface WalkSetup {
    onEnter: <T extends NodeType = NodeType>(type: T | T[] | SetupFilter<GetNode<T>> | WalkCallback<t.Node, void>, cb?: SetupCallback<T, GetNode<T>>) => void;
    onLeave: <T extends NodeType = NodeType>(type: T | T[] | SetupFilter<GetNode<T>> | WalkCallback<t.Node, void>, cb?: SetupCallback<T, GetNode<T>>) => void;
}
type SetupFilter<N extends t.Node = t.Node> = (this: WalkThis<t.Node>, node: t.Node, parent: t.Node | null | undefined, key: string | null | undefined, index: number | null | undefined) => node is N;
/** @deprecated */
declare function walkASTSetup(node: t.Node, cb: (setup: WalkSetup) => void | Promise<void>): Promise<t.Node | null>;
interface ImportBinding {
    local: string;
    imported: LiteralUnion<'*' | 'default'>;
    source: string;
    specifier: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier;
    isType: boolean;
}
/**
 * Walks through an ImportDeclaration node and populates the provided imports object.
 *
 * @param imports - The object to store the import bindings.
 * @param node - The ImportDeclaration node to walk through.
 */
declare function walkImportDeclaration(imports: Record<string, ImportBinding>, node: t.ImportDeclaration): void;
interface ExportBinding {
    local: string;
    exported: LiteralUnion<'*' | 'default'>;
    isType: boolean;
    source: string | null;
    specifier: t.ExportSpecifier | t.ExportDefaultSpecifier | t.ExportNamespaceSpecifier | null;
    declaration: t.Declaration | t.ExportDefaultDeclaration['declaration'] | null;
}
/**
 * Walks through an ExportDeclaration node and populates the exports object with the relevant information.
 * @param exports - The object to store the export information.
 * @param node - The ExportDeclaration node to process.
 */
declare function walkExportDeclaration(exports: Record<string, ExportBinding>, node: t.ExportDeclaration): void;

export { type AttachedScope, type ExportBinding, type GetNode, type ImportBinding, type LiteralUnion, type NodeType, type ObjectPropertyLike, type ParseResult, REGEX_DTS, REGEX_LANG_JSX, REGEX_LANG_TS, TS_NODE_TYPES, type WithScope, attachScopes, babelParse, babelParseExpression, createStringLiteral, createTSLiteralType, createTSUnionType, escapeKey, getLang, isCallOf, isDts, isExpressionType, isFunctionType, isIdentifierOf, isLiteralType, isReferenced, isTs, isTypeOf, locateTrailingComma, resolveIdentifier, resolveLiteral, resolveObjectKey, resolveString, resolveTemplateLiteral, unwrapTSNode, walkAST, walkASTAsync, walkASTSetup, walkExportDeclaration, walkImportDeclaration };
