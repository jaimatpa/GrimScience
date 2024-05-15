import * as vue from 'vue';
import { Ref, ComponentPublicInstance, Plugin } from 'vue';

declare type MediaQueryCallback = (ev?: MediaQueryListEvent) => void;
declare function useMediaQuery(query: string, callback: MediaQueryCallback): {
    matches: vue.Ref<boolean>;
    setup: (newQuery?: string) => void;
    cleanup: () => void;
};

declare type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;
interface ResizeObserverOptions {
    box?: 'content-box' | 'border-box';
}
declare function useResizeObserver(target: Ref<ComponentPublicInstance | HTMLElement | SVGElement | undefined | null>, callback?: ResizeObserverCallback, options?: ResizeObserverOptions): {
    rect: Ref<DOMRectReadOnly | undefined>;
    cleanup: () => void;
};

interface DarkModeClassConfig {
    selector: string;
    darkClass: string;
}
declare type DarkModeConfig = boolean | 'system' | Partial<DarkModeClassConfig>;
declare function useDarkMode(config: Ref<DarkModeConfig>): {
    isDark: Ref<boolean>;
    displayMode: vue.ComputedRef<"dark" | "light">;
    cleanup: () => void;
};

declare type Screens = Record<any, string>;
declare type ScreensConfig = Record<any, any>;
interface ScreensOptions {
    injectKey?: string;
}

declare function useScreens(screens?: Screens, opts?: ScreensOptions): {
    matches: any;
    list: vue.ComputedRef<string[]>;
    mapList: (config: ScreensConfig) => vue.ComputedRef<any[]>;
    current: vue.ComputedRef<string>;
    mapCurrent: (config: ScreensConfig, def?: any) => vue.ComputedRef<any>;
    cleanup: () => void;
};

declare const plugin: Plugin;
//# sourceMappingURL=screens.d.ts.map

interface NormalizedScreenValue {
    min: string;
    max: string | undefined;
    raw?: string | undefined;
}
interface NormalizedScreen {
    name: string;
    values: NormalizedScreenValue[];
}
/**
 * A function that normalizes the various forms that the screens object can be
 * provided in.
 *
 * Input(s):
 *   - ['100px', '200px'] // Raw strings
 *   - { sm: '100px', md: '200px' } // Object with string values
 *   - { sm: { min: '100px' }, md: { max: '100px' } } // Object with object values
 *   - { sm: [{ min: '100px' }, { max: '200px' }] } // Object with object array (multiple values)
 *
 * Output(s):
 *   - [{ name: 'sm', values: [{ min: '100px', max: '200px' }] }] // List of objects, that contains multiple values
 */
declare function normalizeScreens(screens: any, root?: boolean): NormalizedScreen[];

declare function buildMediaQuery(screenValues: NormalizedScreenValue[]): string;

export { DarkModeClassConfig, DarkModeConfig, MediaQueryCallback, NormalizedScreen, NormalizedScreenValue, ResizeObserverCallback, ResizeObserverOptions, Screens, ScreensConfig, ScreensOptions, buildMediaQuery, normalizeScreens, plugin as screens, useDarkMode, useMediaQuery, useResizeObserver, useScreens };
