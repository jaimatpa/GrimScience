import { Selection } from 'd3-selection';
import { GenericAccessor } from "../../../types/accessor";
import { Position } from "../../../types/position";
import { SankeyInputLink, SankeyInputNode, SankeyNode } from '../types';
import { SankeyConfigInterface } from '../config';
export declare function getLabelOrientation<N extends SankeyInputNode, L extends SankeyInputLink>(d: SankeyNode<N, L>, sankeyWidth: number, labelPosition: GenericAccessor<Position.Auto | Position.Left | Position.Right | string, SankeyNode<N, L>>): (Position.Left | Position.Right);
export declare const requiredLabelSpace: (labelWidth: number, labelFontSize: number) => {
    width: number;
    height: number;
};
export declare function getLabelGroupXTranslate<N extends SankeyInputNode, L extends SankeyInputLink>(d: SankeyNode<N, L>, config: SankeyConfigInterface<N, L>, width: number): number;
export declare function getLabelGroupYTranslate<N extends SankeyInputNode, L extends SankeyInputLink>(d: SankeyNode<N, L>, labelGroupHeight: number, config: SankeyConfigInterface<N, L>): number;
export declare function getLabelTextAnchor<N extends SankeyInputNode, L extends SankeyInputLink>(d: SankeyNode<N, L>, config: SankeyConfigInterface<N, L>, width: number): string;
export declare function getSubLabelTextAnchor<N extends SankeyInputNode, L extends SankeyInputLink>(d: SankeyNode<N, L>, config: SankeyConfigInterface<N, L>, width: number): string;
export declare function renderLabel<N extends SankeyInputNode, L extends SankeyInputLink>(labelGroup: Selection<SVGGElement, SankeyNode<N, L>, SVGGElement, any>, d: SankeyNode<N, L>, config: SankeyConfigInterface<N, L>, width: number, duration: number, forceExpand?: boolean): {
    x: number;
    y: number;
    width: number;
    height: number;
    layer: number;
    selection: any;
    hidden?: boolean;
};
