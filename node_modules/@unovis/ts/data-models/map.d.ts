import { CoreDataModel } from "./core";
import { NumericAccessor } from "../types/accessor";
export declare class MapDataModel<PointDatum> extends CoreDataModel<PointDatum[]> {
    getDataLatLngBounds(pointLatitude: NumericAccessor<PointDatum>, pointLongitude: NumericAccessor<PointDatum>, paddingDegrees?: number): [[number, number], [number, number]];
}
