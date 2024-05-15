declare const _default: import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: string;
    placeholder?: string | undefined;
    variant?: "flat" | "accent" | "warning" | "normal" | undefined;
    disabled?: boolean | undefined;
    leftIcon?: string | undefined;
    rightIcon?: string | undefined;
    loading?: boolean | undefined;
    autoFocus?: boolean | undefined;
    loadingDebounceTime?: number | undefined;
    readonly?: boolean | undefined;
    type?: string | undefined;
}>, {
    placeholder: string;
    variant: string;
    disabled: boolean;
    type: string;
    /**
     * loading will auto enable disabled
     */
    loading: boolean;
    autoFocus: boolean;
    loadingDebounceTime: number;
    readonly: boolean;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    updateFocused: (value: boolean) => void;
    keyTab: (e: KeyboardEvent) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: string;
    placeholder?: string | undefined;
    variant?: "flat" | "accent" | "warning" | "normal" | undefined;
    disabled?: boolean | undefined;
    leftIcon?: string | undefined;
    rightIcon?: string | undefined;
    loading?: boolean | undefined;
    autoFocus?: boolean | undefined;
    loadingDebounceTime?: number | undefined;
    readonly?: boolean | undefined;
    type?: string | undefined;
}>, {
    placeholder: string;
    variant: string;
    disabled: boolean;
    type: string;
    /**
     * loading will auto enable disabled
     */
    loading: boolean;
    autoFocus: boolean;
    loadingDebounceTime: number;
    readonly: boolean;
}>>> & {
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onUpdateFocused?: ((value: boolean) => any) | undefined;
    onKeyTab?: ((e: KeyboardEvent) => any) | undefined;
}, {
    type: string;
    loading: boolean;
    disabled: boolean;
    variant: 'normal' | 'accent' | 'flat' | 'warning';
    placeholder: string;
    autoFocus: boolean;
    loadingDebounceTime: number;
    readonly: boolean;
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
