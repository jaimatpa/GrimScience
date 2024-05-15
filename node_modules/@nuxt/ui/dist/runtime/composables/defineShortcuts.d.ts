import type { WatchSource } from 'vue';
export interface ShortcutConfig {
    handler: Function;
    usingInput?: string | boolean;
    whenever?: WatchSource<boolean>[];
}
export interface ShortcutsConfig {
    [key: string]: ShortcutConfig | Function;
}
export interface ShortcutsOptions {
    chainDelay?: number;
}
export declare const defineShortcuts: (config: ShortcutsConfig, options?: ShortcutsOptions) => void;
