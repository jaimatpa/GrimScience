import { scaleBand } from 'd3-scale';
import { min, max, range } from 'd3-array';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isArray, getNumber, isNumber, getString, clamp, isEmpty, getMin, getMax, getExtent } from '../../utils/data.js';
import { roundedRectPath } from '../../utils/path.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor } from '../../utils/color.js';
import { Direction } from '../../types/direction.js';
import { Orientation } from '../../types/position.js';
import { GroupedBarDefaultConfig } from './config.js';
import * as style from './style.js';
import { barGroup, barGroupExit, bar } from './style.js';

class GroupedBar extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = GroupedBarDefaultConfig;
        this.config = this._defaultConfig;
        this.getAccessors = () => isArray(this.config.y) ? this.config.y : [this.config.y];
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
        const halfGroupWidth = this._getGroupWidth() / 2;
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
        const duration = isNumber(customDuration)
            ? customDuration
            : config.duration;
        const groupWidth = this._getGroupWidth();
        const yAccessors = this.getAccessors();
        const innerBandScaleRange = [-groupWidth / 2, groupWidth / 2];
        const innerBandScale = scaleBand()
            .domain(range(yAccessors.length))
            .range(innerBandScaleRange)
            .paddingInner(config.barPadding)
            .paddingOuter(config.barPadding);
        const barGroups = this.g
            .selectAll(`.${barGroup}`)
            .data(this._barData, (d, i) => { var _a; return `${(_a = getString(d, config.id, i)) !== null && _a !== void 0 ? _a : i}`; });
        const getBarGroupsTransform = (d, i) => {
            const v = this.dataScale(getNumber(d, config.x, i));
            const x = this.isVertical() ? v : 0;
            const y = this.isVertical() ? 0 : v;
            return `translate(${x},${y})`;
        };
        const barGroupsEnter = barGroups
            .enter()
            .append('g')
            .attr('class', barGroup)
            .attr('transform', getBarGroupsTransform)
            .style('opacity', 1);
        const barGroupsMerged = barGroupsEnter.merge(barGroups);
        smartTransition(barGroupsMerged, duration)
            .attr('transform', getBarGroupsTransform)
            .style('opacity', 1);
        const barGroupExit$1 = barGroups.exit().attr('class', barGroupExit);
        smartTransition(barGroupExit$1, duration).style('opacity', 0).remove();
        // Animate exiting bars going down
        smartTransition(barGroupExit$1.selectAll(`.${bar}`), duration)
            .attr('transform', (d, i, e) => {
            return this.isVertical()
                ? `translate(0,${this.yScale(0)}) scale(1,0)`
                : `translate(${this.xScale(0)},0) scale(0,1)`;
        });
        const barWidth = innerBandScale.bandwidth();
        const bars = barGroupsMerged
            .selectAll(`.${bar}`)
            .data((d) => yAccessors.map(() => d));
        const valueAxisDirection = this._getValueAxisDirection();
        const barsEnter = bars
            .enter()
            .append('path')
            .attr('class', bar)
            .attr('d', (d, i) => {
            const x = innerBandScale(i);
            const y = this.valueScale(0);
            const width = barWidth;
            const height = 0;
            return this._getBarPath(x, y, width, height, false, valueAxisDirection);
        })
            .style('fill', (d, i) => getColor(d, config.color, i));
        const barsMerged = barsEnter.merge(bars);
        smartTransition(barsMerged, duration)
            .attr('d', (d, j) => {
            const x = innerBandScale(j);
            const width = barWidth;
            // Todo: Find a way to pass the datum index to `getNumber` below
            const value = getNumber(d, yAccessors[j]);
            const isNegative = value < 0;
            let y = isNegative ? this.valueScale(0) : this.valueScale(value || 0);
            let height = Math.abs(this.valueScale(0) - this.valueScale(value)) || 0;
            // Optionally set minimum bar height
            if (height < config.barMinHeight) {
                const dir = valueAxisDirection === Direction.North ? -1 : 1;
                y = this.valueScale(0) + dir * config.barMinHeight;
                height = config.barMinHeight;
            }
            return this._getBarPath(x, y, width, height, isNegative, valueAxisDirection);
        })
            .style('fill', (d, i) => getColor(d, config.color, i))
            .style('cursor', (d, i) => getString(d, config.cursor, i));
        smartTransition(bars.exit(), duration).remove();
    }
    _getValueAxisDirection() {
        return this.valueScale.range()[0] > this.valueScale.range()[1]
            ? Direction.North
            : Direction.South;
    }
    _getVisibleData() {
        const { config, datamodel: { data }, } = this;
        const groupWidth = this._getGroupWidth();
        const halfGroupWidth = data.length < 2 ? 0 : groupWidth / 2;
        const dataScale = this.dataScale;
        const xHalfGroupWidth = Math.abs(dataScale.invert(halfGroupWidth) -
            dataScale.invert(0));
        const filtered = data === null || data === void 0 ? void 0 : data.filter((d, i) => {
            const v = getNumber(d, config.x, i);
            const domain = dataScale.domain();
            const domainMin = +domain[0];
            const domainMax = +domain[1];
            return (v >= domainMin - xHalfGroupWidth && v <= domainMax + xHalfGroupWidth);
        });
        return filtered;
    }
    _getBarPath(x, y, width, height, isNegative, direction) {
        const { config } = this;
        const cornerRadius = config.roundedCorners
            ? isNumber(config.roundedCorners)
                ? +config.roundedCorners
                : width / 2
            : 0;
        const cornerRadiusClamped = clamp(cornerRadius, 0, Math.min(height, width) / 2);
        const isNorthDirected = direction === Direction.North;
        const roundedTop = this.isVertical() && isNegative !== isNorthDirected;
        const roundedBottom = this.isVertical() && isNegative === isNorthDirected;
        const roundedLeft = !this.isVertical() && isNegative;
        const roundedRight = !this.isVertical() && !isNegative;
        return roundedRectPath({
            x: this.isVertical() ? x : y + (isNorthDirected ? 0 : -height),
            y: this.isVertical() ? y + (isNorthDirected ? 0 : -height) : x,
            w: this.isVertical() ? width : height,
            h: this.isVertical() ? height : width,
            tl: roundedTop || roundedLeft,
            tr: roundedTop || roundedRight,
            bl: roundedBottom || roundedLeft,
            br: roundedBottom || roundedRight,
            r: cornerRadiusClamped,
        });
    }
    _getGroupWidth() {
        const { config, datamodel: { data }, } = this;
        if (isEmpty(data))
            return 0;
        if (config.groupWidth) {
            return min([config.groupWidth, config.groupMaxWidth]);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const isOrdinal = this.dataScale.bandwidth;
        const domain = (this.dataScale.domain ? this.dataScale.domain() : []);
        const domainLength = isOrdinal ? domain.length : domain[1] - domain[0];
        // If the dataStep property is provided the amount of data elements is calculates as domainLength / dataStep
        //   otherwise we get the number of data elements within the domain range
        // Or if the scale is ordinal we use data.length
        let dataSize = 1 + domainLength / config.dataStep ||
            (!isOrdinal &&
                data.filter((d, i) => {
                    const value = getNumber(d, config.x, i);
                    return value >= domain[0] && value <= domain[1];
                }).length) ||
            data.length;
        // We increase the dataSize by 1 to take into account possible additional domain space
        if (!isOrdinal && dataSize >= 2)
            dataSize += 1;
        const c = dataSize < 2 ? 1 : 1 - config.groupPadding;
        const groupWidth = (c * (this.isVertical() ? this._width : this._height)) / dataSize;
        return min([groupWidth, config.groupMaxWidth]);
    }
    getValueScaleExtent(scaleByVisibleData) {
        const { datamodel } = this;
        const yAccessors = this.getAccessors();
        const data = scaleByVisibleData ? this._getVisibleData() : datamodel.data;
        const min = getMin(data, ...yAccessors);
        const max = getMax(data, ...yAccessors);
        return [min > 0 ? 0 : min, max < 0 ? 0 : max];
    }
    getDataScaleExtent() {
        const { config, datamodel } = this;
        return getExtent(datamodel.data, config.x);
    }
    getYDataExtent(scaleByVisibleData) {
        return this.isVertical()
            ? this.getValueScaleExtent(scaleByVisibleData)
            : this.getDataScaleExtent();
    }
    getXDataExtent() {
        return this.isVertical()
            ? this.getDataScaleExtent()
            : this.getValueScaleExtent(false);
    }
}
GroupedBar.selectors = style;

export { GroupedBar };
//# sourceMappingURL=index.js.map
