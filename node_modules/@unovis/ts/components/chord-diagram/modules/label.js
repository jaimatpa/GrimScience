import { select } from 'd3-selection';
import { color } from 'd3-color';
import { trimSVGText } from '../../../utils/text.js';
import { smartTransition } from '../../../utils/d3.js';
import { getValue, getString, getNumber } from '../../../utils/data.js';
import { getColor, hexToBrightness } from '../../../utils/color.js';
import { ChordLabelAlignment } from '../types.js';
import { labelText } from '../style.js';

const LABEL_PADDING = 3;
function getLabelFillColor(d, config) {
    var _a;
    const nodeLabelAlignment = (_a = getValue(d.data, config.nodeLabelAlignment)) !== null && _a !== void 0 ? _a : ChordLabelAlignment.Along;
    switch (nodeLabelAlignment) {
        case ChordLabelAlignment.Perpendicular: {
            return getColor(d.data, config.nodeColor, d.height);
        }
        case ChordLabelAlignment.Along: {
            const c = getColor(d.data, config.nodeColor, d.height);
            const colorParsed = color(c);
            const brightness = colorParsed ? hexToBrightness(colorParsed.hex()) : 0;
            return brightness > 0.65 ? 'var(--vis-chord-diagram-label-text-fill-color-dark)' : 'var(--vis-chord-diagram-label-text-fill-color-bright)';
        }
    }
}
function getLabelTextAnchor(d, config) {
    var _a;
    const nodeLabelAlignment = (_a = getValue(d.data, config.nodeLabelAlignment)) !== null && _a !== void 0 ? _a : ChordLabelAlignment.Along;
    switch (nodeLabelAlignment) {
        case ChordLabelAlignment.Perpendicular: {
            const angleCenter = (d.x0 + d.x1) / 2;
            const angleDegree = angleCenter * 180 / Math.PI;
            return angleDegree < 180 ? 'start' : 'end';
        }
        case ChordLabelAlignment.Along: {
            return null;
        }
    }
}
function getLabelTransform(d, config, radiusScale) {
    var _a;
    const nodeLabelAlignment = (_a = getValue(d.data, config.nodeLabelAlignment)) !== null && _a !== void 0 ? _a : ChordLabelAlignment.Along;
    switch (nodeLabelAlignment) {
        case ChordLabelAlignment.Perpendicular: {
            const r = radiusScale(d.y1) + LABEL_PADDING;
            const angleCenter = (d.x0 + d.x1) / 2;
            const angle = angleCenter - Math.PI / 2;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            return `translate(${x}, ${y})`;
        }
        case ChordLabelAlignment.Along:
            return null;
    }
}
function createLabel(selection, config, radiusScale) {
    selection.style('opacity', 0)
        .attr('transform', d => getLabelTransform(d, config, radiusScale));
    selection.append('text')
        .attr('class', labelText)
        .style('fill', d => getColor(d.data, config.nodeColor, d.height));
}
function updateLabel(selection, config, width, radiusScale, duration) {
    const { nodeLabel, nodeLabelColor, nodeWidth } = config;
    smartTransition(selection, duration)
        .attr('transform', d => getLabelTransform(d, config, radiusScale))
        .style('opacity', 1);
    const label = selection.select(`.${labelText}`);
    label.selectAll('textPath').remove();
    label.text(d => getString(d.data, nodeLabel))
        .style('transition', `fill ${duration}ms`)
        .style('fill', d => { var _a; return (_a = getColor(d.data, nodeLabelColor)) !== null && _a !== void 0 ? _a : getLabelFillColor(d, config); })
        .style('text-anchor', d => getLabelTextAnchor(d, config))
        .each((d, i, elements) => {
        var _a;
        const nodeLabelAlignment = (_a = getValue(d.data, config.nodeLabelAlignment)) !== null && _a !== void 0 ? _a : ChordLabelAlignment.Along;
        const radianArcLength = d.x1 - d.x0 - getNumber(d.data, config.padAngle) * 2;
        const radius = radiusScale(d.y1) - getNumber(d, config.nodeWidth) / 2;
        const arcLength = radius * radianArcLength;
        const maxWidth = (nodeLabelAlignment === ChordLabelAlignment.Along ? arcLength : width - LABEL_PADDING * 2);
        const textElement = select(elements[i])
            .call(trimSVGText, maxWidth)
            .attr('dx', nodeLabelAlignment === ChordLabelAlignment.Along ? LABEL_PADDING : null)
            .attr('dy', nodeLabelAlignment === ChordLabelAlignment.Along ? getNumber(d.data, nodeWidth) / 2 : null);
        const textWidth = textElement.node().getComputedTextLength();
        const labelText = textElement.text();
        if (nodeLabelAlignment === ChordLabelAlignment.Along) {
            textElement.text('');
            if (textWidth <= maxWidth) {
                textElement.append('textPath')
                    .attr('href', `#${d.uid}`)
                    .text(labelText);
            }
        }
    });
    smartTransition(label, duration)
        .attr('transform', d => {
        const nodeLabelAlignment = getValue(d.data, config.nodeLabelAlignment);
        if (nodeLabelAlignment !== ChordLabelAlignment.Perpendicular)
            return null;
        const angleCenter = (d.x0 + d.x1) / 2;
        const angleDegree = angleCenter * 180 / Math.PI;
        return `rotate(${angleDegree < 180 ? angleDegree - 90 : angleDegree + 90})`;
    });
}
function removeLabel(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { LABEL_PADDING, createLabel, removeLabel, updateLabel };
//# sourceMappingURL=label.js.map
