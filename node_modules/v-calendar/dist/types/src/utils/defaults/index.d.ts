import { type App } from 'vue';
import type { DarkModeConfig } from 'vue-screen-utils';
interface DatePickerPopoverDefaults {
    visibility?: string;
    placement?: string;
    isInteractive?: boolean;
}
interface DatePickerDefaults {
    updateOnInput?: boolean;
    inputDebounce?: number;
    popover?: DatePickerPopoverDefaults;
}
export interface Defaults {
    componentPrefix?: string;
    color?: string;
    isDark?: DarkModeConfig;
    navVisibility?: string;
    titlePosition?: string;
    transition?: string;
    touch?: object;
    masks?: object;
    locales?: any;
    datePicker?: DatePickerDefaults;
}
declare const defaultLocales: import("vue").ComputedRef<{
    [x: string]: any;
}>;
export { defaultLocales };
export declare const getDefault: (path: string) => any;
export declare const setupDefaults: (app: App, userDefaults: Defaults | undefined) => any;
