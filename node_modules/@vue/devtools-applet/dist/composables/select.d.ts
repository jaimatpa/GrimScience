import { Ref } from 'vue';

export declare function createSelectedContext(): {
    selected: Ref<string>;
};
export declare function useSelect(): {
    selected: Ref<string>;
    select: (value: string) => void;
};
