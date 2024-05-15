import { select } from 'd3-selection';
import { area } from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isNumber, isArray, getNumber, getStackedData, getString, filterDataByRange, getStackedExtent } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor } from '../../utils/color.js';
import { Curve } from '../../types/curve.js';
import { AreaDefaultConfig } from './config.js';
import * as style from './style.js';
import { area as area$1 } from './style.js';

class Area extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = AreaDefaultConfig;
        this.config = this._defaultConfig;
        this.stacked = true;
        this.events = {
            [Area.selectors.area]: {},
        };
        if (config)
            this.setConfig(config);
        // Determine if the provided chart should be stacked
        this.stacked = Array.isArray(this.config.y);
    }
    _render(customDuration) {
        super._render(customDuration);
        const { config, datamodel: { data } } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const curveGen = Curve[config.curveType];
        this._areaGen = area()
            .x(d => d.x)
            .y0(d => d.y0)
            .y1(d => {
            const isSmallerThanPixel = Math.abs(d.y1 - d.y0) < 1;
            return d.y1 - ((isSmallerThanPixel && config.minHeight1Px) ? 1 : 0);
        })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .curve(curveGen);
        const yAccessors = (isArray(config.y) ? config.y : [config.y]);
        const areaDataX = data.map((d, i) => this.xScale(getNumber(d, config.x, i)));
        const stacked = getStackedData(data, config.baseline, yAccessors, this._prevNegative);
        this._prevNegative = stacked.map(s => !!s.negative);
        const stackedData = stacked.map(arr => arr.map((d, j) => ({
            y0: this.yScale(d[0]),
            y1: this.yScale(d[1]),
            x: areaDataX[j],
        })));
        // We reverse the data in order to have the first areas to be displayed on top
        //   for better visibility when they're close to zero
        const areaMaxIdx = stackedData.length - 1;
        const stackedDataReversed = stackedData.reverse();
        const areas = this.g
            .selectAll(`.${area$1}`)
            .data(stackedDataReversed);
        const areasEnter = areas.enter().append('path')
            .attr('class', area$1)
            .attr('d', d => this._areaGen(d) || this._emptyPath())
            .style('opacity', 0)
            .style('fill', (d, i) => getColor(data, config.color, areaMaxIdx - i));
        const areasMerged = smartTransition(areasEnter.merge(areas), duration)
            .style('opacity', (d, i) => {
            const isDefined = d.some(p => (p.y0 - p.y1) !== 0);
            return isDefined ? getNumber(data, config.opacity, areaMaxIdx - i) : 0;
        })
            .style('fill', (d, i) => getColor(data, config.color, areaMaxIdx - i))
            .style('cursor', (d, i) => getString(data, config.cursor, areaMaxIdx - i));
        if (duration) {
            const transition = areasMerged;
            transition.attrTween('d', (d, i, el) => {
                const previous = select(el[i]).attr('d');
                const next = this._areaGen(d) || this._emptyPath();
                return interpolatePath(previous, next);
            });
        }
        else {
            areasMerged.attr('d', d => this._areaGen(d) || this._emptyPath());
        }
        smartTransition(areas.exit(), duration)
            .style('opacity', 0)
            .remove();
    }
    getYDataExtent(scaleByVisibleData) {
        const { config, datamodel } = this;
        const yAccessors = (isArray(config.y) ? config.y : [config.y]);
        const data = scaleByVisibleData ? filterDataByRange(datamodel.data, this.xScale.domain(), config.x) : datamodel.data;
        return getStackedExtent(data, config.baseline, ...yAccessors);
    }
    _emptyPath() {
        const xRange = this.xScale.range();
        const yDomain = this.yScale.domain();
        const y0 = this.yScale((yDomain[0] + yDomain[1]) / 2);
        const y1 = y0;
        return this._areaGen([
            { y0, y1, x: xRange[0] },
            { y0, y1, x: xRange[1] },
        ]);
    }
}
Area.selectors = style;

export { Area };
//# sourceMappingURL=index.js.map
