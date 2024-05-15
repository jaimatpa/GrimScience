
declare const _default: import('vue').DefineComponent<{
    modelValue: import('vue').PropType<any>;
    data: {
        type: import('vue').PropType<({
            groupId: number;
            time: number;
            title: string;
            subtitle: string;
            data: Record<string, unknown>;
        } & {
            color?: string | undefined;
            id?: number | undefined;
        })[]>;
        required: true;
    };
}, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelValue: import('vue').PropType<any>;
    data: {
        type: import('vue').PropType<({
            groupId: number;
            time: number;
            title: string;
            subtitle: string;
            data: Record<string, unknown>;
        } & {
            color?: string | undefined;
            id?: number | undefined;
        })[]>;
        required: true;
    };
}>>, {}, {}>;
export default _default;
