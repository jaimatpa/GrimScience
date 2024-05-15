import { CoreDataModel } from './core.js';
import { getDataLatLngBounds } from '../utils/map.js';

// Core
class MapDataModel extends CoreDataModel {
    getDataLatLngBounds(pointLatitude, pointLongitude, paddingDegrees = 1) {
        return getDataLatLngBounds(this.data, pointLatitude, pointLongitude, paddingDegrees);
    }
}

export { MapDataModel };
//# sourceMappingURL=map.js.map
