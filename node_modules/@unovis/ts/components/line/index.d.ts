import { CurveFactoryLineOnly, Line as LineGenInterface } from 'd3-shape';
import { XYComponentCore } from "../../core/xy-component";
import { Spacing } from "../../types/spacing";
import { LineConfigInterface } from './config';
import * as s from './style';
export declare class Line<Datum> extends XYComponentCore<Datum, LineConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: LineConfigInterface<Datum>;
    config: LineConfigInterface<Datum>;
    lineGen: LineGenInterface<{
        x: number;
        y: number;
        defined: boolean;
    }>;
    curve: CurveFactoryLineOnly;
    events: {
        [x: string]: {
            mouseover: (datum: Datum) => void;
            mouseleave: () => void;
        };
    };
    constructor(config?: LineConfigInterface<Datum>);
    get bleed(): Spacing;
    _render(customDuration?: number): void;
    private _emptyPath;
    private _highlight;
    private _resetHighlight;
}
