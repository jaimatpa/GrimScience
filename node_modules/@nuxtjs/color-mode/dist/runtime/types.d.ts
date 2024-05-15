export interface ColorModeInstance {
    preference: string;
    value: string;
    unknown: boolean;
    forced: boolean;
}
declare module 'vue/types/vue' {
    interface Vue {
        $colorMode: ColorModeInstance;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V> {
        /**
         * Forces a color mode for current page
         * @see https://color-mode.nuxtjs.org/#force-a-color-mode
         */
        colorMode?: string;
    }
}
declare module '#app' {
    interface NuxtApp extends PluginInjection {
    }
}
declare module 'vue-router' {
    interface RouteMeta {
        colorMode?: string;
    }
}
interface PluginInjection {
    $colorMode: ColorModeInstance;
}
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends PluginInjection {
    }
}
export {};
