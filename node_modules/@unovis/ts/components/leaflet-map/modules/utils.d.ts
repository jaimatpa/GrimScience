import type L from 'leaflet';
import Supercluster, { ClusterFeature, PointFeature } from 'supercluster';
import { NumericAccessor, StringAccessor } from "../../../types/accessor";
import { GenericDataRecord } from "../../../types/data";
import { LeafletMapPoint, LeafletMapPointShape, LeafletMapPieDatum, LeafletMapPointStyles, PointExpandedClusterProperties, LeafletMapPointDatum, LeafletMapClusterDatum } from '../types';
import { LeafletMapConfigInterface } from '../config';
export declare function bBoxMerge(bBoxArray: ({
    x1: number;
    x2: number;
    y1: number;
    y2: number;
})[]): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const getNextZoomLevelOnClusterClick: (level: number) => number;
export declare function projectPoint<D extends GenericDataRecord>(geoJSONPoint: LeafletMapPoint<D> | ClusterFeature<LeafletMapClusterDatum<D>> | PointFeature<LeafletMapPointDatum<D>>, leafletMap: L.Map): {
    x: number;
    y: number;
};
export declare function getPointRadius<D extends GenericDataRecord>(geoPoint: ClusterFeature<LeafletMapClusterDatum<D>> | PointFeature<LeafletMapPointDatum<D>> | PointFeature<PointExpandedClusterProperties<D>>, pointRadius: NumericAccessor<LeafletMapPointDatum<D>> | NumericAccessor<LeafletMapClusterDatum<D>>, zoomLevel: number): number;
export declare function getPointPos<D extends GenericDataRecord>(point: LeafletMapPoint<D> | ClusterFeature<LeafletMapClusterDatum<D>> | PointFeature<LeafletMapPointDatum<D>>, leafletMap: L.Map): {
    x: number;
    y: number;
};
export declare function getPointDisplayOrder<D extends GenericDataRecord>(d: LeafletMapPoint<D>, pointStatus: StringAccessor<LeafletMapPointDatum<D> | LeafletMapClusterDatum<D>>, colorMap: LeafletMapPointStyles<D>): number;
export declare function toGeoJSONPoint<D extends GenericDataRecord>(d: D, i: number, pointLatitude: NumericAccessor<D>, pointLongitude: NumericAccessor<D>): PointFeature<D>;
export declare function calculateClusterIndex<D extends GenericDataRecord>(data: D[], config: LeafletMapConfigInterface<D>, maxClusterZoomLevel?: number): Supercluster<D>;
export declare function getNodePathData({ x, y }: {
    x: number;
    y: number;
}, radius: number, shape: LeafletMapPointShape): string;
export declare function getDonutData<D extends GenericDataRecord>(d: LeafletMapClusterDatum<D> | LeafletMapPointDatum<D>, colorMap: LeafletMapPointStyles<D>): LeafletMapPieDatum[];
export declare function geoJsonPointToScreenPoint<D extends GenericDataRecord>(geoPoint: ClusterFeature<LeafletMapClusterDatum<D>> | PointFeature<LeafletMapPointDatum<D>>, i: number, leafletMap: L.Map, config: LeafletMapConfigInterface<D>): LeafletMapPoint<D>;
export declare function shouldClusterExpand<D extends GenericDataRecord>(cluster: LeafletMapPoint<D>, zoomLevel: number, midLevel?: number, maxLevel?: number, maxClusterZoomLevel?: number): boolean;
export declare function findPointAndClusterByPointId<D extends GenericDataRecord>(points: LeafletMapPoint<D>[], id: string, pointId: StringAccessor<D>): {
    point: PointFeature<D> | undefined;
    cluster: LeafletMapPoint<D> | undefined;
};
export declare function getNodeRelativePosition<D extends GenericDataRecord>(d: LeafletMapPoint<D>, leafletMap: L.Map): {
    x: number;
    y: number;
};
export declare function getClusterRadius<D extends GenericDataRecord>(cluster: {
    points: PointFeature<PointExpandedClusterProperties<D>>[];
    cluster: LeafletMapPoint<D>;
}): number;
export declare function getClustersAndPoints<D extends GenericDataRecord>(clusterIndex: Supercluster<D>, leafletMap: L.Map, customBounds?: [number, number, number, number]): (ClusterFeature<LeafletMapClusterDatum<D>> | PointFeature<D>)[];
