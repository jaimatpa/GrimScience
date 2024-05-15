import { ComponentCore } from '../component/index.js';
import { SeriesDataModel } from '../../data-models/series.js';
import { getExtent, filterDataByRange, isArray } from '../../utils/data.js';
import { Scale, ScaleDimension } from '../../types/scale.js';
import { XYComponentDefaultConfig } from './config.js';

// Core
class XYComponentCore extends ComponentCore {
    constructor() {
        super(...arguments);
        this.datamodel = new SeriesDataModel();
        /** Clippable components can be affected by a clipping path (set up in the container) */
        this.clippable = true;
        /** Identifies whether the component displayed stacked data (eg StackedBar, Area) */
        this.stacked = false;
        this._defaultConfig = XYComponentDefaultConfig;
        this._xScale = Scale.scaleLinear();
        this._yScale = Scale.scaleLinear();
    }
    get xScale() {
        return this.config.xScale || this._xScale;
    }
    get yScale() {
        return this.config.yScale || this._yScale;
    }
    setConfig(config) {
        var _a, _b;
        // We don't allow changing scales after the component has been initialized
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.xScale)
            config.xScale = this.config.xScale;
        if ((_b = this.config) === null || _b === void 0 ? void 0 : _b.yScale)
            config.yScale = this.config.yScale;
        super.setConfig(config);
    }
    setScaleDomain(dimension, domain) {
        var _a, _b;
        if (dimension === ScaleDimension.X)
            (_a = this._xScale) === null || _a === void 0 ? void 0 : _a.domain(domain);
        if (dimension === ScaleDimension.Y)
            (_b = this._yScale) === null || _b === void 0 ? void 0 : _b.domain(domain);
    }
    setScaleRange(dimension, range) {
        var _a, _b;
        if (dimension === ScaleDimension.X)
            (_a = this._xScale) === null || _a === void 0 ? void 0 : _a.range(range);
        if (dimension === ScaleDimension.Y)
            (_b = this._yScale) === null || _b === void 0 ? void 0 : _b.range(range);
    }
    setScale(dimension, scale) {
        if (scale && (dimension === ScaleDimension.X))
            this._xScale = scale;
        if (scale && (dimension === ScaleDimension.Y))
            this._yScale = scale;
    }
    getDataExtent(dimension, scaleByVisibleData) {
        const { config, datamodel } = this;
        switch (dimension) {
            case ScaleDimension.X: return this.getXDataExtent();
            case ScaleDimension.Y: return this.getYDataExtent(scaleByVisibleData);
            default: return getExtent(datamodel.data, config[dimension]);
        }
    }
    getXDataExtent() {
        const { config, datamodel } = this;
        return getExtent(datamodel.data, config.x);
    }
    getYDataExtent(scaleByVisibleData) {
        const { config, datamodel } = this;
        const data = scaleByVisibleData ? filterDataByRange(datamodel.data, this.xScale.domain(), config.x) : datamodel.data;
        const yAccessors = (isArray(config.y) ? config.y : [config.y]);
        return getExtent(data, ...yAccessors);
    }
}

export { XYComponentCore };
//# sourceMappingURL=index.js.map
