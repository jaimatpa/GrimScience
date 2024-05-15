import { getNumber, getValue } from '../../../../utils/data.js';
import { getColor, hexToBrightness } from '../../../../utils/color.js';
import { color } from 'd3-color';
import { GraphLinkArrowStyle } from '../../types.js';
import { getY, getX } from '../node/helper.js';

// Utils
const getPolylineData = (d) => `${d.x1},${d.y1} ${(d.x1 + d.x2) / 2},${(d.y1 + d.y2) / 2} ${d.x2},${d.y2}`;
const LINK_MARKER_WIDTH = 9;
const LINK_MARKER_HEIGHT = 7;
function getLinkShift(link, spacing) {
    const sourceNode = link.source;
    const targetNode = link.target;
    const angle = Math.atan2(getY(targetNode) - getY(sourceNode), getX(targetNode) - getX(sourceNode)) - Math.PI / 2;
    const dx = Math.cos(angle) * spacing * link._direction * (link._index - (link._neighbours - 1) / 2);
    const dy = Math.sin(angle) * spacing * link._direction * (link._index - (link._neighbours - 1) / 2);
    return { dx, dy };
}
function getLinkShiftTransform(link, spacing) {
    const { dx, dy } = getLinkShift(link, spacing);
    return `translate(${dx}, ${dy})`;
}
function getLinkStrokeWidth(d, scale, config) {
    const m = getNumber(d, config.linkWidth, d._indexGlobal);
    return m / Math.pow(scale, 0.5);
}
function getLinkBandWidth(d, scale, config) {
    const { nodeSize, linkBandWidth } = config;
    const sourceNodeSize = getNumber(d.source, nodeSize, d.source._index);
    const targetNodeSize = getNumber(d.target, nodeSize, d.target._index);
    const minNodeSize = Math.min(sourceNodeSize, targetNodeSize);
    return Math.min(minNodeSize, getNumber(d, linkBandWidth, d._indexGlobal) / Math.pow(scale || 1, 0.5)) || 0;
}
function getLinkColor(link, config) {
    var _a;
    const { linkStroke } = config;
    const c = (_a = getColor(link, linkStroke, link._indexGlobal, true)) !== null && _a !== void 0 ? _a : 'var(--vis-graph-link-stroke-color)';
    return c || null;
}
function getLinkArrowStyle(d, config) {
    const linkArrowValue = getValue(d, config.linkArrow, d._indexGlobal);
    if (!linkArrowValue)
        return undefined;
    else if (linkArrowValue === GraphLinkArrowStyle.Double)
        return linkArrowValue;
    else
        return GraphLinkArrowStyle.Single;
}
function getArrowPath() {
    return `M${-LINK_MARKER_WIDTH / 2},${-LINK_MARKER_HEIGHT / 2} V${LINK_MARKER_HEIGHT / 2} L${LINK_MARKER_WIDTH / 2},0 Z`;
}
function getDoubleArrowPath() {
    return `M${-LINK_MARKER_WIDTH / 2},0 L${LINK_MARKER_WIDTH / 2},${-LINK_MARKER_HEIGHT / 2} L${LINK_MARKER_WIDTH * 1.5},0 L${LINK_MARKER_WIDTH / 2},${LINK_MARKER_HEIGHT / 2} Z`;
}
function getLinkLabelTextColor(label) {
    if (!label.color)
        return null;
    const hex = color(label.color).hex();
    const brightness = hexToBrightness(hex);
    return brightness > 0.65 ? 'var(--vis-graph-link-label-text-color-dark)' : 'var(--vis-graph-link-label-text-color-bright)';
}

export { LINK_MARKER_HEIGHT, LINK_MARKER_WIDTH, getArrowPath, getDoubleArrowPath, getLinkArrowStyle, getLinkBandWidth, getLinkColor, getLinkLabelTextColor, getLinkShift, getLinkShiftTransform, getLinkStrokeWidth, getPolylineData };
//# sourceMappingURL=helper.js.map
