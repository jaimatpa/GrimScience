import { Selection } from 'd3-selection';
import { ContinuousScale } from "../../../types/scale";
import { XYLabelsConfigInterface } from '../config';
import { XYLabel, XYLabelCluster, XYLabelPositioning, XYLabelRenderProps } from '../types';
export declare function createLabels<Datum>(selection: Selection<SVGGElement, XYLabel<Datum> | XYLabelCluster<Datum>, any, any>): void;
export declare function updateLabels<Datum>(selection: Selection<SVGGElement, XYLabel<Datum> | XYLabelCluster<Datum>, any, any>, config: XYLabelsConfigInterface<Datum>, duration: number): void;
export declare function removeLabels<Datum>(selection: Selection<SVGGElement, XYLabel<Datum> | XYLabelCluster<Datum>, any, any>, duration: number): void;
export declare function getLabelPosition(value: number, positioning: XYLabelPositioning, scale: ContinuousScale): number;
export declare function getLabelRenderProps<Datum>(data: Datum | XYLabel<Datum>[], el: SVGGraphicsElement, config: XYLabelsConfigInterface<Datum>, xScale: ContinuousScale, yScale: ContinuousScale): XYLabelRenderProps;
