import type L from 'leaflet';
import { Selection } from 'd3-selection';
import type { Map } from 'maplibre-gl';
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapConfigInterface } from '../config';
export declare const initialMapCenter: L.LatLngExpression;
export declare const initialMapZoom = 1.9;
export declare function updateTopoJson<T extends GenericDataRecord>(maplibreMap: Map, config: LeafletMapConfigInterface<T>): void;
export declare function setupMap<T extends GenericDataRecord>(mapContainer: HTMLElement, config: LeafletMapConfigInterface<T>): Promise<{
    leaflet: L.Map;
    layer: L.Layer;
    svgOverlay: Selection<SVGSVGElement, unknown, null, undefined>;
    svgGroup: Selection<SVGGElement, unknown, SVGElement, undefined>;
}>;
