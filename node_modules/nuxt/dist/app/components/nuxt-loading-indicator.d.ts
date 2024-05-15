declare const _default: import("vue").DefineComponent<{
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: (BooleanConstructor | StringConstructor)[];
        default: string;
    };
    estimatedProgress: {
        type: () => (duration: number, elapsed: number) => number;
        required: false;
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: (BooleanConstructor | StringConstructor)[];
        default: string;
    };
    estimatedProgress: {
        type: () => (duration: number, elapsed: number) => number;
        required: false;
    };
}>>, {
    color: string | boolean;
    height: number;
    duration: number;
    throttle: number;
}, {}>;
export default _default;
