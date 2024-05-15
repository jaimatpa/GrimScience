import { Component, Ref } from 'vue';

export declare function registerVirtualRouter(routes: {
    path: string;
    component: Component;
    icon?: string;
    name?: string;
}[]): {
    VirtualRouterView: import('vue').DefineComponent<{}, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }> | null, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{}>>, {}, {}>;
};
export declare function useVirtualRouter(): {
    push(path: string): void;
};
export declare function useVirtualRoute(): {
    routes: {
        path: string;
        component: Component;
        icon?: string | undefined;
        name?: string | undefined;
    }[];
    currentRoute: Ref<{
        path: string;
    }>;
};
