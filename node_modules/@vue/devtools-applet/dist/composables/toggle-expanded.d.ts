import { Ref } from 'vue';

export declare function createExpandedContext(id?: string): {
    expanded: Ref<string[]>;
};
export declare function useToggleExpanded(id?: string): {
    expanded: Ref<string[]>;
    toggleExpanded: (key: string) => void;
};
