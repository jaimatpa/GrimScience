import type { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { GraphInputLink, GraphInputNode } from "../../../types/graph";
import { GenericAccessor } from "../../../types/accessor";
import { GraphNode, GraphElkLayoutSettings } from '../types';
export declare const DEFAULT_ELK_SETTINGS: {
    hierarchyHandling: string;
    'nodePlacement.strategy': string;
    'elk.padding': string;
    'spacing.nodeNodeBetweenLayers': string;
    'spacing.edgeNodeBetweenLayers': string;
    'spacing.nodeNode': string;
};
export declare function positionNonConnectedNodes<N extends GraphInputNode, L extends GraphInputLink>(nodes: GraphNode<N, L>[], y: number, spacing: number, width: number, xStart?: number): void;
export declare type GraphElkHierarchyNode<N extends GraphInputNode, L extends GraphInputLink> = {
    id: string;
    children: GraphNode<N, L>[] | GraphElkHierarchyNode<N, L>;
    layoutOptions: GraphElkLayoutSettings;
};
export declare type GraphElkHierarchyNodeMap<N extends GraphInputNode, L extends GraphInputLink> = Map<string | undefined | null, GraphNode<N, L>[] | GraphElkHierarchyNodeMap<N, L>>;
export declare function toElkHierarchy<N extends GraphInputNode, L extends GraphInputLink>(d: GraphElkHierarchyNodeMap<N, L> | GraphNode<N, L>[], layoutOptions: GenericAccessor<GraphElkLayoutSettings, string> | undefined): (GraphElkHierarchyNode<N, L> | GraphNode<N, L>)[];
export declare function adjustElkHierarchyCoordinates(node: ElkNode): void;
