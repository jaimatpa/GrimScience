import { HierarchyNode } from 'd3-hierarchy';
import { NumericAccessor } from "../../../types/accessor";
import { ChordNode, ChordRibbon, ChordLinkDatum, ChordHierarchyNode } from '../types';
export declare function getHierarchyNodes<N>(data: N[], value: NumericAccessor<N>, levels?: string[]): HierarchyNode<ChordHierarchyNode<N>>;
export declare function positionChildren<N>(node: ChordNode<N>, padding: number, scalingCoeff?: number): void;
export declare function getRibbons<N>(data: ChordNode<N>, links: ChordLinkDatum<N>[], padding: number): ChordRibbon<N>[];
