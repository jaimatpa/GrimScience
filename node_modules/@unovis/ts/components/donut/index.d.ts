import { Selection } from 'd3-selection';
import { ComponentCore } from "../../core/component";
import { SeriesDataModel } from "../../data-models/series";
import { Spacing } from "../../types/spacing";
import { DonutArcAnimState } from './types';
import { DonutConfigInterface } from './config';
import * as s from './style';
export declare class Donut<Datum> extends ComponentCore<Datum[], DonutConfigInterface<Datum>> {
    static selectors: typeof s;
    protected _defaultConfig: DonutConfigInterface<Datum>;
    config: DonutConfigInterface<Datum>;
    datamodel: SeriesDataModel<Datum>;
    arcBackground: Selection<SVGPathElement, unknown, SVGGElement, unknown>;
    arcGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    centralLabel: Selection<SVGTextElement, unknown, SVGGElement, unknown>;
    centralSubLabel: Selection<SVGTextElement, unknown, SVGGElement, unknown>;
    arcGen: import("d3-shape").Arc<any, DonutArcAnimState>;
    events: {};
    constructor(config?: DonutConfigInterface<Datum>);
    get bleed(): Spacing;
    _render(customDuration?: number): void;
}
