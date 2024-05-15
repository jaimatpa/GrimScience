export interface ButtonProps {
    type?: ButtonType;
    round?: 'full' | 'normal' | false;
    loading?: boolean;
    disabled?: boolean;
    size?: 'normal' | 'mini';
    flat?: boolean;
    outlined?: boolean;
}
export type ButtonType = 'default' | 'primary' | 'accent' | 'danger' | 'warning' | 'info' | 'success';
declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<ButtonProps>, {
    type: string;
    round: string;
    loading: boolean;
    disabled: boolean;
    size: string;
    flat: boolean;
    outlined: boolean;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    click: (e: MouseEvent) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<ButtonProps>, {
    type: string;
    round: string;
    loading: boolean;
    disabled: boolean;
    size: string;
    flat: boolean;
    outlined: boolean;
}>>> & {
    onClick?: ((e: MouseEvent) => any) | undefined;
}, {
    flat: boolean;
    type: ButtonType;
    round: false | "full" | "normal";
    loading: boolean;
    disabled: boolean;
    size: "normal" | "mini";
    outlined: boolean;
}, {}>, {
    icon?(_: {
        class: string;
    }): any;
    default?(_: {}): any;
    "icon-right"?(_: {}): any;
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
