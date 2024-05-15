import { AppRecord } from '@vue/devtools-kit';
import { Ref } from 'vue';

export type DevtoolsBridgeAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId' | 'moduleDetectives'>;
export declare function createDevToolsStateContext(): {
    appRecords: Ref<{
        name: string;
        id: string | number;
        version?: string | undefined;
        routerId?: string | undefined;
        moduleDetectives?: {
            vueRouter: boolean;
            pinia: boolean;
            vueI18n: boolean;
        } | undefined;
    }[]>;
    activeAppRecordId: Ref<string>;
};
export declare function useDevToolsState(): {
    appRecords: Ref<DevtoolsBridgeAppRecord[]>;
    activeAppRecordId: Ref<string>;
};
