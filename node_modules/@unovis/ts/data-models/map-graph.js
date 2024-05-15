import { cloneDeep, isNumber, isString, isObject } from '../utils/data.js';
import { CoreDataModel } from './core.js';

// Utils
class MapGraphDataModel extends CoreDataModel {
    constructor() {
        super(...arguments);
        this._areas = [];
        this._points = [];
        this._links = [];
        // Model configuration
        this.pointId = n => n.id;
        this.linkSource = l => l.source;
        this.linkTarget = l => l.target;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        var _a, _b, _c;
        if (!data)
            return;
        this._data = data;
        this._areas = cloneDeep((_a = data === null || data === void 0 ? void 0 : data.areas) !== null && _a !== void 0 ? _a : []);
        this._points = cloneDeep((_b = data === null || data === void 0 ? void 0 : data.points) !== null && _b !== void 0 ? _b : []);
        this._links = cloneDeep((_c = data === null || data === void 0 ? void 0 : data.links) !== null && _c !== void 0 ? _c : []).reduce((arr, link) => {
            const source = this.findPoint(this.points, this.linkSource(link));
            const target = this.findPoint(this.points, this.linkTarget(link));
            if (source && target)
                arr.push({ source, target });
            return arr;
        }, []);
    }
    get areas() {
        return this._areas;
    }
    get points() {
        return this._points;
    }
    get links() {
        return this._links;
    }
    findPoint(points, pointIdentifier) {
        let foundPoint;
        if (isNumber(pointIdentifier))
            foundPoint = points[pointIdentifier];
        else if (isString(pointIdentifier))
            foundPoint = points.find((node, i) => this.pointId(node, i) === pointIdentifier);
        else if (isObject(pointIdentifier))
            foundPoint = points.find(node => node === pointIdentifier);
        if (!foundPoint) {
            console.warn(`Point ${pointIdentifier} is missing from the points list`);
        }
        return foundPoint;
    }
}

export { MapGraphDataModel };
//# sourceMappingURL=map-graph.js.map
