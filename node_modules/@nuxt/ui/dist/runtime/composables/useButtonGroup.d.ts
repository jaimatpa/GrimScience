import type { Ref } from 'vue';
import { buttonGroup } from '#ui/ui.config';
type ButtonGroupProps = {
    orientation?: Ref<'horizontal' | 'vertical'>;
    size?: Ref<string>;
    ui?: Ref<Partial<typeof buttonGroup>>;
    rounded?: Ref<{
        start: string;
        end: string;
    }>;
};
export declare function useProvideButtonGroup(buttonGroupProps: ButtonGroupProps): void;
export declare function useInjectButtonGroup({ ui, props }: {
    ui: any;
    props: any;
}): {
    size: import("vue").ComputedRef<any>;
    rounded: import("vue").ComputedRef<any>;
};
export {};
