import { select } from 'd3-selection';
import { Position } from '../../../types/position.js';
import { rectIntersect } from '../../../utils/misc.js';
import { estimateStringPixelLength } from '../../../utils/text.js';
import { getValue } from '../../../utils/data.js';

function isLabelPositionCenter(labelPosition) {
    return (labelPosition !== Position.Top) && (labelPosition !== Position.Bottom) &&
        (labelPosition !== Position.Left) && (labelPosition !== Position.Right);
}
function getCentralLabelFontSize(pointDiameter, textLength) {
    return textLength ? 0.7 * pointDiameter / Math.pow(textLength, 0.5) : 0;
}
function getLabelShift(labelPosition, pointDiameter, labelPadding = 5) {
    switch (labelPosition) {
        case Position.Top:
            return [0, -pointDiameter / 2 - labelPadding];
        case Position.Bottom:
            return [0, pointDiameter / 2 + labelPadding];
        case Position.Left:
            return [-pointDiameter / 2 - labelPadding, 0];
        case Position.Right:
            return [pointDiameter / 2 + labelPadding, 0];
        default:
            return [0, 0];
    }
}
function getEstimatedLabelBBox(d, labelPosition, xScale, yScale, fontSizePx) {
    var _a;
    const x = xScale(d._point.xValue);
    const y = yScale(d._point.yValue);
    const pointDiameter = d._point.sizePx;
    const pointLabelText = (_a = d._point.label) !== null && _a !== void 0 ? _a : '';
    const textLength = pointLabelText.length;
    const centralLabelFontSize = getCentralLabelFontSize(pointDiameter, textLength);
    const width = estimateStringPixelLength(pointLabelText, isLabelPositionCenter(labelPosition) ? centralLabelFontSize : fontSizePx, 0.6);
    const height = fontSizePx;
    const labelShift = getLabelShift(labelPosition, pointDiameter);
    const dx = labelPosition === Position.Left ? -width
        : labelPosition === Position.Right ? 0 : -width / 2;
    const dy = labelPosition === Position.Top ? -height
        : labelPosition === Position.Bottom ? 0 : -height / 2;
    const bbox = {
        x: x + labelShift[0] + dx,
        y: y + labelShift[1] + dy,
        width: width,
        height: height,
    };
    return bbox;
}
function collideLabels(selection, config, xScale, yScale) {
    // Reset visibility of all labels
    selection.each((datum1, i, elements) => {
        const node = elements[i];
        node._labelVisible = true;
    });
    // Run collision detection and set labels visibility
    selection.each((datum1, i, elements) => {
        var _a, _b;
        const group1Node = elements[i];
        const label1Position = getValue(datum1, config.labelPosition, datum1._point.pointIndex);
        if (!group1Node._labelVisible || isLabelPositionCenter(label1Position))
            return;
        const label1 = select(group1Node).select('text');
        const label1FontSize = Number.parseFloat((_a = window.getComputedStyle(label1.node())) === null || _a === void 0 ? void 0 : _a.fontSize);
        // Calculate bounding rect of point's label
        const label1BoundingRect = getEstimatedLabelBBox(datum1, label1Position, xScale, yScale, label1FontSize);
        for (let j = 0; j < elements.length; j += 1) {
            if (i === j)
                continue;
            const group2Node = elements[j];
            const group2 = select(group2Node);
            const label2 = group2.select('text');
            const datum2 = group2.datum();
            // Calculate bounding rect of the second point's circle
            const p2Pos = [xScale(datum2._point.xValue), yScale(datum2._point.yValue)];
            const p2Radius = datum2._point.sizePx / 2;
            const point2BoundingRect = {
                x: p2Pos[0] - p2Radius,
                y: p2Pos[1] - p2Radius,
                width: 2 * p2Radius,
                height: 2 * p2Radius,
            };
            let intersect = rectIntersect(label1BoundingRect, point2BoundingRect, 2);
            // If there's no intersection, check for collision with the second point's label
            const label2Visible = group2Node._labelVisible;
            if (!intersect && label2Visible) {
                const label2FontSize = Number.parseFloat((_b = window.getComputedStyle(label2.node())) === null || _b === void 0 ? void 0 : _b.fontSize);
                const label2Position = getValue(datum2, config.labelPosition, datum2._point.pointIndex);
                const label2BoundingRect = getEstimatedLabelBBox(datum2, label2Position, xScale, yScale, label2FontSize);
                intersect = rectIntersect(label1BoundingRect, label2BoundingRect, 0.25);
            }
            if (intersect) {
                if (group1Node._forceShowLabel)
                    group2Node._labelVisible = false;
                else {
                    group1Node._labelVisible = false;
                    break;
                }
            }
        }
    });
    // Hide the overlapping labels
    selection.each((datum1, i, elements) => {
        const node = elements[i];
        const label = select(node).select('text');
        label.attr('opacity', node._labelVisible ? 1 : 0);
    });
}

export { collideLabels, getCentralLabelFontSize, getEstimatedLabelBBox, getLabelShift, isLabelPositionCenter };
//# sourceMappingURL=utils.js.map
