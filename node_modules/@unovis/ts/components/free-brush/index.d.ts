import { XYComponentCore } from "../../core/xy-component";
import { FreeBrushConfigInterface } from './config';
import * as s from './style';
export declare class FreeBrush<Datum> extends XYComponentCore<Datum, FreeBrushConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: FreeBrushConfigInterface<Datum>;
    config: FreeBrushConfigInterface<Datum>;
    private brush;
    private brushBehaviour;
    private _firstRender;
    constructor(config: FreeBrushConfigInterface<Datum>);
    _render(customDuration?: number): void;
    private _onBrush;
    private _pixelRangeToDataRange;
    private _dataRangeToPixelRange;
    private _isSelectionValid;
    private _getBrushBehaviour;
    private _onBrushStart;
    private _onBrushMove;
    private _onBrushEnd;
}
