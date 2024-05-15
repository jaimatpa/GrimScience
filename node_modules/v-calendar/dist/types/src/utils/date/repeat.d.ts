import Locale from '../locale';
import type { DateParts, DayInMonth, DayOfWeek, DayParts, MonthInYear, WeekInMonth } from './helpers';
import { GroupRuleType, type Rule, type RuleType, type SingleOrArray } from './rules';
export type RepeatIntervalShort = 'day' | 'week' | 'month' | 'year';
export type RepeatInterval = 'days' | 'weeks' | 'months' | 'years';
export interface DateRepeatConfig {
    every: RepeatIntervalShort | [number, RepeatInterval];
    from: Date;
    until: Date;
    weekdays: SingleOrArray<DayOfWeek>;
    days: SingleOrArray<DayInMonth>;
    weeks: SingleOrArray<WeekInMonth>;
    months: SingleOrArray<MonthInYear>;
    years: SingleOrArray<number>;
    ordinalWeekdays: SingleOrArray<number[]>;
    on: SingleOrArray<DateRepeatFn | Partial<DateRepeatConfig>>;
}
export type DateRepeatFn = (dayParts: DayParts) => boolean;
export interface DateRepeatOptions {
    locale: Locale;
}
export declare class DateRepeat implements Rule<GroupRuleType> {
    private parent?;
    validated: boolean;
    config: Partial<DateRepeatConfig> | DateRepeatFn;
    type: GroupRuleType;
    from: DateParts | undefined;
    until: DateParts | undefined;
    rules: Rule<RuleType>[];
    locale: Locale;
    constructor(config: Partial<DateRepeatConfig> | DateRepeatFn, options?: Partial<DateRepeatOptions>, parent?: DateRepeat | undefined);
    getObjectRules(config: any): Rule<RuleType>[];
    passes(dayParts: DayParts): boolean;
}
