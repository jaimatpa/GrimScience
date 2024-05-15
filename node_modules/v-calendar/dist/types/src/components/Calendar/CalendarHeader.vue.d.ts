import { Page } from '../../utils/page';
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<{
    page: Page;
    layout?: string | undefined;
    isLg?: boolean | undefined;
    isXl?: boolean | undefined;
    is2xl?: boolean | undefined;
    hideTitle?: boolean | undefined;
    hideArrows?: boolean | undefined;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    page: Page;
    layout?: string | undefined;
    isLg?: boolean | undefined;
    isXl?: boolean | undefined;
    is2xl?: boolean | undefined;
    hideTitle?: boolean | undefined;
    hideArrows?: boolean | undefined;
}>>>, {}>;
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
