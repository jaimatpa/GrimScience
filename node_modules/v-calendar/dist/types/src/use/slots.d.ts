import { type SetupContext } from 'vue';
type Slots = SetupContext['slots'];
export declare function provideSlots(slots: Slots, remap?: Record<string, string>): void;
export declare function useSlot(slotKey: string): null;
export {};
