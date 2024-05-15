import { XYComponentCore } from "../../core/xy-component";
import { NumericAccessor } from "../../types/accessor";
import { Spacing } from "../../types/spacing";
import { StackedBarDataRecord } from './types';
import { StackedBarConfigInterface } from './config';
import * as s from './style';
export declare class StackedBar<Datum> extends XYComponentCore<Datum, StackedBarConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: StackedBarConfigInterface<Datum>;
    config: StackedBarConfigInterface<Datum>;
    getAccessors: () => NumericAccessor<Datum>[];
    stacked: boolean;
    events: {};
    private _prevNegative;
    private _barData;
    constructor(config?: StackedBarConfigInterface<Datum>);
    get bleed(): Spacing;
    private get dataScale();
    private get valueScale();
    private isVertical;
    _render(customDuration?: number): void;
    _getBarWidth(): number;
    _getVisibleData(): Datum[];
    _getBarPath(d: StackedBarDataRecord<Datum>, accessorIndex: number, isEntering?: boolean): string;
    getValueScaleExtent(scaleByVisibleData: boolean): number[];
    getDataScaleExtent(): number[];
    getYDataExtent(scaleByVisibleData: boolean): number[];
    getXDataExtent(): number[];
}
