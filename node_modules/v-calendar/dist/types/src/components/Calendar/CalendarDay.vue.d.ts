import { type PropType } from 'vue';
import type { Attribute } from '../../utils/attribute';
import type { DateRangeCell } from '../../utils/date/range';
import type { CalendarDay } from '../../utils/page';
declare const _default: import("vue").DefineComponent<{
    day: {
        type: PropType<CalendarDay>;
        required: true;
    };
}, {
    attributes: import("vue").ComputedRef<Attribute[]>;
    attributeCells: import("vue").ComputedRef<DateRangeCell<any>[]>;
    bars: import("vue").ComputedRef<import("../../utils/glyph").Glyph[] | undefined>;
    dayClasses: import("vue").ComputedRef<(string | Object | {
        'vc-day-box-center-center': boolean;
        'is-not-in-month'?: undefined;
    } | {
        'is-not-in-month': boolean;
        'vc-day-box-center-center'?: undefined;
    })[]>;
    dayContentProps: import("vue").ComputedRef<{
        class: (string | any[] | {
            'vc-disabled': boolean;
        } | undefined)[];
        style: {
            [x: string]: any;
        };
        tabindex: string;
        'aria-label': string;
        'aria-disabled': boolean;
        role: string;
    }>;
    dayContentEvents: import("vue").ComputedRef<{
        click(event: MouseEvent): void;
        mouseenter(event: MouseEvent): void;
        mouseleave(event: MouseEvent): void;
        focusin(event: FocusEvent): void;
        focusout(event: FocusEvent): void;
        keydown(event: KeyboardEvent): void;
    }>;
    dayPopover: import("vue").ComputedRef<any>;
    glyphs: import("vue").ComputedRef<{
        popovers: never[];
        highlights?: import("../../utils/glyph").Highlight[] | undefined;
        dots?: import("../../utils/glyph").Glyph[] | undefined;
        bars?: import("../../utils/glyph").Glyph[] | undefined;
        content?: import("../../utils/glyph").Glyph[] | undefined;
    }>;
    dots: import("vue").ComputedRef<import("../../utils/glyph").Glyph[] | undefined>;
    hasDots: import("vue").ComputedRef<boolean>;
    hasBars: import("vue").ComputedRef<boolean>;
    highlights: import("vue").ComputedRef<import("../../utils/glyph").Highlight[] | undefined>;
    hasHighlights: import("vue").ComputedRef<boolean>;
    locale: import("vue").ComputedRef<import("../../utils/locale").default>;
    popovers: import("vue").ComputedRef<never[]>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    day: {
        type: PropType<CalendarDay>;
        required: true;
    };
}>>, {}>;
export default _default;
