import { interpolate } from 'd3-interpolate';
import { max, mean } from 'd3-array';
import { scoreRectPath } from '../../../../utils/path.js';
import { getNumber, getString, isEmpty, isNil } from '../../../../utils/data.js';
import { getHexValue, hexToBrightness, getColor } from '../../../../utils/color.js';
import { GraphNodeShape } from '../../types.js';

const NODE_SIZE = 30;
const LABEL_RECT_HORIZONTAL_PADDING = 10;
const LABEL_RECT_VERTICAL_PADDING = 4;
function getNodeSize(d, nodeSizeAccessor, index) {
    return getNumber(d, nodeSizeAccessor, index) || NODE_SIZE;
}
function _setInitialAnimState(el, index) {
    el._animState = {
        endAngle: 0,
        nodeIndex: index,
    };
}
// Animate the arc around node with keeping
// the current anim state info
function arcTween(d, config, arcConstructor, el) {
    var _a;
    const { nodeStrokeWidth, nodeSize, nodeGaugeValue } = config;
    if (!el._animState)
        _setInitialAnimState(el, d._index);
    const i = interpolate(el._animState, {
        endAngle: 2 * Math.PI * ((_a = getNumber(d, nodeGaugeValue, d._index)) !== null && _a !== void 0 ? _a : 0) / 100,
        nodeIndex: d._index,
        nodeSize: getNodeSize(d, nodeSize, d._index),
        borderWidth: getNumber(d, nodeStrokeWidth, d._index),
    });
    el._animState = i(0);
    return (t) => {
        el._animState = i(t);
        return arcConstructor(el._animState);
    };
}
function polyTween(d, config, polygonConstructor, el) {
    var _a;
    const { nodeShape, nodeGaugeValue } = config;
    const nodeSize = getNodeSize(d, config.nodeSize, d._index);
    let n;
    switch (getString(d, nodeShape, d._index)) {
        case GraphNodeShape.Square:
            n = 4;
            break;
        case GraphNodeShape.Triangle:
            n = 3;
            break;
        case GraphNodeShape.Hexagon:
        default:
            n = 6;
    }
    if (!el._animState)
        _setInitialAnimState(el, d._index);
    const i = interpolate(el._animState, {
        endAngle: 2 * Math.PI * ((_a = getNumber(d, nodeGaugeValue, d._index)) !== null && _a !== void 0 ? _a : 0) / 100,
        nodeIndex: d._index,
    });
    el._animState = i(0);
    return (t) => {
        el._animState = i(t);
        return n === 4 ? scoreRectPath({
            x: -nodeSize / 2,
            y: -nodeSize / 2,
            w: nodeSize,
            h: nodeSize,
            r: 5,
            score: el._animState.endAngle / (2 * Math.PI),
        }) : polygonConstructor(nodeSize, n, el._animState.endAngle, true);
    };
}
function setLabelRect(labelSelection, label, selector) {
    // Set label background rectangle size by text size
    const labelIsEmpty = isEmpty(label);
    const labelTextSelection = labelSelection.select(`.${selector}`);
    const labelTextBBox = labelTextSelection.node().getBBox();
    const backgroundRect = labelSelection.select('rect')
        .attr('visibility', labelIsEmpty ? 'hidden' : null)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('x', -labelTextBBox.width / 2 - LABEL_RECT_HORIZONTAL_PADDING)
        .attr('y', '-0.64em')
        .attr('width', labelTextBBox.width + 2 * LABEL_RECT_HORIZONTAL_PADDING)
        .attr('height', labelTextBBox.height + 2 * LABEL_RECT_VERTICAL_PADDING)
        .style('transform', `translateY(${-LABEL_RECT_VERTICAL_PADDING}px)`);
    return backgroundRect;
}
function getX(node) {
    return node._state && !isNil(node._state.fx) ? node._state.fx : node.x;
}
function getY(node) {
    return node._state && !isNil(node._state.fy) ? node._state.fy : node.y;
}
function configuredNodeSize(nodeSizeAccessor) {
    return typeof nodeSizeAccessor === 'number' ? nodeSizeAccessor : NODE_SIZE;
}
function getMaxNodeSize(data, nodeSize) {
    return max(data || [], (d, i) => getNodeSize(d, nodeSize, i)) || NODE_SIZE;
}
function getAverageNodeSize(data, nodeSize) {
    return mean(data || [], (d, i) => getNodeSize(d, nodeSize, i)) || NODE_SIZE;
}
function getSideLabelTextColor(label, context) {
    if (!label.color)
        return null;
    const hex = getHexValue(label.color, context);
    const brightness = hexToBrightness(hex);
    return brightness > 0.65 ? 'var(--vis-graph-node-side-label-fill-color-dark)' : 'var(--vis-graph-node-side-label-fill-color-bright)';
}
function getNodeColor(d, colorAccessor, index) {
    var _a;
    return (_a = getColor(d, colorAccessor, index, true)) !== null && _a !== void 0 ? _a : null;
}
function getNodeIconColor(d, colorAccessor, index, context) {
    const nodeColor = getNodeColor(d, colorAccessor, index);
    if (!nodeColor)
        return null;
    const hex = getHexValue(nodeColor, context);
    const brightness = hexToBrightness(hex);
    return brightness > 0.65 ? 'var(--vis-graph-node-icon-fill-color-dark)' : 'var(--vis-graph-node-icon-fill-color-bright)';
}
function isInternalHref(str) {
    return /^#[^]+/.test(str);
}

export { LABEL_RECT_HORIZONTAL_PADDING, LABEL_RECT_VERTICAL_PADDING, NODE_SIZE, arcTween, configuredNodeSize, getAverageNodeSize, getMaxNodeSize, getNodeColor, getNodeIconColor, getNodeSize, getSideLabelTextColor, getX, getY, isInternalHref, polyTween, setLabelRect };
//# sourceMappingURL=helper.js.map
