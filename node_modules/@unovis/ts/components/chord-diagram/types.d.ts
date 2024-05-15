import { HierarchyRectangularNode } from 'd3-hierarchy';
import { GraphLinkCore, GraphNodeCore } from "../../types";
export interface ChordInputNode {
    id?: string;
}
export interface ChordInputLink {
    id?: string;
    source: number | string | ChordInputNode;
    target: number | string | ChordInputNode;
}
export declare type ChordDiagramData<N extends ChordInputNode, L extends ChordInputLink> = {
    nodes: N[];
    links?: L[];
};
export interface ChordHierarchyNode<N> {
    key: string;
    values: (ChordHierarchyNode<N> | N)[];
    depth?: number;
    height?: number;
    value?: number;
    ancestors?: string[];
}
export declare type ChordNodeState = {
    _state: {
        hovered?: boolean;
        value?: number;
    };
    _prevX1?: number;
};
export declare type ChordNodeCore<N> = HierarchyRectangularNode<N> & ChordNodeState & {
    data: GraphNodeCore<N, ChordInputLink>;
    uid: string;
};
export declare type ChordNodeDatum<N> = ChordHierarchyNode<N> | N;
export declare type ChordLinkDatum<N extends ChordInputNode, L extends ChordInputLink = ChordInputLink> = GraphLinkCore<N, L>;
export declare type ChordNode<N extends ChordInputNode> = ChordNodeCore<ChordNodeDatum<N>>;
export declare type ChordLeafNode<N extends ChordInputNode> = ChordNodeCore<N>;
export declare type ChordRibbonPoint = {
    a0: number;
    a1: number;
    r: number;
};
export interface ChordRibbon<N extends ChordInputNode, L extends ChordInputLink = ChordInputLink> {
    source: ChordLeafNode<N>;
    target: ChordLeafNode<N>;
    points: ChordRibbonPoint[];
    data: ChordLinkDatum<N, L>;
    _state: {
        hovered?: boolean;
    };
}
export declare enum ChordLabelAlignment {
    Along = "along",
    Perpendicular = "perpendicular"
}
