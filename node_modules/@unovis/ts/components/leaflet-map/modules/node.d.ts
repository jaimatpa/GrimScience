import { Selection } from 'd3-selection';
import type L from 'leaflet';
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapPoint } from '../types';
import { LeafletMapConfigInterface } from '../config';
export declare function createNodes<D extends GenericDataRecord>(selection: Selection<SVGGElement, LeafletMapPoint<D>, SVGGElement, unknown>): void;
export declare function updateNodes<D extends GenericDataRecord>(selection: Selection<SVGGElement, LeafletMapPoint<D>, SVGGElement, unknown>, config: LeafletMapConfigInterface<D>, leafletMap: L.Map, mapMoveZoomUpdateOnly: boolean): void;
export interface LabelSVGGElement extends SVGGElement {
    labelVisible?: boolean;
}
export declare function collideLabels<D extends GenericDataRecord>(selection: Selection<SVGGElement, LeafletMapPoint<D>, SVGGElement, unknown>, leafletMap: L.Map): void;
export declare function removeNodes<D extends GenericDataRecord>(selection: Selection<SVGGElement, LeafletMapPoint<D>, SVGGElement, unknown>): void;
