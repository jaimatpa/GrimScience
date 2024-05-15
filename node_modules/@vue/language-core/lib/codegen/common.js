"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSfcBlockSection = exports.createTsAst = exports.collectVars = exports.wrapWith = exports.conditionWrapWith = exports.variableNameRegex = exports.combineLastMapping = exports.endOfLine = exports.newLine = void 0;
const scriptSetupRanges_1 = require("../parsers/scriptSetupRanges");
exports.newLine = '\n';
exports.endOfLine = `;${exports.newLine}`;
exports.combineLastMapping = { __combineLastMapping: true };
exports.variableNameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
function* conditionWrapWith(condition, startOffset, endOffset, features, ...wrapCodes) {
    if (condition) {
        yield* wrapWith(startOffset, endOffset, features, ...wrapCodes);
    }
    else {
        for (const wrapCode of wrapCodes) {
            yield wrapCode;
        }
    }
}
exports.conditionWrapWith = conditionWrapWith;
function* wrapWith(startOffset, endOffset, features, ...wrapCodes) {
    yield ['', 'template', startOffset, features];
    let offset = 1;
    for (const wrapCode of wrapCodes) {
        if (typeof wrapCode !== 'string') {
            offset++;
        }
        yield wrapCode;
    }
    yield ['', 'template', endOffset, { __combineOffsetMapping: offset }];
}
exports.wrapWith = wrapWith;
function collectVars(ts, node, ast, result) {
    if (ts.isIdentifier(node)) {
        result.push((0, scriptSetupRanges_1.getNodeText)(ts, node, ast));
    }
    else if (ts.isObjectBindingPattern(node)) {
        for (const el of node.elements) {
            collectVars(ts, el.name, ast, result);
        }
    }
    else if (ts.isArrayBindingPattern(node)) {
        for (const el of node.elements) {
            if (ts.isBindingElement(el)) {
                collectVars(ts, el.name, ast, result);
            }
        }
    }
    else {
        ts.forEachChild(node, node => collectVars(ts, node, ast, result));
    }
}
exports.collectVars = collectVars;
function createTsAst(ts, astHolder, text) {
    if (astHolder.__volar_ast_text !== text) {
        astHolder.__volar_ast_text = text;
        astHolder.__volar_ast = ts.createSourceFile('/a.ts', text, 99);
    }
    return astHolder.__volar_ast;
}
exports.createTsAst = createTsAst;
function generateSfcBlockSection(block, start, end, features) {
    return [
        block.content.substring(start, end),
        block.name,
        start,
        features,
    ];
}
exports.generateSfcBlockSection = generateSfcBlockSection;
//# sourceMappingURL=common.js.map