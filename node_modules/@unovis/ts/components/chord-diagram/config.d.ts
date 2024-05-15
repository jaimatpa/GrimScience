import { ComponentConfigInterface } from "../../core/component/config";
import { ColorAccessor, GenericAccessor, NumericAccessor, StringAccessor } from "../../types/accessor";
import { ChordInputLink, ChordInputNode, ChordLabelAlignment, ChordLinkDatum, ChordNodeDatum } from './types';
export interface ChordDiagramConfigInterface<N extends ChordInputNode, L extends ChordInputLink> extends ComponentConfigInterface {
    /** Angular range of the diagram. Default: `[0, 2 * Math.PI]` */
    angleRange?: [number, number];
    /** Corner radius constant value or accessor function. Default: `2` */
    cornerRadius?: NumericAccessor<ChordNodeDatum<N>>;
    /** Node id or index to highlight. Overrides default hover behavior if supplied. Default: `undefined` */
    highlightedNodeId?: number | string;
    /** Link ids or index values to highlight. Overrides default hover behavior if supplied. Default: [] */
    highlightedLinkIds?: (number | string)[];
    /** Link color accessor function. Default: `var(--vis-chord-diagram-link-fill-color)` */
    linkColor?: ColorAccessor<ChordLinkDatum<N, L>>;
    /** Link value accessor function. Default: `l => l.value` */
    linkValue?: NumericAccessor<ChordLinkDatum<N, L>>;
    /** Array of node hierarchy levels. Data records are supposed to have corresponding properties, e.g. ['level1', 'level2']. Default: `[]` */
    nodeLevels?: string[];
    /** Node width in pixels. Default: `15` */
    nodeWidth?: number;
    /** Node color accessor function ot constant value. Default: `d => d.color` */
    nodeColor?: ColorAccessor<ChordNodeDatum<N>>;
    /** Node label accessor function. Default: `d => d.label ?? d.key` */
    nodeLabel?: StringAccessor<ChordNodeDatum<N>>;
    /** Node label color accessor function. Default: `undefined` */
    nodeLabelColor?: StringAccessor<ChordNodeDatum<N>>;
    /** Node label alignment. Default: `ChordLabelAlignment.Along` */
    nodeLabelAlignment?: GenericAccessor<ChordLabelAlignment | string, ChordNodeDatum<N>>;
    /** Pad angle in radians. Default: `0.02` */
    padAngle?: number;
    /** The exponent property of the radius scale. Default: `2` */
    radiusScaleExponent?: number;
}
export declare const ChordDiagramDefaultConfig: ChordDiagramConfigInterface<ChordInputNode, ChordInputLink>;
