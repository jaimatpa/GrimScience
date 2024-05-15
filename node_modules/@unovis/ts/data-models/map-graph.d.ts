import { CoreDataModel } from "./core";
import { MapLink } from "../types/map";
export declare type MapGraphData<AreaDatum, PointDatum, LinkDatum> = {
    areas?: AreaDatum[];
    points?: PointDatum[];
    links?: LinkDatum[];
};
export declare class MapGraphDataModel<AreaDatum, PointDatum, LinkDatum> extends CoreDataModel<MapGraphData<AreaDatum, PointDatum, LinkDatum>> {
    private _areas;
    private _points;
    private _links;
    pointId: ((n: PointDatum, i: number) => string);
    linkSource: ((l: LinkDatum) => number | string | PointDatum);
    linkTarget: ((l: LinkDatum) => number | string | PointDatum);
    get data(): MapGraphData<AreaDatum, PointDatum, LinkDatum>;
    set data(data: MapGraphData<AreaDatum, PointDatum, LinkDatum>);
    get areas(): AreaDatum[];
    get points(): PointDatum[];
    get links(): MapLink<PointDatum, LinkDatum>[];
    private findPoint;
}
