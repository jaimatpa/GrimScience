import { Selection } from 'd3-selection';
import { Arc } from 'd3-shape';
import { DonutArcDatum, DonutArcAnimState } from '../types';
import { DonutConfigInterface } from '../config';
export interface ArcNode extends SVGElement {
    _animState?: DonutArcAnimState;
}
export declare function createArc<Datum>(selection: Selection<SVGPathElement, DonutArcDatum<Datum>, SVGGElement, unknown>, config: DonutConfigInterface<Datum>): void;
export declare function updateArc<Datum>(selection: Selection<SVGPathElement, DonutArcDatum<Datum>, SVGGElement, unknown>, config: DonutConfigInterface<Datum>, arcGen: Arc<any, DonutArcAnimState>, duration: number): void;
export declare function removeArc<Datum>(selection: Selection<SVGPathElement, DonutArcDatum<Datum>, SVGGElement, unknown>, duration: number): void;
