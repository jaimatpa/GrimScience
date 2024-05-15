import { NumericAccessor } from "../types/accessor";
export declare function getDataLatLngBounds<D>(data: D[], pointLatitude: NumericAccessor<D>, pointLongitude: NumericAccessor<D>, paddingDegrees?: number): [[number, number], [number, number]];
