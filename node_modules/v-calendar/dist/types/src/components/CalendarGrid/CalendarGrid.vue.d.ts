declare const _default: import("vue").DefineComponent<{
    events: {
        type: import("vue").PropType<import("../../utils/calendar/event").EventConfig[]>;
        default: () => never[];
    };
    view: {
        type: import("vue").PropType<import("../../use/calendar").CalendarView>;
        default: string;
        validator(value: string): boolean;
    };
    rows: {
        type: NumberConstructor;
        default: number;
    };
    columns: {
        type: NumberConstructor;
        default: number;
    };
    step: NumberConstructor;
    titlePosition: {
        type: import("vue").PropType<import("../../utils/page").TitlePosition>;
        default: () => import("../../utils/page").TitlePosition;
    };
    navVisibility: {
        type: import("vue").PropType<import("../../utils/popovers").PopoverVisibility>;
        default: () => import("../../utils/popovers").PopoverVisibility;
    };
    showWeeknumbers: (BooleanConstructor | StringConstructor)[];
    showIsoWeeknumbers: (BooleanConstructor | StringConstructor)[];
    expanded: BooleanConstructor;
    borderless: BooleanConstructor;
    transparent: BooleanConstructor;
    initialPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    initialPagePosition: {
        type: NumberConstructor;
        default: number;
    };
    minPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    maxPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    transition: import("vue").PropType<import("../../use/calendar").MoveTransition>;
    attributes: import("vue").PropType<Partial<{
        key: string | number;
        hashcode: string;
        content: import("../../utils/glyph").ContentConfig;
        highlight: import("../../utils/glyph").HighlightConfig;
        dot: import("../../utils/glyph").DotConfig;
        bar: import("../../utils/glyph").BarConfig;
        popover: Partial<{
            label: string;
            visibility: import("../../utils/popovers").PopoverVisibility;
            placement: import("@popperjs/core").Placement;
            hideIndicator: boolean;
            isInteractive: boolean;
        }>;
        event: Partial<{
            label: string;
        }>;
        dates: import("../../utils/date/range").DateRangeSource[];
        customData: any;
        order: number;
        pinPage: boolean;
    }>[]>;
    trimWeeks: BooleanConstructor;
    disablePageSwipe: BooleanConstructor;
    color: {
        type: StringConstructor;
        default: () => any;
    };
    isDark: {
        type: import("vue").PropType<boolean | "system" | import("vue-screen-utils").DarkModeClassConfig>;
        default: () => any;
    };
    firstDayOfWeek: import("vue").PropType<import("../../utils/date/helpers").DayOfWeek>;
    masks: ObjectConstructor;
    locale: import("vue").PropType<string | import("../../utils/locale").default | Record<string, any>>;
    timezone: StringConstructor;
    minDate: null;
    maxDate: null;
    disabledDates: null;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, string[], string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    events: {
        type: import("vue").PropType<import("../../utils/calendar/event").EventConfig[]>;
        default: () => never[];
    };
    view: {
        type: import("vue").PropType<import("../../use/calendar").CalendarView>;
        default: string;
        validator(value: string): boolean;
    };
    rows: {
        type: NumberConstructor;
        default: number;
    };
    columns: {
        type: NumberConstructor;
        default: number;
    };
    step: NumberConstructor;
    titlePosition: {
        type: import("vue").PropType<import("../../utils/page").TitlePosition>;
        default: () => import("../../utils/page").TitlePosition;
    };
    navVisibility: {
        type: import("vue").PropType<import("../../utils/popovers").PopoverVisibility>;
        default: () => import("../../utils/popovers").PopoverVisibility;
    };
    showWeeknumbers: (BooleanConstructor | StringConstructor)[];
    showIsoWeeknumbers: (BooleanConstructor | StringConstructor)[];
    expanded: BooleanConstructor;
    borderless: BooleanConstructor;
    transparent: BooleanConstructor;
    initialPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    initialPagePosition: {
        type: NumberConstructor;
        default: number;
    };
    minPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    maxPage: import("vue").PropType<import("../../utils/page").PageAddress>;
    transition: import("vue").PropType<import("../../use/calendar").MoveTransition>;
    attributes: import("vue").PropType<Partial<{
        key: string | number;
        hashcode: string;
        content: import("../../utils/glyph").ContentConfig;
        highlight: import("../../utils/glyph").HighlightConfig;
        dot: import("../../utils/glyph").DotConfig;
        bar: import("../../utils/glyph").BarConfig;
        popover: Partial<{
            label: string;
            visibility: import("../../utils/popovers").PopoverVisibility;
            placement: import("@popperjs/core").Placement;
            hideIndicator: boolean;
            isInteractive: boolean;
        }>;
        event: Partial<{
            label: string;
        }>;
        dates: import("../../utils/date/range").DateRangeSource[];
        customData: any;
        order: number;
        pinPage: boolean;
    }>[]>;
    trimWeeks: BooleanConstructor;
    disablePageSwipe: BooleanConstructor;
    color: {
        type: StringConstructor;
        default: () => any;
    };
    isDark: {
        type: import("vue").PropType<boolean | "system" | import("vue-screen-utils").DarkModeClassConfig>;
        default: () => any;
    };
    firstDayOfWeek: import("vue").PropType<import("../../utils/date/helpers").DayOfWeek>;
    masks: ObjectConstructor;
    locale: import("vue").PropType<string | import("../../utils/locale").default | Record<string, any>>;
    timezone: StringConstructor;
    minDate: null;
    maxDate: null;
    disabledDates: null;
}>> & {
    [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
}, {
    view: import("../../use/calendar").CalendarView;
    trimWeeks: boolean;
    titlePosition: import("../../utils/page").TitlePosition;
    color: string;
    isDark: boolean | "system" | import("vue-screen-utils").DarkModeClassConfig;
    navVisibility: import("../../utils/popovers").PopoverVisibility;
    rows: number;
    columns: number;
    expanded: boolean;
    borderless: boolean;
    transparent: boolean;
    initialPagePosition: number;
    disablePageSwipe: boolean;
    events: import("../../utils/calendar/event").EventConfig[];
}>;
export default _default;
