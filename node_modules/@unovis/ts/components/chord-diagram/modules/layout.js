import { group, index } from 'd3-array';
import { hierarchy } from 'd3-hierarchy';
import { pie } from 'd3-shape';
import { getNumber, groupBy } from '../../../utils/data.js';

function transformData(node) {
    const { height, depth } = node;
    if (height > 0) {
        const d = node.data;
        const n = node;
        n.data = { key: d[0], values: d[1], depth, height, ancestors: n.ancestors().map(d => d.data.key) };
    }
}
function getHierarchyNodes(data, value, levels = []) {
    const nodeLevels = levels.map(level => (d) => d[level]);
    const nestedData = levels.length ? group(data, ...nodeLevels) : { key: 'root', children: data };
    const root = hierarchy(nestedData)
        .sum(d => getNumber(d, value))
        .each(transformData);
    return root;
}
function positionChildren(node, padding, scalingCoeff = 0.95) {
    if (!node.children)
        return;
    // We need to ensure levels with empty links still take up full space
    const containsLinks = node.value > 0;
    const length = node.x1 - node.x0;
    const scaledLength = length * (node.y0 === 0 ? 1 : scalingCoeff);
    const delta = length - scaledLength;
    const padAngle = containsLinks ? padding : scaledLength / node.children.length;
    const positions = pie()
        .startAngle(node.x0 + delta / 2)
        .endAngle(node.x1 - delta / 2)
        .padAngle(padAngle)
        .value(d => containsLinks ? d.value : 1)
        .sort((a, b) => node.children.indexOf(a) - node.children.indexOf(b))(node.children);
    node.children.forEach((child, i) => {
        const x0 = positions[i].startAngle;
        const x1 = positions[i].endAngle;
        const childDelta = (x1 - x0) * (1 - scalingCoeff);
        const xmid = (x0 + x1) / 2;
        child.x0 = containsLinks ? x0 + childDelta / 2 : xmid - padding / 2;
        child.x1 = containsLinks ? x1 - childDelta / 2 : xmid + padding / 2;
    });
}
function getRibbons(data, links, padding) {
    const groupedBySource = groupBy(links, d => d.source._id);
    const groupedByTarget = groupBy(links, d => d.target._id);
    const leafNodes = data.leaves();
    const leafNodesById = index(leafNodes, d => d.data._id);
    const getNodesInRibbon = (source, target, partitionHeight, nodes = []) => {
        nodes[source.height] = source;
        nodes[partitionHeight * 2 - target.height] = target;
        if (source.parent && target.parent)
            getNodesInRibbon(source.parent, target.parent, partitionHeight, nodes);
        return nodes;
    };
    const calculatePoints = (links, type, depth, maxDepth) => {
        links.forEach(link => {
            var _a;
            if (!link._state.points)
                link._state.points = [];
            const sourceLeaf = leafNodesById.get(link.source._id);
            const targetLeaf = leafNodesById.get(link.target._id);
            const nodesInRibbon = getNodesInRibbon(type === 'out' ? sourceLeaf : targetLeaf, type === 'out' ? targetLeaf : sourceLeaf, maxDepth);
            const currNode = nodesInRibbon[depth];
            const len = currNode.x1 - currNode.x0 - padding;
            const x0 = (_a = currNode._prevX1) !== null && _a !== void 0 ? _a : (currNode.x0 + padding / 2);
            const x1 = x0 + len * link._state.value / currNode.value;
            currNode._prevX1 = x1;
            const pointIdx = type === 'out' ? depth : maxDepth * 2 - 1 - depth;
            link._state.points[pointIdx] = { a0: x0, a1: x1, r: currNode.y1 };
        });
    };
    leafNodes.forEach(leafNode => {
        const outLinks = groupedBySource[leafNode.data._id] || [];
        const inLinks = groupedByTarget[leafNode.data._id] || [];
        for (let depth = 0; depth < leafNode.depth; depth += 1) {
            calculatePoints(outLinks, 'out', depth, leafNode.depth);
            calculatePoints(inLinks, 'in', depth, leafNode.depth);
        }
    });
    return links.map(l => ({
        source: leafNodesById.get(l.source._id),
        target: leafNodesById.get(l.target._id),
        data: l,
        points: l._state.points,
        _state: {},
    }));
}

export { getHierarchyNodes, getRibbons, positionChildren };
//# sourceMappingURL=layout.js.map
