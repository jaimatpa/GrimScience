import { Selection } from 'd3-selection';
import { ContinuousScale } from "../../../types/scale";
import { ScatterConfigInterface } from '../config';
import { ScatterPoint } from '../types';
export declare function createPoints<Datum>(selection: Selection<SVGGElement, ScatterPoint<Datum>, SVGGElement, ScatterPoint<Datum>[]>, xScale: ContinuousScale, yScale: ContinuousScale): void;
export declare function updatePoints<Datum>(selection: Selection<SVGGElement, ScatterPoint<Datum>, SVGGElement, ScatterPoint<Datum>[]>, config: ScatterConfigInterface<Datum>, xScale: ContinuousScale, yScale: ContinuousScale, duration: number): void;
export declare function removePoints<Datum>(selection: Selection<SVGGElement, ScatterPoint<Datum>, SVGGElement, ScatterPoint<Datum>[]>, xScale: ContinuousScale, yScale: ContinuousScale, duration: number): void;
