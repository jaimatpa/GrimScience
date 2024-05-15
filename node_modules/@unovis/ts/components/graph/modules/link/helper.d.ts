import { GraphInputLink, GraphInputNode } from "../../../../types/graph";
import { GraphLink, GraphLinkArrowStyle, GraphCircleLabel } from '../../types';
import { GraphConfigInterface } from '../../config';
export declare const getPolylineData: (d: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}) => string;
export declare const LINK_MARKER_WIDTH = 9;
export declare const LINK_MARKER_HEIGHT = 7;
export declare function getLinkShift(link: GraphLink, spacing: number): {
    dx: number;
    dy: number;
};
export declare function getLinkShiftTransform(link: GraphLink, spacing: number): string;
export declare function getLinkStrokeWidth<N extends GraphInputNode, L extends GraphInputLink>(d: GraphLink<N, L>, scale: number, config: GraphConfigInterface<N, L>): number;
export declare function getLinkBandWidth<N extends GraphInputNode, L extends GraphInputLink>(d: GraphLink<N, L>, scale: number, config: GraphConfigInterface<N, L>): number;
export declare function getLinkColor<N extends GraphInputNode, L extends GraphInputLink>(link: GraphLink<N, L>, config: GraphConfigInterface<N, L>): string;
export declare function getLinkArrowStyle<N extends GraphInputNode, L extends GraphInputLink>(d: GraphLink<N, L>, config: GraphConfigInterface<N, L>): GraphLinkArrowStyle | undefined;
export declare function getArrowPath(): string;
export declare function getDoubleArrowPath(): string;
export declare function getLinkLabelTextColor(label: GraphCircleLabel): string;
