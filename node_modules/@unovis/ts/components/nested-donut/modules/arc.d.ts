import { Selection } from 'd3-selection';
import { Arc } from 'd3-shape';
import { NestedDonutSegment } from '../types';
import { NestedDonutConfigInterface } from '../config';
declare type AnimState = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export interface ArcNode extends SVGElement {
    _animState?: AnimState;
}
export declare function createArc<Datum>(selection: Selection<SVGPathElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, config: NestedDonutConfigInterface<Datum>): void;
export declare function updateArc<Datum>(selection: Selection<SVGPathElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, config: NestedDonutConfigInterface<Datum>, arcGen: Arc<any, AnimState>, duration: number): void;
export declare function removeArc<Datum>(selection: Selection<SVGPathElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, duration: number): void;
export {};
