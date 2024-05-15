import { XYComponentCore } from "../../core/xy-component";
import { NumericAccessor } from "../../types/accessor";
import { Spacing } from "../../types/spacing";
import { Direction } from "../../types/direction";
import { GroupedBarConfigInterface } from './config';
import * as s from './style';
export declare class GroupedBar<Datum> extends XYComponentCore<Datum, GroupedBarConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: GroupedBarConfigInterface<Datum>;
    config: GroupedBarConfigInterface<Datum>;
    getAccessors: () => NumericAccessor<Datum>[];
    protected events: {};
    private _barData;
    constructor(config?: GroupedBarConfigInterface<Datum>);
    get bleed(): Spacing;
    private get dataScale();
    private get valueScale();
    private isVertical;
    _render(customDuration?: number): void;
    _getValueAxisDirection(): Direction.North | Direction.South;
    _getVisibleData(): Datum[];
    _getBarPath(x: number, y: number, width: number, height: number, isNegative: boolean, direction: Direction.North | Direction.South): string;
    _getGroupWidth(): number;
    getValueScaleExtent(scaleByVisibleData: boolean): number[];
    getDataScaleExtent(): number[];
    getYDataExtent(scaleByVisibleData: boolean): number[];
    getXDataExtent(): number[];
}
