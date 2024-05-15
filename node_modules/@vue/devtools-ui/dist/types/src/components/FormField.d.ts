declare const _default: import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: string;
    status?: "danger" | "warning" | "success" | "normal" | undefined;
    showMessage?: boolean | undefined;
    message?: string | undefined;
    placeholder?: string | undefined;
}>, {
    message: string;
    showMessage: boolean;
    status: string;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: string;
    status?: "danger" | "warning" | "success" | "normal" | undefined;
    showMessage?: boolean | undefined;
    message?: string | undefined;
    placeholder?: string | undefined;
}>, {
    message: string;
    showMessage: boolean;
    status: string;
}>>> & {
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}, {
    message: string;
    status: 'normal' | 'danger' | 'success' | 'warning';
    showMessage: boolean;
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
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
