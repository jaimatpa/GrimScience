declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: boolean;
    content: string;
    cancelText?: string | undefined;
    confirmText?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    title?: string | undefined;
    loading?: boolean | undefined;
    autoClose?: boolean | undefined;
}>, {
    cancelText: string;
    confirmText: string;
    width: string;
    height: string;
    title: string;
    loading: boolean;
    autoClose: boolean;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => void;
    close: () => void;
    confirm: () => void;
    cancel: () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: boolean;
    content: string;
    cancelText?: string | undefined;
    confirmText?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    title?: string | undefined;
    loading?: boolean | undefined;
    autoClose?: boolean | undefined;
}>, {
    cancelText: string;
    confirmText: string;
    width: string;
    height: string;
    title: string;
    loading: boolean;
    autoClose: boolean;
}>>> & {
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onClose?: (() => any) | undefined;
    onCancel?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
}, {
    title: string;
    loading: boolean;
    autoClose: boolean;
    width: string;
    height: string;
    cancelText: string;
    confirmText: string;
}, {}>, {
    default?(_: {
        class: string;
    }): any;
}>;
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
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
