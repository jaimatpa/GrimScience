import { geoMercator, geoEquirectangular, geoAzimuthalEqualArea, geoAzimuthalEquidistant, geoGnomonic, geoOrthographic, geoStereographic, geoEqualEarth, geoAlbersUsa, geoAlbers, geoConicConformal, geoConicEqualArea, geoConicEquidistant, geoTransverseMercator, geoNaturalEarth1 } from 'd3-geo';
import { geoBromley, geoNaturalEarth2, geoKavrayskiy7, geoHufnagel, geoFoucautSinusoidal, geoEckert1, geoEckert3, geoBoggs, geoCylindricalStereographic, geoCraster, geoBaker, geoArmadillo, geoAitoff, geoFahey, geoRobinson } from 'd3-geo-projection';

var MapPointLabelPosition;
(function (MapPointLabelPosition) {
    MapPointLabelPosition["Center"] = "center";
    MapPointLabelPosition["Bottom"] = "bottom";
})(MapPointLabelPosition || (MapPointLabelPosition = {}));
var MapProjectionKind;
(function (MapProjectionKind) {
    // Projections form `d3-geo`
    MapProjectionKind["Mercator"] = "Mercator";
    MapProjectionKind["Equirectangular"] = "Equirectangular";
    MapProjectionKind["AzimuthalEqualArea"] = "AzimuthalEqualArea";
    MapProjectionKind["AzimuthalEquidistant"] = "AzimuthalEquidistant";
    MapProjectionKind["Gnomonic"] = "Gnomonic";
    MapProjectionKind["Orthographic"] = "Orthographic";
    MapProjectionKind["Stereographic"] = "Stereographic";
    MapProjectionKind["EqualEarth"] = "EqualEarth";
    MapProjectionKind["AlbersUsa"] = "AlbersUsa";
    MapProjectionKind["Albers"] = "Albers";
    MapProjectionKind["ConicConformal"] = "ConicConformal";
    MapProjectionKind["ConicEqualArea"] = "ConicEqualArea";
    MapProjectionKind["ConicEquidistant"] = "ConicEquidistant";
    MapProjectionKind["TransverseMercator"] = "TransverseMercator";
    MapProjectionKind["NaturalEarth1"] = "NaturalEarth1";
    // Projections form `d3-geo-projection`
    MapProjectionKind["Bromley"] = "Bromley";
    MapProjectionKind["NaturalEarth2"] = "NaturalEarth2";
    MapProjectionKind["Kavrayskiy7"] = "Kavrayskiy7";
    MapProjectionKind["Hufnagel"] = "Hufnagel";
    MapProjectionKind["FoucautSinusoidal"] = "FoucautSinusoidal";
    MapProjectionKind["Eckert1"] = "Eckert1";
    MapProjectionKind["Eckert3"] = "Eckert3";
    MapProjectionKind["Boggs"] = "Boggs";
    MapProjectionKind["CylindricalStereographic"] = "CylindricalStereographic";
    MapProjectionKind["Craster"] = "Craster";
    MapProjectionKind["Baker"] = "Baker";
    MapProjectionKind["Armadillo"] = "Armadillo";
    MapProjectionKind["Aitoff"] = "Aitoff";
    MapProjectionKind["Fahey"] = "Fahey";
    MapProjectionKind["Robinson"] = "Robinson";
})(MapProjectionKind || (MapProjectionKind = {}));
const MapProjection = {
    // Projections form `d3-geo`
    [MapProjectionKind.Mercator]: geoMercator,
    [MapProjectionKind.Equirectangular]: geoEquirectangular,
    [MapProjectionKind.AzimuthalEqualArea]: geoAzimuthalEqualArea,
    [MapProjectionKind.AzimuthalEquidistant]: geoAzimuthalEquidistant,
    [MapProjectionKind.Gnomonic]: geoGnomonic,
    [MapProjectionKind.Orthographic]: geoOrthographic,
    [MapProjectionKind.Stereographic]: geoStereographic,
    [MapProjectionKind.EqualEarth]: geoEqualEarth,
    [MapProjectionKind.AlbersUsa]: geoAlbersUsa,
    [MapProjectionKind.Albers]: geoAlbers,
    [MapProjectionKind.ConicConformal]: geoConicConformal,
    [MapProjectionKind.ConicEqualArea]: geoConicEqualArea,
    [MapProjectionKind.ConicEquidistant]: geoConicEquidistant,
    [MapProjectionKind.TransverseMercator]: geoTransverseMercator,
    [MapProjectionKind.NaturalEarth1]: geoNaturalEarth1,
    // Projections form `d3-geo-projection`
    [MapProjectionKind.Bromley]: geoBromley,
    [MapProjectionKind.NaturalEarth2]: geoNaturalEarth2,
    [MapProjectionKind.Kavrayskiy7]: geoKavrayskiy7,
    [MapProjectionKind.Hufnagel]: geoHufnagel,
    [MapProjectionKind.FoucautSinusoidal]: geoFoucautSinusoidal,
    [MapProjectionKind.Eckert1]: geoEckert1,
    [MapProjectionKind.Eckert3]: geoEckert3,
    [MapProjectionKind.Boggs]: geoBoggs,
    [MapProjectionKind.CylindricalStereographic]: geoCylindricalStereographic,
    [MapProjectionKind.Craster]: geoCraster,
    [MapProjectionKind.Baker]: geoBaker,
    [MapProjectionKind.Armadillo]: geoArmadillo,
    [MapProjectionKind.Aitoff]: geoAitoff,
    [MapProjectionKind.Fahey]: geoFahey,
    [MapProjectionKind.Robinson]: geoRobinson,
};

export { MapPointLabelPosition, MapProjection, MapProjectionKind };
//# sourceMappingURL=types.js.map
