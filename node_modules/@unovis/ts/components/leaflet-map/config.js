import { ComponentDefaultConfig } from '../../core/component/config.js';
import { LeafletMapRenderer } from './types.js';

/* eslint-disable no-irregular-whitespace */
const LeafletMapDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { 
    // General
    width: undefined, height: undefined, flyToDuration: 1500, fitViewPadding: [150, 150], zoomDuration: 800, initialBounds: undefined, fitBoundsOnUpdate: undefined, fitViewOnInit: true, fitViewOnUpdate: false, attribution: ['<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'], accessToken: '', style: undefined, styleDarkTheme: undefined, renderer: LeafletMapRenderer.MapLibre, 
    // Map events
    onMapInitialized: undefined, onMapMoveZoom: undefined, onMapMoveStart: undefined, onMapMoveEnd: undefined, onMapZoomStart: undefined, onMapZoomEnd: undefined, onMapClick: undefined, 
    // Point
    pointLongitude: (d) => d.longitude, pointLatitude: (d) => d.latitude, pointId: (d) => d.id, pointShape: (d) => d.shape, pointColor: (d) => d.color, pointRadius: undefined, pointLabel: undefined, pointLabelColor: undefined, pointBottomLabel: '', pointCursor: null, pointRingWidth: 1.25, selectedPointId: undefined, 
    // Cluster
    clusterColor: undefined, clusterRadius: undefined, clusterLabel: (d) => `${d.point_count}`, clusterLabelColor: undefined, clusterBottomLabel: '', clusterRingWidth: 1.25, clusterBackground: true, clusterExpandOnClick: true, clusteringDistance: 55, colorMap: {}, 
    // TopoJSON Overlay
    topoJSONLayer: {
        sources: undefined,
        fillOpacity: 0.6,
        strokeOpacity: 0.8,
        strokeWidth: 1,
        featureName: undefined,
        fillProperty: undefined,
        strokeProperty: undefined,
    }, 
    // Misc
    tooltip: undefined, ariaLabel: undefined });

export { LeafletMapDefaultConfig };
//# sourceMappingURL=config.js.map
