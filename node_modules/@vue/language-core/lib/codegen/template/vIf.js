"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVIf = void 0;
const language_core_1 = require("@volar/language-core");
const CompilerDOM = require("@vue/compiler-dom");
const common_1 = require("../common");
const index_1 = require("./index");
const interpolation_1 = require("./interpolation");
const templateChild_1 = require("./templateChild");
function* generateVIf(options, ctx, node, currentComponent, componentCtxVar) {
    let originalBlockConditionsLength = ctx.blockConditions.length;
    for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (i === 0) {
            yield `if `;
        }
        else if (branch.condition) {
            yield `else if `;
        }
        else {
            yield `else `;
        }
        let addedBlockCondition = false;
        if (branch.condition?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
            const codes = [
                ...(0, interpolation_1.generateInterpolation)(options, ctx, branch.condition.content, branch.condition.loc, branch.condition.loc.start.offset, ctx.codeFeatures.all, '(', ')'),
            ];
            for (const code of codes) {
                yield code;
            }
            ctx.blockConditions.push((0, language_core_1.toString)(codes));
            addedBlockCondition = true;
            yield ` `;
        }
        yield `{${common_1.newLine}`;
        if ((0, index_1.isFragment)(node)) {
            yield* ctx.resetDirectiveComments('end of v-if start');
        }
        let prev;
        for (const childNode of branch.children) {
            yield* (0, templateChild_1.generateTemplateChild)(options, ctx, childNode, currentComponent, prev, componentCtxVar);
            prev = childNode;
        }
        yield* ctx.generateAutoImportCompletion();
        yield `}${common_1.newLine}`;
        if (addedBlockCondition) {
            ctx.blockConditions[ctx.blockConditions.length - 1] = `!(${ctx.blockConditions[ctx.blockConditions.length - 1]})`;
        }
    }
    ctx.blockConditions.length = originalBlockConditionsLength;
}
exports.generateVIf = generateVIf;
//# sourceMappingURL=vIf.js.map