import { select } from 'd3-selection';
import { color } from 'd3-color';
import { smartTransition } from '../../../utils/d3.js';
import { trimStringMiddle, estimateTextSize } from '../../../utils/text.js';
import { getString, clamp } from '../../../utils/data.js';
import { getCSSVariableValueInPixels, rectIntersect } from '../../../utils/misc.js';
import { hexToBrightness } from '../../../utils/color.js';
import { cssvar } from '../../../utils/style.js';
import { getPointPos } from './utils.js';
import { LeafletMapPointShape } from '../types.js';
import { updateDonut } from './donut.js';
import { pointPath, donutCluster, innerLabel, innerLabelCluster, bottomLabel, pointPathCluster, pointPathRing, variables } from '../style.js';

const BOTTOM_LABEL_TOP_MARGIN = 10;
function createNodes(selection) {
    selection.append('path')
        .attr('class', pointPath)
        .attr('id', d => `point-${d.id}`)
        .style('opacity', 0);
    selection.append('g')
        .attr('class', donutCluster);
    selection.append('text')
        .attr('class', innerLabel)
        .classed(innerLabelCluster, d => d.properties.cluster)
        .attr('id', d => `label-${d.id}`)
        .attr('dy', '0.32em');
    selection.append('text')
        .attr('class', bottomLabel)
        .attr('dy', '0.32em')
        .attr('opacity', 1);
}
function updateNodes(selection, config, leafletMap, mapMoveZoomUpdateOnly) {
    selection.each((d, i, elements) => {
        var _a, _b, _c;
        const group = select(elements[i]);
        const node = group.select(`.${pointPath}`);
        const innerLabel$1 = group.select(`.${innerLabel}`);
        const bottomLabel$1 = group.select(`.${bottomLabel}`);
        const { x, y } = getPointPos(d, leafletMap);
        const donutData = d.donutData;
        const isCluster = d.properties.cluster;
        const fromExpandedCluster = !!d.properties.expandedClusterPoint;
        const innerLabelText = (_a = (isCluster
            ? getString(d.properties, config.clusterLabel)
            : getString(d.properties, config.pointLabel))) !== null && _a !== void 0 ? _a : '';
        const innerLabelColor = (_b = (isCluster
            ? getString(d.properties, config.clusterLabelColor)
            : getString(d.properties, config.pointLabelColor))) !== null && _b !== void 0 ? _b : null;
        const bottomLabelText = (_c = (isCluster
            ? getString(d.properties, config.clusterBottomLabel)
            : getString(d.properties, config.pointBottomLabel))) !== null && _c !== void 0 ? _c : '';
        const pointCursor = getString(d.properties, config.pointCursor);
        const pointShape = getString(d.properties, config.pointShape);
        const isRing = pointShape === LeafletMapPointShape.Ring;
        const isCircular = (pointShape === LeafletMapPointShape.Circle) || isRing || isCluster || !pointShape;
        // To get updated on every render call
        const ringWidth = (isCluster && config.clusterRingWidth) || (isRing && config.pointRingWidth) || 0;
        group.attr('transform', `translate(${x},${y})`);
        group.select(`.${donutCluster}`)
            .call(updateDonut, donutData, isCircular ? d.radius : 0, ringWidth);
        node.attr('d', d.path);
        node.style('cursor', isCluster ? 'pointer' : pointCursor);
        bottomLabel$1.attr('transform', `translate(0,${d.radius + BOTTOM_LABEL_TOP_MARGIN})`);
        innerLabel$1.attr('font-size', () => {
            const fontSize = d.radius / Math.pow(innerLabelText.length, 0.4);
            return clamp(fontSize, fontSize, 16);
        });
        if (mapMoveZoomUpdateOnly)
            return;
        // Updates required only when data changes
        node
            .classed(pointPathCluster, isCluster)
            .classed(pointPathRing, isRing)
            .style('fill', d.color)
            .style('stroke', d.color) // being used for hover
            .style('stroke-width', ringWidth)
            .style('opacity', 1);
        innerLabel$1
            .text(innerLabelText || null)
            .attr('visibility', innerLabelText ? null : 'hidden')
            .style('fill', () => {
            var _a;
            if (innerLabelColor)
                return innerLabelColor;
            // Determine the label color based on the point brightness
            const c = getComputedStyle(node.node()).fill;
            const hex = (_a = color(c)) === null || _a === void 0 ? void 0 : _a.hex();
            if (!hex)
                return null;
            const brightness = hexToBrightness(hex);
            return brightness > 0.5
                ? (isCluster ? cssvar(variables.mapClusterInnerLabelTextColorDark) : cssvar(variables.mapPointInnerLabelTextColorDark))
                : (isCluster ? cssvar(variables.mapClusterInnerLabelTextColorLight) : cssvar(variables.mapPointInnerLabelTextColorLight));
        });
        const bottomLabelTextTrimmed = trimStringMiddle(bottomLabelText, 15);
        bottomLabel$1
            .text(bottomLabelTextTrimmed)
            .attr('font-size', getCSSVariableValueInPixels(cssvar(variables.mapPointBottomLabelFontSize), selection.node()))
            .attr('visibility', fromExpandedCluster ? 'hidden' : null);
    });
}
function collideLabels(selection, leafletMap) {
    selection.each((datum1, i, elements) => {
        const group1LabelElement = elements[i];
        const group1 = select(group1LabelElement);
        const label1 = group1.select(`.${bottomLabel}`);
        group1LabelElement.labelVisible = true;
        // Calculate bounding rect of point's bottom label
        const bottomLabelFontSizePx = getCSSVariableValueInPixels(cssvar(variables.mapPointBottomLabelFontSize), selection.node());
        const p1Pos = getPointPos(datum1, leafletMap);
        const label1Size = estimateTextSize(label1, bottomLabelFontSizePx, 0.32, true, 0.6);
        const label1BoundingRect = {
            x: p1Pos.x - label1Size.width / 2,
            y: p1Pos.y - label1Size.height / 2 + datum1.radius + BOTTOM_LABEL_TOP_MARGIN,
            width: label1Size.width,
            height: label1Size.height,
        };
        for (let j = 0; j < elements.length; j += 1) {
            if (i === j)
                continue;
            const group2LabelElement = elements[j];
            const group2 = select(group2LabelElement);
            const label2 = group2.select(`.${bottomLabel}`);
            const datum2 = group2.datum();
            // Calculate bounding rect of the second point's circle
            const p2Pos = getPointPos(datum2, leafletMap);
            const point2BoundingRect = {
                x: p2Pos.x - datum2.radius,
                y: p2Pos.y - datum2.radius,
                width: 2 * datum2.radius,
                height: 2 * datum2.radius,
            };
            let intersect = rectIntersect(label1BoundingRect, point2BoundingRect);
            // If there's not intersection, check a collision with the second point's label
            const label2Visible = group2LabelElement.labelVisible;
            if (!intersect && label2Visible) {
                const label2Size = estimateTextSize(label2, bottomLabelFontSizePx, 0.32, true, 0.6);
                intersect = rectIntersect(label1BoundingRect, {
                    x: p2Pos.x - label2Size.width / 2,
                    y: p2Pos.y + datum2.radius + BOTTOM_LABEL_TOP_MARGIN - label2Size.height / 2,
                    width: label2Size.width,
                    height: label2Size.height,
                });
            }
            if (intersect) {
                group1LabelElement.labelVisible = false;
                break;
            }
        }
        smartTransition(label1, 0).attr('opacity', group1LabelElement.labelVisible ? 1 : 0);
    });
}
function removeNodes(selection) {
    selection.remove();
}

export { collideLabels, createNodes, removeNodes, updateNodes };
//# sourceMappingURL=node.js.map
