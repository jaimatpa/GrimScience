import type { Event } from '../../utils/calendar/event';
import { type PopoverOptions } from '../../utils/popovers';
declare const _default: import("vue").DefineComponent<{
    popoverId: {
        type: StringConstructor;
        default: string;
    };
}, {
    displayMode: import("vue").ComputedRef<"light" | "dark">;
    color: import("vue").ComputedRef<string>;
    show: (event: Event) => void;
    update: (event: Event) => void;
    hide: () => void;
    isVisible: () => boolean;
    onAfterHide(): void;
    event: import("vue").Ref<{
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
        startResize: (day: import("../../utils/page").CalendarDay, isStart: boolean) => void;
        updateResize: (offset: import("../../use/calendarGrid").ResizeOffset) => void;
        stopResize: () => void;
        startDrag: (day: import("../../utils/page").CalendarDay) => void;
        updateDrag: (offset: import("../../use/calendarGrid").DragOffset) => void;
        stopDrag: () => false | undefined;
        compareTo: (b: any) => number;
        key: any;
        summary: string;
        description: string;
        range: import("../../utils/date/range").DateRange;
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
        resizeOrigin: import("../../utils/calendar/event").ResizeOrigin | null;
        dragOrigin: import("../../utils/calendar/event").DragOrigin | null;
    } | null>;
    popoverRef: import("vue").Ref<null>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    popoverId: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    popoverId: string;
}>;
export default _default;
