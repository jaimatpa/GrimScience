import { CoreDataModel } from './core.js';

// Core
class SeriesDataModel extends CoreDataModel {
    constructor(data) {
        super(data);
    }
    get data() {
        var _a;
        return (_a = this._data) !== null && _a !== void 0 ? _a : [];
    }
    set data(data) {
        if (Array.isArray(data))
            this._data = data;
    }
}

export { SeriesDataModel };
//# sourceMappingURL=series.js.map
