import { select } from 'd3-selection';
import { mean } from 'd3-array';
import { color } from 'd3-color';
import { smartTransition } from '../../../utils/d3.js';
import { isStringCSSVariable, getCSSVariableValue, getCSSVariableValueInPixels } from '../../../utils/misc.js';
import { hexToBrightness, getColor } from '../../../utils/color.js';
import { getNumber, getString, getValue } from '../../../utils/data.js';
import { XYLabelPositioning } from '../types.js';

function createLabels(selection) {
    selection.attr('transform', d => `translate(${d._screen.x},${d._screen.y})`);
    selection.append('rect').style('fill', d => d._screen.backgroundColor);
    selection.append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'central')
        .style('fill', d => d._screen.backgroundColor)
        .style('pointer-events', 'none');
    selection.attr('transform', d => `translate(${d._screen.x},${d._screen.y}) scale(0)`);
}
function updateLabels(selection, config, duration) {
    selection.each((d, i, elements) => {
        var _a, _b;
        const group = select(elements[i]);
        const text = group.select('text');
        const rect = group.select('rect');
        const backgroundColor = d._screen.backgroundColor;
        const labelText = (_a = d._screen.labelText) !== null && _a !== void 0 ? _a : '';
        const labelFontSize = d._screen.fontSize;
        let labelColor = d._screen.labelColor;
        // Label background
        const backgroundHeight = labelFontSize * 1.7;
        let backgroundWidth = labelFontSize * labelText.length * 0.7;
        if (backgroundWidth < backgroundHeight)
            backgroundWidth = backgroundHeight;
        smartTransition(rect, duration)
            .attr('width', backgroundWidth)
            .attr('height', backgroundHeight)
            .attr('x', -backgroundWidth / 2)
            .attr('y', -backgroundHeight / 2)
            .attr('rx', labelFontSize)
            .attr('ry', labelFontSize)
            .style('fill', backgroundColor);
        // Label
        if (!labelColor) {
            const hex = (_b = color(isStringCSSVariable(backgroundColor) ? getCSSVariableValue(backgroundColor, group.node()) : backgroundColor)) === null || _b === void 0 ? void 0 : _b.hex();
            const brightness = hexToBrightness(hex);
            labelColor = brightness > config.labelTextBrightnessRatio
                ? 'var(--vis-xy-label-text-color-dark)'
                : 'var(--vis-xy-label-text-color-light)';
        }
        text.html(labelText)
            .attr('font-size', labelFontSize);
        smartTransition(text, duration)
            .style('fill', labelColor);
        rect.style('cursor', d._screen.cursor);
    });
    smartTransition(selection, duration)
        .attr('transform', d => `translate(${d._screen.x},${d._screen.y}) scale(1)`);
}
function removeLabels(selection, duration) {
    smartTransition(selection, duration)
        .attr('transform', d => `translate(${d._screen.x},${d._screen.y}) scale(0)`)
        .remove();
}
function getLabelPosition(value, positioning, scale) {
    var _a;
    switch (positioning) {
        case XYLabelPositioning.DataSpace: return (_a = scale(value)) !== null && _a !== void 0 ? _a : 0;
        case XYLabelPositioning.AbsolutePx: return value;
        case XYLabelPositioning.AbsolutePercentage: {
            const scaleRange = scale.range();
            return scaleRange[0] + (scaleRange[1] - scaleRange[0]) * value / 100;
        }
    }
}
function getLabelRenderProps(data, el, config, xScale, yScale) {
    var _a, _b;
    const isCluster = Array.isArray(data);
    const fontSize = isCluster
        ? ((_a = getNumber(data, config.clusterFontSize)) !== null && _a !== void 0 ? _a : getCSSVariableValueInPixels('var(--vis-xy-label-cluster-font-size)', el))
        : ((_b = getNumber(data, config.labelFontSize)) !== null && _b !== void 0 ? _b : getCSSVariableValueInPixels('var(--vis-xy-label-font-size)', el));
    const labelText = (isCluster ? getString(data, config.clusterLabel) : getString(data, config.label)) || '';
    const backgroundHeight = fontSize * 1.7;
    let backgroundWidth = fontSize * labelText.length * 0.7;
    if (backgroundWidth < backgroundHeight)
        backgroundWidth = backgroundHeight;
    const x = isCluster
        ? mean(data, d => d._screen.x)
        : getLabelPosition(getNumber(data, config.x), getValue(data, config.xPositioning), xScale);
    const y = isCluster
        ? mean(data, d => d._screen.y)
        : getLabelPosition(getNumber(data, config.y), getValue(data, config.yPositioning), yScale);
    return {
        x,
        y,
        fontSize,
        labelText,
        labelColor: isCluster ? getColor(data, config.clusterLabelColor) : getColor(data, config.color),
        backgroundColor: isCluster ? getColor(data, config.clusterBackgroundColor) : getColor(data, config.backgroundColor),
        cursor: isCluster ? getString(data, config.clusterCursor) : getString(data, config.cursor),
        width: backgroundWidth,
        height: backgroundHeight,
    };
}

export { createLabels, getLabelPosition, getLabelRenderProps, removeLabels, updateLabels };
//# sourceMappingURL=label.js.map
