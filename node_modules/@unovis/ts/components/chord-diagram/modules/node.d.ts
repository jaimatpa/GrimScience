import { Selection } from 'd3-selection';
import { Arc } from 'd3-shape';
import { ChordInputNode, ChordInputLink, ChordNode } from '../types';
import { ChordDiagramConfigInterface } from '../config';
declare type AnimState = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export interface ArcNode extends SVGElement {
    _animState?: AnimState;
}
export declare function createNode<N extends ChordInputNode, L extends ChordInputLink>(selection: Selection<SVGPathElement, ChordNode<N>, SVGGElement, unknown>): void;
export declare function updateNode<N extends ChordInputNode, L extends ChordInputLink>(selection: Selection<SVGPathElement, ChordNode<N>, SVGGElement, unknown>, config: ChordDiagramConfigInterface<N, L>, arcGen: Arc<unknown, AnimState>, duration: number): void;
export declare function removeNode<N extends ChordInputNode>(selection: Selection<SVGPathElement, unknown, SVGGElement, unknown>, duration: number): void;
export {};
