import type L from 'leaflet';
import { Selection } from 'd3-selection';
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapPoint } from '../types';
import { LeafletMapConfigInterface } from '../config';
export declare function createNodeSelectionRing(selection: Selection<SVGGElement, unknown, SVGElement, undefined>): void;
export declare function updateNodeSelectionRing<D extends GenericDataRecord>(selection: Selection<SVGGElement, unknown, SVGElement, undefined>, selectedPoint: LeafletMapPoint<D>, pointData: LeafletMapPoint<D>[], config: LeafletMapConfigInterface<D>, leafletMap: L.Map): void;
