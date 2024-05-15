import { Selection } from 'd3-selection';
import { GraphInputLink, GraphInputNode } from "../../../../types/graph";
import { GraphNode, GraphLink, GraphPanel } from '../../types';
import { GraphConfigInterface } from '../../config';
export declare function createPanels<N extends GraphNode, L extends GraphLink>(selection: Selection<SVGGElement, GraphPanel, SVGGElement, unknown>): void;
export declare function updatePanels<N extends GraphNode, L extends GraphLink>(selection: Selection<SVGGElement, GraphPanel, SVGGElement, unknown>, config: GraphConfigInterface<GraphInputNode, GraphInputLink>, duration: number): void;
export declare function removePanels<N extends GraphNode, L extends GraphLink>(selection: Selection<SVGGElement, GraphPanel, SVGGElement, unknown>, config: GraphConfigInterface<GraphInputNode, GraphInputLink>, duration: number): void;
