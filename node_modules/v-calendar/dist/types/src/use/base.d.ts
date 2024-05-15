import { type ExtractPropTypes, type PropType } from 'vue';
import { type DarkModeClassConfig } from 'vue-screen-utils';
import { Attribute } from '../utils/attribute';
import { type DayOfWeek } from '../utils/date/helpers';
import { default as Locale } from '../utils/locale';
import { Theme } from '../utils/theme';
export declare const propsDef: {
    color: {
        type: StringConstructor;
        default: () => any;
    };
    isDark: {
        type: PropType<boolean | "system" | DarkModeClassConfig>;
        default: () => any;
    };
    firstDayOfWeek: PropType<DayOfWeek>;
    masks: ObjectConstructor;
    locale: PropType<string | Locale | Record<string, any>>;
    timezone: StringConstructor;
    minDate: null;
    maxDate: null;
    disabledDates: null;
};
export type BaseProps = Readonly<ExtractPropTypes<typeof propsDef>>;
export type BaseContext = ReturnType<typeof createBase>;
export declare function createBase(props: BaseProps): {
    color: import("vue").ComputedRef<string>;
    isDark: import("vue").ComputedRef<boolean | "system" | DarkModeClassConfig>;
    displayMode: import("vue").ComputedRef<"light" | "dark">;
    theme: import("vue").ComputedRef<Theme>;
    locale: import("vue").ComputedRef<Locale>;
    masks: import("vue").ComputedRef<any>;
    minDate: import("vue").ComputedRef<any>;
    maxDate: import("vue").ComputedRef<any>;
    disabledDates: import("vue").ComputedRef<import("../utils/date/range").DateRange[]>;
    disabledAttribute: import("vue").ComputedRef<Attribute>;
};
export declare function useBase(): {
    color: import("vue").ComputedRef<string>;
    isDark: import("vue").ComputedRef<boolean | "system" | DarkModeClassConfig>;
    displayMode: import("vue").ComputedRef<"light" | "dark">;
    theme: import("vue").ComputedRef<Theme>;
    locale: import("vue").ComputedRef<Locale>;
    masks: import("vue").ComputedRef<any>;
    minDate: import("vue").ComputedRef<any>;
    maxDate: import("vue").ComputedRef<any>;
    disabledDates: import("vue").ComputedRef<import("../utils/date/range").DateRange[]>;
    disabledAttribute: import("vue").ComputedRef<Attribute>;
};
export declare function useOrCreateBase(props: BaseProps): {
    color: import("vue").ComputedRef<string>;
    isDark: import("vue").ComputedRef<boolean | "system" | DarkModeClassConfig>;
    displayMode: import("vue").ComputedRef<"light" | "dark">;
    theme: import("vue").ComputedRef<Theme>;
    locale: import("vue").ComputedRef<Locale>;
    masks: import("vue").ComputedRef<any>;
    minDate: import("vue").ComputedRef<any>;
    maxDate: import("vue").ComputedRef<any>;
    disabledDates: import("vue").ComputedRef<import("../utils/date/range").DateRange[]>;
    disabledAttribute: import("vue").ComputedRef<Attribute>;
};
