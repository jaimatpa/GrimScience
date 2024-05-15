import { max } from 'd3-array';
import { partition } from 'd3-hierarchy';
import { scalePow } from 'd3-scale';
import { arc } from 'd3-shape';
import { ComponentCore } from '../../core/component/index.js';
import { GraphDataModel } from '../../data-models/graph.js';
import { getValue, getString, getNumber, isNumber } from '../../utils/data.js';
import { estimateStringPixelLength } from '../../utils/text.js';
import { getCSSVariableValueInPixels } from '../../utils/misc.js';
import { ChordLabelAlignment } from './types.js';
import { ChordDiagramDefaultConfig } from './config.js';
import { createNode, updateNode, removeNode } from './modules/node.js';
import { LABEL_PADDING, createLabel, updateLabel, removeLabel } from './modules/label.js';
import { getHierarchyNodes, positionChildren, getRibbons } from './modules/layout.js';
import { createLink, updateLink, removeLink } from './modules/link.js';
import * as style from './style.js';
import { background, links, nodes, labels, transparent, link, highlightedLink, node, highlightedNode, label, labelExit } from './style.js';

class ChordDiagram extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = ChordDiagramDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new GraphDataModel();
        this.arcGen = arc();
        this.radiusScale = scalePow();
        this.events = {
            [ChordDiagram.selectors.node]: {
                mouseover: this._onNodeMouseOver.bind(this),
                mouseout: this._onNodeMouseOut.bind(this),
            },
            [ChordDiagram.selectors.link]: {
                mouseover: this._onLinkMouseOver.bind(this),
                mouseout: this._onLinkMouseOut.bind(this),
            },
            [ChordDiagram.selectors.label]: {
                mouseover: this._onNodeMouseOver.bind(this),
                mouseout: this._onNodeMouseOut.bind(this),
            },
        };
        this._nodes = [];
        this._links = [];
        if (config)
            this.setConfig(config);
        this.background = this.g.append('rect').attr('class', background);
        this.linkGroup = this.g.append('g').attr('class', links);
        this.nodeGroup = this.g.append('g').attr('class', nodes);
        this.labelGroup = this.g.append('g').attr('class', labels);
    }
    get _forceHighlight() {
        var _a;
        return this.config.highlightedNodeId !== undefined || ((_a = this.config.highlightedLinkIds) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    get bleed() {
        const { config } = this;
        const padding = LABEL_PADDING * 2;
        let top = 0;
        let bottom = 0;
        let right = 0;
        let left = 0;
        this._nodes.forEach(n => {
            var _a;
            const nodeLabelAlignment = getValue(n.data, config.nodeLabelAlignment);
            if (n.height === 0 && nodeLabelAlignment === ChordLabelAlignment.Perpendicular) {
                const label = (_a = getString(n.data, config.nodeLabel)) !== null && _a !== void 0 ? _a : '';
                const fontSize = getCSSVariableValueInPixels('var(--vis-chord-diagram-label-text-font-size)', this.element);
                const labelWidth = estimateStringPixelLength(label, fontSize);
                const [x, y] = this.arcGen.centroid(n);
                if (x < 0)
                    left = Math.max(left, labelWidth);
                else
                    right = Math.max(right, labelWidth);
                if (y < 0)
                    top = Math.max(top, labelWidth);
                else
                    bottom = Math.max(bottom, labelWidth);
            }
        });
        left += padding;
        right += padding;
        bottom += padding;
        top += padding;
        return { top, bottom, left, right };
    }
    setSize(width, height, containerWidth, containerHeight) {
        super.setSize(width, height, containerWidth, containerHeight);
        // Setting radius for initial bleed calculation. This ensures the correct radius is set when render is called
        this.radiusScale
            .exponent(this.config.radiusScaleExponent)
            .range([0, Math.min(width, height) / 2]);
    }
    setData(data) {
        super.setData(data);
        this._layoutData();
    }
    _layoutData() {
        const { nodes, links } = this.datamodel;
        const { padAngle, linkValue, nodeLevels } = this.config;
        nodes.forEach(n => { delete n._state.value; });
        links.forEach(l => {
            delete l._state.points;
            l._state.value = getNumber(l, linkValue);
            l.source._state.value = (l.source._state.value || 0) + getNumber(l, linkValue);
            l.target._state.value = (l.target._state.value || 0) + getNumber(l, linkValue);
        });
        const root = getHierarchyNodes(nodes, d => { var _a; return (_a = d._state) === null || _a === void 0 ? void 0 : _a.value; }, nodeLevels);
        const partitionData = partition().size([this.config.angleRange[1], 1])(root);
        partitionData.each((n, i) => {
            positionChildren(n, padAngle);
            n.uid = `${this.uid.substr(0, 4)}-${i}`;
            n.x0 = Number.isNaN(n.x0) ? 0 : n.x0;
            n.x1 = Number.isNaN(n.x1) ? 0 : n.x1;
            n._state = {};
        });
        const partitionDataWithRoot = partitionData.descendants();
        this._rootNode = partitionDataWithRoot.find(d => d.depth === 0);
        this._nodes = partitionDataWithRoot.filter(d => d.depth !== 0); // Filter out the root node
        this._links = getRibbons(partitionData, links, padAngle);
    }
    _render(customDuration) {
        var _a;
        super._render(customDuration);
        const { config, bleed } = this;
        this._layoutData();
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const size = Math.min(this._width, this._height);
        const radius = size / 2 - max([bleed.top, bleed.bottom, bleed.left, bleed.right]);
        const numLevels = 1 + ((_a = config.nodeLevels) === null || _a === void 0 ? void 0 : _a.length);
        const maxSpace = config.nodeWidth * numLevels;
        const nodeWidth = radius > maxSpace ? config.nodeWidth : Math.max(radius / numLevels, 0);
        this.radiusScale.range([0, Math.max(radius, 0)]);
        this.arcGen
            .startAngle(d => d.x0 + config.padAngle / 2 - (d.value ? 0 : Math.PI / 360))
            .endAngle(d => d.x1 - config.padAngle / 2 + (d.value ? 0 : Math.PI / 360))
            .cornerRadius(d => getNumber(d.data, config.cornerRadius))
            .innerRadius(d => Math.max(this.radiusScale(d.y1) - nodeWidth, 0))
            .outerRadius(d => this.radiusScale(d.y1));
        this.g.classed(transparent, this._forceHighlight);
        this.background
            .attr('width', this._width)
            .attr('height', this._height)
            .style('opacity', 0);
        // Center the view
        this.nodeGroup.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.labelGroup.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        this.linkGroup.attr('transform', `translate(${this._width / 2},${this._height / 2})`);
        // Links
        const linksSelection = this.linkGroup
            .selectAll(`.${link}`)
            .data(this._links, d => String(d.data._id));
        const linksEnter = linksSelection.enter().append('path')
            .attr('class', link)
            .call(createLink, this.radiusScale);
        const linksMerged = linksSelection
            .merge(linksEnter)
            .classed(highlightedLink, l => {
            var _a, _b;
            const linkId = (_a = l.data.id) !== null && _a !== void 0 ? _a : l.data._indexGlobal;
            return (_b = config.highlightedLinkIds) === null || _b === void 0 ? void 0 : _b.includes(linkId);
        });
        linksMerged.call(updateLink, config, this.radiusScale, duration);
        linksSelection.exit()
            .call(removeLink, duration);
        // Nodes
        const nodesSelection = this.nodeGroup
            .selectAll(`.${node}`)
            .data(this._nodes, d => String(d.uid));
        const nodesEnter = nodesSelection.enter().append('path')
            .attr('class', node)
            .call(createNode, config);
        const nodesMerged = nodesSelection
            .merge(nodesEnter)
            .classed(highlightedNode, d => config.highlightedNodeId === d.data._id);
        nodesMerged.call(updateNode, config, this.arcGen, duration, this.bleed);
        nodesSelection.exit()
            .call(removeNode, duration);
        // Labels
        const labelWidth = size - radius;
        const labels = this.labelGroup
            .selectAll(`.${label}`)
            .data(this._nodes, d => String(d.uid));
        const labelEnter = labels.enter().append('g')
            .attr('class', label)
            .call(createLabel, config, this.radiusScale);
        const labelsMerged = labels.merge(labelEnter);
        labelsMerged.call(updateLabel, config, labelWidth, this.radiusScale, duration);
        labels.exit()
            .attr('class', labelExit)
            .call(removeLabel, duration);
    }
    _onNodeMouseOver(d) {
        let ribbons;
        if (d.children) {
            const leaves = d.leaves();
            ribbons = this._links.filter(l => leaves.find(leaf => l.source.data.id === leaf.data.id || l.target.data.id === leaf.data.id));
        }
        else {
            const leaf = d;
            ribbons = this._links.filter(l => l.source.data.id === leaf.data.id || l.target.data.id === leaf.data.id);
        }
        // Nodes without links should still be highlighted
        if (!ribbons.length)
            d._state.hovered = true;
        this._highlightOnHover(ribbons);
    }
    _onNodeMouseOut() {
        this._highlightOnHover();
    }
    _onLinkMouseOver(d) {
        this._highlightOnHover([d]);
    }
    _onLinkMouseOut() {
        this._highlightOnHover();
    }
    _highlightOnHover(links) {
        if (this._forceHighlight)
            return;
        if (links) {
            links.forEach(l => {
                l._state.hovered = true;
                const sourcePath = l.source.path(this._rootNode);
                const targetPath = l.target.path(this._rootNode);
                sourcePath.forEach(n => { if (n.depth)
                    n._state.hovered = true; });
                targetPath.forEach(n => { if (n.depth)
                    n._state.hovered = true; });
            });
        }
        else {
            this._nodes.forEach(n => { delete n._state.hovered; });
            this._links.forEach(l => { delete l._state.hovered; });
        }
        this.nodeGroup.selectAll(`.${node}`)
            .classed(highlightedNode, d => d._state.hovered);
        this.linkGroup.selectAll(`.${link}`)
            .classed(highlightedLink, d => d._state.hovered);
        this.g.classed(transparent, !!links);
    }
}
ChordDiagram.selectors = style;

export { ChordDiagram };
//# sourceMappingURL=index.js.map
