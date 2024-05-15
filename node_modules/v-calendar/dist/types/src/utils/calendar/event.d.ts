import { type ComputedRef } from 'vue';
import type { DragOffset, ResizeOffset } from '../../use/calendarGrid';
import { DateRange } from '../date/range';
import Locale from '../locale';
import type { CalendarDay } from '../page';
import type { PopoverOptions } from '../popovers';
export interface ResizeOrigin {
    start: Date;
    end: Date;
    isStart: boolean;
}
export interface DragOrigin {
    day: CalendarDay;
    start: Date;
    end: Date;
    minOffsetWeeks: number;
    maxOffsetWeeks: number;
    minOffsetWeekdays: number;
    maxOffsetWeekdays: number;
    minOffsetMs: number;
    maxOffsetMs: number;
    durationMs: number;
}
export interface EventConfig {
    key: PropertyKey;
    summary: string;
    description: string;
    start: Date;
    end: Date;
    range: DateRange;
    allDay: boolean;
    color: string;
    selected: boolean;
}
export interface EventState {
    key: any;
    summary: string;
    description: string;
    range: DateRange;
    allDay: boolean;
    color: string;
    fill: string;
    selected: boolean;
    draggable: boolean;
    dragging: boolean;
    resizable: boolean;
    resizing: boolean;
    editing: boolean;
    order: number;
    snapMinutes: number;
    minDurationMinutes: number;
    maxDurationMinutes: number;
    popover: Partial<PopoverOptions> | null;
    resizeOrigin: ResizeOrigin | null;
    dragOrigin: DragOrigin | null;
}
export interface EventContext {
    days: ComputedRef<CalendarDay[]>;
    dayRows: ComputedRef<number>;
    dayColumns: ComputedRef<number>;
    isDaily: ComputedRef<boolean>;
    isMonthly: ComputedRef<boolean>;
    locale: ComputedRef<Locale>;
}
export type Event = ReturnType<typeof createEvent>;
export declare function createEvent(config: Partial<EventConfig>, ctx: EventContext): {
    refSelector: string;
    isMultiDay: boolean;
    isWeekly: boolean;
    durationMs: number;
    durationMinutes: number;
    startDate: Date;
    startDateTime: number;
    startTimeLabel: string;
    endDate: Date;
    endDateTime: number;
    endTimeLabel: string;
    timeLabel: string;
    isSolid: boolean;
    dragIsDirty: boolean;
    formatDate: (date: Date, mask: string) => string;
    formatTime: (date: Date) => string;
    resizeToConstraints: () => void;
    startResize: (day: CalendarDay, isStart: boolean) => void;
    updateResize: (offset: ResizeOffset) => void;
    stopResize: () => void;
    startDrag: (day: CalendarDay) => void;
    updateDrag: (offset: DragOffset) => void;
    stopDrag: () => false | undefined;
    compareTo: (b: Event) => number;
    key: any;
    summary: string;
    description: string;
    range: DateRange;
    allDay: boolean;
    color: string;
    fill: string;
    selected: boolean;
    draggable: boolean;
    dragging: boolean;
    resizable: boolean;
    resizing: boolean;
    editing: boolean;
    order: number;
    snapMinutes: number;
    minDurationMinutes: number;
    maxDurationMinutes: number;
    popover: Partial<PopoverOptions> | null;
    resizeOrigin: ResizeOrigin | null;
    dragOrigin: DragOrigin | null;
};
