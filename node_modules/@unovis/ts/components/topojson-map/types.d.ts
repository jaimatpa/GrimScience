import { Feature, Geometry } from 'geojson';
import { GeoProjection, geoMercator, geoEquirectangular, geoAzimuthalEqualArea, geoAzimuthalEquidistant, geoGnomonic, geoOrthographic, geoStereographic, geoEqualEarth, geoAlbersUsa, geoAlbers, geoConicConformal, geoConicEqualArea, geoConicEquidistant, geoTransverseMercator, geoNaturalEarth1 } from 'd3-geo';
export declare type MapData<AreaDatum, PointDatum = unknown, LinkDatum = unknown> = {
    areas?: AreaDatum[];
    points?: PointDatum[];
    links?: LinkDatum[];
};
export declare enum MapPointLabelPosition {
    Center = "center",
    Bottom = "bottom"
}
export declare type MapFeature<D> = Feature<Geometry> & {
    data: D;
};
export declare enum MapProjectionKind {
    Mercator = "Mercator",
    Equirectangular = "Equirectangular",
    AzimuthalEqualArea = "AzimuthalEqualArea",
    AzimuthalEquidistant = "AzimuthalEquidistant",
    Gnomonic = "Gnomonic",
    Orthographic = "Orthographic",
    Stereographic = "Stereographic",
    EqualEarth = "EqualEarth",
    AlbersUsa = "AlbersUsa",
    Albers = "Albers",
    ConicConformal = "ConicConformal",
    ConicEqualArea = "ConicEqualArea",
    ConicEquidistant = "ConicEquidistant",
    TransverseMercator = "TransverseMercator",
    NaturalEarth1 = "NaturalEarth1",
    Bromley = "Bromley",
    NaturalEarth2 = "NaturalEarth2",
    Kavrayskiy7 = "Kavrayskiy7",
    Hufnagel = "Hufnagel",
    FoucautSinusoidal = "FoucautSinusoidal",
    Eckert1 = "Eckert1",
    Eckert3 = "Eckert3",
    Boggs = "Boggs",
    CylindricalStereographic = "CylindricalStereographic",
    Craster = "Craster",
    Baker = "Baker",
    Armadillo = "Armadillo",
    Aitoff = "Aitoff",
    Fahey = "Fahey",
    Robinson = "Robinson"
}
export declare const MapProjection: {
    Mercator: typeof geoMercator;
    Equirectangular: typeof geoEquirectangular;
    AzimuthalEqualArea: typeof geoAzimuthalEqualArea;
    AzimuthalEquidistant: typeof geoAzimuthalEquidistant;
    Gnomonic: typeof geoGnomonic;
    Orthographic: typeof geoOrthographic;
    Stereographic: typeof geoStereographic;
    EqualEarth: typeof geoEqualEarth;
    AlbersUsa: typeof geoAlbersUsa;
    Albers: typeof geoAlbers;
    ConicConformal: typeof geoConicConformal;
    ConicEqualArea: typeof geoConicEqualArea;
    ConicEquidistant: typeof geoConicEquidistant;
    TransverseMercator: typeof geoTransverseMercator;
    NaturalEarth1: typeof geoNaturalEarth1;
    Bromley: () => GeoProjection;
    NaturalEarth2: () => GeoProjection;
    Kavrayskiy7: () => GeoProjection;
    Hufnagel: () => GeoProjection;
    FoucautSinusoidal: () => GeoProjection;
    Eckert1: () => GeoProjection;
    Eckert3: () => GeoProjection;
    Boggs: () => GeoProjection;
    CylindricalStereographic: () => GeoProjection;
    Craster: () => GeoProjection;
    Baker: () => GeoProjection;
    Armadillo: () => GeoProjection;
    Aitoff: () => GeoProjection;
    Fahey: () => GeoProjection;
    Robinson: () => GeoProjection;
};
