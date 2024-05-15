import { Selection } from 'd3-selection';
import type L from 'leaflet';
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapExpandedCluster } from '../types';
import { LeafletMapConfigInterface } from '../config';
export declare function createBackgroundNode(selection: Selection<SVGGElement, unknown, SVGElement, undefined>): void;
export declare function updateBackgroundNode<D extends GenericDataRecord>(selection: Selection<SVGGElement, unknown, SVGElement, undefined>, expandedCluster: LeafletMapExpandedCluster<D>, config: LeafletMapConfigInterface<D>, leafletMap: L.Map, clusterBackgroundRadius: number): void;
