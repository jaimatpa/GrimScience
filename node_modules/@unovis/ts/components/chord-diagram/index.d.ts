import { Selection } from 'd3-selection';
import { ScalePower } from 'd3-scale';
import { ComponentCore } from "../../core/component";
import { GraphData, GraphDataModel } from "../../data-models/graph";
import { Spacing } from "../../types/spacing";
import { ChordInputNode, ChordInputLink, ChordDiagramData, ChordNode, ChordRibbon } from './types';
import { ChordDiagramConfigInterface } from './config';
import * as s from './style';
export declare class ChordDiagram<N extends ChordInputNode, L extends ChordInputLink> extends ComponentCore<ChordDiagramData<N, L>, ChordDiagramConfigInterface<N, L>> {
    static selectors: typeof s;
    protected _defaultConfig: ChordDiagramConfigInterface<N, L>;
    config: ChordDiagramConfigInterface<N, L>;
    datamodel: GraphDataModel<N, L>;
    background: Selection<SVGRectElement, unknown, SVGGElement, unknown>;
    nodeGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    linkGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    labelGroup: Selection<SVGGElement, unknown, SVGGElement, unknown>;
    arcGen: import("d3-shape").Arc<any, ChordNode<N>>;
    radiusScale: ScalePower<number, number>;
    events: {
        [x: string]: {
            mouseover: (d: ChordNode<N>) => void;
            mouseout: () => void;
        } | {
            mouseover: (d: ChordRibbon<N>) => void;
            mouseout: () => void;
        };
    };
    private _nodes;
    private _links;
    private _rootNode;
    private get _forceHighlight();
    constructor(config?: ChordDiagramConfigInterface<N, L>);
    get bleed(): Spacing;
    setSize(width: number, height: number, containerWidth: number, containerHeight: number): void;
    setData(data: GraphData<N, L>): void;
    _layoutData(): void;
    _render(customDuration?: number): void;
    private _onNodeMouseOver;
    private _onNodeMouseOut;
    private _onLinkMouseOver;
    private _onLinkMouseOut;
    private _highlightOnHover;
}
