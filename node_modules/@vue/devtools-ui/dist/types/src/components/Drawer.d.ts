import { OverlayProps } from "./Overlay";

declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: boolean;
    mountTo?: string | HTMLElement | undefined;
    placement?: "top" | "bottom" | "right" | "left" | undefined;
    closeOutside?: boolean | undefined;
    closable?: boolean | undefined;
    contentClass?: string | undefined;
    permanent?: boolean | undefined;
    contentBlur?: boolean | undefined;
    top?: string | HTMLElement | undefined;
} & OverlayProps>, {
    mountTo: string;
    placement: string;
    closeOutside: boolean;
    closable: boolean;
    permanent: boolean;
    contentBlur: boolean;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (modelValue: boolean) => void;
    close: () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue: boolean;
    mountTo?: string | HTMLElement | undefined;
    placement?: "top" | "bottom" | "right" | "left" | undefined;
    closeOutside?: boolean | undefined;
    closable?: boolean | undefined;
    contentClass?: string | undefined;
    permanent?: boolean | undefined;
    contentBlur?: boolean | undefined;
    top?: string | HTMLElement | undefined;
} & OverlayProps>, {
    mountTo: string;
    placement: string;
    closeOutside: boolean;
    closable: boolean;
    permanent: boolean;
    contentBlur: boolean;
}>>> & {
    "onUpdate:modelValue"?: ((modelValue: boolean) => any) | undefined;
    onClose?: (() => any) | undefined;
}, {
    closable: boolean;
    mountTo: string | HTMLElement;
    placement: "top" | "bottom" | "right" | "left";
    closeOutside: boolean;
    permanent: boolean;
    contentBlur: boolean;
}, {}>, {
    default?(_: {}): any;
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
