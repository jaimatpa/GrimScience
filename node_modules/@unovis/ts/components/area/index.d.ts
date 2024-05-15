import { XYComponentCore } from "../../core/xy-component";
import { AreaConfigInterface } from './config';
import * as s from './style';
export declare class Area<Datum> extends XYComponentCore<Datum, AreaConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: AreaConfigInterface<Datum>;
    config: AreaConfigInterface<Datum>;
    stacked: boolean;
    private _areaGen;
    private _prevNegative;
    events: {
        [x: string]: {};
    };
    constructor(config?: AreaConfigInterface<Datum>);
    _render(customDuration?: number): void;
    getYDataExtent(scaleByVisibleData: boolean): number[];
    _emptyPath(): string;
}
