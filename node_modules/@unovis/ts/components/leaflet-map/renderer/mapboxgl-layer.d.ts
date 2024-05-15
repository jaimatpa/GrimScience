import type L from 'leaflet';
import type Maplibre from 'maplibre-gl';
import type { Map } from 'maplibre-gl';
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapConfigInterface } from '../config';
export declare function getMaplibreGLLayer<Datum extends GenericDataRecord>(config: LeafletMapConfigInterface<Datum>, leaflet: typeof L, maplibre: typeof Maplibre): L.Layer & {
    getMaplibreMap(): Map;
};
