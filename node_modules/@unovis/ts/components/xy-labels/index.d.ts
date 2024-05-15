import { XYComponentCore } from "../../core/xy-component";
import { XYLabelsConfigInterface } from './config';
import * as s from './style';
export declare class XYLabels<Datum> extends XYComponentCore<Datum, XYLabelsConfigInterface<Datum>> {
    static selectors: typeof s;
    clippable: boolean;
    protected _defaultConfig: XYLabelsConfigInterface<Datum>;
    config: XYLabelsConfigInterface<Datum>;
    events: {
        [x: string]: {};
    };
    constructor(config?: XYLabelsConfigInterface<Datum>);
    _render(customDuration?: number): void;
    private _getDataToRender;
    private _getClusteredLabels;
}
