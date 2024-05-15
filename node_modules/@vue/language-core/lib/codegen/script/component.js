"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScriptSetupOptions = exports.generateScriptOptions = exports.generateComponentSetupReturns = exports.generateComponent = void 0;
const common_1 = require("../common");
const index_1 = require("./index");
function* generateComponent(options, ctx, scriptSetup, scriptSetupRanges) {
    if (options.sfc.script && options.scriptRanges?.exportDefault && options.scriptRanges.exportDefault.expression.start !== options.scriptRanges.exportDefault.args.start) {
        // use defineComponent() from user space code if it exist
        yield (0, common_1.generateSfcBlockSection)(options.sfc.script, options.scriptRanges.exportDefault.expression.start, options.scriptRanges.exportDefault.args.start, index_1.codeFeatures.all);
        yield `{${common_1.newLine}`;
    }
    else {
        yield `(await import('${options.vueCompilerOptions.lib}')).defineComponent({${common_1.newLine}`;
    }
    yield `setup() {${common_1.newLine}`;
    yield `return {${common_1.newLine}`;
    if (ctx.bypassDefineComponent) {
        yield* generateComponentSetupReturns(scriptSetupRanges);
    }
    if (scriptSetupRanges.expose.define) {
        yield `...__VLS_exposed,${common_1.newLine}`;
    }
    yield `}${common_1.endOfLine}`;
    yield `},${common_1.newLine}`;
    if (!ctx.bypassDefineComponent) {
        yield* generateScriptSetupOptions(options, ctx, scriptSetup, scriptSetupRanges);
    }
    if (options.sfc.script && options.scriptRanges) {
        yield* generateScriptOptions(options.sfc.script, options.scriptRanges);
    }
    yield `})`;
}
exports.generateComponent = generateComponent;
function* generateComponentSetupReturns(scriptSetupRanges) {
    // fill $props
    if (scriptSetupRanges.props.define) {
        // NOTE: defineProps is inaccurate for $props
        yield `$props: __VLS_makeOptional(${scriptSetupRanges.props.name ?? `__VLS_props`}),${common_1.newLine}`;
        yield `...${scriptSetupRanges.props.name ?? `__VLS_props`},${common_1.newLine}`;
    }
    // fill $emit
    if (scriptSetupRanges.emits.define) {
        yield `$emit: ${scriptSetupRanges.emits.name ?? '__VLS_emit'},${common_1.newLine}`;
    }
}
exports.generateComponentSetupReturns = generateComponentSetupReturns;
function* generateScriptOptions(script, scriptRanges) {
    if (scriptRanges.exportDefault?.args) {
        yield (0, common_1.generateSfcBlockSection)(script, scriptRanges.exportDefault.args.start + 1, scriptRanges.exportDefault.args.end - 1, index_1.codeFeatures.all);
    }
}
exports.generateScriptOptions = generateScriptOptions;
function* generateScriptSetupOptions(options, ctx, scriptSetup, scriptSetupRanges) {
    const propsCodegens = [];
    if (ctx.generatedPropsType) {
        propsCodegens.push(function* () {
            yield `{} as `;
            if (scriptSetupRanges.props.withDefaults?.arg) {
                yield `${ctx.helperTypes.WithDefaults.name}<`;
            }
            yield `${ctx.helperTypes.TypePropsToOption.name}<`;
            yield `__VLS_PublicProps>`;
            if (scriptSetupRanges.props.withDefaults?.arg) {
                yield `, typeof __VLS_withDefaultsArg>`;
            }
        });
    }
    if (scriptSetupRanges.props.define?.arg) {
        const { arg } = scriptSetupRanges.props.define;
        propsCodegens.push(function* () {
            yield (0, common_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, index_1.codeFeatures.navigation);
        });
    }
    if (propsCodegens.length === 1) {
        yield `props: `;
        for (const generate of propsCodegens) {
            yield* generate();
        }
        yield `,${common_1.newLine}`;
    }
    else if (propsCodegens.length >= 2) {
        yield `props: {${common_1.newLine}`;
        for (const generate of propsCodegens) {
            yield `...`;
            yield* generate();
            yield `,${common_1.newLine}`;
        }
        yield `},${common_1.newLine}`;
    }
    if (scriptSetupRanges.defineProp.filter(p => p.isModel).length || scriptSetupRanges.emits.define) {
        yield `emits: ({} as __VLS_NormalizeEmits<typeof __VLS_modelEmitsType`;
        if (scriptSetupRanges.emits.define) {
            yield ` & typeof `;
            yield scriptSetupRanges.emits.name ?? '__VLS_emit';
        }
        yield `>),${common_1.newLine}`;
    }
    if (options.vueCompilerOptions.target >= 3.5) {
        // https://github.com/vuejs/core/pull/10801
        if (scriptSetupRanges.props.define?.typeArg) {
            yield `__typeProps: __VLS_typeProps,${common_1.newLine}`;
        }
        if (scriptSetupRanges.emits.define?.typeArg) {
            yield `__typeEmits: ${scriptSetupRanges.emits.name ?? '__VLS_emit'},${common_1.newLine}`;
        }
    }
}
exports.generateScriptSetupOptions = generateScriptSetupOptions;
//# sourceMappingURL=component.js.map