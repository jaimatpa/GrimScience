import { select } from 'd3-selection';
import { color } from 'd3-color';
import { getHexValue, rgbaToRgb, rgbToBrightness, getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';
import { getString } from '../../../utils/data.js';
import { getCSSVariableValueInPixels } from '../../../utils/misc.js';
import { cssvar } from '../../../utils/style.js';
import { wrapSVGText } from '../../../utils/text.js';
import { NestedDonutSegmentLabelAlignment } from '../types.js';
import { variables } from '../style.js';

function getLabelFillColor(d, element) {
    var _a;
    const c = (_a = color(d._state.fill)) !== null && _a !== void 0 ? _a : color(getHexValue(d._state.fill, element));
    const rgb = c === null || c === void 0 ? void 0 : c.rgb();
    // If shading, we adjust segment color before calculating brightness ratio
    const colorParsed = rgb && d._state.fillOpacity
        ? rgbaToRgb(`rgba(${rgb.r},${rgb.g},${rgb.b},${d._state.fillOpacity})`, getHexValue(cssvar(variables.nestedDonutBackgroundColor), element)) : rgb;
    const brightness = colorParsed ? rgbToBrightness(colorParsed) : 0;
    return cssvar(brightness > 0.65 ? variables.nestedDonutSegmentLabelTextColorLight : variables.nestedDonutSegmentLabelTextColorDark);
}
function getLabelTransform(d, arcGen) {
    const translate = `translate(${arcGen.centroid(d)})`;
    const degree = 180 / Math.PI * (arcGen.startAngle()(d) + arcGen.endAngle()(d)) / 2 - 90;
    switch (d._layer.labelAlignment) {
        case NestedDonutSegmentLabelAlignment.Along:
            return `${translate} rotate(${degree + 90})`;
        case NestedDonutSegmentLabelAlignment.Perpendicular:
            return `${translate} rotate(${degree > 90 ? degree - 180 : degree})`;
        default:
            return `${translate}`;
    }
}
function getLabelBounds(d) {
    const arcWidth = d.y1 - d.y0;
    const arcLength = d._layer._innerRadius * (d.x1 - d.x0);
    const bandwidth = Math.max(Math.abs(Math.cos(d.x0 + (d.x1 - d.x0) / 2 - Math.PI / 2) * arcWidth), arcWidth);
    switch (d._layer.labelAlignment) {
        case NestedDonutSegmentLabelAlignment.Perpendicular:
            return { width: arcWidth, height: arcLength };
        case NestedDonutSegmentLabelAlignment.Along:
            return { width: arcLength, height: arcWidth };
        case NestedDonutSegmentLabelAlignment.Straight:
            return { width: bandwidth, height: bandwidth };
    }
}
function createLabel(selection, arcGen) {
    selection
        .attr('transform', d => getLabelTransform(d, arcGen))
        .style('visibility', null)
        .style('opacity', 0);
}
function updateLabel(selection, config, arcGen, duration) {
    selection
        .text(d => { var _a; return (_a = getString(d, config.segmentLabel)) !== null && _a !== void 0 ? _a : d.data.key; })
        .style('transition', `fill ${duration}ms`)
        .style('fill', (d, i, els) => { var _a; return (_a = getColor(d, config.segmentLabelColor)) !== null && _a !== void 0 ? _a : getLabelFillColor(d, els[i]); })
        .each((d, i, els) => {
        const bounds = getLabelBounds(d);
        const label = select(els[i]).call(wrapSVGText, bounds.width);
        const { width, height } = label.node().getBBox();
        if (config.hideOverflowingSegmentLabels && (width > bounds.width || height > bounds.height) && 'hidden') {
            label.attr('visibility', 'hidden');
        }
        else {
            const fontSize = getCSSVariableValueInPixels(cssvar(variables.nestedDonutSegmentLabelFontSize), els[i]);
            const len = label.selectChildren().size() - 1;
            label.attr('dy', -fontSize / 2 * len);
        }
    });
    smartTransition(selection, duration)
        .attr('transform', d => getLabelTransform(d, arcGen))
        .style('opacity', 1);
}
function removeLabel(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createLabel, removeLabel, updateLabel };
//# sourceMappingURL=label.js.map
