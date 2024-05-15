import { select } from 'd3-selection';
import { sankey } from 'd3-sankey';
import { max, extent, sum } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { ComponentCore } from '../../core/component/index.js';
import { GraphDataModel } from '../../data-models/graph.js';
import { Sizing } from '../../types/component.js';
import { Position } from '../../types/position.js';
import { VerticalAlign } from '../../types/text.js';
import { smartTransition } from '../../utils/d3.js';
import { getString, isNumber, getNumber, groupBy } from '../../utils/data.js';
import { getCSSVariableValueInPixels } from '../../utils/misc.js';
import { SankeyDefaultConfig } from './config.js';
import * as style from './style.js';
import { background, links, nodes, link, nodeGroup, nodeExit } from './style.js';
import { SankeyLayout } from './types.js';
import { removeLinks, createLinks, updateLinks } from './modules/link.js';
import { removeNodes, createNodes, updateNodes, onNodeMouseOver, onNodeMouseOut } from './modules/node.js';
import { requiredLabelSpace, getLabelOrientation } from './modules/label.js';

class Sankey extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = SankeyDefaultConfig;
        this.config = this._defaultConfig;
        this.datamodel = new GraphDataModel();
        this._extendedWidth = undefined;
        this._extendedHeight = undefined;
        this._extendedHeightIncreased = undefined;
        this._sankey = sankey();
        this._highlightTimeoutId = null;
        this._highlightActive = false;
        this.events = {
            [Sankey.selectors.nodeGroup]: {
                mouseenter: this._onNodeMouseOver.bind(this),
                mouseleave: this._onNodeMouseOut.bind(this),
            },
            [Sankey.selectors.node]: {
                mouseenter: this._onNodeRectMouseOver.bind(this),
                mouseleave: this._onNodeRectMouseOut.bind(this),
            },
            [Sankey.selectors.link]: {
                mouseenter: this._onLinkMouseOver.bind(this),
                mouseleave: this._onLinkMouseOut.bind(this),
            },
        };
        if (config)
            this.setConfig(config);
        this._backgroundRect = this.g.append('rect').attr('class', background);
        this._linksGroup = this.g.append('g').attr('class', links);
        this._nodesGroup = this.g.append('g').attr('class', nodes);
    }
    get bleed() {
        var _a;
        const { config, datamodel: { nodes, links } } = this;
        const labelFontSize = (_a = config.labelFontSize) !== null && _a !== void 0 ? _a : getCSSVariableValueInPixels('var(--vis-sankey-label-font-size)', this.element);
        const labelSize = requiredLabelSpace(config.labelMaxWidth, labelFontSize);
        let left = 0;
        let right = 0;
        // We pre-calculate sankey layout to get information about node labels placement and calculate bleed properly
        // Potentially it can be a performance bottleneck for large layouts, but generally rendering of such layouts is much more computationally heavy
        if (nodes.length) {
            const sankeyProbeSize = 1000;
            this._populateLinkAndNodeValues();
            this._sankey.size([sankeyProbeSize, sankeyProbeSize]);
            this._sankey({ nodes, links });
            const maxDepth = max(nodes, d => d.depth);
            const zeroDepthNodes = nodes.filter(d => d.depth === 0);
            const maxDepthNodes = nodes.filter(d => d.depth === maxDepth);
            left = zeroDepthNodes.some(d => getLabelOrientation(d, sankeyProbeSize, config.labelPosition) === Position.Left) ? labelSize.width : 0;
            right = maxDepthNodes.some(d => getLabelOrientation(d, sankeyProbeSize, config.labelPosition) === Position.Right) ? labelSize.width : 0;
        }
        const top = config.labelVerticalAlign === VerticalAlign.Top ? 0
            : config.labelVerticalAlign === VerticalAlign.Bottom ? labelSize.height
                : labelSize.height / 2;
        const bottom = config.labelVerticalAlign === VerticalAlign.Top ? labelSize.height
            : config.labelVerticalAlign === VerticalAlign.Bottom ? 0
                : labelSize.height / 2;
        return { top, bottom, left, right };
    }
    setData(data) {
        super.setData(data);
        // Pre-calculate component size for Sizing.EXTEND
        if ((this.sizing !== Sizing.Fit) || !this._hasLinks())
            this._preCalculateComponentSize();
    }
    setConfig(config) {
        super.setConfig(config);
        // Pre-calculate component size for Sizing.EXTEND
        if ((this.sizing !== Sizing.Fit) || !this._hasLinks())
            this._preCalculateComponentSize();
        // Using "as any" because typings are not full ("@types/d3-sankey": "^0.11.2")
        const nodeId = ((d, i) => getString(d, this.config.id, i));
        this._sankey.linkSort(this.config.linkSort);
        this._sankey
            .nodeId(nodeId)
            .nodeWidth(this.config.nodeWidth)
            .nodePadding(this.config.nodePadding)
            .nodeAlign(SankeyLayout[this.config.nodeAlign])
            .nodeSort(this.config.nodeSort)
            .iterations(this.config.iterations);
    }
    _render(customDuration) {
        const { config, bleed, datamodel: { nodes, links } } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        if ((nodes.length === 0) ||
            (nodes.length === 1 && links.length > 0) ||
            (nodes.length === 1 && !config.showSingleNode) ||
            (nodes.length > 1 && links.length === 0)) {
            this._linksGroup.selectAll(`.${link}`).call(removeLinks, duration);
            this._nodesGroup.selectAll(`.${nodeGroup}`).call(removeNodes, config, duration);
        }
        // Prepare Layout
        this._prepareLayout();
        // Links
        smartTransition(this._linksGroup, duration).attr('transform', `translate(${bleed.left},${bleed.top})`);
        const linkSelection = this._linksGroup.selectAll(`.${link}`)
            .data(links, (d, i) => { var _a; return (_a = config.id(d, i)) !== null && _a !== void 0 ? _a : i; });
        const linkSelectionEnter = linkSelection.enter().append('g').attr('class', link);
        linkSelectionEnter.call(createLinks);
        linkSelection.merge(linkSelectionEnter).call(updateLinks, config, duration);
        linkSelection.exit().call(removeLinks);
        // Nodes
        smartTransition(this._nodesGroup, duration).attr('transform', `translate(${bleed.left},${bleed.top})`);
        const nodeSelection = this._nodesGroup.selectAll(`.${nodeGroup}`)
            .data(nodes, (d, i) => { var _a; return (_a = config.id(d, i)) !== null && _a !== void 0 ? _a : i; });
        const nodeSelectionEnter = nodeSelection.enter().append('g').attr('class', nodeGroup);
        nodeSelectionEnter.call(createNodes, this.config, this._width, bleed);
        nodeSelection.merge(nodeSelectionEnter).call(updateNodes, config, this._width, bleed, this._hasLinks(), duration);
        nodeSelection.exit()
            .attr('class', nodeExit)
            .call(removeNodes, config, duration);
        // Background
        this._backgroundRect
            .attr('width', this.getWidth())
            .attr('height', this.getHeight())
            .attr('opacity', 0);
    }
    _populateLinkAndNodeValues() {
        const { config, datamodel } = this;
        const nodes = datamodel.nodes;
        const links = datamodel.links;
        // For d3-sankey each link must be an object with the `value` property
        links.forEach((link, i) => {
            link.value = getNumber(link, d => getNumber(d, config.linkValue, i));
        });
        // Populating node.fixedValue for d3-sankey
        nodes.forEach((node, i) => {
            node.fixedValue = getNumber(node, config.nodeFixedValue, i);
        });
    }
    _preCalculateComponentSize() {
        const { bleed, config, datamodel } = this;
        const nodes = datamodel.nodes;
        if (nodes.length) {
            this._populateLinkAndNodeValues();
            this._sankey(datamodel);
        }
        const scaleExtent = extent(nodes, d => d.value || undefined);
        const scaleRange = [config.nodeMinHeight, config.nodeMaxHeight];
        const scale = scaleLinear().domain(scaleExtent).range(scaleRange).clamp(true);
        nodes.forEach(n => { n._state.precalculatedHeight = scale(n.value) || config.nodeMinHeight; });
        const groupedByColumn = groupBy(nodes, d => d.layer);
        const values = Object.values(groupedByColumn)
            .map((group) => sum(group.map(n => n._state.precalculatedHeight + config.nodePadding)) - config.nodePadding);
        const height = max(values) || config.nodeMinHeight;
        this._extendedHeight = height + bleed.top + bleed.bottom;
        this._extendedWidth = Math.max(0, (config.nodeWidth + config.nodeHorizontalSpacing) * Object.keys(groupedByColumn).length - config.nodeHorizontalSpacing + bleed.left + bleed.right);
    }
    _prepareLayout() {
        var _a, _b;
        const { config, bleed, datamodel } = this;
        const isExtendedSize = this.sizing === Sizing.Extend;
        const sankeyHeight = this.sizing === Sizing.Fit ? this._height : this._extendedHeight;
        const sankeyWidth = this.sizing === Sizing.Fit ? this._width : this._extendedWidth;
        this._sankey
            .size([
            Math.max(sankeyWidth - bleed.left - bleed.right, 0),
            Math.max(sankeyHeight - bleed.top - bleed.bottom, 0),
        ]);
        const nodes = datamodel.nodes;
        const links = datamodel.links;
        // If there are no links we manually calculate the visualization layout
        if (!this._hasLinks()) {
            let y = 0;
            const nodesTotalHeight = sum(nodes, n => n._state.precalculatedHeight || 1);
            for (const node of nodes) {
                const sankeyHeight = this.getHeight() - bleed.top - bleed.bottom;
                const nodeHeight = node._state.precalculatedHeight || 1;
                const h = isExtendedSize ? nodeHeight : (sankeyHeight - config.nodePadding * (nodes.length - 1)) * nodeHeight / nodesTotalHeight;
                node.width = Math.max(10, config.nodeWidth);
                node.x0 = 0;
                node.x1 = node.width;
                node.y0 = y;
                node.y1 = y + Math.max(1, h);
                node.layer = 0;
                y = node.y1 + config.nodePadding;
            }
            this._extendedHeightIncreased = undefined;
            return;
        }
        // Calculate sankey
        this._populateLinkAndNodeValues();
        this._sankey({ nodes, links });
        // Setting minimum node height
        //   Default: 1px
        //   Extended size nodes that have no links: config.nodeMinHeight
        for (const node of nodes) {
            const singleExtendedSize = isExtendedSize && !((_a = node.sourceLinks) === null || _a === void 0 ? void 0 : _a.length) && !((_b = node.targetLinks) === null || _b === void 0 ? void 0 : _b.length);
            const h = Math.max(singleExtendedSize ? config.nodeMinHeight : 1, node.y1 - node.y0);
            const y = (node.y0 + node.y1) / 2;
            node.y0 = y - h / 2;
            node.y1 = y + h / 2;
        }
        if (isExtendedSize) {
            const height = max(nodes, d => d.y1);
            this._extendedHeightIncreased = height + bleed.top + bleed.bottom;
        }
    }
    getWidth() {
        return this.sizing === Sizing.Fit ? this._width : (this._extendedWidth || 0);
    }
    getHeight() {
        return this.sizing === Sizing.Fit ? this._height : Math.max(this._extendedHeightIncreased || 0, this._extendedHeight || 0);
    }
    getLayoutWidth() {
        return this.sizing === Sizing.Fit ? this._width : this._extendedWidth;
    }
    getLayoutHeight() {
        return this.sizing === Sizing.Fit ? this._height : (this._extendedHeightIncreased || this._extendedHeight);
    }
    getColumnCenters() {
        const { datamodel } = this;
        const nodes = datamodel.nodes;
        const centers = nodes.reduce((pos, node) => {
            const idx = node.layer;
            if (!isFinite(pos[idx])) {
                pos[idx] = (node.x0 + node.x1) / 2;
            }
            return pos;
        }, []);
        return centers;
    }
    highlightSubtree(node) {
        const { config, datamodel } = this;
        clearTimeout(this._highlightTimeoutId);
        this._highlightTimeoutId = setTimeout(() => {
            for (const n of datamodel.nodes)
                n._state.greyout = true;
            for (const l of datamodel.links)
                l._state.greyout = true;
            this.recursiveSetSubtreeState(node, 'sourceLinks', 'target', 'greyout', false);
            this.recursiveSetSubtreeState(node, 'targetLinks', 'source', 'greyout', false);
            this._render(config.highlightDuration);
            this._highlightActive = true;
        }, config.highlightDelay);
    }
    recursiveSetSubtreeState(node, linksKey, nodeKey, key, value) {
        node._state[key] = value;
        for (const l of node[linksKey]) {
            l._state[key] = value;
            this.recursiveSetSubtreeState(l[nodeKey], linksKey, nodeKey, key, value);
        }
    }
    disableHighlight() {
        const { config, datamodel } = this;
        clearTimeout(this._highlightTimeoutId);
        if (this._highlightActive) {
            this._highlightActive = false;
            for (const n of datamodel.nodes)
                n._state.greyout = false;
            for (const l of datamodel.links)
                l._state.greyout = false;
            this._render(config.highlightDuration);
        }
    }
    _hasLinks() {
        const { datamodel } = this;
        return datamodel.links.length > 0;
    }
    _onNodeMouseOver(d, event) {
        onNodeMouseOver(d, select(event.currentTarget), this.config, this._width);
    }
    _onNodeMouseOut(d, event) {
        onNodeMouseOut(d, select(event.currentTarget), this.config, this._width);
    }
    _onNodeRectMouseOver(d) {
        const { config } = this;
        if (config.highlightSubtreeOnHover)
            this.highlightSubtree(d);
    }
    _onNodeRectMouseOut(d) {
        this.disableHighlight();
    }
    _onLinkMouseOver(d, event) {
        const { config } = this;
        if (config.highlightSubtreeOnHover)
            this.highlightSubtree(d.target);
    }
    _onLinkMouseOut(d, event) {
        this.disableHighlight();
    }
}
Sankey.selectors = style;

export { Sankey };
//# sourceMappingURL=index.js.map
