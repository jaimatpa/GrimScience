"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVForNode = exports.generateVFor = void 0;
const CompilerDOM = require("@vue/compiler-dom");
const common_1 = require("../common");
const index_1 = require("./index");
const interpolation_1 = require("./interpolation");
const templateChild_1 = require("./templateChild");
function* generateVFor(options, ctx, node, currentComponent, componentCtxVar) {
    const { source } = node.parseResult;
    const { leftExpressionRange, leftExpressionText } = parseVForNode(node);
    const forBlockVars = [];
    yield `for (const [`;
    if (leftExpressionRange && leftExpressionText) {
        const collectAst = (0, common_1.createTsAst)(options.ts, node.parseResult, `const [${leftExpressionText}]`);
        (0, common_1.collectVars)(options.ts, collectAst, collectAst, forBlockVars);
        yield [
            leftExpressionText,
            'template',
            leftExpressionRange.start,
            ctx.codeFeatures.all,
        ];
    }
    yield `] of `;
    if (source.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        yield `__VLS_getVForSourceType(`;
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, source.content, source.loc, source.loc.start.offset, ctx.codeFeatures.all, '(', ')');
        yield `!)`; // #3102
    }
    else {
        yield `{} as any`;
    }
    yield `) {${common_1.newLine}`;
    if ((0, index_1.isFragment)(node)) {
        yield* ctx.resetDirectiveComments('end of v-for start');
    }
    for (const varName of forBlockVars) {
        ctx.addLocalVariable(varName);
    }
    let prev;
    for (const childNode of node.children) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, childNode, currentComponent, prev, componentCtxVar);
        prev = childNode;
    }
    for (const varName of forBlockVars) {
        ctx.removeLocalVariable(varName);
    }
    yield* ctx.generateAutoImportCompletion();
    yield `}${common_1.newLine}`;
}
exports.generateVFor = generateVFor;
function parseVForNode(node) {
    const { value, key, index } = node.parseResult;
    const leftExpressionRange = (value || key || index)
        ? {
            start: (value ?? key ?? index).loc.start.offset,
            end: (index ?? key ?? value).loc.end.offset,
        }
        : undefined;
    const leftExpressionText = leftExpressionRange
        ? node.loc.source.substring(leftExpressionRange.start - node.loc.start.offset, leftExpressionRange.end - node.loc.start.offset)
        : undefined;
    return {
        leftExpressionRange,
        leftExpressionText,
    };
}
exports.parseVForNode = parseVForNode;
//# sourceMappingURL=vFor.js.map