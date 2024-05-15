declare const _default: import("vue").DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
    lazy: BooleanConstructor;
    props: {
        type: ObjectConstructor;
        default: () => undefined;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
    source: {
        type: StringConstructor;
        default: () => undefined;
    };
    dangerouslyLoadClientComponents: {
        type: BooleanConstructor;
        default: boolean;
    };
}, (_ctx: any, _cache: any) => (import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[])[] | import("vue").VNode<any, any, {
    [key: string]: any;
}>[], unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "error"[], "error", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
    lazy: BooleanConstructor;
    props: {
        type: ObjectConstructor;
        default: () => undefined;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
    source: {
        type: StringConstructor;
        default: () => undefined;
    };
    dangerouslyLoadClientComponents: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onError?: ((...args: any[]) => any) | undefined;
}, {
    props: Record<string, any>;
    lazy: boolean;
    source: string;
    context: Record<string, any>;
    dangerouslyLoadClientComponents: boolean;
}, {}>;
export default _default;
