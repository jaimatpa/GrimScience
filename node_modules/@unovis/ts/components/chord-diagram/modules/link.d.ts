import { Selection } from 'd3-selection';
import { ScalePower } from 'd3-scale';
import { ChordInputLink, ChordInputNode, ChordRibbon } from '../types';
import { ChordDiagramConfigInterface } from '../config';
export declare function emptyPath(): string;
export declare function createLink<N extends ChordInputNode>(selection: Selection<SVGPathElement, ChordRibbon<N>, SVGGElement, unknown>, radiusScale: ScalePower<number, number>): void;
export declare function updateLink<N extends ChordInputNode, L extends ChordInputLink>(selection: Selection<SVGPathElement, ChordRibbon<N, L>, SVGGElement, unknown>, config: ChordDiagramConfigInterface<N, L>, radiusScale: ScalePower<number, number>, duration: number): void;
export declare function removeLink(selection: Selection<SVGPathElement, unknown, SVGGElement, unknown>, duration: number): void;
