import { Selection } from 'd3-selection';
import { SankeyInputLink, SankeyInputNode, SankeyLink } from '../types';
import { SankeyConfigInterface } from '../config';
export declare type LinkPathOptions = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    width: number;
};
export declare function linkPath({ x0, x1, y0, y1, width }: LinkPathOptions): string;
export declare type LinkAnimState = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    width: number;
};
export interface LinkElement extends SVGPathElement {
    _animState?: LinkAnimState;
}
export declare function createLinks<N extends SankeyInputNode, L extends SankeyInputLink>(sel: Selection<SVGGElement, SankeyLink<N, L>, SVGGElement, unknown>): void;
export declare function updateLinks<N extends SankeyInputNode, L extends SankeyInputLink>(sel: Selection<SVGGElement, SankeyLink<N, L>, SVGGElement, unknown>, config: SankeyConfigInterface<N, L>, duration: number): void;
export declare function removeLinks<N extends SankeyInputNode, L extends SankeyInputLink>(sel: Selection<SVGGElement, SankeyLink<N, L>, SVGGElement, unknown>): void;
