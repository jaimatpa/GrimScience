import { isPlainObject, merge, getValue } from '../../../utils/data.js';

// Utils
const DEFAULT_ELK_SETTINGS = {
    hierarchyHandling: 'INCLUDE_CHILDREN',
    'nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.padding': '[top=15.0,left=15.0,bottom=15.0,right=15.0]',
    'spacing.nodeNodeBetweenLayers': '50',
    'spacing.edgeNodeBetweenLayers': '50',
    'spacing.nodeNode': '10',
};
function positionNonConnectedNodes(nodes, y, spacing, width, xStart = 0) {
    nodes.forEach((d, i) => {
        const x = spacing / 2 + i * spacing;
        const rowIdx = width ? Math.floor(x / width) : 0;
        d.y = (y + rowIdx * spacing) || 0;
        d.x = width ? x % width + xStart : x + xStart;
    });
}
function toElkHierarchy(d, layoutOptions) {
    if (!(d instanceof Map))
        return d;
    const hierarchyNode = Array.from(d.entries()).map(([key, value]) => {
        const children = toElkHierarchy(value, layoutOptions);
        if (key) {
            const layoutOps = isPlainObject(layoutOptions) ? DEFAULT_ELK_SETTINGS : merge(DEFAULT_ELK_SETTINGS, getValue(key, layoutOptions));
            return {
                id: key,
                layoutOptions: layoutOps,
                children,
            };
        }
        else {
            return children;
        }
    }).flat();
    return hierarchyNode;
}
function adjustElkHierarchyCoordinates(node) {
    var _a, _b;
    const parentX = node.x;
    const parentY = node.y;
    (_a = node.edges) === null || _a === void 0 ? void 0 : _a.forEach(edge => {
        var _a, _b;
        (_a = edge.sections) === null || _a === void 0 ? void 0 : _a.forEach(section => {
            var _a;
            section.startPoint.x += parentX;
            section.startPoint.y += parentY;
            section.endPoint.x += parentX;
            section.endPoint.y += parentY;
            (_a = section.bendPoints) === null || _a === void 0 ? void 0 : _a.forEach(bendPoint => {
                bendPoint.x += parentX;
                bendPoint.y += parentY;
            });
        });
        (_b = edge.labels) === null || _b === void 0 ? void 0 : _b.forEach(label => {
            label.x += parentX;
            label.y += parentY;
        });
    });
    (_b = node.children) === null || _b === void 0 ? void 0 : _b.forEach(child => {
        child.x += parentX;
        child.y += parentY;
        adjustElkHierarchyCoordinates(child);
    });
}

export { DEFAULT_ELK_SETTINGS, adjustElkHierarchyCoordinates, positionNonConnectedNodes, toElkHierarchy };
//# sourceMappingURL=layout-helpers.js.map
