import { ButtonProps } from "./Button";

declare const _default: <Value extends string | number, Label, M extends boolean>(__VLS_props: {
    disabled?: boolean | undefined;
    modelValue: M extends true ? Value[] : Value;
    "onUpdate:modelValue"?: ((value: M extends true ? Value[] : Value) => any) | undefined;
    autoClose?: boolean | undefined;
    buttonProps?: ButtonProps | undefined;
    placeholder?: string | undefined;
    multiple?: M | undefined;
    options: {
        label: Label;
        value: Value;
    }[];
    labelRenderer?: ((label: Label) => string) | undefined;
} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, __VLS_ctx?: {
    attrs: any;
    slots: Readonly<{
        item: (props: {
            item: {
                label: Label;
                value: Value;
            };
            active: boolean;
            disabled: boolean;
        }) => any;
        button: () => any;
    }> & {
        item: (props: {
            item: {
                label: Label;
                value: Value;
            };
            active: boolean;
            disabled: boolean;
        }) => any;
        button: () => any;
    };
    emit: (evt: "update:modelValue", value: M extends true ? Value[] : Value) => void;
} | undefined, __VLS_expose?: ((exposed: import('vue').ShallowUnwrapRef<{}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        disabled?: boolean | undefined;
        modelValue: M extends true ? Value[] : Value;
        "onUpdate:modelValue"?: ((value: M extends true ? Value[] : Value) => any) | undefined;
        autoClose?: boolean | undefined;
        buttonProps?: ButtonProps | undefined;
        placeholder?: string | undefined;
        multiple?: M | undefined;
        options: {
            label: Label;
            value: Value;
        }[];
        labelRenderer?: ((label: Label) => string) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        item: (props: {
            item: {
                label: Label;
                value: Value;
            };
            active: boolean;
            disabled: boolean;
        }) => any;
        button: () => any;
    }> & {
        item: (props: {
            item: {
                label: Label;
                value: Value;
            };
            active: boolean;
            disabled: boolean;
        }) => any;
        button: () => any;
    };
    emit: (evt: "update:modelValue", value: M extends true ? Value[] : Value) => void;
}>) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            disabled?: boolean | undefined;
            modelValue: M extends true ? Value[] : Value;
            "onUpdate:modelValue"?: ((value: M extends true ? Value[] : Value) => any) | undefined;
            autoClose?: boolean | undefined;
            buttonProps?: ButtonProps | undefined;
            placeholder?: string | undefined;
            multiple?: M | undefined;
            options: {
                label: Label;
                value: Value;
            }[];
            labelRenderer?: ((label: Label) => string) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
        attrs: any;
        slots: Readonly<{
            item: (props: {
                item: {
                    label: Label;
                    value: Value;
                };
                active: boolean;
                disabled: boolean;
            }) => any;
            button: () => any;
        }> & {
            item: (props: {
                item: {
                    label: Label;
                    value: Value;
                };
                active: boolean;
                disabled: boolean;
            }) => any;
            button: () => any;
        };
        emit: (evt: "update:modelValue", value: M extends true ? Value[] : Value) => void;
    } | undefined;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
