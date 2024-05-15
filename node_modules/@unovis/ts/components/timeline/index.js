import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { drag } from 'd3-drag';
import { max } from 'd3-array';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isNumber, unique, arrayOfIndices, getString, getNumber, getMin, getMax } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { getColor } from '../../utils/color.js';
import { trimSVGText } from '../../utils/text.js';
import { TimelineDefaultConfig } from './config.js';
import * as style from './style.js';
import { background, rows, lines, labels, scrollbar, scrollbarBackground, scrollbarHandle, label, row, rowOdd, line } from './style.js';

class Timeline extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = TimelineDefaultConfig;
        this.config = this._defaultConfig;
        this.events = {
            [Timeline.selectors.rows]: {
                wheel: this._onMouseWheel.bind(this),
            },
            [Timeline.selectors.line]: {
                wheel: this._onMouseWheel.bind(this),
            },
        };
        this._scrollBarWidth = 5;
        this._scrollDistance = 0;
        this._scrollBarMargin = 5;
        this._maxScroll = 0;
        this._scrollbarHeight = 0;
        this._labelMargin = 5;
        if (config)
            this.setConfig(config);
        // Invisible background rect to track events
        this._background = this.g.append('rect').attr('class', background);
        // Group for content
        this._rowsGroup = this.g.append('g').attr('class', rows);
        this._linesGroup = this.g.append('g').attr('class', lines);
        this._labelsGroup = this.g.append('g').attr('class', labels);
        this._scrollBarGroup = this.g.append('g').attr('class', scrollbar);
        // Scroll bar
        this._scrollBarBackground = this._scrollBarGroup.append('rect')
            .attr('class', scrollbarBackground);
        this._scrollBarHandle = this._scrollBarGroup.append('rect')
            .attr('class', scrollbarHandle);
        // Set up scrollbar drag event
        const dragBehaviour = drag()
            .on('drag', this._onScrollbarDrag.bind(this));
        this._scrollBarHandle.call(dragBehaviour);
    }
    get bleed() {
        const { config, datamodel: { data } } = this;
        // We calculate the longest label width to set the bleed values accordingly
        let labelsBleed = 0;
        if (config.showLabels) {
            if (config.labelWidth)
                labelsBleed = config.labelWidth + this._labelMargin;
            else {
                const recordLabels = this._getRecordLabels(data);
                const longestLabel = recordLabels.reduce((acc, val) => acc.length > val.length ? acc : val, '');
                const label$1 = this._labelsGroup.append('text')
                    .attr('class', label)
                    .text(longestLabel)
                    .call(trimSVGText, config.maxLabelWidth);
                const labelWidth = label$1.node().getBBox().width;
                this._labelsGroup.empty();
                const tolerance = 1.15; // Some characters are wider than others so we add a little of extra space to take that into account
                labelsBleed = labelWidth ? tolerance * labelWidth + this._labelMargin : 0;
            }
        }
        const maxLineWidth = this._getMaxLineWidth();
        return {
            top: 0,
            bottom: 0,
            left: maxLineWidth / 2 + labelsBleed,
            right: maxLineWidth / 2 + this._scrollBarWidth + this._scrollBarMargin,
        };
    }
    _render(customDuration) {
        super._render(customDuration);
        const { config, datamodel: { data } } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const xRange = this.xScale.range();
        const yRange = this.yScale.range();
        const yStart = Math.min(...yRange);
        const yHeight = Math.abs(yRange[1] - yRange[0]);
        const maxLineWidth = this._getMaxLineWidth();
        const recordLabels = this._getRecordLabels(data);
        const recordLabelsUnique = unique(recordLabels);
        const numUniqueRecords = recordLabelsUnique.length;
        // Ordinal scale to handle records on the same type
        const ordinalScale = scaleOrdinal();
        ordinalScale.range(arrayOfIndices(numUniqueRecords));
        // Invisible Background rect to track events
        this._background
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('opacity', 0);
        // Labels
        const labels = this._labelsGroup.selectAll(`.${label}`)
            .data(config.showLabels ? recordLabelsUnique : []);
        const labelsEnter = labels.enter().append('text')
            .attr('class', label);
        labelsEnter.merge(labels)
            .attr('x', xRange[0] - maxLineWidth / 2 - this._labelMargin)
            .attr('y', (label, i) => yStart + (ordinalScale(label) + 0.5) * config.rowHeight)
            .text(label => label)
            .each((label, i, els) => {
            trimSVGText(select(els[i]), config.labelWidth || config.maxLabelWidth);
        });
        labels.exit().remove();
        // Row background rects
        const xStart = xRange[0];
        const numRows = Math.max(Math.floor(yHeight / config.rowHeight), numUniqueRecords);
        const recordTypes = Array(numRows).fill(null).map((_, i) => recordLabelsUnique[i]);
        const rects = this._rowsGroup.selectAll(`.${row}`)
            .data(recordTypes);
        const rectsEnter = rects.enter().append('rect')
            .attr('class', row);
        rectsEnter.merge(rects)
            .classed(rowOdd, config.alternatingRowColors ? (_, i) => !(i % 2) : null)
            .attr('x', xStart - maxLineWidth / 2)
            .attr('width', xRange[1] - xStart + maxLineWidth)
            .attr('y', (_, i) => yStart + i * config.rowHeight)
            .attr('height', config.rowHeight);
        rects.exit().remove();
        // Lines
        const lines = this._linesGroup.selectAll(`.${line}`)
            .data(data, (d, i) => {
            var _a;
            return (_a = getString(d, config.id, i)) !== null && _a !== void 0 ? _a : [
                this._getRecordType(d, i), getNumber(d, config.x, i),
            ].join('-');
        });
        const linesEnter = lines.enter().append('rect')
            .attr('class', line)
            .classed(rowOdd, config.alternatingRowColors
            ? (d, i) => !(recordLabelsUnique.indexOf(this._getRecordType(d, i)) % 2)
            : null)
            .style('fill', (d, i) => getColor(d, config.color, ordinalScale(this._getRecordType(d, i))))
            .call(this._positionLines.bind(this), ordinalScale)
            .attr('transform', 'translate(0, 10)')
            .style('opacity', 0);
        const linesMerged = linesEnter.merge(lines)
            .style('fill', (d, i) => getColor(d, config.color, ordinalScale(this._getRecordType(d, i))))
            .style('cursor', (d, i) => getString(d, config.cursor, i))
            .call(this._positionLines.bind(this), ordinalScale);
        smartTransition(linesMerged, duration)
            .attr('transform', 'translate(0, 0)')
            .style('opacity', 1);
        smartTransition(lines.exit(), duration)
            .style('opacity', 0)
            .remove();
        // Scroll Bar
        const contentBBox = this._rowsGroup.node().getBBox(); // We determine content size using the rects group because lines are animated
        const absoluteContentHeight = contentBBox.height;
        this._scrollbarHeight = yHeight * yHeight / absoluteContentHeight || 0;
        this._maxScroll = Math.max(absoluteContentHeight - yHeight, 0);
        this._scrollBarGroup
            .attr('transform', `translate(${this._width - this._scrollBarWidth}, ${yStart})`)
            .attr('opacity', this._maxScroll ? 1 : 0);
        this._scrollBarBackground
            .attr('width', this._scrollBarWidth)
            .attr('height', this._height)
            .attr('rx', this._scrollBarWidth / 2)
            .attr('ry', this._scrollBarWidth / 2);
        this._scrollBarHandle
            .attr('width', this._scrollBarWidth)
            .attr('height', this._scrollbarHeight)
            .attr('rx', this._scrollBarWidth / 2)
            .attr('ry', this._scrollBarWidth / 2);
        this._updateScrollPosition(0);
    }
    _positionLines(selection, ordinalScale) {
        const { config, xScale, yScale } = this;
        const yRange = yScale.range();
        const yStart = Math.min(...yRange);
        selection.each((d, i, elements) => {
            var _a;
            const x = getNumber(d, config.x, i);
            const y = ordinalScale(this._getRecordType(d, i)) * config.rowHeight;
            const length = (_a = getNumber(d, config.length, i)) !== null && _a !== void 0 ? _a : 0;
            // Rect dimensions
            const height = getNumber(d, config.lineWidth, i);
            const width = xScale(x + length) - xScale(x);
            if (width < 0) {
                console.warn('Unovis | Timeline: Line segments should not have negative lengths. Setting to 0.');
            }
            select(elements[i])
                .attr('x', xScale(x))
                .attr('y', yStart + y + (config.rowHeight - height) / 2)
                .attr('width', config.showEmptySegments
                ? Math.max(config.lineCap ? height : 1, width)
                : Math.max(0, width))
                .attr('height', height)
                .attr('rx', config.lineCap ? height / 2 : null);
        });
    }
    _onScrollbarDrag(event) {
        const yRange = this.yScale.range();
        const yHeight = Math.abs(yRange[1] - yRange[0]);
        this._updateScrollPosition(event.dy * this._maxScroll / (yHeight - this._scrollbarHeight));
    }
    _onMouseWheel(d, event) {
        var _a;
        const { config } = this;
        this._updateScrollPosition(event === null || event === void 0 ? void 0 : event.deltaY);
        if (this._scrollDistance > 0 && this._scrollDistance < this._maxScroll)
            event === null || event === void 0 ? void 0 : event.preventDefault();
        (_a = config.onScroll) === null || _a === void 0 ? void 0 : _a.call(config, this._scrollDistance);
        // Programmatically trigger a mousemove event to update Tooltip or Crosshair if they were set up
        const e = new Event('mousemove');
        this.element.dispatchEvent(e);
    }
    _updateScrollPosition(diff) {
        const yRange = this.yScale.range();
        const yHeight = Math.abs(yRange[1] - yRange[0]);
        this._scrollDistance += diff;
        this._scrollDistance = Math.max(0, this._scrollDistance);
        this._scrollDistance = Math.min(this._maxScroll, this._scrollDistance);
        this._linesGroup.attr('transform', `translate(0,${-this._scrollDistance})`);
        this._rowsGroup.attr('transform', `translate(0,${-this._scrollDistance})`);
        this._labelsGroup.attr('transform', `translate(0,${-this._scrollDistance})`);
        const scrollBarPosition = (this._scrollDistance / this._maxScroll * (yHeight - this._scrollbarHeight)) || 0;
        this._scrollBarHandle.attr('y', scrollBarPosition);
    }
    _getMaxLineWidth() {
        var _a;
        const { config, datamodel: { data } } = this;
        return (_a = max(data, (d, i) => getNumber(d, config.lineWidth, i))) !== null && _a !== void 0 ? _a : 0;
    }
    _getRecordType(d, i) {
        return getString(d, this.config.type) || `__${i}`;
    }
    _getRecordLabels(data) {
        return data.map((d, i) => getString(d, this.config.type) || `${i + 1}`);
    }
    // Override the default XYComponent getXDataExtent method to take into account line lengths
    getXDataExtent() {
        const { config, datamodel } = this;
        const min = getMin(datamodel.data, config.x);
        const max = getMax(datamodel.data, (d, i) => { var _a; return getNumber(d, config.x, i) + ((_a = getNumber(d, config.length, i)) !== null && _a !== void 0 ? _a : 0); });
        return [min, max];
    }
}
Timeline.selectors = style;

export { Timeline };
//# sourceMappingURL=index.js.map
