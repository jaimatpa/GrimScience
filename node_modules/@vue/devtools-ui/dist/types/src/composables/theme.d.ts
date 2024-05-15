import { UseColorModeOptions } from '@vueuse/core';

export declare const THEME_KEY = "__vue-devtools-theme__";
export declare function useDevToolsColorMode(options?: Omit<UseColorModeOptions, 'storageKey'>): {
    colorMode: import('@vueuse/core').UseColorModeReturn<import('@vueuse/core').BasicColorMode>;
    isDark: import('vue').ComputedRef<boolean>;
};
