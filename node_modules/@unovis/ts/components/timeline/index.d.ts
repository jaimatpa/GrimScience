import { XYComponentCore } from "../../core/xy-component";
import { TimelineConfigInterface } from './config';
import * as s from './style';
export declare class Timeline<Datum> extends XYComponentCore<Datum, TimelineConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: TimelineConfigInterface<Datum>;
    config: TimelineConfigInterface<Datum>;
    events: {
        [x: string]: {
            wheel: (d: unknown, event: WheelEvent) => void;
        };
    };
    private _background;
    private _rowsGroup;
    private _linesGroup;
    private _labelsGroup;
    private _scrollBarGroup;
    private _scrollBarBackground;
    private _scrollBarHandle;
    private _scrollBarWidth;
    private _scrollDistance;
    private _scrollBarMargin;
    private _maxScroll;
    private _scrollbarHeight;
    private _labelMargin;
    constructor(config?: TimelineConfigInterface<Datum>);
    get bleed(): {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    _render(customDuration?: number): void;
    private _positionLines;
    private _onScrollbarDrag;
    private _onMouseWheel;
    private _updateScrollPosition;
    private _getMaxLineWidth;
    private _getRecordType;
    private _getRecordLabels;
    getXDataExtent(): number[];
}
