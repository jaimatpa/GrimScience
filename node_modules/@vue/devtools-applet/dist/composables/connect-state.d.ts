import { ComputedRef } from 'vue';

export declare function createDevToolsConnectStateContext(): {
    connected: ComputedRef<boolean>;
};
export declare function useDevToolsConnectState(): import('vue').Ref<boolean>;
export declare function onDevToolsClientConnected(callback: () => void): void;
