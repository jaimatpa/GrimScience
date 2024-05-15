import { Selection } from 'd3-selection';
import { ComponentCore } from "../component";
import { SeriesDataModel } from "../../data-models/series";
import { ContinuousScale, ScaleDimension } from "../../types/scale";
import { XYComponentConfigInterface } from './config';
export declare class XYComponentCore<Datum, ConfigInterface extends Partial<XYComponentConfigInterface<Datum>> = Partial<XYComponentConfigInterface<Datum>>> extends ComponentCore<Datum[], ConfigInterface> {
    element: SVGGraphicsElement;
    g: Selection<SVGGElement, unknown, null, undefined>;
    config: ConfigInterface;
    prevConfig: ConfigInterface;
    datamodel: SeriesDataModel<Datum>;
    /** Clippable components can be affected by a clipping path (set up in the container) */
    clippable: boolean;
    /** Identifies whether the component displayed stacked data (eg StackedBar, Area) */
    stacked: boolean;
    protected _defaultConfig: ConfigInterface;
    private _xScale;
    private _yScale;
    get xScale(): ContinuousScale;
    get yScale(): ContinuousScale;
    setConfig(config: ConfigInterface): void;
    setScaleDomain(dimension: ScaleDimension, domain: number[]): void;
    setScaleRange(dimension: ScaleDimension, range: number[]): void;
    setScale(dimension: ScaleDimension, scale: ContinuousScale): void;
    getDataExtent(dimension: ScaleDimension, scaleByVisibleData: boolean): number[];
    getXDataExtent(): number[];
    getYDataExtent(scaleByVisibleData: boolean): number[];
}
