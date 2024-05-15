interface BaseOption {
    value: any;
    label: string;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<{
    options: BaseOption[];
    modelValue: any;
    alignRight?: boolean | undefined;
    alignLeft?: boolean | undefined;
    showIcon?: boolean | undefined;
    fitContent?: boolean | undefined;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    options: BaseOption[];
    modelValue: any;
    alignRight?: boolean | undefined;
    alignLeft?: boolean | undefined;
    showIcon?: boolean | undefined;
    fitContent?: boolean | undefined;
}>>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
