import type { UseTimestampOptions } from '@vueuse/core';
export declare function useTimer(cb: (...args: unknown[]) => any, interval: number, options?: UseTimestampOptions<true>): {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    remaining: import("vue-demi").ComputedRef<number>;
};
