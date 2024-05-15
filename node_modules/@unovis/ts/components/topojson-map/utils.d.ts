import { NumericAccessor } from "../../types/accessor";
export declare function getLonLat<Datum>(d: Datum, pointLongitude: NumericAccessor<Datum>, pointLatitude: NumericAccessor<Datum>): [number, number];
export declare function arc(source?: number[], target?: number[], curvature?: number): string;
