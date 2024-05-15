import { ComponentInternalInstance } from 'vue';
export declare function arePropsEqual<PropTypes>(prevProps: PropTypes, nextProps: PropTypes): boolean;
export declare function useForwardProps<T extends Record<string, any>>(props: T): import("vue").ComputedRef<T & {
    [x: string]: unknown;
}>;
export declare function parseProps<T extends object>(props: T, instance: ComponentInternalInstance | null): T;
