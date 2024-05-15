import { ComponentTreeNode } from '@vue/devtools-kit';

declare const _default: import('vue').DefineComponent<{
    modelValue: import('vue').PropType<any>;
    data: {
        type: import('vue').PropType<ComponentTreeNode[]>;
        required: true;
    };
    depth: {
        type: import('vue').PropType<number>;
        required: true;
        default: number;
    };
}, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelValue: import('vue').PropType<any>;
    data: {
        type: import('vue').PropType<ComponentTreeNode[]>;
        required: true;
    };
    depth: {
        type: import('vue').PropType<number>;
        required: true;
        default: number;
    };
}>>, {
    depth: number;
}, {}>;
export default _default;
