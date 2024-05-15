declare const _default: import("../nuxt").Plugin<Record<string, unknown>> & import("../nuxt").ObjectPlugin<Record<string, unknown>>;
export default _default;
export interface ViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
}
declare global {
    interface Document {
        startViewTransition?: (callback: () => Promise<void> | void) => ViewTransition;
    }
}
