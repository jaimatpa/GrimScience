import { BrushBehavior, D3BrushEvent } from 'd3-brush';
import { Selection } from 'd3-selection';
import { XYComponentCore } from "../../core/xy-component";
import { BrushConfigInterface } from './config';
import { BrushHandleType } from './types';
import * as s from './style';
export declare class Brush<Datum> extends XYComponentCore<Datum, BrushConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: BrushConfigInterface<Datum>;
    clippable: boolean;
    config: BrushConfigInterface<Datum>;
    brush: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    unselectedRange: Selection<SVGRectElement, BrushHandleType, SVGGElement, unknown>;
    handleLines: Selection<SVGLineElement, BrushHandleType, SVGGElement, unknown>;
    brushBehaviour: BrushBehavior<unknown>;
    events: {
        [x: string]: {};
    };
    private _selection;
    private _firstRender;
    constructor(config?: BrushConfigInterface<Datum>);
    _render(customDuration?: number): void;
    _updateSelection(s: [number, number]): void;
    private _positionHandles;
    _onBrush(event: D3BrushEvent<Datum>): void;
    _onBrushStart(event: D3BrushEvent<Datum>): void;
    _onBrushMove(event: D3BrushEvent<Datum>): void;
    _onBrushEnd(event: D3BrushEvent<Datum>): void;
}
