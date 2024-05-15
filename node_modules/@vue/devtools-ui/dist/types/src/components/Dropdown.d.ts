import { ButtonProps } from "./Button";

declare const _default: <T>(__VLS_props: {
    label?: string | undefined;
    disabled?: boolean | undefined;
    placement?: import('floating-vue').Placement | undefined;
    "onUpdate:visible"?: ((value: boolean) => any) | undefined;
    buttonProps?: ButtonProps | undefined;
    buttonClass?: string | undefined;
    trigger?: "click" | "hover" | undefined;
    distance?: number | undefined;
    skidding?: number | undefined;
    shown?: boolean | undefined;
} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, __VLS_ctx?: {
    attrs: any;
    slots: Readonly<{
        default: () => any;
        popper: (props: {
            hide: () => void;
        }) => any;
        'button-icon': () => any;
        'button-icon-right': () => any;
    }> & {
        default: () => any;
        popper: (props: {
            hide: () => void;
        }) => any;
        'button-icon': () => any;
        'button-icon-right': () => any;
    };
    emit: (evt: "update:visible", value: boolean) => void;
} | undefined, __VLS_expose?: ((exposed: import('vue').ShallowUnwrapRef<{}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        label?: string | undefined;
        disabled?: boolean | undefined;
        placement?: import('floating-vue').Placement | undefined;
        "onUpdate:visible"?: ((value: boolean) => any) | undefined;
        buttonProps?: ButtonProps | undefined;
        buttonClass?: string | undefined;
        trigger?: "click" | "hover" | undefined;
        distance?: number | undefined;
        skidding?: number | undefined;
        shown?: boolean | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        default: () => any;
        popper: (props: {
            hide: () => void;
        }) => any;
        'button-icon': () => any;
        'button-icon-right': () => any;
    }> & {
        default: () => any;
        popper: (props: {
            hide: () => void;
        }) => any;
        'button-icon': () => any;
        'button-icon-right': () => any;
    };
    emit: (evt: "update:visible", value: boolean) => void;
}>) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            label?: string | undefined;
            disabled?: boolean | undefined;
            placement?: import('floating-vue').Placement | undefined;
            "onUpdate:visible"?: ((value: boolean) => any) | undefined;
            buttonProps?: ButtonProps | undefined;
            buttonClass?: string | undefined;
            trigger?: "click" | "hover" | undefined;
            distance?: number | undefined;
            skidding?: number | undefined;
            shown?: boolean | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
        attrs: any;
        slots: Readonly<{
            default: () => any;
            popper: (props: {
                hide: () => void;
            }) => any;
            'button-icon': () => any;
            'button-icon-right': () => any;
        }> & {
            default: () => any;
            popper: (props: {
                hide: () => void;
            }) => any;
            'button-icon': () => any;
            'button-icon-right': () => any;
        };
        emit: (evt: "update:visible", value: boolean) => void;
    } | undefined;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
