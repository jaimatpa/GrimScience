import { ComponentCore } from "../../core/component";
import { GraphDataModel } from "../../data-models/graph";
import { ExtendedSizeComponent } from "../../types/component";
import { Spacing } from "../../types/spacing";
import { SankeyConfigInterface } from './config';
import * as s from './style';
import { SankeyInputLink, SankeyInputNode, SankeyLink, SankeyNode } from './types';
export declare class Sankey<N extends SankeyInputNode, L extends SankeyInputLink> extends ComponentCore<{
    nodes: N[];
    links?: L[];
}, SankeyConfigInterface<N, L>> implements ExtendedSizeComponent {
    static selectors: typeof s;
    protected _defaultConfig: SankeyConfigInterface<N, L>;
    config: SankeyConfigInterface<N, L>;
    datamodel: GraphDataModel<N, L, SankeyNode<N, L>, SankeyLink<N, L>>;
    private _extendedWidth;
    private _extendedHeight;
    private _extendedHeightIncreased;
    private _linksGroup;
    private _nodesGroup;
    private _backgroundRect;
    private _sankey;
    private _highlightTimeoutId;
    private _highlightActive;
    events: {
        [x: string]: {
            mouseenter: (d: SankeyNode<N, L>, event: MouseEvent) => void;
            mouseleave: (d: SankeyNode<N, L>, event: MouseEvent) => void;
        } | {
            mouseenter: (d: SankeyLink<N, L>, event: MouseEvent) => void;
            mouseleave: (d: SankeyLink<N, L>, event: MouseEvent) => void;
        };
    };
    constructor(config?: SankeyConfigInterface<N, L>);
    get bleed(): Spacing;
    setData(data: {
        nodes: N[];
        links?: L[];
    }): void;
    setConfig(config: SankeyConfigInterface<N, L>): void;
    _render(customDuration?: number): void;
    private _populateLinkAndNodeValues;
    private _preCalculateComponentSize;
    private _prepareLayout;
    getWidth(): number;
    getHeight(): number;
    getLayoutWidth(): number;
    getLayoutHeight(): number;
    getColumnCenters(): number[];
    highlightSubtree(node: SankeyNode<N, L>): void;
    recursiveSetSubtreeState(node: SankeyNode<N, L>, linksKey: 'sourceLinks' | 'targetLinks', nodeKey: 'source' | 'target', key: string, value: unknown): void;
    disableHighlight(): void;
    private _hasLinks;
    private _onNodeMouseOver;
    private _onNodeMouseOut;
    private _onNodeRectMouseOver;
    private _onNodeRectMouseOut;
    private _onLinkMouseOver;
    private _onLinkMouseOut;
}
