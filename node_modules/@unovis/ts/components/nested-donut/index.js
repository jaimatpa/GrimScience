import { arc, pie } from 'd3-shape';
import { hierarchy, partition } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';
import { group } from 'd3-array';
import { ComponentCore } from '../../core/component/index.js';
import { SeriesDataModel } from '../../data-models/series.js';
import { VerticalAlign } from '../../types/text.js';
import { getColor } from '../../utils/color.js';
import { smartTransition } from '../../utils/d3.js';
import { isNumber, getString, getNumber, isNumberWithinRange, merge, getValue } from '../../utils/data.js';
import { getPixelValue } from '../../utils/misc.js';
import { cssvar } from '../../utils/style.js';
import { wrapSVGText } from '../../utils/text.js';
import { NestedDonutSegmentLabelAlignment, NestedDonutDirection } from './types.js';
import { NestedDonutDefaultConfig } from './config.js';
import { createArc, updateArc, removeArc } from './modules/arc.js';
import { createLabel, updateLabel, removeLabel } from './modules/label.js';
import * as style from './style.js';
import { segmentsGroup, centralLabel, centralSubLabel, background, segment, segmentExit, segmentArc, segmentLabel, variables } from './style.js';

class NestedDonut extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = NestedDonutDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new SeriesDataModel();
        this.arcGen = arc();
        this.colorScale = scaleLinear();
        this.events = {};
        if (config)
            this.setConfig(config);
        this.arcBackground = this.g.append('g');
        this.arcGroup = this.g.append('g')
            .attr('class', segmentsGroup);
        this.centralLabel = this.g.append('text')
            .attr('class', centralLabel);
        this.centralSubLabel = this.g.append('text')
            .attr('class', centralSubLabel);
    }
    _render(customDuration) {
        var _a, _b;
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        if (config.layers === undefined || config.layers.length === 0) {
            console.warn('Unovis | Nested Donut: No layers defined.');
            return;
        }
        const layers = this._getLayerSettings();
        const data = this._getHierarchyData(layers);
        this.arcGen
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1)
            .cornerRadius(config.cornerRadius);
        this.arcGroup.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.arcBackground.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.centralLabel.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.centralSubLabel.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        // Layer backgrounds
        const backgrounds = this.arcBackground
            .selectAll(`.${background}`)
            .data(layers, d => d._id);
        const backgroundsEnter = backgrounds.enter().append('path')
            .attr('class', background)
            .attr('visibility', config.showBackground ? null : 'hidden');
        const backgroundsMerged = backgrounds.merge(backgroundsEnter)
            .style('transition', `fill ${duration}ms`)
            .style('fill', d => d.backgroundColor);
        smartTransition(backgroundsMerged, duration)
            .attr('d', d => {
            var _a, _b, _c, _d;
            return this.arcGen({
                x0: (_b = (_a = config.angleRange) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0,
                x1: (_d = (_c = config.angleRange) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 2 * Math.PI,
                y0: d._innerRadius,
                y1: d._outerRadius,
            });
        });
        smartTransition(backgrounds.exit(), duration)
            .style('opacity', 0)
            .remove();
        // Segments
        const segments = this.arcGroup.selectAll(`${segment}`)
            .data(data, d => d._id);
        const segmentsEnter = segments.enter()
            .append('g')
            .attr('class', segment);
        segments.merge(segmentsEnter);
        smartTransition(segments.exit(), duration)
            .attr('class', segmentExit)
            .style('opacity', 0)
            .remove();
        // Segment arcs
        const arcs = this.arcGroup
            .selectAll(`.${segmentArc}`)
            .data(data, d => d._id);
        const arcsEnter = segmentsEnter.append('path')
            .attr('class', segmentArc)
            .call(createArc, config);
        arcs.merge(arcsEnter)
            .call(updateArc, config, this.arcGen, duration);
        arcs.exit()
            .attr('class', segmentExit)
            .call(removeArc, duration);
        // Segment labels
        if (config.showSegmentLabels) {
            const labels = this.arcGroup
                .selectAll(`.${segmentLabel}`)
                .data(data, d => d._id);
            const labelsEnter = segmentsEnter.append('text')
                .attr('class', segmentLabel)
                .call(createLabel, this.arcGen);
            labels.merge(labelsEnter)
                .call(updateLabel, config, this.arcGen, duration);
            labels.exit()
                .call(removeLabel, duration);
        }
        // Chart labels
        this.centralLabel
            .attr('dy', config.centralSubLabel ? '-0.55em' : null)
            .text((_a = config.centralLabel) !== null && _a !== void 0 ? _a : null);
        this.centralSubLabel
            .attr('dy', config.centralLabel ? '0.55em' : null)
            .text((_b = config.centralSubLabel) !== null && _b !== void 0 ? _b : null);
        if (config.centralSubLabelWrap)
            wrapSVGText(this.centralSubLabel, layers[0]._innerRadius * 1.9, VerticalAlign.Top);
    }
    _getHierarchyData(layers) {
        var _a;
        const { config, datamodel: { data } } = this;
        const layerAccessors = (_a = config.layers) === null || _a === void 0 ? void 0 : _a.map(layerAccessor => (i) => getString(data[i], layerAccessor, i));
        const nestedData = group(data.keys(), ...layerAccessors);
        const rootNode = config.value !== undefined
            ? hierarchy(nestedData).sum(index => typeof index === 'number' && getNumber(data[index], config.value, index))
            : hierarchy(nestedData).count();
        const partitionData = partition().size([config.angleRange[1], 1])(rootNode);
        partitionData
            .each(node => {
            var _a, _b, _c;
            // Starting with the root, we transform the original data returned from d3.hierarchy
            const n = node;
            node.data = {
                key: n.data[0],
                values: Array.isArray(n.data[1]) ? n.data[1].map(i => data[i]) : [],
                root: (_c = (_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : n.data[0],
            };
            node._id = `root${partitionData.path(node).map(d => d.data.key).join('->')}`;
            if (isNumberWithinRange(node.depth - 1, [0, layers.length - 1])) {
                node._layer = layers[node.depth - 1];
                node.y0 = node._layer._innerRadius;
                node.y1 = node._layer._outerRadius;
            }
        })
            .eachBefore((node) => {
            var _a, _b, _c, _d;
            // Once ancestors have been visited, children properties that are
            // dependent on the parent's data are populated here
            if (!node.children || node.depth === rootNode.height - 1)
                return;
            const positions = pie()
                .startAngle(node.parent ? node.x0 : (_a = config.angleRange) === null || _a === void 0 ? void 0 : _a[0])
                .endAngle(node.parent ? node.x1 : (_b = config.angleRange) === null || _b === void 0 ? void 0 : _b[1])
                .value(d => config.showEmptySegments && d.value === 0
                ? config.emptySegmentAngle
                : (d.x1 - d.x0))
                .sort(config.sort)(node.children);
            const opacity = scaleLinear()
                .domain([-1, node.children.length])
                .range([(_d = (_c = node._state) === null || _c === void 0 ? void 0 : _c.fillOpacity) !== null && _d !== void 0 ? _d : 1, 0]);
            node.children.forEach((child, i) => {
                child._index = i;
                child.x0 = positions[i].startAngle;
                child.x1 = positions[i].endAngle;
                // Default to parent's fill if segmentColor accessor is not provided
                const color = getColor(child, config.segmentColor, positions[i].index, child.depth !== 1);
                child._state = {
                    fill: color !== null && color !== void 0 ? color : node._state.fill,
                    fillOpacity: color === null ? opacity(positions[i].index) : null,
                };
            });
        })
            .eachAfter(node => {
            var _a;
            // Once hierarchy has been traversed, we append children data the parent
            // parent.data serves as a reference to all the original data it represents
            (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(ch => node.data.values.push(...ch.data.values));
        });
        const segments = partitionData.descendants().filter(d => { var _a; return ((_a = d.parent) === null || _a === void 0 ? void 0 : _a.value) && d.data.key; });
        return segments;
    }
    _getLayerSettings() {
        const { direction, layers, layerPadding, layerSettings } = this.config;
        const outerRadius = Math.min(this._width, this._height) / 2;
        const defaultLayerSettings = {
            backgroundColor: cssvar(variables.nestedDonutBackgroundColor),
            labelAlignment: NestedDonutSegmentLabelAlignment.Perpendicular,
            width: outerRadius * 0.75 / layers.length,
        };
        const layerItems = layers.reduceRight((arr, _, i) => {
            const layerId = direction === NestedDonutDirection.Outwards ? i : arr.length;
            const layerConfig = merge(defaultLayerSettings, getValue(layerId, layerSettings));
            const radius = arr.length ? arr[0]._innerRadius - layerPadding : outerRadius;
            const layerWidth = getPixelValue(layerConfig.width);
            if (layerWidth === null) {
                console.warn(`Unovis | Nested Donut: Could not parse width ${layerConfig.width}. Setting to default.`);
            }
            arr.unshift(Object.assign(Object.assign({}, layerConfig), { _id: layerId, _outerRadius: radius, _innerRadius: radius - (layerWidth !== null && layerWidth !== void 0 ? layerWidth : defaultLayerSettings.width) }));
            return arr;
        }, new Array());
        return direction === NestedDonutDirection.Inwards ? layerItems.reverse() : layerItems;
    }
}
NestedDonut.selectors = style;
NestedDonut.cssVariables = variables;

export { NestedDonut };
//# sourceMappingURL=index.js.map
