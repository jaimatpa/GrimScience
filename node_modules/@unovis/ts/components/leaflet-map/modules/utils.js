import { max, min } from 'd3-array';
import Supercluster from 'supercluster';
import { clamp, getNumber, getString } from '../../../utils/data.js';
import { getColor } from '../../../utils/color.js';
import { circlePath, polygon } from '../../../utils/path.js';
import { getHTMLTransform } from '../../../utils/html.js';
import { LeafletMapPointShape } from '../types.js';

function bBoxMerge(bBoxArray) {
    let box = { x1: 0, x2: 0, y1: 0, y2: 0 };
    bBoxArray.forEach(coords => {
        if (!box) {
            box = Object.assign({}, coords);
        }
        else {
            if (box.x1 > coords.x1)
                box.x1 = coords.x1;
            if (box.y1 > coords.y1)
                box.y1 = coords.y1;
            if (box.x2 < coords.x2)
                box.x2 = coords.x2;
            if (box.y2 < coords.y2)
                box.y2 = coords.y2;
        }
    });
    return {
        x: box.x1,
        y: box.y1,
        width: box.x2 - box.x1,
        height: box.y2 - box.y1,
    };
}
const getNextZoomLevelOnClusterClick = (level) => clamp(1 + level * 1.5, level, 12);
function projectPoint(geoJSONPoint, leafletMap) {
    const lat = geoJSONPoint.geometry.coordinates[1];
    const lon = geoJSONPoint.geometry.coordinates[0];
    const projected = leafletMap.latLngToLayerPoint([lat, lon]);
    return projected;
}
function getPointRadius(geoPoint, pointRadius, zoomLevel) {
    const isDynamic = !pointRadius;
    const radius = isDynamic
        ? 1 + 2 * Math.pow(zoomLevel, 0.80)
        // Todo: Needs a better typings handling
        : getNumber(geoPoint.properties, pointRadius);
    const isCluster = geoPoint.properties.cluster;
    return (isCluster && isDynamic)
        ? clamp(Math.pow(geoPoint.properties.point_count, 0.35) * radius, radius * 1.1, radius * 3)
        : radius;
}
function getPointPos(point, leafletMap) {
    const properties = point.properties;
    const isFromCluster = !!(properties).expandedClusterPoint;
    if (isFromCluster) {
        const { x, y } = projectPoint(properties.expandedClusterPoint, leafletMap);
        return {
            x: x + properties.dx,
            y: y + properties.dy,
        };
    }
    else {
        return projectPoint(point, leafletMap);
    }
}
function getPointDisplayOrder(d, pointStatus, colorMap) {
    const status = getString(d.properties, pointStatus);
    const statusList = Object.keys(colorMap);
    return Object.keys(statusList).indexOf(status);
}
function toGeoJSONPoint(d, i, pointLatitude, pointLongitude) {
    const lat = getNumber(d, pointLatitude);
    const lon = getNumber(d, pointLongitude);
    return {
        type: 'Feature',
        properties: Object.assign(Object.assign({}, d), { _index: i }),
        geometry: {
            type: 'Point',
            coordinates: [lon, lat],
        },
    };
}
function calculateClusterIndex(data, config, maxClusterZoomLevel = 23) {
    const { colorMap, pointShape, pointLatitude, pointLongitude, clusteringDistance } = config;
    return new Supercluster({
        radius: clusteringDistance,
        maxZoom: maxClusterZoomLevel,
        map: (d) => {
            const shape = getString(d, pointShape);
            const clusterPoint = { shape };
            for (const key of Object.keys(colorMap)) {
                clusterPoint[key] = d[key] || 0;
            }
            return clusterPoint;
        },
        reduce: (acc, clusterPoint) => {
            var _a, _b;
            acc.shape = acc.shape === clusterPoint.shape ? acc.shape : LeafletMapPointShape.Circle;
            acc.value = ((_a = acc.value) !== null && _a !== void 0 ? _a : 0) + ((_b = clusterPoint.value) !== null && _b !== void 0 ? _b : 0);
            for (const key of Object.keys(colorMap)) {
                acc[key] += clusterPoint[key];
            }
        },
    }).load(data.map((d, i) => toGeoJSONPoint(d, i, pointLatitude, pointLongitude)));
}
function getNodePathData({ x, y }, radius, shape) {
    switch (shape) {
        case LeafletMapPointShape.Triangle:
            return polygon(radius * 2, 3);
        case LeafletMapPointShape.Square:
            return polygon(radius * 2, 4);
        case LeafletMapPointShape.Circle:
        case LeafletMapPointShape.Ring:
        default:
            return circlePath(x, y, radius);
    }
}
function getDonutData(d, colorMap) {
    return Object.keys(colorMap).map(key => ({
        name: key,
        value: d[key],
        color: colorMap[key].color,
        className: colorMap[key].className,
    }));
}
function geoJsonPointToScreenPoint(geoPoint, i, leafletMap, config) {
    var _a;
    const zoomLevel = leafletMap.getZoom();
    const isCluster = geoPoint.properties.cluster;
    const clusterIndex = geoPoint.properties.clusterIndex;
    const clusterPoints = isCluster ? clusterIndex.getLeaves(geoPoint.properties.cluster_id, Infinity).map(d => d.properties) : undefined;
    const { x, y } = getPointPos(geoPoint, leafletMap);
    const id = isCluster ? `cluster-${geoPoint.id}` : ((_a = getString(geoPoint.properties, config.pointId)) !== null && _a !== void 0 ? _a : geoPoint.geometry.coordinates.join(''));
    // Todo: Needs a better typings handling
    const pointColor = getColor(geoPoint.properties, (isCluster ? config.clusterColor : config.pointColor));
    const radius = getPointRadius(geoPoint, isCluster ? config.clusterRadius : config.pointRadius, zoomLevel);
    const shape = isCluster ? LeafletMapPointShape.Circle : getString(geoPoint.properties, config.pointShape);
    const isRing = shape === LeafletMapPointShape.Ring;
    const donutData = getDonutData(geoPoint.properties, config.colorMap);
    const maxValue = max(donutData, d => d.value);
    const maxValueIndex = donutData.map(d => d.value).indexOf(maxValue);
    const biggestDatum = donutData[maxValueIndex !== null && maxValueIndex !== void 0 ? maxValueIndex : 0];
    const color = isCluster ? pointColor
        : (isRing ? null : (pointColor !== null && pointColor !== void 0 ? pointColor : biggestDatum === null || biggestDatum === void 0 ? void 0 : biggestDatum.color));
    const bbox = { x1: x - radius, y1: y - radius, x2: x + radius, y2: y + radius };
    const path = getNodePathData({ x: 0, y: 0 }, radius, shape);
    const _zIndex = 0;
    const screenPoint = Object.assign(Object.assign({}, geoPoint), { id,
        bbox,
        radius,
        donutData,
        path,
        color,
        isCluster,
        clusterIndex,
        clusterPoints,
        _zIndex });
    return screenPoint;
}
function shouldClusterExpand(cluster, zoomLevel, midLevel = 4, maxLevel = 8, maxClusterZoomLevel = 23) {
    if (!cluster)
        return false;
    const clusterExpansionZoomLevel = cluster.clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);
    return zoomLevel >= maxLevel ||
        (zoomLevel >= midLevel && (cluster.properties.point_count < 20 || clusterExpansionZoomLevel >= maxClusterZoomLevel));
}
function findPointAndClusterByPointId(points, id, pointId) {
    let point;
    let cluster;
    points.forEach(p => {
        var _a;
        if (p.isCluster) {
            const leaves = (_a = p.clusterIndex.getLeaves(p.properties.cluster_id, Infinity)) !== null && _a !== void 0 ? _a : [];
            const foundPoint = leaves.find(d => getString(d.properties, pointId) === id);
            if (foundPoint) {
                point = foundPoint;
                cluster = p;
            }
        }
    });
    return { point, cluster };
}
function getNodeRelativePosition(d, leafletMap) {
    const paneTransform = getHTMLTransform(leafletMap.getPane('mapPane'));
    const { x, y } = getPointPos(d, leafletMap);
    return { x: x + paneTransform[0], y: y + paneTransform[1] };
}
function getClusterRadius(cluster) {
    const { points } = cluster;
    const minX = min(points.map(d => d.properties.dx - d.properties.r));
    const maxX = max(points.map(d => d.properties.dx + d.properties.r));
    const minY = min(points.map(d => d.properties.dy - d.properties.r));
    const maxY = max(points.map(d => d.properties.dy + d.properties.r));
    return Math.sqrt(Math.pow((maxX - minX), 2) + Math.pow((maxY - minY), 2)) * 0.5;
}
function getClustersAndPoints(clusterIndex, leafletMap, customBounds) {
    const leafletBounds = leafletMap.getBounds();
    const southWest = leafletBounds.getSouthWest();
    const northEast = leafletBounds.getNorthEast();
    const bounds = customBounds || [southWest.lng, southWest.lat, northEast.lng, northEast.lat];
    const zoom = Math.round(leafletMap.getZoom());
    const points = clusterIndex.getClusters(bounds, zoom); // as ClusterFeature<LeafletMapPointDatum<D>>[]
    for (const p of points) {
        const point = p;
        const isCluster = point.properties.cluster;
        if (isCluster) {
            point.properties.clusterIndex = clusterIndex;
            point.properties.clusterPoints = clusterIndex.getLeaves(point.properties.cluster_id, Infinity).map(d => d.properties);
        }
    }
    return points;
}

export { bBoxMerge, calculateClusterIndex, findPointAndClusterByPointId, geoJsonPointToScreenPoint, getClusterRadius, getClustersAndPoints, getDonutData, getNextZoomLevelOnClusterClick, getNodePathData, getNodeRelativePosition, getPointDisplayOrder, getPointPos, getPointRadius, projectPoint, shouldClusterExpand, toGeoJSONPoint };
//# sourceMappingURL=utils.js.map
