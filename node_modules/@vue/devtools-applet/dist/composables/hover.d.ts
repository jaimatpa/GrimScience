import { MaybeRefOrGetter } from '@vueuse/core';

export interface UseHoverOptions {
    enter?: () => void;
    leave?: () => void;
    initial?: boolean;
}
export declare function useHover(el: MaybeRefOrGetter<HTMLElement | null | undefined>, options?: UseHoverOptions): {
    isHovering: import('vue').Ref<boolean>;
};
