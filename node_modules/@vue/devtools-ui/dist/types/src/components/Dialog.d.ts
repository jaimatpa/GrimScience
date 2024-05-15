import { OverlayProps } from "./Overlay";

declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: boolean | undefined;
    autoClose?: boolean | undefined;
    title?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    closable?: boolean | undefined;
    mountTo?: string | HTMLElement | undefined;
} & OverlayProps>, {
    title: string;
    modelValue: boolean;
    autoClose: boolean;
    width: string;
    height: string;
    closable: boolean;
    mountTo: string;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => void;
    "update:modelValue": (value: boolean) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: boolean | undefined;
    autoClose?: boolean | undefined;
    title?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    closable?: boolean | undefined;
    mountTo?: string | HTMLElement | undefined;
} & OverlayProps>, {
    title: string;
    modelValue: boolean;
    autoClose: boolean;
    width: string;
    height: string;
    closable: boolean;
    mountTo: string;
}>>> & {
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onClose?: (() => any) | undefined;
}, {
    title: string;
    modelValue: boolean;
    autoClose: boolean;
    width: string;
    height: string;
    closable: boolean;
    mountTo: string | HTMLElement;
}, {}>, {
    title?(_: {}): any;
    default?(_: {}): any;
    footer?(_: {}): any;
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
