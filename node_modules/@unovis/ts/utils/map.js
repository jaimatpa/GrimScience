import { max, min } from 'd3-array';
import { getNumber } from './data.js';

function getDataLatLngBounds(data, pointLatitude, pointLongitude, paddingDegrees = 1) {
    const northWest = {
        lat: max(data !== null && data !== void 0 ? data : [], d => getNumber(d, pointLatitude)),
        lng: min(data !== null && data !== void 0 ? data : [], d => getNumber(d, pointLongitude)),
    };
    const southEast = {
        lat: min(data !== null && data !== void 0 ? data : [], d => getNumber(d, pointLatitude)),
        lng: max(data !== null && data !== void 0 ? data : [], d => getNumber(d, pointLongitude)),
    };
    return [
        [northWest.lat + paddingDegrees || 90, northWest.lng - paddingDegrees || -180],
        [southEast.lat - paddingDegrees || -70, southEast.lng + paddingDegrees || 180],
    ];
}

export { getDataLatLngBounds };
//# sourceMappingURL=map.js.map
