import { type PageConfig, type CachedPage } from './page';
import { type DateSource, type DateOptions, type DayOfWeek, type MonthParts, type SimpleDateParts, type TimeNames } from './date/helpers';
import Cache from './cache';
import { type DateRangeSource, DateRange } from './date/range';
export interface LocaleConfig {
    id: string;
    firstDayOfWeek: number;
    masks: any;
    monthCacheSize: number;
    pageCacheSize: number;
}
export declare function resolveConfig(config: string | Partial<LocaleConfig> | undefined, locales: any): LocaleConfig;
export default class Locale {
    id: any;
    daysInWeek: number;
    firstDayOfWeek: DayOfWeek;
    masks: any;
    timezone: string | undefined;
    hourLabels: string[];
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesShorter: string[];
    dayNamesNarrow: string[];
    monthNames: string[];
    monthNamesShort: string[];
    relativeTimeNames: TimeNames;
    amPm: [string, string];
    monthCache: Cache<MonthParts>;
    pageCache: Cache<CachedPage>;
    constructor(config?: Partial<LocaleConfig> | string | undefined, timezone?: string);
    formatDate(date: Date, masks: string | string[]): string;
    parseDate(dateString: string, mask: string | string[]): Date;
    toDate(d: DateSource | Partial<SimpleDateParts>, opts?: Partial<DateOptions>): Date;
    toDateOrNull(d: DateSource | Partial<SimpleDateParts>, opts?: Partial<DateOptions>): Date | null;
    fromDate(date: Date | null, { type, mask }?: Partial<DateOptions>): string | number | Date | import("./date/helpers").DateParts | null;
    range(source: DateRangeSource): DateRange;
    ranges(ranges: DateRangeSource | DateRangeSource[]): DateRange[];
    getDateParts(date: Date): import("./date/helpers").DateParts;
    getDateFromParts(parts: Partial<SimpleDateParts>): Date;
    getDateFromParams(year: number, month: number, day: number, hours: number, minutes: number, seconds: number, milliseconds: number): Date;
    getPage(config: PageConfig): import("./page").Page;
    getMonthParts(month: number, year: number): MonthParts;
    getThisMonthParts(): MonthParts;
    getPrevMonthParts(month: number, year: number): MonthParts;
    getNextMonthParts(month: number, year: number): MonthParts;
    getHourLabels(): string[];
    getDayId(date: Date): string;
}
