import Locale from '../locale';
import type { CalendarDay } from '../page';
import { type DateParts, type DayParts } from './helpers';
import { DateRepeat, type DateRepeatConfig } from './repeat';
type DateRangeDate = Date | string | number | null;
interface DateRangeConfig {
    start: DateRangeDate;
    end: DateRangeDate;
    span: number;
    order: number;
    repeat: Partial<DateRepeatConfig>;
}
export type DateRangeSource = DateRange | DateRangeDate | [DateRangeDate, DateRangeDate] | Partial<DateRangeConfig>;
export interface SimpleDateRange {
    start: Date;
    end: Date;
}
export declare class DateRange {
    order: number;
    locale: Locale;
    start: DateParts | null;
    end: DateParts | null;
    repeat: DateRepeat | null;
    static fromMany(ranges: DateRangeSource | DateRangeSource[], locale: Locale): DateRange[];
    static from(source: DateRangeSource, locale: Locale): DateRange;
    private constructor();
    get opts(): {
        order: number;
        locale: Locale;
    };
    get hasRepeat(): boolean;
    get isSingleDay(): boolean | null;
    get isMultiDay(): boolean;
    get daySpan(): number;
    startsOnDay(dayParts: DayParts): boolean;
    intersectsDay(dayIndex: number): boolean;
    intersectsRange(range: DateRange): boolean;
    intersectsDayRange(startDayIndex: number, endDayIndex: number): boolean;
}
interface DataRange {
    startDay: number;
    startTime: number;
    endDay: number;
    endTime: number;
}
export interface RangeData {
    key: string | number;
    order?: number;
}
export interface DateRangeCell<T extends RangeData> extends DataRange {
    data: T;
    onStart: boolean;
    onEnd: boolean;
    startTime: number;
    startDate: Date;
    endTime: number;
    endDate: Date;
    allDay: boolean;
    order: number;
}
export declare class DateRangeContext {
    private records;
    render(data: RangeData, range: DateRange, days: DayParts[]): {
        startDay: number;
        startTime: number;
        endDay: number;
        endTime: number;
    } | null;
    private getRangeRecords;
    getCell(key: string | number, day: CalendarDay): DateRangeCell<any> | undefined;
    cellExists(key: string | number, dayIndex: number): boolean;
    getCells(day: CalendarDay): DateRangeCell<any>[];
}
export {};
