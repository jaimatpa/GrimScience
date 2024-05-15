interface Preview {
    enabled: boolean;
    state: Record<any, unknown>;
    _initialized?: boolean;
}
interface PreviewModeOptions<S> {
    shouldEnable?: (state: Preview['state']) => boolean;
    getState?: (state: Preview['state']) => S;
}
type EnteredState = Record<any, unknown> | null | undefined | void;
/** @since 3.11.0 */
export declare function usePreviewMode<S extends EnteredState>(options?: PreviewModeOptions<S>): {
    enabled: import("vue").Ref<boolean>;
    state: S extends void ? Record<any, unknown> : S & Record<any, unknown>;
};
export {};
