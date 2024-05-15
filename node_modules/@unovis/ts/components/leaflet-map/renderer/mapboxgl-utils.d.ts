import type L from 'leaflet';
import type { Map } from 'maplibre-gl';
export declare function constraintMapView(map: L.Map, latMin?: number, latMax?: number): void;
export declare function mapboxglWheelEvent(map: L.Map, layer: L.Layer & {
    getMaplibreMap(): Map;
}, event: WheelEvent): void;
export declare const mapboxglWheelEventThrottled: import("throttle-debounce").throttle<typeof mapboxglWheelEvent>;
export declare const constraintMapViewThrottled: import("throttle-debounce").throttle<typeof constraintMapView>;
