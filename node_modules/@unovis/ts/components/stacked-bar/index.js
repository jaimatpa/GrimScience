import { min, max } from 'd3-array';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isArray, getNumber, isNumber, getStackedData, getString, isEmpty, clamp, getStackedExtent, getExtent } from '../../utils/data.js';
import { roundedRectPath } from '../../utils/path.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor } from '../../utils/color.js';
import { Orientation } from '../../types/position.js';
import { StackedBarDefaultConfig } from './config.js';
import * as style from './style.js';
import { barGroup, barGroupExit, bar } from './style.js';

class StackedBar extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = StackedBarDefaultConfig;
        this.config = this._defaultConfig;
        this.getAccessors = () => (isArray(this.config.y) ? this.config.y : [this.config.y]);
        this.stacked = true;
        this.events = {};
        this._barData = [];
        if (config)
            this.setConfig(config);
    }
    get bleed() {
        this._barData = this._getVisibleData();
        if (this._barData.length === 0)
            return { top: 0, bottom: 0, left: 0, right: 0 };
        // By default, horizontal orientation is "flipped", i.e. the `yDirection` of `XYContainer` is set to `Direction.North`
        const isHorizontalAndFlipped = !this.isVertical() && (this.dataScale.range()[0] > this.dataScale.range()[1]);
        const dataDomain = this.dataScale.domain();
        const halfGroupWidth = this._getBarWidth() / 2;
        const dataScaleValues = this._barData.map((d, i) => getNumber(d, this.config.x, i));
        const firstDataValue = min(dataScaleValues);
        const lastDataValue = max(dataScaleValues);
        const firstValuePx = this.dataScale(firstDataValue);
        const lastValuePx = this.dataScale(lastDataValue);
        const dataDomainRequiredStart = this.dataScale.invert(firstValuePx + (isHorizontalAndFlipped ? halfGroupWidth : -halfGroupWidth));
        const dataDomainRequiredEnd = this.dataScale.invert(lastValuePx + (isHorizontalAndFlipped ? -halfGroupWidth : halfGroupWidth));
        const bleedPxStart = dataDomainRequiredStart <= dataDomain[0] ? this.dataScale(dataDomain[0]) - this.dataScale(dataDomainRequiredStart) : 0;
        const bleedPxEnd = dataDomainRequiredEnd > dataDomain[1] ? this.dataScale(dataDomainRequiredEnd) - this.dataScale(dataDomain[1]) : 0;
        return {
            top: this.isVertical() ? 0 : (isHorizontalAndFlipped ? -bleedPxEnd : bleedPxStart),
            bottom: this.isVertical() ? 0 : (isHorizontalAndFlipped ? -bleedPxStart : bleedPxEnd),
            left: this.isVertical() ? bleedPxStart : 0,
            right: this.isVertical() ? bleedPxEnd : 0,
        };
    }
    get dataScale() {
        return this.isVertical() ? this.xScale : this.yScale;
    }
    get valueScale() {
        return this.isVertical() ? this.yScale : this.xScale;
    }
    isVertical() {
        return this.config.orientation === Orientation.Vertical;
    }
    _render(customDuration) {
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const yAccessors = this.getAccessors();
        const stacked = getStackedData(this._barData, 0, yAccessors, this._prevNegative);
        this._prevNegative = stacked.map(s => !!s.negative);
        const barGroups = this.g
            .selectAll(`.${barGroup}`)
            .data(this._barData, (d, i) => { var _a; return `${(_a = getString(d, config.id, i)) !== null && _a !== void 0 ? _a : i}`; });
        const getBarGroupsTransform = (d, i) => {
            const v = this.dataScale(getNumber(d, config.x, i));
            const x = this.isVertical() ? v : 0;
            const y = this.isVertical() ? 0 : v;
            return `translate(${x},${y})`;
        };
        const barGroupsEnter = barGroups.enter().append('g')
            .attr('class', barGroup)
            .attr('transform', getBarGroupsTransform)
            .style('opacity', 1);
        const barGroupsMerged = barGroupsEnter.merge(barGroups);
        smartTransition(barGroupsMerged, duration)
            .attr('transform', getBarGroupsTransform)
            .style('opacity', 1);
        const barGroupExit$1 = barGroups.exit()
            .attr('class', barGroupExit);
        smartTransition(barGroupExit$1, duration)
            .style('opacity', 0)
            .remove();
        // Animate bars from exiting groups going down
        smartTransition(barGroupExit$1.selectAll(`.${bar}`), duration)
            .attr('transform', this.isVertical()
            ? `translate(0,${this._height / 3})`
            : `translate(${this._width / 6},0)`);
        // Render Bars
        const bars = barGroupsMerged
            .selectAll(`.${bar}`)
            .data((d, j) => stacked.map((s) => (Object.assign(Object.assign({}, d), { _stacked: s[j], _negative: s.negative, _ending: s.ending }))));
        const barsEnter = bars.enter().append('path')
            .attr('class', bar)
            .attr('d', (d, j) => this._getBarPath(d, j, true))
            .style('fill', (d, j) => getColor(d, config.color, j));
        const barsMerged = barsEnter.merge(bars);
        smartTransition(barsMerged, duration)
            .attr('d', (d, j) => this._getBarPath(d, j))
            .style('fill', (d, j) => getColor(d, config.color, j))
            .style('cursor', (d, j) => getString(d, config.cursor, j));
        smartTransition(bars.exit(), duration)
            .style('opacity', 0)
            .remove();
    }
    _getBarWidth() {
        const { config, datamodel: { data } } = this;
        if (isEmpty(data))
            return 0;
        if (config.barWidth)
            return min([config.barWidth, config.barMaxWidth]);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const isOrdinal = this.dataScale.bandwidth;
        const domain = (this.dataScale.domain ? this.dataScale.domain() : []);
        const domainLength = isOrdinal ? domain.length : domain[1] - domain[0];
        // If the dataStep property is provided the amount of data elements is calculates as domainLength / dataStep
        //   otherwise we get the number of data elements within the domain range
        // Or if the scale is ordinal we use data.length
        let dataSize = (1 + domainLength / config.dataStep) ||
            (!isOrdinal && data.filter((d, i) => {
                const value = getNumber(d, config.x, i);
                return (value >= domain[0]) && (value <= domain[1]);
            }).length) ||
            data.length;
        // We increase the dataSize by 1 to take into account possible additional domain space
        if (!isOrdinal && dataSize >= 2)
            dataSize += 1;
        const c = dataSize < 2 ? 1 : 1 - config.barPadding;
        const barWidth = c * (this.isVertical() ? this._width : this._height) / dataSize;
        return min([barWidth, config.barMaxWidth]);
    }
    _getVisibleData() {
        const { config, datamodel: { data } } = this;
        const groupWidth = this._getBarWidth();
        const halfGroupWidthPx = data.length < 2 ? 0 : groupWidth / 2;
        const scale = this.dataScale;
        const halfGroupWidth = Math.abs(scale.invert(halfGroupWidthPx) - scale.invert(0));
        const filtered = data === null || data === void 0 ? void 0 : data.filter((d, i) => {
            const v = getNumber(d, config.x, i);
            const domain = scale.domain();
            const domainMin = +domain[0];
            const domainMax = +domain[1];
            return (v >= (domainMin - halfGroupWidth)) && (v <= (domainMax + halfGroupWidth));
        });
        return filtered;
    }
    _getBarPath(d, accessorIndex, isEntering = false) {
        const { config } = this;
        const yAccessors = this.getAccessors();
        const barWidth = this._getBarWidth();
        const isNegative = d._negative;
        const isEnding = d._ending; // The most top bar or, if the value is negative, the most bottom bar
        // Todo: Find a way to pass the datum index to `getNumber` below
        const value = getNumber(d, yAccessors[accessorIndex]);
        const height = isEntering ? 0 : Math.abs(this.valueScale(d._stacked[0]) - this.valueScale(d._stacked[1]));
        const h = !isEntering && config.barMinHeight1Px && (height < 1) && isFinite(value) && (value !== config.barMinHeightZeroValue) ? 1 : height;
        const y = isEntering
            ? this.valueScale(0)
            : this.valueScale(isNegative ? d._stacked[0] : d._stacked[1]) - (height < 1 && config.barMinHeight1Px ? 1 : 0);
        const x = -barWidth / 2;
        const width = barWidth;
        const cornerRadius = config.roundedCorners
            ? isNumber(config.roundedCorners) ? +config.roundedCorners : width / 2
            : 0;
        const cornerRadiusClamped = clamp(cornerRadius, 0, Math.min(height, width) / 2);
        const isNorthDirected = this.yScale.range()[0] > this.yScale.range()[1];
        return roundedRectPath({
            x: this.isVertical() ? x : y - h,
            y: this.isVertical() ? y + (isNorthDirected ? 0 : -h) : x,
            w: this.isVertical() ? width : h,
            h: this.isVertical() ? h : width,
            tl: isEnding && (this.isVertical()
                ? (!isNegative && isNorthDirected) || (isNegative && !isNorthDirected)
                : isNegative),
            tr: isEnding && (this.isVertical()
                ? (!isNegative && isNorthDirected) || (isNegative && !isNorthDirected)
                : !isNegative),
            br: isEnding && (this.isVertical()
                ? (isNegative && isNorthDirected) || (!isNegative && !isNorthDirected)
                : !isNegative),
            bl: isEnding && (this.isVertical()
                ? (isNegative && isNorthDirected) || (!isNegative && !isNorthDirected)
                : isNegative),
            r: cornerRadiusClamped,
        });
    }
    getValueScaleExtent(scaleByVisibleData) {
        const { datamodel } = this;
        const yAccessors = this.getAccessors();
        const data = scaleByVisibleData ? this._getVisibleData() : datamodel.data;
        return getStackedExtent(data, ...yAccessors);
    }
    getDataScaleExtent() {
        const { config, datamodel } = this;
        return getExtent(datamodel.data, config.x);
    }
    getYDataExtent(scaleByVisibleData) {
        return this.isVertical() ? this.getValueScaleExtent(scaleByVisibleData) : this.getDataScaleExtent();
    }
    getXDataExtent() {
        return this.isVertical() ? this.getDataScaleExtent() : this.getValueScaleExtent(false);
    }
}
StackedBar.selectors = style;

export { StackedBar };
//# sourceMappingURL=index.js.map
