import { LatLng } from 'leaflet';
import Supercluster, { ClusterProperties, PointFeature } from 'supercluster';
import { GenericDataRecord } from "../../types/data";
export declare enum LeafletMapRenderer {
    Raster = "raster",
    MapLibre = "maplibre"
}
export declare enum LeafletMapPointShape {
    Square = "square",
    Circle = "circle",
    Triangle = "triangle",
    Ring = "ring"
}
export declare type LeafletMapPieDatum = {
    value: number;
    name: string;
    color: string;
    className?: string;
};
export interface LeafletMapPointStyle {
    color: string;
    className?: string;
}
export declare type LeafletMapPointStyles<D> = {
    [key in keyof D]?: LeafletMapPointStyle;
};
export declare type PointExpandedClusterProperties<D extends GenericDataRecord> = D & {
    expandedClusterPoint?: LeafletMapPoint<D>;
    r?: number;
    dx?: number;
    dy?: number;
};
export declare type LeafletMapClusterDatum<D extends GenericDataRecord> = Partial<D> & ClusterProperties & {
    clusterIndex?: Supercluster<D>;
    clusterPoints?: D[];
};
export declare type LeafletMapPointDatum<D extends GenericDataRecord> = D & PointExpandedClusterProperties<D> & {
    id: string | number;
    shape: LeafletMapPointShape;
    _index: number;
};
export declare type LeafletMapPoint<D extends GenericDataRecord> = {
    geometry: GeoJSON.Point;
    bbox: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
    radius: number;
    path: string;
    color: string;
    id: number | string;
    properties: LeafletMapPointDatum<D> | LeafletMapClusterDatum<D>;
    donutData: LeafletMapPieDatum[];
    isCluster: boolean;
    clusterIndex: Supercluster<D, Supercluster.AnyProps>;
    clusterPoints?: D[];
    _zIndex: number;
};
export declare type Bounds = {
    northEast: {
        lat: number;
        lng: number;
    };
    southWest: {
        lat: number;
        lng: number;
    };
};
export declare type MapZoomState = {
    mapCenter: LatLng;
    zoomLevel: number;
    bounds: Bounds;
    userDriven: boolean;
};
export declare type LeafletMapExpandedCluster<Datum extends GenericDataRecord> = {
    points: PointFeature<PointExpandedClusterProperties<Datum>>[];
    cluster: LeafletMapPoint<Datum>;
};
