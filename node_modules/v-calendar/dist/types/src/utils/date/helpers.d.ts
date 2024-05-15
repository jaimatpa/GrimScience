import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import { type LocaleConfig, default as Locale } from '../locale';
export { addDays, addMonths, addYears };
export { DateRepeat } from './repeat';
type DayNameLength = 'narrow' | 'short' | 'long';
type MonthNameLength = 'short' | 'long';
export type DayInMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -13 | -14 | -15 | -16 | -17 | -18 | -19 | -20 | -21 | -22 | -23 | -24 | -25 | -26 | -27 | -28 | -29 | -30 | -31;
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WeekInMonth = 1 | 2 | 3 | 4 | 5 | 6;
export type WeekInMonthFromEnd = -6 | -5 | -4 | -3 | -2 | -1;
export type OrdinalWeekInMonth = -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5;
export type MonthInYear = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type StartOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DateSource = Date | string | number;
export type TimeNames = Partial<Record<Intl.RelativeTimeFormatUnit, string>>;
export declare function isDayInMonth(dayInMonth: unknown): dayInMonth is DayInMonth;
export declare function isDayOfWeek(dayOfWeek: unknown): dayOfWeek is DayOfWeek;
export declare function isWeekInMonth(weekInMonth: unknown): weekInMonth is WeekInMonth;
export declare function isMonthInYear(monthInYear: unknown): monthInYear is MonthInYear;
export declare function isOrdinalWeekInMonth(weekInMonth: unknown): weekInMonth is OrdinalWeekInMonth;
interface NumberRuleConfig {
    min?: number;
    max?: number;
    interval?: number;
}
type DatePartsRuleFunction = (part: number, parts: TimeParts) => boolean;
type DatePartsRule = number | Array<number> | NumberRuleConfig | DatePartsRuleFunction;
export interface DatePartsRules {
    hours?: DatePartsRule;
    minutes?: DatePartsRule;
    seconds?: DatePartsRule;
    milliseconds?: DatePartsRule;
}
export interface DatePartOption {
    value: number;
    label: string;
    disabled?: boolean;
}
export interface FormatParseOptions {
    locale?: Locale | LocaleConfig | string;
    timezone?: string;
}
export interface DateOptions {
    type: string;
    fillDate: DateSource;
    mask: string;
    patch: DatePatch;
    rules: DatePartsRules;
}
export interface PageAddress {
    day?: number;
    week?: number;
    month: number;
    year: number;
}
export interface TimeParts {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
export interface SimpleDateParts {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
export interface DayParts {
    dayIndex: number;
    day: number;
    dayFromEnd: number;
    weekday: number;
    weekdayOrdinal: number;
    weekdayOrdinalFromEnd: number;
    week: number;
    weekFromEnd: number;
    weeknumber: number;
    month: number;
    year: number;
    date: Date;
}
export interface DateParts extends DayParts {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    time: number;
    dateTime: number;
    isValid: boolean;
    timezoneOffset: number;
    isPm?: boolean;
}
export interface MonthParts {
    firstDayOfWeek: DayOfWeek;
    firstDayOfMonth: Date;
    inLeapYear: boolean;
    firstWeekday: number;
    numDays: number;
    numWeeks: number;
    month: number;
    year: number;
    weeknumbers: number[];
    isoWeeknumbers: number[];
}
export type DatePatch = 'dateTime' | 'date' | 'time';
export declare const DatePatchKeys: Record<DatePatch, (keyof SimpleDateParts)[]>;
export declare const daysInWeek = 7;
export declare const weeksInMonth = 6;
export declare const MS_PER_SECOND = 1000;
export declare const MS_PER_MINUTE: number;
export declare const MS_PER_HOUR: number;
export declare const MS_PER_DAY: number;
type DatePartsRange = Readonly<[number, number, number]>;
export declare function isDateParts(parts: unknown): parts is Partial<DateParts>;
export declare function isDateSource(date: unknown): date is DateSource;
export declare function roundDate(dateMs: number, snapMs?: number): Date;
export declare function startOfWeek(date: Date, firstDayOfWeek?: DayOfWeek): Date;
export declare function getStartOfWeek(date: Date, firstDayOfWeek?: DayOfWeek): Date;
export declare function getDayIndex(year: number, month: number, day: number): number;
export declare function diffInDays(d1: Date, d2: Date): number;
export declare function diffInWeeks(d1: Date, d2: Date): number;
export declare function diffInYears(d1: Date, d2: Date): number;
export declare function diffInMonths(d1: Date, d2: Date): number;
export declare function getDateFromParts(parts: Partial<SimpleDateParts>, timezone?: string): Date;
export declare function getTimezoneOffset(parts: Partial<SimpleDateParts>, timezone?: string): number;
export declare function getDateParts(date: Date, locale: Locale): DateParts;
export declare function getMonthPartsKey(month: number, year: number, firstDayOfWeek: DayOfWeek): string;
export declare function getMonthParts(month: number, year: number, firstDayOfWeek: DayOfWeek): {
    firstDayOfWeek: DayOfWeek;
    firstDayOfMonth: Date;
    inLeapYear: boolean;
    firstWeekday: number;
    numDays: number;
    numWeeks: number;
    month: number;
    year: number;
    weeknumbers: number[];
    isoWeeknumbers: number[];
};
export declare function getWeekdayDates(): Date[];
export declare function getDayNames(length: DayNameLength, localeId?: string | undefined): string[];
export declare function getHourDates(): Date[];
export declare function getRelativeTimeNames(localeId?: undefined): TimeNames;
export declare function getMonthDates(): Date[];
export declare function getMonthNames(length: MonthNameLength, localeId?: undefined): string[];
export declare function datePartIsValid(part: number, rule: DatePartsRule, parts: DateParts): boolean;
export declare function getDatePartOptions(parts: DateParts, range: DatePartsRange, rule: DatePartsRule | undefined): DatePartOption[];
export declare function getDatePartsOptions(parts: DateParts, rules: DatePartsRules): {
    milliseconds: DatePartOption[];
    seconds: DatePartOption[];
    minutes: DatePartOption[];
    hours: DatePartOption[];
};
export declare function getNearestDatePart(parts: DateParts, range: DatePartsRange, value: number, rule: DatePartsRule): number;
export declare function applyRulesForDateParts(dateParts: DateParts, rules: DatePartsRules): DateParts;
export declare function parseDate(dateString: string, mask: string | string[], locale: Locale): Date;
export declare function formatDate(date: Date, masks: string | string[], locale: Locale): string;
