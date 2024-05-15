import { sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';
import { GraphInputLink, GraphLinkCore, GraphNodeCore } from "../../types/graph";
import { GraphInputNode } from '../../types';
export declare type SankeyInputNode = GraphInputNode;
export declare type SankeyInputLink = GraphInputLink;
export declare type SankeyNode<N extends SankeyInputNode, L extends SankeyInputLink> = GraphNodeCore<N, L> & {
    id: string;
    /** the node’s value; this is the sum of link.value for the node’s incoming links, or node.fixedValue if defined */
    value: number;
    /** */
    fixedValue?: number;
    /** the node’s zero-based column index, corresponding to its horizontal position */
    layer: number;
    /** */
    isConnected: boolean;
    /** the array of incoming links which have this node as their source */
    sourceLinks?: SankeyLink<N, L>[];
    /** the array of outgoing links which have this node as their target */
    targetLinks: SankeyLink<N, L>[];
    /** the node’s zero-based index within the array of nodes */
    index: number;
    /** the node’s zero-based graph depth, derived from the graph topology */
    depth: number;
    /** node.height - the node’s zero-based graph height, derived from the graph topology */
    height: number;
    /** the node’s minimum horizontal position, derived from node.depth */
    x0: number;
    /** the node’s maximum horizontal position (node.x0 + sankey.nodeWidth) */
    x1: number;
    /** the node’s minimum vertical position */
    y0: number;
    /** the node’s maximum vertical position (node.y1 - node.y0 is proportional to node.value) */
    y1: number;
    /** calculated node width */
    width: number;
    /** internal ui state */
    _state?: {
        greyout?: boolean;
        precalculatedHeight?: number;
    };
};
export declare type SankeyLink<N extends SankeyInputNode, L extends SankeyInputLink> = GraphLinkCore<N, L> & {
    value: number;
    /** the link’s source node */
    source: SankeyNode<N, L>;
    /** the link’s target node */
    target: SankeyNode<N, L>;
    /** the link’s vertical starting position (at source node) */
    y0: number;
    /** the link’s vertical end position (at target node) */
    y1: number;
    /** the link’s width (proportional to link.value) */
    width: number;
    /** the zero-based index of link within the array of links */
    index: number;
    /** internal ui state */
    _state?: {
        greyout?: boolean;
    };
};
export declare enum SankeySubLabelPlacement {
    Inline = "inline",
    Below = "below"
}
export declare enum SankeyNodeAlign {
    Left = "left",
    Right = "right",
    Center = "center",
    Justify = "justify"
}
export declare const SankeyLayout: {
    left: typeof sankeyLeft;
    right: typeof sankeyRight;
    center: typeof sankeyCenter;
    justify: typeof sankeyJustify;
};
export declare enum SankeyExitTransitionType {
    Default = "default",
    ToAncestor = "to ancestor"
}
export declare enum SankeyEnterTransitionType {
    Default = "default",
    FromAncestor = "from ancestor"
}
