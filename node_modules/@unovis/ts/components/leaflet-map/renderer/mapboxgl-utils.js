import { throttle } from '../../../utils/data.js';

// Utils
function constraintMapView(map, latMin = -75, latMax = 85) {
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    if (northEast.lat > latMax && southWest.lat < latMin) {
        map.fitBounds([
            [latMin, 0],
            [latMax, 0],
        ]);
    }
}
function mapboxglWheelEvent(map, layer, event) {
    const { deltaY } = event;
    if (!layer || !layer.getMaplibreMap)
        return;
    const mapboxmap = layer.getMaplibreMap();
    const delta = deltaY * -1;
    // Prevent Map from being zoomed-out too far away
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const latMin = -70;
    const latMax = 80;
    if (delta < 0 && northEast.lat > latMax && southWest.lat < latMin) {
        constraintMapView(map);
        return;
    }
    const zoom = mapboxmap.getZoom() + delta * 0.001;
    const xy = map.mouseEventToLayerPoint(event);
    map.setZoomAround(xy, zoom + 1, { animate: false });
}
const mapboxglWheelEventThrottled = throttle(mapboxglWheelEvent, 32);
const constraintMapViewThrottled = throttle(constraintMapView, 1000);

export { constraintMapView, constraintMapViewThrottled, mapboxglWheelEvent, mapboxglWheelEventThrottled };
//# sourceMappingURL=mapboxgl-utils.js.map
