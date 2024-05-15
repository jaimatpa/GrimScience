import { arc, pie } from 'd3-shape';
import { ComponentCore } from '../../core/component/index.js';
import { SeriesDataModel } from '../../data-models/series.js';
import { smartTransition } from '../../utils/d3.js';
import { getNumber, isNumber, clamp } from '../../utils/data.js';
import { wrapSVGText } from '../../utils/text.js';
import { DonutDefaultConfig } from './config.js';
import { createArc, updateArc, removeArc } from './modules/arc.js';
import * as style from './style.js';
import { centralLabel, centralSubLabel, segment, segmentExit, background } from './style.js';

class Donut extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = DonutDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new SeriesDataModel();
        this.arcGen = arc();
        this.events = {};
        if (config)
            this.setConfig(config);
        this.arcBackground = this.g.append('path');
        this.arcGroup = this.g.append('g');
        this.centralLabel = this.g.append('text')
            .attr('class', centralLabel);
        this.centralSubLabel = this.g.append('text')
            .attr('class', centralSubLabel);
    }
    get bleed() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    _render(customDuration) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const { config, datamodel, bleed } = this;
        // Wrap data to preserve original indices
        const data = datamodel.data
            .map((d, i) => ({
            index: i,
            datum: d,
        }))
            .filter(d => config.showEmptySegments || getNumber(d.datum, config.value, d.index));
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const outerRadius = config.radius || Math.min(this._width - bleed.left - bleed.right, this._height - bleed.top - bleed.bottom) / 2;
        const innerRadius = config.arcWidth === 0 ? 0 : clamp(outerRadius - config.arcWidth, 0, outerRadius - 1);
        this.arcGen
            .startAngle(d => d.startAngle)
            .endAngle(d => d.endAngle)
            .innerRadius(d => d.innerRadius)
            .outerRadius(d => d.outerRadius)
            .padAngle(d => d.padAngle)
            .cornerRadius(config.cornerRadius);
        const pieGen = pie()
            .startAngle((_b = (_a = config.angleRange) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0)
            .endAngle((_d = (_c = config.angleRange) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 2 * Math.PI)
            .padAngle(config.padAngle)
            .value(d => getNumber(d.datum, config.value, d.index) || 0)
            .sort((a, b) => { var _a; return (_a = config.sortFunction) === null || _a === void 0 ? void 0 : _a.call(config, a.datum, b.datum); });
        this.arcGroup.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        const arcData = pieGen(data).map(d => {
            const arc = Object.assign(Object.assign({}, d), { data: d.data.datum, index: d.data.index, innerRadius,
                outerRadius });
            if (config.showEmptySegments && d.endAngle - d.startAngle - d.padAngle <= Number.EPSILON) {
                arc.endAngle = d.startAngle + Math.max(config.emptySegmentAngle, config.padAngle);
                arc.padAngle = d.padAngle / 2;
            }
            return arc;
        });
        // Arc segments
        const arcsSelection = this.arcGroup
            .selectAll(`.${segment}`)
            .data(arcData, (d) => config.id(d.data, d.index));
        const arcsEnter = arcsSelection.enter().append('path')
            .attr('class', segment)
            .call(createArc, config);
        const arcsMerged = arcsSelection.merge(arcsEnter);
        arcsMerged.call(updateArc, config, this.arcGen, duration);
        arcsMerged.sort((a, b) => b.value - a.value);
        arcsSelection.exit()
            .attr('class', segmentExit)
            .call(removeArc, duration);
        // Label
        this.centralLabel
            .attr('transform', `translate(${this._width / 2},${this._height / 2})`)
            .attr('dy', config.centralSubLabel ? '-0.55em' : null)
            .text((_e = config.centralLabel) !== null && _e !== void 0 ? _e : null);
        this.centralSubLabel
            .attr('transform', `translate(${this._width / 2},${this._height / 2})`)
            .attr('dy', config.centralLabel ? '0.55em' : null)
            .text((_f = config.centralSubLabel) !== null && _f !== void 0 ? _f : null);
        if (config.centralSubLabelWrap)
            wrapSVGText(this.centralSubLabel, innerRadius * 1.9);
        // Background
        this.arcBackground.attr('class', background)
            .attr('visibility', config.showBackground ? null : 'hidden')
            .attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        smartTransition(this.arcBackground, duration)
            .attr('d', this.arcGen({
            startAngle: (_k = (_h = (_g = config.backgroundAngleRange) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : (_j = config.angleRange) === null || _j === void 0 ? void 0 : _j[0]) !== null && _k !== void 0 ? _k : 0,
            endAngle: (_p = (_m = (_l = config.backgroundAngleRange) === null || _l === void 0 ? void 0 : _l[1]) !== null && _m !== void 0 ? _m : (_o = config.angleRange) === null || _o === void 0 ? void 0 : _o[1]) !== null && _p !== void 0 ? _p : 2 * Math.PI,
            innerRadius,
            outerRadius,
        }));
    }
}
Donut.selectors = style;

export { Donut };
//# sourceMappingURL=index.js.map
