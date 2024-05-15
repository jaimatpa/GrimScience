import * as _nuxt_schema from '@nuxt/schema';

declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

interface ModuleOptions {
    /**
     * The default value of $colorMode.preference
     * @default `system`
     */
    preference: string;
    /**
     * Fallback value if no system preference found
     * @default `light`
     */
    fallback: string;
    /**
     * @default `nuxt-color-mode-script`
     */
    hid: string;
    /**
     * @default `__NUXT_COLOR_MODE__`
     */
    globalName: string;
    /**
     * @default `ColorScheme`
     */
    componentName: string;
    /**
     * @default ''
     */
    classPrefix: string;
    /**
     * @default '-mode'
     */
    classSuffix: string;
    /**
     * Whether to add a data attribute to the html tag. If set, it defines the key of the data attribute.
     * For example, setting this to `theme` will output `<html data-theme="dark">` if dark mode is enabled.
     * @default ''
     */
    dataValue: string;
    /**
     * @default 'nuxt-color-mode'
     */
    storageKey: string;
    /**
     * The script that will be injected into the head of the page
     */
    script?: string;
    /**
     * Disable transition on switch
     *
     * @see https://paco.me/writing/disable-theme-transitions
     * @default false
     */
    disableTransition?: boolean;
}

export { type ModuleOptions, _default as default };
