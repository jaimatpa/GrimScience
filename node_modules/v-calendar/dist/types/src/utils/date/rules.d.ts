import { type DayOfWeek, type DayParts, type OrdinalWeekInMonth } from './helpers';
export type SingleOrArray<T> = T | T[];
export declare enum GroupRuleType {
    Any = "any",
    All = "all"
}
export declare enum IntervalRuleType {
    Days = "days",
    Weeks = "weeks",
    Months = "months",
    Years = "years"
}
export declare enum ComponentRuleType {
    Days = "days",
    Weekdays = "weekdays",
    Weeks = "weeks",
    Months = "months",
    Years = "years"
}
export declare enum OrdinalComponentRuleType {
    OrdinalWeekdays = "ordinalWeekdays"
}
export declare enum FunctionRuleType {
    Function = "function"
}
export type RuleType = GroupRuleType | IntervalRuleType | ComponentRuleType | OrdinalComponentRuleType | FunctionRuleType;
export type OrdinalArrayConfig = SingleOrArray<[
    OrdinalWeekInMonth,
    ...DayOfWeek[]
]>;
export interface Rule<T> {
    type: T;
    passes(dayParts: DayParts): boolean;
}
export declare class IntervalRule implements Rule<IntervalRuleType> {
    type: IntervalRuleType;
    interval: number;
    from: DayParts;
    private validated;
    constructor(type: IntervalRuleType, interval: number, from: DayParts);
    passes(dateParts: DayParts): boolean;
}
export declare class ComponentRule implements Rule<ComponentRuleType> {
    type: ComponentRuleType;
    validator: (component: unknown) => component is number;
    getter: (dayParts: DayParts) => number[];
    components: number[];
    static create(type: ComponentRuleType, config: unknown): DaysRule | WeekdaysRule | WeeksRule | MonthsRule | YearsRule;
    constructor(type: ComponentRuleType, components: unknown, validator: (component: unknown) => component is number, getter: (dayParts: DayParts) => number[]);
    normalizeComponents(components: unknown): number[];
    passes(dayParts: DayParts): boolean;
}
export declare class DaysRule extends ComponentRule {
    constructor(components: unknown);
}
export declare class WeekdaysRule extends ComponentRule {
    constructor(components: unknown);
}
export declare class WeeksRule extends ComponentRule {
    constructor(components: unknown);
}
export declare class MonthsRule extends ComponentRule {
    constructor(components: unknown);
}
export declare class YearsRule extends ComponentRule {
    constructor(components: unknown);
}
export declare class OrdinalComponentRule implements Rule<OrdinalComponentRuleType> {
    type: OrdinalComponentRuleType;
    components: [OrdinalWeekInMonth, DayOfWeek][];
    constructor(type: OrdinalComponentRuleType, components: OrdinalArrayConfig);
    normalizeArrayConfig(config: OrdinalArrayConfig): [OrdinalWeekInMonth, DayOfWeek][];
    normalizeComponents(config: OrdinalArrayConfig): [OrdinalWeekInMonth, DayOfWeek][];
    passes(dayParts: DayParts): boolean;
}
export declare class FunctionRule implements Rule<FunctionRuleType> {
    fn: Function;
    type: FunctionRuleType;
    private validated;
    constructor(fn: Function);
    passes(dayParts: DayParts): any;
}
