import { Position } from '../../../../types/position.js';
import { isPlainObject, getBoolean } from '../../../../utils/data.js';
import { getNodeSize, getX, getY } from '../node/helper.js';
import { node } from '../node/style.js';

const DEFAULT_PADDING = 15;
const DEFAULT_LABEL_MARGIN = 16;
const OUTLINE_SELECTION_PADDING = 5;
const DEFAULT_SIDE_LABEL_SIZE = 25;
function getPanelPadding(padding) {
    var _a, _b, _c, _d;
    const isPaddingAnObject = isPlainObject(padding);
    return {
        left: (_a = (isPaddingAnObject ? padding.left : padding)) !== null && _a !== void 0 ? _a : DEFAULT_PADDING,
        right: (_b = (isPaddingAnObject ? padding.right : padding)) !== null && _b !== void 0 ? _b : DEFAULT_PADDING,
        top: (_c = (isPaddingAnObject ? padding.top : padding)) !== null && _c !== void 0 ? _c : DEFAULT_PADDING,
        bottom: (_d = (isPaddingAnObject ? padding.bottom : padding)) !== null && _d !== void 0 ? _d : DEFAULT_PADDING,
    };
}
function initPanels(panelsConfig) {
    const panels = (panelsConfig !== null && panelsConfig !== void 0 ? panelsConfig : []).map(p => (Object.assign(Object.assign({}, p), { _padding: getPanelPadding(p.padding) })));
    return panels;
}
function setPanelForNodes(panels, nodes, config) {
    if (!panels)
        return;
    // For each node store its related panels
    nodes.forEach(node => {
        // Find all panels to which node belong
        const nodePanels = panels.filter(panel => panel.nodes && panel.nodes.includes(node._id));
        node._panels = nodePanels;
    });
}
function setPanelBBox(panelConfig, panelNodes, nodeSizeAccessor, nodeDisabledAccessor) {
    const selection = panelNodes.select(`.${node}`);
    if (selection.empty())
        return;
    const labelApprxHeight = 40;
    const labelApprxWidth = 110;
    const labelMargin = 10;
    let box;
    selection.each((d, i) => {
        const nodeSize = getNodeSize(d, nodeSizeAccessor, i);
        const w = Math.max(nodeSize, labelApprxWidth);
        const h = nodeSize + labelMargin + labelApprxHeight;
        // const nodeBBox = node.getBBox()
        const yShift = 10; // This is hard to calculate, so we just use an approximation
        const coords = {
            x1: getX(d) - w / 2,
            y1: getY(d) - h / 2 + yShift,
            x2: getX(d) + w / 2,
            y2: getY(d) + h / 2 + yShift,
        };
        if (!box) {
            box = Object.assign({}, coords);
        }
        else {
            if (box.x1 > coords.x1)
                box.x1 = coords.x1;
            if (box.y1 > coords.y1)
                box.y1 = coords.y1;
            if (box.x2 < coords.x2)
                box.x2 = coords.x2;
            if (box.y2 < coords.y2)
                box.y2 = coords.y2;
        }
    });
    panelConfig._x = box.x1 - panelConfig._padding.left;
    panelConfig._y = box.y1 - panelConfig._padding.top;
    panelConfig._width = box.x2 - box.x1 + panelConfig._padding.left + panelConfig._padding.right;
    panelConfig._height = box.y2 - box.y1 + panelConfig._padding.top + panelConfig._padding.bottom;
    panelConfig._disabled = selection.data()
        .map((node, i) => getBoolean(node, nodeDisabledAccessor, node._index) || node._state.greyout)
        .every(d => d);
}
function setPanelNumNodes(panelConfig, panelNodes) {
    panelConfig._numNodes = panelNodes.size();
}
function updatePanelBBoxSize(nodesSelection, panels, config) {
    const { layoutNonConnectedAside } = config;
    if (!panels)
        return;
    panels.forEach(panelConfig => {
        const panelNodes = nodesSelection.filter(node => {
            return (!layoutNonConnectedAside || node._isConnected) && panelConfig.nodes.includes(node._id);
        });
        setPanelBBox(panelConfig, panelNodes, config.nodeSize, config.nodeDisabled);
    });
}
function updatePanelNumNodes(nodesSelection, panels, config) {
    const { layoutNonConnectedAside } = config;
    if (!panels)
        return;
    panels.forEach(panelConfig => {
        const panelNodes = nodesSelection.filter(node => {
            return (!layoutNonConnectedAside || node._isConnected) && panelConfig.nodes.includes(node._id);
        });
        setPanelNumNodes(panelConfig, panelNodes);
    });
}
function getLabelTranslateTransform(panel) {
    const x = panel._width / 2;
    const dy = DEFAULT_LABEL_MARGIN + (panel.dashedOutline ? OUTLINE_SELECTION_PADDING : 0);
    const y = panel.labelPosition === Position.Bottom
        ? panel._height + dy
        : -dy;
    return `translate(${x}, ${y})`;
}

export { DEFAULT_LABEL_MARGIN, DEFAULT_PADDING, DEFAULT_SIDE_LABEL_SIZE, OUTLINE_SELECTION_PADDING, getLabelTranslateTransform, getPanelPadding, initPanels, setPanelBBox, setPanelForNodes, setPanelNumNodes, updatePanelBBoxSize, updatePanelNumNodes };
//# sourceMappingURL=helper.js.map
