import { Selection } from 'd3-selection';
import { ScaleContinuousNumeric } from 'd3-scale';
import { ChordDiagramConfigInterface } from '../config';
import { ChordInputLink, ChordInputNode, ChordNode } from '../types';
export declare const LABEL_PADDING = 3;
export declare function createLabel<N extends ChordInputNode, L extends ChordInputLink>(selection: Selection<SVGGElement, ChordNode<N>, SVGGElement, unknown>, config: ChordDiagramConfigInterface<N, L>, radiusScale: ScaleContinuousNumeric<number, number>): void;
export declare function updateLabel<N extends ChordInputNode, L extends ChordInputLink>(selection: Selection<SVGGElement, ChordNode<N>, SVGGElement, unknown>, config: ChordDiagramConfigInterface<N, L>, width: number, radiusScale: ScaleContinuousNumeric<number, number>, duration: number): void;
export declare function removeLabel(selection: Selection<SVGGElement, unknown, SVGGElement, unknown>, duration: number): void;
