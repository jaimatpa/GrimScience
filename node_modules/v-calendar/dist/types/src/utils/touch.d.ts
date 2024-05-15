import type { CustomElement } from './helpers';
interface SwipeHandlerOptions {
    maxSwipeTime: number;
    minHorizontalSwipeDistance: number;
    maxVerticalSwipeDistance: number;
}
export declare const addHorizontalSwipeHandler: (element: CustomElement, handler: Function, { maxSwipeTime, minHorizontalSwipeDistance, maxVerticalSwipeDistance, }: SwipeHandlerOptions) => (() => void) | null;
export {};
