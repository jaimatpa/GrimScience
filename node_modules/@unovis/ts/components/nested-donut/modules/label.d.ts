import { Selection } from 'd3-selection';
import { Arc } from 'd3-shape';
import { NestedDonutConfigInterface } from '../config';
import { NestedDonutSegment } from '../types';
export declare function createLabel<Datum>(selection: Selection<SVGTextElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, arcGen: Arc<unknown, NestedDonutSegment<Datum>>): void;
export declare function updateLabel<Datum>(selection: Selection<SVGTextElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, config: NestedDonutConfigInterface<Datum>, arcGen: Arc<unknown, NestedDonutSegment<Datum>>, duration: number): void;
export declare function removeLabel<Datum>(selection: Selection<SVGTextElement, NestedDonutSegment<Datum>, SVGGElement, unknown>, duration: number): void;
